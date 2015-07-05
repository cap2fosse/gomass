'use strict';
console.log('Start gomassSrv.js');
// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var server = require('http').createServer();
var io = require('socket.io')(server);
var Carte = require('./srvCarte.js');
//var PlayerCarte = require('./srvPlayer.js');
var port = process.env.PORT || 3333;
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
  this.cardSelectDone = false;
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
var maxCartes = 120;
var maxPlayer = 3;
var allUsers = [];
var allPlayers = [];
var allGames = [];
var allMoves = [];
var allCartes = [];
var allAvatars = [];
var allPowers = [];
var allManas = [];
// load all cartes of the game
loadCartes();
loadPlayer();
loadManas();
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
        avatar: allAvatars,
        power: allPowers,
        mana: allManas
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
  // when the client emits 'removedhandcard'
  socket.on('removedhandcard', function (data) {
    console.log('receveived cmd removedhandcard from : ' + data.player + ' in room : ' + data.room);
    console.log(data.player + ' ask for : ' + data.numbercard + ' cards');
    var cards = [];
    // game exist?
    var idx = gameExist(data.room);
    if (idx != -1) {
      var p1 = allGames[idx].player1;
      var p2 = allGames[idx].player2;
      if (data.iscreator) {
        cards = p1.getCarte(data.numbercard);
        p1.cardSelectDone = true;
      }
      else {
        cards = p2.getCarte(data.numbercard);
        p2.cardSelectDone = true;
      }
      // send new cards to the requester
      socket.emit('newhandcard', {
        message: "new card for your hand.",
        newcards: cards,
        player: data.player,
        game: data.room
      });
      // send show game
      if (p1.cardSelectDone && p2.cardSelectDone) {
        socket.emit('showgame', {
          message: "the game begin now.",
          player: data.player,
          game: data.room
        });
        socket.broadcast.to(data.room).emit('showgame', {
          message: "the game begin now.",
          player: data.player,
          game: data.room
        });
      }
    }
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
      var caseId = data.caseid;
      var thecarte = data.carte;
      // send only to the requester
      socket.emit('addcarteok', {
        message: "Carte add on board.",
        caseid: caseId,
        player: player,
        game: gameName
      });
      // send to all in the room except requester
      socket.broadcast.to(gameName).emit('putcarte', {
        message: "New carte arrived.",
        srcboard: srcboard,
        dstboard: dstboard,
        caseid: caseId,
        carte: thecarte,
        player: player,
        game: gameName
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
      var board1 = data.defboard;
      var board2 = data.attboard;
      var transboard1 = translateBoard(board1);
      var transboard2 = translateBoard(board2);
      var caseId1 = data.defcaseid;
      var caseId2 = data.attcaseid;
      var changeCard = data.attcarte;
      socket.emit('removeok', {
        message: "Carte removed on board : ",
        caseid: caseId1,
        board: board1
      });
      // send to all in the room except requester
      socket.broadcast.to(gameName).emit('deletecarte', {
        message: "New carte deleted on board : ",
        attboard: transboard2,
        defboard: transboard1,
        defcaseid: caseId1,
        attcaseid: caseId2,
        attcarte: changeCard
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
      var board1 = data.defboard;
      var board2 = data.attboard;
      var transboard1 = translateBoard(board1);
      var transboard2 = translateBoard(board2);
      var caseId1 = data.defcaseid;
      var caseId2 = data.attcaseid;
      var card1 = data.defcarte;
      var card2 = data.attcarte;
      // to the emitter
      socket.emit('changeok', {
        message: "Carte changed on board : ",
        board: board2,
        caseid: caseId2,
        carte: card2
      });
      // send to all in the room except requester
      socket.broadcast.to(gameName).emit('changecarte', {
        message: "New carte change on board : ",
        attboard: transboard2,
        defboard: transboard1,
        defcaseid: caseId1,
        attcaseid: caseId2,
        defcarte: card1,
        attcarte: card2
      });
    }
  });
  // when the client emits 'cardplayed'
  socket.on('cardplayed', function (data) {
    var gameName = data.game;
    var player = data.player;
    console.log('receveived cmd change from : ' + player + ' in room : ' + gameName);
    var idx = gameExist(gameName);
    if (idx != -1) {
      socket.broadcast.to(gameName).emit('cardplayedok', {
        validated: "opponent play a card.",
        game: gameName,
        player: player
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

  // when the client emits 'cardplayed'
  socket.on('defausseattack', function (data) {
    var gameName = data.game;
    var player = data.player;
    var defausse = data.defausse;
    console.log('receveived cmd defausseattack from : ' + player + ' in room : ' + gameName);
    var idx = gameExist(gameName);
    if (idx != -1) {
      socket.broadcast.to(gameName).emit('defausseattackok', {
        validated: "opponent play.",
        game: gameName,
        player: player,
        defausse: defausse
      });
    }
  });

  // when the client emits 'cardplayed'
  socket.on('defaussedefense', function (data) {
    var gameName = data.game;
    var player = data.player;
    var defausse = data.defausse;
    console.log('receveived cmd defaussedefense from : ' + player + ' in room : ' + gameName);
    var idx = gameExist(gameName);
    if (idx != -1) {
      socket.broadcast.to(gameName).emit('defaussedefenseok', {
        validated: "opponent play.",
        game: gameName,
        player: player,
        defausse: defausse
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
      allGames[idx].player1.cardSelectDone = false;
      allGames[idx].player2.cardSelectDone = false;
    }
  });

    // when the client emits 'surrender'
  socket.on('surrender', function (game) {
    var gameName = game.name;
    var player = game.player;
    console.log('receveived cmd surrender from : ' + player + ' in room : ' + gameName);
    var idx = gameExist(gameName);
    if (idx != -1) {
      console.log('End game : ' + game.name + ' from player : ' + game.player);
      // answer to the winner
      socket.emit('endgameok', {
        validated: "The game is over.",
        game: gameName,
        player: player,
        win: false
      });
      socket.broadcast.to(game.name).emit('endgameok', {
        validated: "The game is over.",
        game: gameName,
        player: player,
        win: true
      });
      allGames[idx].player1.cardSelectDone = false;
      allGames[idx].player2.cardSelectDone = false;
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
  // players
  var invocus = new Carte(0, 'Normal', 'Player', 0, true, 2, 0, 0, 30, 'invocus');
  var spellus = new Carte(1, 'Normal', 'Player', 1, true, 2, 0, 0, 30, 'spellus');
  var healus = new Carte(2, 'Normal', 'Player', 2, true, 2, 0, 0, 30, 'healus');
  var armorus = new Carte(3, 'Normal', 'Player', 3, true, 2, 0, 0, 30, 'armorus');
  // spell players
  var invocusSpell = new Carte(0, 'Normal', 'PlayerSpell', 0, true, 2, 1, 0, 1, 'invocusSpell');
  var spellusSpell = new Carte(1, 'Normal', 'PlayerSpell', 1, true, 2, 1, 0, 0, 'spellusSpell');
  spellusSpell.effet.id = 1;
  spellusSpell.effet.zone = 'Single';
  spellusSpell.effet.impact = 'any';
  spellusSpell.effet.declencheur = 'Immediat';
  spellusSpell.effet.modifVie = -1;
  spellusSpell.setDescription();
  var healusSpell = new Carte(2, 'Normal', 'PlayerSpell', 2, true, 2, 0, 0, 1, 'healusSpell');
  healusSpell.effet.id = 2;
  healusSpell.effet.zone = 'Single';
  healusSpell.effet.impact = 'any';
  healusSpell.effet.declencheur = 'Immediat';
  healusSpell.effet.modifVie = 1;
  healusSpell.setDescription();
  var armorusSpell = new Carte(3, 'Normal', 'PlayerSpell', 3, true, 2, 0, 1, 0, 'armorusSpell');
  armorusSpell.effet.id = 3;
  armorusSpell.effet.zone = 'Single';
  armorusSpell.effet.impact = 'any';
  armorusSpell.effet.declencheur = 'Immediat';
  armorusSpell.effet.modifDefense = 1;
  armorusSpell.setDescription();
  // global arrays
  allAvatars = [invocus, spellus, healus, armorus];
  allPowers = [invocusSpell, spellusSpell, healusSpell, armorusSpell];
  console.log('Avatar 1 : ' + invocus + ' Avatar 2 : ' + spellus + ' Avatar 3 : ' + healus + ' Avatar 4 : ' + armorus);
  console.log('AvatarSpell 1 : ' + invocusSpell + ' AvatarSpell 2 : ' + spellusSpell + ' AvatarSpell 3 : ' + healusSpell + ' AvatarSpell 4 : ' + armorusSpell);
}

function loadManas() {
  for (var i = 1; i <= 10; i++) {
    var mana = new Carte(i, 'Normal', 'Mana', 0, true, i);
    allManas.push(mana);
  }
}

function loadCartes() {
  var c;
  for (var id = 0; id < maxCartes; id++) {
    var cardName = getName(5, 9, '', '');
    if (id >= 0 && id < 9) {
      c = new Carte(id, 'Normal', 'Invocation', 0, true, 1, 1, 1, 1, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 9 && id < 13) {
      c = new Carte(id, 'Normal', 'Spell', 0, true, 1, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 13 && id < 15) {
      c = new Carte(id, 'Normal', 'Equipment', 0, true, 1, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 15 && id < 24) {
      c = new Carte(id, 'Normal', 'Invocation', 1, true, 2, 2, 1, 2, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 24 && id < 28) {
      c = new Carte(id, 'Normal', 'Spell', 1, true, 2, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 28 && id < 30) {
      c = new Carte(id, 'Normal', 'Equipment', 1, true, 2, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 30 && id < 39) {
      c = new Carte(id, 'Normal', 'Invocation', 2, true, 3, 3, 1, 3, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 39 && id < 43) {
      c = new Carte(id, 'Normal', 'Spell', 2, true, 3, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 43 && id < 45) {
      c = new Carte(id, 'Normal', 'Equipment', 2, true, 3, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 45 && id < 54) {
      c = new Carte(id, 'Normal', 'Invocation', 3, true, 4, 4, 1, 4, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 54 && id < 58) {
      c = new Carte(id, 'Normal', 'Spell', 3, true, 4, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 58 && id < 60) {
      c = new Carte(id, 'Normal', 'Equipment', 3, true, 4, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 60 && id < 69) {
      c = new Carte(id, 'Normal', 'Invocation', 4, true, 5, 5, 1, 5, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 69 && id < 73) {
      c = new Carte(id, 'Normal', 'Spell', 4, true, 5, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 73 && id < 75) {
      c = new Carte(id, 'Normal', 'Equipment', 4, true, 5, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 75 && id < 84) {
      c = new Carte(id, 'Normal', 'Invocation', 5, true, 6, 6, 1, 6, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 84 && id < 88) {
      c = new Carte(id, 'Normal', 'Spell', 5, true, 6, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 88 && id < 90) {
      c = new Carte(id, 'Normal', 'Equipment', 5, true, 6, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 90 && id < 99) {
      c = new Carte(id, 'Normal', 'Invocation', 6, true, 7, 7, 1, 7, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 99 && id < 103) {
      c = new Carte(id, 'Normal', 'Spell', 6, true, 7, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 103 && id < 105) {
      c = new Carte(id, 'Normal', 'Equipment', 6, true, 7, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 105 && id < 114) {
      c = new Carte(id, 'Normal', 'Invocation', 7, true, 8, 8, 1, 8, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 114 && id < 118) {
      c = new Carte(id, 'Normal', 'Spell', 7, true, 8, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 118 && id < 120) {
      c = new Carte(id, 'Normal', 'Equipment', 7, true, 8, 0, 0, 0, cardName);
      doEquipement(c);
    }
    allCartes.push(c);
    console.log('push a new carte : '+ c);
  }
}

function doEtat(carte) {
  var hasard = Math.floor(Math.random() * 100);
  var defense = -1;
  var attack = -1;
  if (hasard < 10) {
    carte.special = 'Provocate';
    carte.etat.provoke = true;
    if (carte.cout > 0 && carte.cout < 5) {malus(-1, 1, 0);}
    else {malus(-2, 2, 0);}
  }
  if (hasard >= 10 && hasard < 20) {
    carte.special = 'Fury';
    carte.etat.activeFury();
    if (carte.cout > 0 && carte.cout < 5) {malus(0, -1, -1);}
    else {malus(-1, -1, -2);}
  }
  if (hasard >= 20 && hasard < 30) {
    carte.special = 'Divine';
    carte.etat.divine = true;
    if (carte.cout > 0 && carte.cout < 5) {malus(-1, 0, 0);}
    else {malus(-2, 0, 0);}
  }
  if (hasard >= 30 && hasard < 40) {
    carte.special = 'Hide';
    carte.etat.hide = true;
    if (carte.cout > 0 && carte.cout < 5) {malus(0, -1, -1);}
    else {malus(0, -1, -2);}
  }
  if (hasard >= 40 && hasard < 50) {
    carte.special = 'Charge';
    carte.etat.charge = true;
    if (carte.cout > 0 && carte.cout < 5) {malus(0, -1, -1);}
    else {malus(0, -1, -2);}
  }
  function malus(att, def, vie) {
    var a = carte.attaque + att;
    var d = carte.defense + def;
    var v = carte.vie + vie;
    if (a >= 0) {carte.attaque = a;}
    else {carte.attaque = 0;}
    if (d >= 0) {carte.defense = d;}
    else {carte.defense = 0;}
    if (v > 0) {carte.vie = v;}
    else {carte.vie = 1;}
  };
}

function doInvocEffet(carte) {
  var isSpell = Math.floor(Math.random() * 100);  // [0, 99]
  var zone = Math.floor(Math.random() * 100);
  var impact = Math.floor(Math.random() * 100);
  var declencheur = Math.floor(Math.random() * 100);
  var typeModif = Math.floor(Math.random() * 100);
  var singleBonus = parseInt(carte.cout);
  var multiBonus = Math.round(singleBonus/2);
  var isPair = Math.pow(-1, singleBonus); // true if > 0
  var bonusTab = []; //store calculated bonus
  var spell = carte.effet;
  spell.id = carte.id;
  // 30% of chance to get invocation with spell
  if (isSpell < 30) {
    if (declencheur < 20) { // 'Attack'
      spell.declencheur = 'Attack';
      if (isPair > 0) {
        if (zone < 70) {spell.zone = 'Multi';}
        else {spell.zone = 'Single';}
      }
      else {
        if (zone < 70) {spell.zone = 'Single';}
        else {spell.zone = 'Multi';}
      }
      if (impact < 50) {spell.impact = 'opponentBoard';}
      else {spell.impact = 'playerBoard';}
    }
    else if (declencheur < 40) { // 'Defense'
      spell.declencheur = 'Defense';
      if (isPair > 0) {
        if (zone < 70) {spell.zone = 'Multi';}
        else {spell.zone = 'Single';}
      }
      else {
        if (zone < 70) {spell.zone = 'Single';}
        else {spell.zone = 'Multi';}
      }
      if (impact < 50) {spell.impact = 'opponentBoard';}
      else {spell.impact = 'playerBoard';}
    }
    else if (declencheur < 60) { // 'Activated'
      spell.declencheur = 'Activated';
      spell.zone = 'Single';
      spell.impact = 'mySelf';
    }
    else if (declencheur < 80) { // 'Played'
      spell.declencheur = 'Played';
      spell.zone = 'Single';
      spell.impact = 'mySelf';
    }
    else { // 'Die'
      spell.declencheur = 'Die';
      spell.zone = 'Single';
      if (impact < 50) {spell.impact = 'opponent';}
      else {spell.impact = 'player';}
    }
    if (typeModif < 33) { // Attack
      malus(-1, 0, 0);
      // bonus for player
      if (spell.impact == 'player' || spell.impact == 'playerBoard' || spell.impact == 'mySelf') {
        if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'attack');}
        else {bonusTab = calculBonus(multiBonus, 'attack');}
        spell = applyBonus(spell, bonusTab, true);
      }
      // malus for opponent
      else if (spell.impact == 'opponent' || spell.impact == 'opponentBoard') {
        if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'attack');}
        else {bonusTab = calculBonus(multiBonus, 'attack');}
        spell = applyBonus(spell, bonusTab, false);
      }
    }
    else if (typeModif < 66) { // Defense
      malus(0, -1, 0);
      // bonus for player
      if (spell.impact == 'player' || spell.impact == 'playerBoard' || spell.impact == 'mySelf') {
        if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'defence');}
        else {bonusTab = calculBonus(multiBonus, 'defence');}
        spell = applyBonus(spell, bonusTab, true);
      }
      // malus for opponent
      else if (spell.impact == 'opponent' || spell.impact == 'opponentBoard') {
        if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'defence');}
        else {bonusTab = calculBonus(multiBonus, 'defence');}
        spell = applyBonus(spell, bonusTab, false);
      }
    }
    else { // Life
      malus(0, 0, -1);
      // bonus for player
      if (spell.impact == 'player' || spell.impact == 'playerBoard' || spell.impact == 'mySelf') {
        if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'life');}
        else {bonusTab = calculBonus(multiBonus, 'life');}
        spell = applyBonus(spell, bonusTab, true);
      }
      // malus for opponent
      else if (spell.impact == 'opponent' || spell.impact == 'opponentBoard') {
        if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'life');}
        else {bonusTab = calculBonus(multiBonus, 'life');}
        spell = applyBonus(spell, bonusTab, false);
      }
    }
    carte.setDescription();
  }
  function malus(att, def, vie) {
    var a = carte.attaque + att;
    var d = carte.defense + def;
    var v = carte.vie + vie;
    if (a >= 0) {carte.attaque = a;}
    else {carte.attaque = 0;}
    if (d >= 0) {carte.defense = d;}
    else {carte.defense = 0;}
    if (v > 0) {carte.vie = v;}
    else {carte.vie = 1;}
  };
}

function doSpellEffet(carte) {
  var zone = Math.floor(Math.random() * 100); // [0, 99]
  var impact = Math.floor(Math.random() * 100);
  var declencheur = Math.floor(Math.random() * 100);
  var typeModif = Math.floor(Math.random() * 100);
  var bonusSign = Math.floor(Math.random() * 100);
  var singleBonus = parseInt(carte.cout);
  var multiBonus = Math.round(singleBonus/2);
  var isPair = Math.pow(-1, singleBonus); // true if > 0
  var bonusTab = []; //store calculated bonus
  var spell = carte.effet;
  spell.id = carte.id;
  // Zone
  if (isPair > 0 && zone < 70) {spell.zone = 'Multi';}
  else if (isPair > 0) {spell.zone = 'Single';}
  else if (isPair < 0 && zone < 70) {spell.zone = 'Single';}
  else {spell.zone = 'Multi';}
  // Impact
  spell.impact = 'any';
  // choose bonus categories
  if (typeModif < 33) { // Attack
    // bonus
    if (bonusSign < 50) {
      if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'attack');}
      else {bonusTab = calculBonus(multiBonus, 'attack');}
      spell = applyBonus(spell, bonusTab, true);
    }
    // malus
    else {
      if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'attack');}
      else {bonusTab = calculBonus(multiBonus, 'attack');}
      spell = applyBonus(spell, bonusTab, false);
    }
  }
  else if (typeModif < 66) { // Defence
    // bonus
    if (bonusSign < 50) {
      if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'defence');}
      else {bonusTab = calculBonus(multiBonus, 'defence');}
      spell = applyBonus(spell, bonusTab, true);
    }
    // malus
    else {
      if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'defence');}
      else {bonusTab = calculBonus(multiBonus, 'defence');}
      spell = applyBonus(spell, bonusTab, false);
    }
  }
  else { // Life
    // bonus
    if (bonusSign < 50) {
      if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'life');}
      else {bonusTab = calculBonus(multiBonus, 'life');}
      spell = applyBonus(spell, bonusTab, true);
    }
    // malus
    else {
      if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'life');}
      else {bonusTab = calculBonus(multiBonus, 'life');}
      spell = applyBonus(spell, bonusTab, false);
    }
  }
  // all spell are immediate and any
  spell.declencheur = 'Immediat';
  carte.attaque = spell.modifAttack;
  carte.defense = spell.modifDefense;
  carte.vie = spell.modifVie;
  carte.effet = spell;
  carte.setDescription();
}

function calculBonus(originalBonus, typeOfBonus) {
  var diff = originalBonus;
  var attackBonus = 0;
  var defenceBonus = 0;
  var lifeBonus = 0;
  if (typeOfBonus == 'attack') {
    attackBonus = Math.floor(Math.random() * diff) + 1;
    diff -= attackBonus;
    if (diff >= 1) {
      defenceBonus = Math.floor(Math.random() * diff) + 1;
      diff -= defenceBonus;
    }
    if (diff > 0) {
      lifeBonus = diff;
    }
  }
  if (typeOfBonus == 'defence') {
    defenceBonus = Math.floor(Math.random() * diff) + 1;
    diff -= defenceBonus;
    if (diff >= 1) {
      lifeBonus = Math.floor(Math.random() * diff) + 1;
      diff -= lifeBonus;
    }
    if (diff > 0) {
      attackBonus = diff;
    }
  }
  if (typeOfBonus == 'life') {
    lifeBonus = Math.floor(Math.random() * diff) + 1;
    diff -= lifeBonus;
    if (diff >= 1) {
      attackBonus = Math.floor(Math.random() * diff) + 1;
      diff -= attackBonus;
    }
    if (diff > 0) {
      defenceBonus = diff;
    }
  }
  return [attackBonus, defenceBonus, lifeBonus];
}
function applyBonus(theSpell, bonusArray, positive) {
  if (positive) {
    theSpell.modifAttack += bonusArray[0];
    theSpell.modifDefense += bonusArray[1];
    theSpell.modifVie += bonusArray[2];
  }
  else {
    theSpell.modifAttack -= bonusArray[0];
    theSpell.modifDefense -= bonusArray[1];
    theSpell.modifVie -= bonusArray[2];
  }
  return theSpell;
}

function doEquipement(carte) {
  var hasard = Math.floor(Math.random() * 100);
  var impact = Math.floor(Math.random() * 100);
  var armorBonus = parseInt(carte.cout);
  var weaponBonus = Math.round(armorBonus/2);
  var durability = Math.round(weaponBonus/2);
  if (durability <= 0) {durability = 0;}
  if (carte.type == 'Equipment') {
    var equip = carte.equipement;
    equip.id = carte.id;
    if (hasard < 50) {
      equip.type = 'Weapon';
      equip.durability = durability;
      equip.modifAttack = weaponBonus;
    }
    else {
      equip.type = 'Armor';
      equip.modifDefense = armorBonus;
    }
    if (impact < 20) {equip.impact = 'opponentBoard';}
    else if (impact < 40) {equip.impact = 'playerBoard';}
    else if (impact < 60) {equip.impact = 'opponent';}
    else if (impact < 80) {equip.impact = 'player';}
    else {equip.impact = 'any';}
    equip.impact = 'player'; // only for player
    carte.attaque = equip.modifAttack;
    carte.defense = equip.modifDefense;
    carte.equipement = equip;
    carte.setDescription();
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
  if (board == 'playerPower') {
    return 'opponentPower';
  }
  return '';
}

//-----------------------------------------------------------
//random name generator from
//http://leapon.net/files/namegen.html
//-----------------------------------------------------------
function getName(minlength, maxlength, prefix, suffix)
{
  prefix = prefix || '';
  suffix = suffix || '';
  //these weird character sets are intended to cope with the nature of English (e.g. char 'x' pops up less frequently than char 's')
  //note: 'h' appears as consonants and vocals
  var vocals = 'aeiouyh' + 'aeiou' + 'aeiou';
  var cons = 'bcdfghjklmnpqrstvwxz' + 'bcdfgjklmnprstvw' + 'bcdfgjklmnprst';
  var allchars = vocals + cons;
  var length = rnd(minlength, maxlength) - prefix.length - suffix.length;
  var touse = '';
  if (length < 1) length = 1;
  var consnum = 0;
  if (prefix.length > 0) {
    for (var i = 0; i < prefix.length; i++) {
      if (consnum == 2) {consnum = 0;}
      if (cons.indexOf(prefix[i]) != -1) {consnum++;}
    }
  }
  else {
    consnum = 1;
  }
  var name = prefix;
  for (var i = 0; i < length; i++) {
    //if we have used 2 consonants, the next char must be vocal.
    if (consnum == 2) {
      touse = vocals;
      consnum = 0;
    }
    else {touse = allchars;}
    //pick a random character from the set we are goin to use.
    var c = touse.charAt(rnd(0, touse.length - 1));
    name = name + c;
    if (cons.indexOf(c) != -1) {consnum++;}
  }
  name = name.charAt(0).toUpperCase() + name.substring(1, name.length) + suffix;
  return name;
}
function rnd(minv, maxv){
  if (maxv < minv) return 0;
  return Math.floor(Math.random()*(maxv-minv+1)) + minv;
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
