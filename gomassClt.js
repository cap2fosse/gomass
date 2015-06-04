// URL
rootUrl = 'http://localhost:3000/';
// socket creation
socket = io.connect(rootUrl);
//BEGIN CONNECTION
socket.on('login', function(message) {
  if (message.accepted) {
    console.log('Received login : you are accepted : ' + message.player);
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
  // remove the game from the list
  gomassListGame.remove(message.index);
  // who is opponent ?
  if (creator) opponentName = message.player2;
  else opponentName = message.player1;
  // who play in first ?
  if (message.first == playerName) {
    myTurn = true;
    endTurnB.disabled = false;
    console.log('You start the game : ' + message.game);
  }
  else {
    myTurn = false;
    endTurnB.disabled = true;
    console.log('You wait your turn : ' + message.game);
  }
  // show the game
  showGame(true);
})
socket.on('mymove', function(message) {
  console.log('Received mymove : ' + message.validated);
})
socket.on('hismove', function(message) {
  console.log('Received hismove : ' + message.validated);
  var tempMove = message.move.split(",");
  console.log('move : '+ tempMove[0] +' : '+ tempMove[1]);
  mainBoard.move(tempMove[0], tempMove[1]);
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
