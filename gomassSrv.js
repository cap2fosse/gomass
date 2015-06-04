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
  this.state = ''; //'create', 'running', 'close'
  this.toString = function() {
    return " name : " + this.name + " turn : " + this.turn + " state : " + this.state;
  }
}
function Player(name) {
  this.name = name;
  this.isFirst = false;
  this.deck = [];
  this.imgid = 0;
  this.getCarte = function(nbCarte) {
    var carte = [];
    if (this.deck.length > 0) {
      for (var i = 0; i < nbCarte; i++) {
        carte[i] = this.deck.pop();
        console.log('get carte : ' + carte[i] + '\n');
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
var maxRound = Math.floor(Math.random() * 10) + 1;
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
    if (addToArray(allUsers, user.name)) {
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
      // store the deck
      allPlayers[idP].imgid = message.id;
      console.log('imgid : '+message.id);
      socket.emit('avatarok', {
        accepted: true,
        player: message.player
      });
    }
  });

  // when the client emits 'deck'
  socket.on('deck', function (theDeck) {
    console.log('received cmd deck : ' + theDeck.player);
    // get id of player
    var idP = playerExist(theDeck.player);
    if (idP != -1) {
      // store the deck
      allPlayers[idP].deck = theDeck.deck;
      console.log('Deck : '+theDeck.deck);
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
    // we tell the client to execute 'newmessageok'
    socket.broadcast.emit('newmessageok', {
      username: data.player,
      message: data.message
    });
    socket.emit('newmessageok', {
      username: data.player,
      message: data.message
    });
  });

  // when the client emits 'newgame'
  socket.on('newgame', function (game) {
    console.log('receveived cmd newgame : ' + game.name + ' from player : ' + game.player);
    // check if game exist and add it
    myGame = new Game(game.name);
    idx = addToArray(allGames, myGame);
    if (idx != -1) {
      socket.game = game.name;
      socket.join(game.name);
      // get id of player
      var idP = playerExist(game.player);
      if (idP != -1) {
        // update game
        allGames[idx].player1 = allPlayers[idP];
        allGames[idx].state = 'create';
        // reply to the requester
        socket.emit('newgameok', {
          validated: "The game is created : " + game.name,
          accepted: true,
          game: game.name
        });
        // send to all other
        socket.broadcast.emit('opengame', {
          validated: "A new game is created : " + game.name,
          accepted: true,
          game: game.name
        });
      }
    }
    else {
      // reply to the requester
      socket.emit('newgameok', {
        validated: "The game already exist : " + game.name,
        accepted: false,
        game: game.name
      });
    }
  });

  // when the client emits 'joingame'
  socket.on('joingame', function (game) {
    console.log('receveived cmd joingame : ' + game.name + ' from player : ' + game.player);
    // game exist?
    var idx = gameExist(game.name);
    if (idx != -1) {
      // store game and join
      socket.game = game.name;
      socket.join(game.name);
      // get id of player
      var idP = playerExist(game.player);
      if (idP != -1) {
        // update game
        allGames[idx].player2 = allPlayers[idP];
        allGames[idx].state = 'running';
        // who play first, update Player isFirst property
        var firstPlayer = whoPlayFirst(allGames[idx]);
        // get hand card
        var theHand1 = allGames[idx].player1.getCarte(3);
        var theHand2 = allGames[idx].player2.getCarte(3);
        // answer to sender player 2
        socket.emit('joingameok', {
          validated: "You join the game : " + game.name,
          game: game.name,
          index: game.idx,
          first: firstPlayer,
          player1: allGames[idx].player1.name,
          player2: allGames[idx].player2.name
        });
        socket.emit('startgame', {
          validated: "The game start now. : " + game.name,
          game: game.name,
          index: game.idx,
          first: firstPlayer,
          player1: allGames[idx].player1.name,
          player2: allGames[idx].player2.name,
          hand: theHand2,
          imgid1: allGames[idx].player1.imgid,
          imgid2: allGames[idx].player2.imgid
        });
        // answer in the game (player 1)
        socket.broadcast.to(game.name).emit('startgame', {
          validated: "The game start now. : " + game.name,
          game: game.name,
          index: game.idx,
          first: firstPlayer,
          player1: allGames[idx].player1.name,
          player2: allGames[idx].player2.name,
          hand: theHand1,
          imgid1: allGames[idx].player1.imgid,
          imgid2: allGames[idx].player2.imgid
        });
        // answer to all others
        socket.broadcast.emit('closegame', {
          validated: "The game is closed : " + game.name,
          game: game.name,
          index: game.idx
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
    console.log('receveived cmd addcarte from : ' + data.player + ' in room : ' + data.game);
    var dstboard = translateBoard(data.dstboard);
    var srcboard = translateBoard(data.srcboard);
    var caseId = data.caseId;
    var carteId = data.carteId;
    // send only to the requester
    socket.emit('addcarteok', {
      message: "Carte add on board.",
      carteId: carteId,
      player: data.player
    });
    // send to all in the room except requester
    socket.broadcast.to(data.game).emit('putcarte', {
      message: "New carte arrived.",
      srcboard: srcboard,
      dstboard: dstboard,
      caseId: caseId,
      carteId: carteId,
      player: data.player
    });
  });
  // when the client emits 'newcarte'
  socket.on('newcarte', function (data) {
    console.log('receveived cmd addcarte from : ' + data.player + ' in room : ' + data.game);
    var dstboard = translateBoard(data.dstboard);
    var srcboard = translateBoard(data.srcboard);
    var caseId = data.caseId;
    var carte = data.carte;
    // set up id and type
    carte.id = allCartes.length;
    // add the new Carte to allCartes
    allCartes.push(carte);
    // send only to the requester
    socket.emit('newcarteok', {
      message: "Carte created on board.",
      carte: carte,
      player: data.player
    });
    // send to all in the room except requester
    socket.broadcast.to(data.game).emit('insertcarte', {
      message: "New carte inserted.",
      srcboard: srcboard,
      dstboard: dstboard,
      caseId: caseId,
      carte: carte,
      player: data.player
    });
  });
  // when the client emits 'endturn'
  socket.on('endturn', function (game) {
    console.log('receveived cmd endturn from : ' + game.player + ' in room : ' + game.name);
    idx = gameExist(game.name);
    if (idx != 1) {
      allGames[idx].turn++;
      console.log('next turn is : ' + allGames[idx].turn + ' on : ' + maxRound);
      socket.emit('endturnok', {
        validated: "Your turn is finish.",
        game: game.name,
        first: false
      });
      socket.broadcast.to(game.name).emit('endturnok', {
        validated: "Your turn start now.",
        game: game.name,
        first: true
      });
    }
  });

  // when the client emits 'endgame'
  socket.on('endgame', function (game) {
    console.log('receveived cmd endgame from : ' + game.player + ' in room : ' + game.name);
    idx = gameExist(game.name);
    if (idx != 1) {
      if (allGames[idx].turn >= maxRound) {
        console.log('End game : ' + game.name + ' from player : ' + game.player);
        socket.emit('endgameok', {
          validated: "The game is over.",
          game: game.name,
          win: false
        });
        socket.broadcast.to(game.name).emit('endgameok', {
          validated: "The game is over.",
          game: game.name,
          win: true
        });
      }
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
      return i;
    }
  }
  return -1;
}
function gameExist(gamename) {
  for (var i = 0; i < allGames.length; i++) {
    if (allGames[i].name == gamename) {
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
    myArray[myArray.length] = elt;
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
    ind = myArray.indexOf(elt);
    delete myArray[ind];
    return true;
  }
  else {
    //console.log("don't rm elt : " + elt);
    return false;
  }
}

function loadPlayer() {
    var invocus = new Carte(0, 0, '2', '1', '1', '', 'invocus', true, false, 2);
    var spellus = new Carte(1, 1, '2', '1', '', '', 'spellus', true, false, 2);
    var healus = new Carte(2, 2, '2', '', '2', '', 'healus', true, false, 2);
    allAvatars = [invocus, spellus, healus];
    console.log('Avatar 1 : ' + invocus + ' Avatar 2 : ' + spellus + ' Avatar 3 : ' + healus);
}

function loadCartes() {
  var c;
  for (var id = 0; id < maxCartes; id++) {
    if (id >= 0 && id < 10) {
      c = new Carte(id, 1, "1", "1", "1", "soldat", "soldat"+id, true, false, 0);
    }
    if (id >= 10 && id < 20) {
      c = new Carte(id, 2, "2", "2", "2", "sergent", "sergent"+id, true, false, 0);
    }
    if (id >= 20 && id < 30) {
      c = new Carte(id, 3, "3", "3", "3", "adjudant", "adjudant"+id, true, false, 0);
    }
    if (id >= 30 && id < 40) {
      c = new Carte(id, 4, "4", "4", "4", "lieutenant", "lieutenant"+id, true, false, 0);
    }
    if (id >= 40 && id < 50) {
      c = new Carte(id, 5, "5", "5", "5", "capitaine", "capitaine"+id, true, false, 0);
    }
    if (id >= 50 && id < 60) {
      c = new Carte(id, 6, "6", "6", "6", "commandant", "commandant"+id, true, false, 0);
    }
    if (id >= 60 && id < 70) {
      c = new Carte(id, 7, "7", "7", "7", "colonel", "colonel"+id, true, false, 0);
    }
    if (id >= 70 && id < 80) {
      c = new Carte(id, 8, "8", "8", "8", "général", "général"+id, true, false, 0);
    }
    allCartes.push(c);
    console.log('push a new carte : '+ c);
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
  return '';
}