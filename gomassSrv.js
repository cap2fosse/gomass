"use strict";
console.log('Start gomassSrv.js');
// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var server = require('http').createServer();
var io = require('socket.io')(server);
var Carte = require('./srvCarte.js');
//var PlayerCarte = require('./srvPlayer.js');
var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
// Routing
app.use(express.static(__dirname));
// Movement
function Move(user, srcx, srcy, dstx, dsty) {
  this.userName = user;
  this.srcx = srcx;
  this.srcy = srcy;
  this.dstx = dstx;
  this.dsty = dsty;
}
function Game(name) {
  this.name = name;
  this.player1; // create the game
  this.player2; // join the game
  this.turn = 0;
  this.gameCard = []; // new carte created in the game
  this.state = ''; //'create', 'running', 'close'
  this.toString = function() {
    return " name : " + this.name + " turn : " + this.turn + " state : " + this.state;
  }
  this.addTurn = function() {
    this.turn++;
    console.log('New turn ! ' + this.turn);
  }
  this.whoIsNextPlayer = function() {
    if (this.player1.myTurn == true) {return this.player1.name}
    else {return this.player2.name}
  }
}
function Player(name) {
  this.name = name;
  this.isFirst = false;
  this.myTurn = false;
  this.deck = [];
  this.imgid = 0;
  this.getCarte = function(nbCarte) {
    var carte = [];
    if (this.deck.length > 0) {
      for (var i = 0; i < nbCarte; i++) {
        carte[i] = this.deck.pop();
        console.log('it left ' + this.deck.length + ' on player : ' + this.name + ' hand.\n');
      }
    }
    return carte;
  }
}
var maxCartes = 80;
var maxPlayer = 3;
var allUsers = [];
var allPlayers = [];
var allGames = [];
var allMoves = [];
var allCartes = [];
var allAvatars = [];
// load all cartes of the game
loadCartes();
loadPlayer();
// default namespace
io.on('connection', function (socket) {
  console.log('connection to the soket : ' + socket.id);

  // when the client emits 'add user', this listens and executes
  socket.on('adduser', function (user) {
    console.log('received cmd adduser : ' + user.name);
    // we store the username in the socket session for this client
    socket.username = user.name;
    socket.register = true;
    // add the client's username to the global list
    // and send all cards of the game
    var idx = addToArray(allUsers, user.name);
    if (idx != -1) {
      // store new player
      allPlayers.push(new Player(user.name));
      //emit welcome
      socket.emit('login', {
        accepted: true,
        player: user.name,
        numUsers: allUsers.length,
        cartes: allCartes,
        avatar: allAvatars
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('userjoined', {
        accepted: true,
        player: user.name,
        numUsers: allUsers.length
      });
    }
    // user name already exist
    else {
      socket.emit('login', {
        accepted: false,
        player: user.name,
        numUsers: allUsers.length
      });
    }
  });

  // when the client emits 'avatar'
  socket.on('avatar', function (message) {
    console.log('received cmd avatar : ' + message.player);
    // get id of player
    var idP = playerExist(message.player);
    if (idP != -1) {
      // store the player image
      allPlayers[idP].imgid = message.id;
      console.log('imgid : ' + message.id);
      socket.emit('avatarok', {
        accepted: true,
        player: message.player,
        imgid: message.id
      });
    }
  });

  // when the client emits 'deck'
  socket.on('deck', function (theDeck) {
    console.log('received cmd deck : ' + theDeck.player);
    // get id of player
    var idP = playerExist(theDeck.player);
    if (idP != -1) {
      // store the randomize deck
      var randomize = randomDeck(theDeck.deck);
      allPlayers[idP].deck = randomize;
      console.log('original Deck : ' + theDeck.deck);
      console.log('random Deck : ' + randomize);
      socket.emit('deckok', {
        accepted: true,
        player: theDeck.player
      });
    }
  });
  
  // when the user disconnects.. perform this
  socket.on('disconnect', function (data) {
    console.log('receveived cmd disconnect');
    if (allUsers.length > 0) {
      // remove the username from global allUsers list
      rmToArray(allUsers, socket.username);
      // echo globally that this client has left
      socket.broadcast.emit('userleft', {
        username: socket.username,
        numUsers: allUsers.length
      });
    }
  });

  // when the client emits 'newmessage'
  socket.on('newmessage', function (data) {
    var msg = data.message;
    var player = data.player;
    console.log('receveived cmd newmessage from : ' + player + ' message : ' + msg);
    // we tell the client to execute 'newmessageok'
    socket.broadcast.emit('newmessageok', {
      username: player,
      message: msg
    });
    socket.emit('newmessageok', {
      username: player,
      message: msg
    });
  });

  // when the client emits 'newgame'
  socket.on('newgame', function (game) {
    var gameName = game.name;
    var player = game.player;
    console.log('receveived cmd newgame from : ' + player + ' in room : ' + gameName);
    // check if game exist and add it
    var myGame = new Game(gameName);
    var idx = addToArray(allGames, myGame);
    if (idx != -1) {
      socket.game = gameName;
      socket.join(gameName);
      // get id of player
      var idP = playerExist(player);
      if (idP != -1) {
        // update game
        allGames[idx].player1 = allPlayers[idP];
        allGames[idx].state = 'create';
        // reply to the requester
        socket.emit('newgameok', {
          validated: "The game is created : " + game.name,
          accepted: true,
          game: gameName
        });
        // send to all other
        socket.broadcast.emit('opengame', {
          validated: "A new game is created : " + game.name,
          accepted: true,
          game: gameName
        });
      }
    }
    else {
      // reply to the requester
      socket.emit('newgameok', {
        validated: "The game already exist : " + game.name,
        accepted: false,
        game: gameName
      });
    }
  });

  // when the client emits 'joingame'
  socket.on('joingame', function (game) {
    var gameName = game.name;
    var player = game.player;
    console.log('receveived cmd joingame from : ' + player + ' in room : ' + gameName);
    // game exist?
    var idx = gameExist(gameName);
    if (idx != -1) {
      // store game and join
      socket.game = gameName;
      socket.join(gameName);
      // get id of player
      var idP = playerExist(player);
      if (idP != -1) {
        // update game
        allGames[idx].player2 = allPlayers[idP];
        allGames[idx].state = 'running';
        allGames[idx].addTurn();
        // who play first, update Player isFirst property
        var firstPlayer = whoPlayFirst(allGames[idx]);
        if (firstPlayer == allGames[idx].player1.name) {
          allGames[idx].player1.myTurn = true;
          allGames[idx].player2.myTurn = false;
        }
        else {
          allGames[idx].player1.myTurn = false;
          allGames[idx].player2.myTurn = true;
        }
        // get hand card
        var theHand1 = allGames[idx].player1.getCarte(3);
        var theHand2 = allGames[idx].player2.getCarte(3);
        // get game index
        var idxGame = game.idx;
        // answer to sender player 2
        socket.emit('joingameok', {
          validated: "You join the game : ",
          game: gameName,
          first: firstPlayer
        });
        socket.emit('startgame', {
          validated: "The game start now : ",
          game: gameName,
          first: firstPlayer,
          index: idxGame,
          player1: allGames[idx].player1.name,
          player2: allGames[idx].player2.name,
          hand: theHand2,
          imgid1: allGames[idx].player1.imgid,
          imgid2: allGames[idx].player2.imgid
        });
        // answer in the game (player 1)
        socket.broadcast.to(gameName).emit('startgame', {
          validated: "The game start now : ",
          game: gameName,
          first: firstPlayer,
          index: idxGame,
          player1: allGames[idx].player1.name,
          player2: allGames[idx].player2.name,
          hand: theHand1,
          imgid1: allGames[idx].player1.imgid,
          imgid2: allGames[idx].player2.imgid
        });
        // answer to all others
        socket.broadcast.emit('closegame', {
          validated: "The game is closed : ",
          game: gameName,
          index: idxGame
        });
      }
    }
  });
  // when the client emits 'move'
  socket.on('move', function (data) {
    console.log('receveived cmd move from : ' + data.player + ' in room : ' + data.room);
    var tempMove = data.message; //srcid, dstid
    tempMove.split(",");
    storeMovement(data.player, tempMove[0], tempMove[1]);
    // send only to the requester
    socket.emit('mymove', {
      validated: "Move Ok.",
      move: data.message,
      player: data.player
    });
    // send to all in the room except requester
    socket.broadcast.to(data.room).emit('hismove', {
      validated: "New move.",
      move: data.message,
      player: data.player
    });
  });
  // when the client emits 'addcarte'
  socket.on('addcarte', function (data) {
    var gameName = data.game;
    var player = data.player;
    console.log('receveived cmd addcarte from : ' + player + ' in room : ' + gameName);
    var idx = gameExist(gameName);
    if (idx != -1) {
      var dstboard = translateBoard(data.dstboard);
      var srcboard = translateBoard(data.srcboard);
      var caseId = data.caseId;
      var carteId = data.carteId;
      // send only to the requester
      socket.emit('addcarteok', {
        message: "Carte add on board.",
        caseId: caseId,
        player: player
      });
      // send to all in the room except requester
      socket.broadcast.to(gameName).emit('putcarte', {
        message: "New carte arrived.",
        srcboard: srcboard,
        dstboard: dstboard,
        caseId: caseId,
        carteId: carteId,
        player: player
      });
    }
  });
  // when the client emits 'newcarte'
  socket.on('newcarte', function (data) {
    var gameName = data.game;
    var player = data.player;
    console.log('receveived cmd newcarte from : ' + player + ' in room : ' + gameName);
    var idx = gameExist(gameName);
    if (idx != -1) {
      var dstboard = translateBoard(data.dstboard);
      var srcboard = translateBoard(data.srcboard);
      var caseId = data.caseId;
      var carte = data.carte;
      // set up id and type
      carte.id = allCartes.length;
      // add the new Carte to card game
      allGames[idx].gameCard.push(carte);
      // send only to the requester
      socket.emit('newcarteok', {
        message: "Carte created on board.",
        carte: carte,
        player: player
      });
      // send to all in the room except requester
      socket.broadcast.to(gameName).emit('insertcarte', {
        message: "New carte inserted.",
        srcboard: srcboard,
        dstboard: dstboard,
        caseId: caseId,
        carte: carte,
        player: player
      });
    }
  });
  // when the client emits 'remove'
  socket.on('remove', function (data) {
    var gameName = data.game;
    var player = data.player;
    console.log('receveived cmd remove from : ' + player + ' in room : ' + gameName);
    var idx = gameExist(gameName);
    if (idx != -1) {
      var clientBoard = data.board;
      var Transboard = translateBoard(clientBoard);
      var caseId = data.caseid;
      socket.emit('removeok', {
        message: "Carte removed on board : ",
        caseid: caseId,
        board: clientBoard
      });
      // send to all in the room except requester
      socket.broadcast.to(gameName).emit('deletecarte', {
        message: "New carte deleted on board : ",
        caseid: caseId,
        board: Transboard
      });
    }
  });
  // when the client emits 'change'
  socket.on('change', function (data) {
    var gameName = data.game;
    var player = data.player;
    console.log('receveived cmd change from : ' + player + ' in room : ' + gameName);
    var idx = gameExist(gameName);
    if (idx != -1) {
      var clientBoard = data.board;
      var Transboard = translateBoard(clientBoard);
      var caseId = data.caseid;
      var cltCard = data.carte;
      // to the emitter
      socket.emit('changeok', {
        message: "Carte changed on board : ",
        caseid: caseId,
        board: clientBoard,
        carte: cltCard
      });
      // send to all in the room except requester
      socket.broadcast.to(gameName).emit('changecarte', {
        message: "New carte change on board : ",
        caseid: caseId,
        board: Transboard,
        carte: cltCard
      });
    }
  });
  // when the client emits 'endturn'
  socket.on('endturn', function (game) {
    var gameName = game.name;
    var player = game.player;
    console.log('receveived cmd endturn from : ' + player + ' in room : ' + gameName);
    var idx = gameExist(gameName);
    if (idx != -1) {
      console.log('next turn is : ' + allGames[idx].turn);
      // add one round
      allGames[idx].addTurn();
      var newCarte;
      // get next player carte
      if (game.opponent == allGames[idx].player1.name) {
        newCarte = allGames[idx].player1.getCarte(1);
      }
      else {
        newCarte = allGames[idx].player2.getCarte(1);
      }
      // get mana
      var mana = Math.round(allGames[idx].turn/2);
      if (mana > 10) {mana = 10;}
      // to the sender
      socket.emit('endturnok', {
        validated: "Your turn is finish.",
        game: gameName,
        player: player
      });
      // to other
      socket.broadcast.to(game.name).emit('newturn', {
        validated: "Your turn start now.",
        game: gameName,
        mana: mana,
        carte: newCarte,
        player: player
      });
    }
  });

  // when the client emits 'endgame'
  socket.on('endgame', function (game) {
    var gameName = game.name;
    var player = game.player;
    console.log('receveived cmd endgame from : ' + player + ' in room : ' + gameName);
    var idx = gameExist(gameName);
    if (idx != -1) {
      console.log('End game : ' + game.name + ' from player : ' + game.player);
      // answer to the winner
      socket.emit('endgameok', {
        validated: "The game is over.",
        game: gameName,
        player: player,
        win: true
      });
      socket.broadcast.to(game.name).emit('endgameok', {
        validated: "The game is over.",
        game: gameName,
        player: player,
        win: false
      });
    }
  });

});

//OUTSIDE SOCKET//

// return name of the winner
function whoPlayFirst(game) {
  var secret = (game.player1.name + game.player2.name).length;
  var first = Math.pow((-1), secret);
  if (first) {
    game.player1.isFirst = true;
    game.player2.isFirst = false;
    return game.player1.name; // player 1 win
  }
  else {
    game.player1.isFirst = false;
    game.player2.isFirst = true;
    return game.player2.name;
  }
}
function playerExist(playername) {
  for (var i = 0; i < allPlayers.length; i++) {
    if (allPlayers[i].name == playername) {
      console.log('Player exist at index : ' + i);
      return i;
    }
  }
  return -1;
}
function gameExist(gamename) {
  for (var i = 0; i < allGames.length; i++) {
    if (allGames[i].name == gamename) {
      console.log('Game exist at index : ' + i);
      return i;
    }
  }
  return -1;
}
function storeMovement(user, srcx, srcy, dstx, dsty) {
  allMoves.push(new Move(user, srcx, srcy, dstx, dsty));
}
function addToArray(myArray, elt) {
  var res = myArray.every(function(element, index, array) {
    //console.log('element :', element);
    if (element == elt) {
      return false;
    }
    return true;
  });
  // if no exist
  if (res) {
    //console.log('add elt : ' + elt);
    myArray.push(elt);
    return myArray.length-1;
  }
  else {
    //console.log("don't add elt : " + elt);
    return -1;
  }
}
function rmToArray(myArray, elt) {
  var res = myArray.every(function(element, index, array) {
    //console.log('element :', element);
    if (element != elt) {
      return true;
    }
    return false;
  });
  // if exist
  if (!res) {
    //console.log('rm elt : ' + elt);
    var ind = myArray.indexOf(elt);
    delete myArray[ind];
    return true;
  }
  else {
    //console.log("don't rm elt : " + elt);
    return false;
  }
}

function loadPlayer() {
    var invocus = new Carte(0, 'Normal', 'Player', 0, true, '2', '1', '1', '', 'invocus');
    var spellus = new Carte(1, 'Normal', 'Player', 1, true, '2', '1', '', '', 'spellus');
    var healus = new Carte(2, 'Normal', 'Player', 2, true, '2', '', '1', '', 'healus');
    allAvatars = [invocus, spellus, healus];
    console.log('Avatar 1 : ' + invocus + ' Avatar 2 : ' + spellus + ' Avatar 3 : ' + healus);
}

function loadCartes() {
  var c;
  for (var id = 0; id < maxCartes; id++) {
    if (id >= 0 && id < 10) {
      c = new Carte(id, 'Normal', 'Invocation', 0, true, "1", "1", "1", "soldat", "soldat"+id);
    }
    if (id >= 10 && id < 20) {
      c = new Carte(id, 'Normal', 'Invocation', 1, true, "2", "2", "2", "sergent", "sergent"+id);
    }
    if (id >= 20 && id < 30) {
      c = new Carte(id, 'Normal', 'Invocation', 2, true,"3", "3", "3", "adjudant", "adjudant"+id);
    }
    if (id >= 30 && id < 40) {
      c = new Carte(id, 'Normal', 'Invocation', 3, true, "4", "4", "4", "lieutenant", "lieutenant"+id);
    }
    if (id >= 40 && id < 50) {
      c = new Carte(id, 'Normal', 'Invocation', 4, true, "5", "5", "5", "capitaine", "capitaine"+id);
    }
    if (id >= 50 && id < 60) {
      c = new Carte(id, 'Normal', 'Invocation', 5, true, "6", "6", "6", "commandant", "commandant"+id);
    }
    if (id >= 60 && id < 70) {
      c = new Carte(id, 'Normal', 'Invocation', 6, true, "7", "7", "7", "colonel", "colonel"+id);
    }
    if (id >= 70 && id < 80) {
      c = new Carte(id, 'Normal', 'Invocation', 7, true, "8", "8", "8", "général", "général"+id);
    }
    doEtat(c);
    allCartes.push(c);
    console.log('push a new carte : '+ c);
  }
}
function doEtat(carte) {
  var hasard = Math.floor(Math.random() * 100) + 1;
  if (hasard < 10) {
    carte.special = 'Provocate';
    carte.etat.provocator = true;
  }
  if (hasard >= 10 && hasard < 20) {
    carte.special = 'Furie';
    carte.etat.furie = true;
  }
  if (hasard >= 20 && hasard < 30) {
    carte.special = 'Divin';
    carte.etat.divin = true;
  }
  if (hasard >= 30 && hasard < 40) {
    carte.special = 'Hide';
    carte.etat.hide = true;
  }
  if (hasard >= 40 && hasard < 50) {
    carte.special = 'Charge';
    carte.etat.charge = true;
  }
}
function translateBoard(board) {
  if (board == 'playerBoard') {
    return 'opponentBoard';
  }
  if (board == 'playerHand') {
    return 'opponentHand';
  }
  if (board == 'player') {
    return 'opponent';
  }
  if (board == 'opponentBoard') {
    return 'playerBoard';
  }
  if (board == 'opponentHand') {
    return 'playerHand';
  }
  if (board == 'opponent') {
    return 'player';
  }
  return '';
}

function randomDeck(deck) {
  for (var position = deck.length-1; position >= 1; position--){
    //hasard reçoit un nombre entier aléatoire entre 0 et position
    var hasard = Math.floor(Math.random() * (position + 1));
    //Echange
    var sauve = deck[position];
    deck[position] = deck[hasard];
    deck[hasard] = sauve;
  }
  return deck;
}
console.log('Finish gomassSrv.js');
