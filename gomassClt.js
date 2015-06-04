// URL
rootUrl = 'http://localhost:3000/';
// socket creation
socket = io.connect(rootUrl);
//BEGIN CONNECTION
socket.on('login', function(message) {
  if (message.accepted) {
    console.log('Received login : you are accepted : ' + message.player);
    // fill array of carte and avatar
    allGameCartes = message.cartes;
    allAvatarsCartes = message.avatar;
    //show all avatars
    playerSelector.fill();
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
    // add avatar carte to player board
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
  console.log('Received joingameok : ' + message.validated);
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
  opponentAvatar = new Carte(srvCardOp.id, srvCardOp.imgid, '2', '', '30', opponentName, srvCardOp.description, srvCardOp.visible, srvCardOp.active, srvCardOp.type);
  opponent.add(0, opponentAvatar);
  playerAvatar = new Carte(srvCardPl.id, srvCardPl.imgid, '2', '', '30', opponentName, srvCardPl.description, srvCardPl.visible, srvCardPl.active, srvCardPl.type);
  player.add(0, playerAvatar);
  endTurnB.style.visibility = "visible";
  // who play in first ?
  if (message.first == playerName) {
    myTurn = true;
    endTurnB.disabled  = false;
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
    var pcarte = new Carte(srvCard.id, srvCard.imgid, srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.titre, srvCard.description, srvCard.visible, srvCard.active, 0);
    playerHand.add(i, pcarte);
    // set hiding opponent hand
    var ocarte = backCard.clone();
    opponentHand.add(i, ocarte);
  }
  // give one mana to all
  manaBoard.add(1);
  // show the game
  showGameBoards(true);
})

socket.on('addcarteok', function(data) {
  console.log('Received addcarteok : ' + data.message + 'at ' + data.caseId);
})
socket.on('putcarte', function(data) {
  console.log('Received putcarte : ' + data.message);
  if (data.dstboard == 'opponentBoard' && data.srcboard == 'opponentHand') {
    var putCarte = allCarte.get(data.carteId);
    opponentBoard.add(data.caseId, putCarte);
    opponentHand.removeLast();
  }
})
socket.on('newcarteok', function(data) {
  console.log('Received newcarteok : ' + data.message);
})
socket.on('insertcarte', function(data) {
  if (data.srcboard == 'opponent' && data.dstboard == 'opponentBoard') {
    var srvCard = data.carte;
    var newCarte = new Carte(srvCard.id, srvCard.imgid, srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.titre, srvCard.description, srvCard.visible, srvCard.active, srvCard.type);
    opponentBoard.add(data.caseId, newCarte);
  }
})

socket.on('endturnok', function(message) {
  console.log('Received endturnok : ' + message.validated);
  myTurn = false;
  endTurnB.disabled = true;
  manaBoard.reset();
  // set hiding opponent hand
  var ocarte = backCard.clone();
  opponentHand.addLast(ocarte);
  // ask is it the end of game
  socket.emit('endgame', {
    name: gameName,
    player: playerName
  });
})
socket.on('newturn', function(message) {
  console.log('Received newturn : ' + message.validated);
  myTurn = true;
  endTurnB.disabled = false;
  // get mana
  manaBoard.add(message.mana);
  // get new carte 
  var srvCard = message.carte[0];
  var carte = new Carte(srvCard.id, srvCard.imgid, srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.titre, srvCard.description, srvCard.visible, srvCard.active, 0);
  playerHand.addLast(carte);
})

socket.on('endgameok', function(message) {
  console.log('Received endgameok : ' + message.validated);
  // win the game?
  if (message.win) {
    console.log('You win the game : ' + message.game);
  }
  else {
    console.log('You loose the game : ' + message.game);
  }
  endTurnB.disabled = true;
  deckB.disabled = false;
  // go to create a new game
  loadNewGame();
  showGameBoards(false);
})
//END GAME
