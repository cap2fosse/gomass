'use strict';
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
    var srvAllPowerCartes = message.power;
    createArrayCarte(srvAllGameCartes, allGameCartes);
    createArrayCarte(srvAllAvatarsCartes, allAvatarsCartes);
    createArrayCarte(srvAllPowerCartes, allPowerCartes);
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
  var srvPowerPl;
  var srvPowerOp;
  // remove the game from the list
  gomassListGame.remove(message.index);
  // hide the info
  infoDiv.visible(false);
  // who is opponent ?
  if (creator) {
    opponentName = message.player2; // set the name
    srvCardOp = allAvatarsCartes[message.imgid2]; // set the carte
    srvCardPl = allAvatarsCartes[message.imgid1];
    srvPowerOp = allPowerCartes[message.imgid2];
    srvPowerPl = allPowerCartes[message.imgid1];
  }
  else {
    opponentName = message.player1;
    srvCardOp = allAvatarsCartes[message.imgid1];
    srvCardPl = allAvatarsCartes[message.imgid2];
    srvPowerOp = allPowerCartes[message.imgid1];
    srvPowerPl = allPowerCartes[message.imgid2];
  }
  // add avatar to the board
  opponent.addClone(0, srvCardOp);
  player.addClone(0, srvCardPl);
  // add power
  playerPower.addClone(0, srvPowerPl);
  opponentPower.addClone(0, srvPowerOp);
  // who play in first ?
  if (message.first == playerName) {
    myTurn = true;
    manaBoard.set(1); // give one mana
    playerPower.activateAll();
    opponentPower.inactivateAll();
    player.activateAll();
    opponent.inactivateAll();
    console.log('You start the game : ' + message.game);
  }
  else {
    myTurn = false;
    playerPower.inactivateAll();
    opponentPower.activateAll();
    player.inactivateAll();
    opponent.activateAll();
    console.log('You wait your turn : ' + message.game);
  }
  // get first selection of hand
  var cltcarte = [];
  createArrayCarte(message.hand, cltcarte);
  // fill & show cardSelector
  cardSelector.fill(cltcarte);
  // fill the first hand
  playerHand.fill(cltcarte);
  // active button
  finishSelectB.hide(false);
  displayInfo(6);
})
socket.on('newhandcard', function(data) {
  console.log('Received newhandcard : ' + data.message + data.game + ' from player : ' + data.player);
  var newCards = [];
  createArrayCarte(data.newcards, newCards);
  // hide cardSelector & button
  cardSelector.setVisibility(false);
  finishSelectB.hide(true);
  // replace the hand
  playerHand.fill(newCards);
  // set hiding opponent hand
  var backC = [backCard, backCard, backCard];
  opponentHand.fill(backC);
  displayInfo(7);
})
socket.on('showgame', function(data) {
  console.log('Received showgame : ' + data.message + data.game + ' from player : ' + data.player);
  // hide the info
  infoDiv.visible(false);
  // set my turn button
  endTurnB.style.visibility = "visible";
  if (myTurn) {endTurnB.disabled  = false;}
  else {endTurnB.disabled  = true;}
  // show the game
  showGameBoards(true);
})
socket.on('addcarteok', function(data) {
  console.log('Received addcarteok : ' + data.message + data.game + ' at ' + data.caseid + ' from player : ' + data.player);
})
socket.on('putcarte', function(data) {
  console.log('Received putcarte : ' + data.message + data.game + ' at ' + data.caseid + ' from player : ' + data.player);
  if (data.dstboard == 'opponentBoard' && data.srcboard == 'opponentHand') {
    var srvC = data.carte;
    var putCarte = fromSrvCarte(srvC);
    opponentBoard.add(data.caseid, putCarte);
    opponentHand.removeLast();
  }
})
socket.on('newcarteok', function(data) {
  console.log('Received newcarteok : ' + data.message);
})
socket.on('insertcarte', function(data) {
  console.log('Received insertcarte : ' + data.message + data.dstboard + ' on case : ' + data.caseId);
  // insert only on this  board
  if (data.dstboard == 'playerBoard' || data.dstboard == 'opponentBoard') {
    var srvcarte = data.carte;
    var newCarte = fromSrvCarte(srvcarte);
    var board = getBoard(data.dstboard);
    board.add(data.caseId, newCarte);
  }
})
socket.on('removeok', function(data) {
  console.log('Received removeok : ' + data.message + data.board + ' on case : ' + data.caseid);
})
socket.on('deletecarte', function(data) {
  var board1 = data.defboard;
  var board2 = data.attboard;
  var caseId1 = data.defcaseid;
  var caseId2 = data.attcaseid;
  var changeCard = fromSrvCarte(data.attcarte);
  console.log('Received deletecarte : ' + data.message + data.defboard + ' on case : ' + data.defcaseid);
  var remBoard = getBoard(board1);
  remBoard.getCase(caseId1).clear();
  if (changeCard.type == 'Invocation' || changeCard.type == 'Player') { // change only invocation or player
    var changeBoard = getBoard(board2);
    changeBoard.getCase(caseId2).carte = changeCard;
    changeBoard.getCase(caseId2).draw();
  }
})
socket.on('changeok', function(data) {
  console.log('Received changeok : ' + data.message + data.board + ' on case : ' + data.caseid);
})
socket.on('changecarte', function(data) {
  var board1 = data.defboard;
  var board2 = data.attboard;
  var caseId1 = data.defcaseid;
  var caseId2 = data.attcaseid;
  var card1 = fromSrvCarte(data.defcarte);
  var card2 = fromSrvCarte(data.attcarte);
  var defboard = getBoard(board1);
  var attboard = getBoard(board2);
  console.log('Received changecarte : ' + data.message + data.defboard + ' on case : ' + data.defcaseid);
  if (card1.type == 'Invocation' || card1.type == 'Player') { // change only invocation or player
    defboard.getCase(caseId1).carte = card1;
    defboard.getCase(caseId1).draw();
  }
  if (card2.type == 'Invocation' || card2.type == 'Player') { // change only invocation or player
    attboard.getCase(caseId2).carte = card2;
    attboard.getCase(caseId2).draw();
  }
})
socket.on('cardplayedok', function(message) {
  console.log('Received cardplayedok : ' + message.player + ' game : ' + message.game + ' message : ' + message.validated);
  opponentHand.removeLast();
})
socket.on('endturnok', function(message) {
  console.log('Received endturnok : ' + message.player + ' game : ' + message.game + ' message : ' + message.validated);
  myTurn = false;
  endTurnB.disabled = true;
  manaBoard.reset();
  // set hiding opponent hand
  var ocarte = backCard.clone();
  opponentHand.addLast(ocarte);
  // inactive card on boards
  playerBoard.inactivateAll();
  opponentBoard.activateAll();
  playerPower.inactivateAll();
  opponentPower.activateAll();
  player.inactivateAll();
  opponent.activateAll();
})
socket.on('newturn', function(message) {
  console.log('Received newturn : ' + message.player + ' game : ' + message.game + ' message : ' + message.validated);
  myTurn = true;
  endTurnB.disabled = false;
  // get mana
  manaBoard.set(message.mana);
  // get new carte 
  var srvcarte = message.carte[0];
  var carte = fromSrvCarte(srvcarte);
  playerHand.addLast(carte);
  // activate carte from playerBord
  playerBoard.activateAll();
  playerPower.activateAll();
  player.activateAll();
  opponentPower.inactivateAll();
  opponentBoard.inactivateAll();
  opponent.inactivateAll();
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
    srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.vie, srvCard.titre, srvCard.description, srvCard.active, 
    srvCard.selected, srvCard.special, srvCard.effet, srvCard.etat, srvCard.equipement);
    cltCarteArray.push(cltCard);
  }
}
console.log('Finish gomassClt.js');
