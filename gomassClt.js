"use strict";
console.log('Start gomassClt.js');
// socket creation
var socket = io.connect(rootUrl);
//BEGIN CONNECTION
socket.on('login', function(message) {
  if (message.accepted) {
    console.log('Received login : you are accepted : ' + message.player);
    // fill array of carte and avatar
    var srvAllGameCartes = message.cartes;
    var srvAllAvatarsCartes = message.avatar;
    createArrayCarte(srvAllGameCartes, allGameCartes);
    createArrayCarte(srvAllAvatarsCartes, allAvatarsCartes);
    //show all avatars
    playerSelector.fill();
    //set all cartes
    allCarte.setAll(allGameCartes);
  }
  else {
    console.log('Received login : login already exist : ' + message.player);
    userNameB.disabled = false;
    userNameT.disabled = false;
  }
})
socket.on('userjoined', function(message) {
  if (message.accepted) {
    console.log('Received user joined : ' + message.player);
  }
})
socket.on('userleft', function(message) {
  //gomassChat.value += message.username + ' : leave the game!' + '\n';
  console.log('Received user left : ' + message.username + ' : ' + message.message);
})
//END CONNECTION
//-----------------------------------------------------------

//BEGIN CHAT
socket.on('newmessageok', function(message) {
  gomassChat.value += message.username + ' : ' + message.message + '\n';
  sendT.value = '';
})
//END CHAT
//-----------------------------------------------------------

//BEGIN CREATE GAME
socket.on('avatarok', function(message) {
  if (message.accepted) {
    // active deck button
    deckB.disabled = false;
    // hide avatar board
    playerSelector.setVisibility(false);
    // change info
    displayInfo(3);
    console.log('Received avatarok : ' + message.accepted);
  }
  else {
    console.log('Received avatarok : ' + message.accepted);
  }
})
socket.on('deckok', function(message) {
  if (message.accepted) {
    showDeckBuilder(false);
    disableCommands(false);
    console.log('Received deckok : ' + message.accepted);
  }
  else {
    console.log('Received deckok : ' + message.accepted);
  }
})
socket.on('newgameok', function(message) {
  if (message.accepted) {
    gameName = message.game;
    disableCommands(true);
    console.log('Received newgameok : ' + message.validated);
  }
  else {
    console.log('Received newgameok : ' + message.validated);
  }
})
socket.on('joingameok', function(message) {
  gameName = message.game;
  createT.value = gameName;
  disableCommands(true);
  console.log('Received joingameok : ' + message.validated + gameName + ' player : ' + message.first + ' start the game!');
})
socket.on('opengame', function(message) {
  gomassListGame.addOpt(message.game);
  console.log('Received openGame : ' + message.validated);
})
socket.on('closegame', function(message) {
  // remove the game from the list
  gomassListGame.remove(message.index);
  console.log('Received closeGame : ' + message.validated);
})
//END CREATE GAME
//-----------------------------------------------------------

//BEGIN GAME
socket.on('startgame', function(message) {
  console.log('Received startgame : ' + message.validated);
  var srvCardOp;
  var srvCardPl;
  // remove the game from the list
  gomassListGame.remove(message.index);
  // hide the info
  infoDiv.visible(false);
  // who is opponent ?
  if (creator) {
    opponentName = message.player2; // set the name
    srvCardOp = allAvatarsCartes[message.imgid2]; // set the carte
    srvCardPl = allAvatarsCartes[message.imgid1];
  }
  else {
    opponentName = message.player1;
    srvCardOp = allAvatarsCartes[message.imgid1];
    srvCardPl = allAvatarsCartes[message.imgid2];
  }
  // add avatar to the board
  opponentAvatar = new Carte(srvCardOp.id, srvCardOp.typeimg, srvCardOp.type, srvCardOp.imgid, 
  srvCardOp.visible, '2', '', '30', opponentName, srvCardOp.description);
  opponent.add(0, opponentAvatar);
  playerAvatar = new Carte(srvCardPl.id, srvCardPl.typeimg, srvCardOp.type, srvCardPl.imgid, 
  srvCardPl.visible, '2', '', '30', playerName, srvCardPl.description);
  player.add(0, playerAvatar);
  endTurnB.style.visibility = "visible";
  // who play in first ?
  if (message.first == playerName) {
    myTurn = true;
    endTurnB.disabled  = false;
    manaBoard.set(1); // give one mana
    console.log('You start the game : ' + message.game);
  }
  else {
    myTurn = false;
    endTurnB.disabled  = true;
    console.log('You wait your turn : ' + message.game);
  }
  // get my hand
  for (var i = 0; i < message.hand.length; i++) {
    var srvCard = message.hand[i];
    var pcarte = new Carte(srvCard.id, srvCard.typeimg, srvCard.type, srvCard.imgid, srvCard.visible, 
    srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.titre, srvCard.description, 
    srvCard.active, srvCard.selected, srvCard.special, srvCard.effet, srvCard.etat);
    playerHand.add(i, pcarte);
    // set hiding opponent hand
    opponentHand.addClone(i, backCard);
  }
  // show the game
  showGameBoards(true);
})

socket.on('addcarteok', function(data) {
  console.log('Received addcarteok : ' + data.message + 'at ' + data.caseId + ' from player : ' + data.player);
})
socket.on('putcarte', function(data) {
  console.log('Received putcarte : ' + data.message + 'at ' + data.caseId + ' from player : ' + data.player);
  if (data.dstboard == 'opponentBoard' && data.srcboard == 'opponentHand') {
    var putCarte = allCarte.getByCarteId(data.carteId);
    opponentBoard.addClone(data.caseId, putCarte);
    opponentHand.removeLast();
  }
})
socket.on('newcarteok', function(data) {
  console.log('Received newcarteok : ' + data.message);
})
socket.on('insertcarte', function(data) {
  console.log('Received insertcarte : ' + data.message + data.dstboard + ' on case : ' + data.caseId);
  if (data.srcboard == 'opponent' && data.dstboard == 'opponentBoard') {
    var srvCard = data.carte;
    var newCarte = new Carte(srvCard.id, srvCard.typeimg, srvCard.type, srvCard.imgid, srvCard.visible,
    srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.titre, srvCard.description, 
    srvCard.active, srvCard.selected, srvCard.special, srvCard.effet, srvCard.etat);
    opponentBoard.add(data.caseId, newCarte);
  }
})
socket.on('removeok', function(data) {
  console.log('Received removeok : ' + data.message + data.board + ' on case : ' + data.caseid);
})
socket.on('deletecarte', function(data) {
  var theBoard = data.board;
  var caseId = data.caseid;
  console.log('Received deletecarte : ' + data.message + data.board + ' on case : ' + data.caseid);
  var remBoard = getBoard(theBoard);
  remBoard.getCase(caseId).clear();
})
socket.on('changeok', function(data) {
  console.log('Received changeok : ' + data.message + data.board + ' on case : ' + data.caseid);
})
socket.on('changecarte', function(data) {
  var theBoard = data.board;
  var caseId = data.caseid;
  var srvCard = data.carte;
  console.log('Received changecarte : ' + data.message + data.board + ' on case : ' + data.caseid);
  var carte = new Carte(srvCard.id, srvCard.typeimg, srvCard.type, srvCard.imgid, srvCard.visible,
  srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.titre, srvCard.description, 
  srvCard.active, srvCard.selected, srvCard.special, srvCard.effet, srvCard.etat);
  var remBoard = getBoard(theBoard);
  remBoard.getCase(caseId).carte = carte;
  remBoard.getCase(caseId).draw();
})

socket.on('endturnok', function(message) {
  console.log('Received endturnok : ' + message.player + ' game : ' + message.game + ' message : ' + message.validated);
  myTurn = false;
  endTurnB.disabled = true;
  manaBoard.reset();
  // set hiding opponent hand
  var ocarte = backCard.clone();
  opponentHand.addLast(ocarte);
  // clean boards
  playerBoard.inactivateAll();
  opponentBoard.inactivateAll();
})
socket.on('newturn', function(message) {
  console.log('Received newturn : ' + message.player + ' game : ' + message.game + ' message : ' + message.validated);
  myTurn = true;
  endTurnB.disabled = false;
  // get mana
  manaBoard.set(message.mana);
  // get new carte 
  var srvCard = message.carte[0];
  var carte = new Carte(srvCard.id, srvCard.typeimg, srvCard.type, srvCard.imgid, srvCard.visible,
  srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.titre, srvCard.description, 
  srvCard.active, srvCard.selected, srvCard.special, srvCard.effet, srvCard.etat);
  playerHand.addLast(carte);
  // activate carte from playerBord
  playerBoard.activateAll();
})

socket.on('endgameok', function(message) {
  var infoTxt = '';
  console.log('Received endgameok : ' + message.player + ' game : ' + message.game + ' message : ' + message.validated);
  // win the game?
  if (message.win) {
    infoTxt = '<h2>6 - End of game</h2><p>You <b>win</b> the game : ' + message.game + ' you are the boss ' + playerName + '</p>';
  }
  else {
    infoTxt = '<h2>6 - End of game</h2><p>You <b>loose</b> the game : ' + message.game + ' may be next time ' + playerName + '</p>';
  }
  // game is finish
  endTurnB.disabled = true;
  // hide all
  showGameBoards(false);
  // display info of end of game
  infoDiv.setText(infoTxt);
  infoDiv.setButton();
  infoDiv.visible(true);
})
//END GAME

function createArrayCarte(srvCarteArray, cltCarteArray) {
  for (var i = 0; i < srvCarteArray.length; i++) {
    var srvCard = srvCarteArray[i];
    var cltCard = new Carte(srvCard.id, srvCard.typeimg, srvCard.type, srvCard.imgid, srvCard.visible,
    srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.titre, srvCard.description, srvCard.active, 
    srvCard.selected, srvCard.special, srvCard.effet, srvCard.etat);
    cltCarteArray.push(cltCard);
  }
}
console.log('Finish gomassClt.js');
