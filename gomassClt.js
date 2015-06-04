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
  var srvCard;
  // remove the game from the list
  gomassListGame.remove(message.index);
  // who is opponent ?
  if (creator) {
    opponentName = message.player2;
    srvCard = allAvatarsCartes[message.imgid2];
  }
  else {
    opponentName = message.player1;
    srvCard = allAvatarsCartes[message.imgid1];
  }
  // add it to the board
  opponentAvatar = new Carte(srvCard.id, srvCard.imgid, '', '', '', opponentName, srvCard.description, srvCard.visible, srvCard.active, srvCard.type);
  opponent.add(0, opponentAvatar);
  // who play in first ?
  if (message.first == playerName) {
    myTurn = true;
    endTurnB.hide(false);
    console.log('You start the game : ' + message.game);
  }
  else {
    myTurn = false;
    endTurnB.hide(true);
    console.log('You wait your turn : ' + message.game);
  }
  // get my hand
  for (var i = 0; i < message.hand.length; i++) {
    var srvCard = message.hand[i];
    var carte = new Carte(srvCard.id, srvCard.imgid, srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.titre, srvCard.description, srvCard.visible, srvCard.active, 0);
    playerHand.add(i, carte);
  }
  // show the game
  showGame(true);
})

socket.on('addcarteok', function(data) {
  console.log('Received addcarteok : ' + data.message + 'at ' + data.caseId);
})
socket.on('putcarte', function(data) {
  console.log('Received putcarte : ' + data.message);
  if (data.dstboard == 'opponentBoard' && data.srcboard == 'opponentHand') {
    var putCarte = allCarte.get(data.carteId);
    opponentBoard.add(data.caseId, putCarte);
  }
})
socket.on('newcarteok', function(data) {
  console.log('Received newcarteok : ' + data.message);
})
socket.on('insertcarte', function(data) {
  if (data.srcboard == 'opponent' && data.dstboard == 'opponentBoard') {
    var srvCard = data.carte;
    var newCarte = new Carte(srvCard.id, srvCard.imgid, '', '', '', opponentName, srvCard.description, srvCard.visible, srvCard.active, srvCard.type);
    opponentBoard.add(data.caseId, newCarte);
  }
})

socket.on('endturnok', function(message) {
  console.log('Received endturnok : ' + message.validated);
  // my turn?
  if (message.first) {
    myTurn = true;
    endTurnB.disabled = false;
    // ask is it the end of game
    socket.emit('endgame', {
      name: gameName,
      player: playerName
    });
  }
  else {
    myTurn = false;
    endTurnB.disabled = true;
  }
})
socket.on('endgameok', function(message) {
  console.log('Received endgameok : ' + message.validated);
  // win the game?
  if (message.win) {
    console.log('You win the game : ' + message.game);
    myTurn = false;
    endTurnB.disabled = true;
  }
  else {
    console.log('You loose the game : ' + message.game);
    myTurn = false;
    endTurnB.disabled = true;
  }
  // go to create a new game
  disableCommands(false);
  initGlobal();
  showGame(false);
})
//END GAME
