'use strict';
console.log('Start gomassSrv.js');
var express = require('express');
var http = require('http');

var socketIo = require('socket.io');
var socketio_jwt = require('socketio-jwt');

var jwt = require('jsonwebtoken');

var app = express();

var Carte = require('./srvCarte.js');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(__dirname));
app.locals.title = 'Gomass';

///////BDD//////////
var GomassClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/gomass';
var allUsers = [];

// initialize all collections from data base
GomassClient.connect(url, function(err, db) {
  assert.equal(null, err);
  loadUsers(db, function() {
    loadAvatars(db, function() {
      loadAvatarsPower(db, function() {
        loadManas(db, function() {
          loadBasicCards(db, function() {
            loadCollectionCards(db, function() {
              loadDeckCards(db, function() {
                db.close();
              });
            });
          });
        });
      });
    });
  });
});
// load all users
var loadUsers = function(db, callback) {
  console.log('loadUsers');
  var cursor = db.collection('user').find( ).sort({id: 1});
  cursor.each(function(err, auser) {
    assert.equal(err, null);
    if (auser != null) {
      console.dir(auser);
      allUsers.push(auser);
    } else {
      callback();
    }
  });
};
// load all avatars
var loadAvatars = function(db, callback) {
  console.log('loadAvatars');
  var cursor = db.collection('avatar').find( ).sort({id: 1});
  cursor.each(function(err, anavatar) {
    assert.equal(err, null);
    if (anavatar != null) {
      allAvatars.push(anavatar);
    } else {
      callback();
    }
  });
}
// load all avatars power
var loadAvatarsPower = function(db, callback) {
  console.log('loadAvatarsPower');
  var cursor = db.collection('avatar-power').find( ).sort({id: 1});
  cursor.each(function(err, apower) {
    assert.equal(err, null);
    if (apower != null) {
      allPowers.push(apower);
    } else {
      callback();
    }
  });
}
// load all manas
var loadManas = function(db, callback) {
  console.log('loadManas');
  var cursor = db.collection('mana').find( ).sort({id: 1});
  cursor.each(function(err, amana) {
    assert.equal(err, null);
    if (amana != null) {
      allManas.push(amana);
    } else {
      callback();
    }
  });
}
// load all basic cards
var loadBasicCards = function(db, callback) {
  console.log('loadBasicCards');
  var cursor = db.collection('basic-card').find( ).sort({id: 1});
  cursor.each(function(err, acard) {
    assert.equal(err, null);
    if (acard != null) {
      allCartes.push(acard);
    } else {
      callback();
    }
  });
}
// load all collection cards
var loadCollectionCards = function(db, callback) {
  console.log('loadCollectionCards');
  var cursor = db.collection('card-collection').find( ).sort({id: 1});
  cursor.each(function(err, acollection) {
    assert.equal(err, null);
    if (acollection != null) {
      allPlayersCollection.push(acollection);
    } else {
      callback();
    }
  });
}
// load all players decks cards
var loadDeckCards = function(db, callback) {
  console.log('loadDeckCards');
  var cursor = db.collection('deck').find( ).sort({id: 1});
  cursor.each(function(err, adeck) {
    assert.equal(err, null);
    if (adeck != null) {
      allPlayersDeck.push(adeck);
    } else {
      callback();
    }
  });
}
// load all current player decks cards
var loadPlayerDeckCards = function(db, playerName, callback) {
  console.log('loadPlayerDeckCards');
  var cursor = db.collection('deck').find( {"playername": playerName} ).sort({id: 1});
  cursor.each(function(err, adeck) {
    assert.equal(err, null);
    if (adeck != null) {
      currentPlayerDecks.push(adeck);
    } else {
      callback();
    }
  });
}
// get number of played and wins games and store it in allPlayers array
var loadPlayerInfos = function(db, playerName, callback) {
  console.log('loadPlayerInfos');
  var cursor = db.collection('user').find({"name": playerName});
  cursor.each(function(err, auser) {
    assert.equal(err, null);
    if (auser != null) {
      var playerId = playerExist(playerName);
      if (playerId != -1) {
        allPlayers[playerId].playedGame = auser.playedGame;
        allPlayers[playerId].nbWinGame = auser.nbWinGame;
        allPlayers[playerId].avatarId = auser.currentAvatarId;
        allPlayers[playerId].currentCollectionId = auser.currentCollectionId;
        allPlayers[playerId].currentDeckId = auser.currentDeckId;
        allPlayers[playerId].collectionStruct = allPlayersCollection[auser.currentCollectionId];
        allPlayers[playerId].deckStruct = currentPlayerDecks[auser.currentDeckId];
      }
    } else {
      callback();
    }
  });
};
// update player infos stored in allPlayers array
var updatePlayerInfos = function(db, playerName, callback) {
  console.log('updatePlayerInfos');
  var playerId = playerExist(playerName);
  if (playerId != -1) {
    db.collection('user').updateOne(
      {"name": playerName},
      {$set: { "playedGame": allPlayers[playerId].playedGame, 
               "nbWinGame": allPlayers[playerId].nbWinGame,
               "currentAvatarId": allPlayers[playerId].avatarId,
               "currentCollectionId": allPlayers[playerId].collectionId,
               "currentDeckId": allPlayers[playerId].deckId}},
      function(err, results) {
      callback();
    });
  }
};
// add player deck
var addPlayerDeck = function(db, playerName, deckId, deckName, cardList, callback) {
  console.log('addPlayerDeck');
  var playerId = playerExist(playerName);
  if (playerId != -1) {
    var adeck = {"id": deckId, 
       "name": deckName,
       "playername": playerName,
       "cardIdList": cardList};
    currentPlayerDecks.push(adeck);
    db.collection('deck').insertOne(
      adeck,
      function(err, results) {
      callback();
    });
  }
};
// remove player deck
var delPlayerDeck = function(db, playerName, deckId, callback) {
  console.log('delPlayerDeck : ' + playerName + '  ' + deckId);
  var playerId = playerExist(playerName);
  if (playerId != -1) {
    db.collection('deck').remove( {"id": deckId, "playername": playerName} );
  }
};
////////AUTH////////
var fs = require('fs');
var cert_pub = fs.readFileSync(__dirname + '/cert/rsa-public-key.pem', 'utf8');
var cert_priv = fs.readFileSync(__dirname + '/cert/rsa-private.pem', 'utf8');
var gomassSecret = "Gomass Secret Passphrase";

// get the secret
app.post('/secret', function(req, res){
  var user = req.body.username;
  console.log('user ' + user + ' ask for secret\n');
  var profileIdx = userExist(user);
  if (profileIdx != -1) {
    var secret = {"secret": gomassSecret};
    var tokenSecret = jwt.sign(secret, cert_priv, {expiresInMinutes: 60, algorithm: 'RS256'});
    // verify token
    var decoded = jwt.verify(tokenSecret, cert_pub);
    console.log('Decoded name : ' + decoded.secret);
    res.json({"verified": true, "secret": tokenSecret});
  }
  else {
    console.log('Return to index!');
    res.json({"verified": false});
  }
});

// get username check existence and password
app.post('/login', function(req, res){
  var user = req.body.username;
  var pass = req.body.password;
  console.log('user ' + user + ' pass : ' + pass + '\n');
  var profileIdx = profileVerified(user, pass);
  if (profileIdx != -1) {
    var profile = allUsers[profileIdx];
    // We are sending the profile inside the token
    var token = jwt.sign(profile, cert_priv, {expiresInMinutes: 60, algorithm: 'RS256'});
    // verify token
    var decoded = jwt.verify(token, cert_pub);
    console.log('Decoded name : ' + decoded.name);
    res.json({verified: true, token: token});
  }
  else {
    console.log('Return to index!');
    res.json({verified: false});
  }
});

function profileVerified(username, password) {
  for (var i = 0; i < allUsers.length; i++) {
    if (username == allUsers[i].name && password == allUsers[i].password) {
      console.log("User " + username + " is verified!");
      return i;
    }
    else {
      console.log("User " + username + " isn't verified!");
    }
  }
  return -1;
}

var server = http.createServer(app);
var sio = socketIo.listen(server);

sio.use(socketio_jwt.authorize({
  secret: cert_pub,
  handshake: true
}));

///////CONNECTED/////////
sio.sockets
  .on('connection', function (socket) {
    var token = socket.decoded_token;
    console.log(token.name, 'connected');

    // when the client emits 'connectgomass'
  socket.on('connectgomass', function (user) {
    console.log('received cmd connectgomass : ' + user.name);
    // we store the username in the socket session for this client
    socket.username = user.name;
    socket.register = true;
    // add the client's username to the global list
    // and send all collection cards 
    var idx = userExist(user.name);
    // check
    if (idx != -1) {
      console.log('add new player : ' + user.name);
      // create and load player infos
      createPlayer(user.name);
      // get ID of player
      var p1Id = playerExist(user.name);
      // get avatarId, collection and deck
      var avatar_id = allPlayers[p1Id].avatarId;
      var playercollectionname = allPlayers[p1Id].collectionName;
      var playerdeckname = allPlayers[p1Id].deckName;
      var allplayercollections = allPlayers[p1Id].collectionStruct;
      var allplayerdecks = allPlayers[p1Id].deckStruct;
      var playerdeck = allPlayers[p1Id].deck;
      var playercollection = allPlayers[p1Id].collection;
      // emit welcome
      socket.emit('login', {
        accepted: true,
        player: user.name,
        avatarId: avatar_id,
        numUsers: allUsers.length,
        cartes: allCartes,
        allcollections: allplayercollections,
        collection: playercollection,
        alldecks: allplayerdecks,
        deck: playerdeck,
        deckname: playerdeckname,
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
      allPlayers[idP].avatarId = message.id;
      socket.emit('avatarok', {
        accepted: true,
        player: message.player,
        avatarId: message.id
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
  
  // when the client emits 'deck'
  socket.on('savedeck', function (theDeck) {
    console.log('received cmd savedeck : ' + theDeck.player);
    var ok = false;
    var issaved = false;
    var lastId = currentPlayerDecks.length;
    // get id of player
    var idP = playerExist(theDeck.player);
    if (idP != -1) {
      var deckname = theDeck.deckname;
      var idD = deckExist(deckname);
      // if deck don't exist
      if (idD == -1) {
        ok = true;
        // build deck
        var csvDeck = '';
        var i = 0;
        while (i < theDeck.deck.length) {
          csvDeck = csvDeck + theDeck.deck[i].id + ';';
          i++;
        }
        var deckStruct = {"id": lastId, "name": theDeck.deckname, "playername": theDeck.player, "cardIdList": csvDeck};
        var playername = theDeck.player;
        if (lastId < maxDeck) {
          GomassClient.connect(url, function(err, db) {
            assert.equal(null, err);
            addPlayerDeck(db, playername, lastId, deckname, csvDeck, function() {
            db.close();
            });
          });
          issaved = true;
        }
      }
      socket.emit('savedeckok', {
        accepted: ok,
        saved: issaved,
        player: theDeck.player,
        deckname: theDeck.deckname,
        deck: deckStruct,
        deckid: lastId
      });
    }
  });
  
  // when the client emits 'deck'
  socket.on('deldeck', function (theDeck) {
    console.log('received cmd deldeck : ' + theDeck.player);
    // get id of player
    var idP = playerExist(theDeck.player);
    if (idP != -1) {
      // get infos
      var ideckid = theDeck.deckid;
      var ideckname = theDeck.deckname;
      var iplayername = theDeck.player;
      // delete deck from db
      GomassClient.connect(url, function(err, db) {
        assert.equal(null, err);
        delPlayerDeck(db, iplayername, ideckid, function() {
        db.close();
        });
      });
      socket.emit('deldeckok', {
        accepted: true,
        player: theDeck.player,
        deckid: ideckid,
        deckname: ideckname
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
        // store a reference of a player in allGames array
        allGames[idx].player1 = allPlayers[idP];
        allGames[idx].player1.curentGame = gameName;
        // update game
        allGames[idx].state = 'create';
        var timerGame = allGames[idx].timer;
        // reply to the requester
        socket.emit('newgameok', {
          validated: "The game is created : " + game.name,
          accepted: true,
          game: gameName,
          time: timerGame
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
      // store game and join the room
      socket.game = gameName;
      socket.join(gameName);
      // get id of player
      var idP = playerExist(player);
      if (idP != -1) {
        // store player in game
        allGames[idx].player2 = allPlayers[idP];
        allGames[idx].player2.curentGame = gameName;
        // update game
        allGames[idx].state = 'running';
        var timerGame = allGames[idx].timer;
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
          first: firstPlayer,
          time: timerGame
        });
        socket.emit('startgame', {
          validated: "The game start now : ",
          game: gameName,
          first: firstPlayer,
          index: idxGame,
          player1: allGames[idx].player1.name,
          player2: allGames[idx].player2.name,
          hand: theHand2,
          avatarId1: allGames[idx].player1.avatarId,
          avatarId2: allGames[idx].player2.avatarId
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
          avatarId1: allGames[idx].player1.avatarId,
          avatarId2: allGames[idx].player2.avatarId
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
      var newtime = allGames[idx].timer;
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
        player: player,
        time: newtime
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
      //reset game infos
      allGames[idx].player1.cardSelectDone = false;
      allGames[idx].player2.cardSelectDone = false;
      // update allPlayers infos
      var p1Id = playerExist(allGames[idx].player1.name);
      var p2Id = playerExist(allGames[idx].player2.name);
      if (p1Id != -1 && p2Id != -1) {
        allPlayers[p1Id].playedGame++;
        allPlayers[p2Id].playedGame++;
        // update win game
        if (game.creator) { allPlayers[p1Id].nbWinGame++; }
        else { allPlayers[p2Id].nbWinGame++; }
        // update players infos in db
        GomassClient.connect(url, function(err, db) {
          assert.equal(null, err);
          updatePlayerInfos(db, allPlayers[p1Id].name, function() {
          db.close();
          });
        });
        GomassClient.connect(url, function(err, db) {
          assert.equal(null, err);
          updatePlayerInfos(db, allPlayers[p2Id].name, function() {
          db.close();
          });
        });
      }
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

    // when the client emits 'surrender'
  socket.on('surrender', function (game) {
    var gameName = game.name;
    var player = game.player;
    console.log('receveived cmd surrender from : ' + player + ' in room : ' + gameName);
    var idx = gameExist(gameName);
    if (idx != -1) {
      console.log('End game : ' + game.name + ' from player : ' + game.player);
      //reset game infos
      allGames[idx].player1.cardSelectDone = false;
      allGames[idx].player2.cardSelectDone = false;
      // update allPlayers infos
      var p1Id = playerExist(allGames[idx].player1.name);
      var p2Id = playerExist(allGames[idx].player2.name);
      if (p1Id != -1 && p2Id != -1) {
        allPlayers[p1Id].playedGame++;
        allPlayers[p2Id].playedGame++;
        // update win game
        if (game.creator) { allPlayers[p1Id].nbWinGame++; }
        else { allPlayers[p2Id].nbWinGame++; }
        // update players infos in db
        GomassClient.connect(url, function(err, db) {
          assert.equal(null, err);
          updatePlayerInfos(db, allPlayers[p1Id].name, function() {
          db.close();
          });
        });
        GomassClient.connect(url, function(err, db) {
          assert.equal(null, err);
          updatePlayerInfos(db, allPlayers[p2Id].name, function() {
          db.close();
          });
        });
      }
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
    }
  });
});
//OUTSIDE SOCKET//
setInterval(function () {
  sio.emit('time', Date());
}, 5000);

var port = process.env.PORT || 3333;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

//////////////////////////////USE FULL///////////////////////
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
  this.timer = 60;
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

function Player(name, collectionid, deckid, avatarid, nbwin, nbplay) {
  this.name = name;
  this.isFirst = false;
  this.myTurn = false;
  this.cardSelectDone = false;
  // default collection id
  this.collectionId = collectionid;
  // default deck id
  this.deckId = deckid;
  // default collection name
  this.collectionName = "";
  // default deck name
  this.deckName = "";
  // all player collections struct
  this.collectionStruct = [];
  // all player decks struct
  this.deckStruct = [];
  // current player collection cards
  this.collection = [];
  // current player deck cards
  this.deck = [];
  this.avatarId = avatarid;
  this.playedGame = nbplay;
  this.nbWinGame = nbwin;
  // get carte from current deck
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
  // init default player deck
  this.initDefaultDeck = function() {
    console.log("initDefaultDeck");
    var csvdeck = this.deckStruct[this.deckId].cardIdList;
    var arraydeck = csvdeck.split(";");
    var currentId = 0;
    if (arraydeck.length > 0) {
      for (var i = 0; i < arraydeck.length; i++) {
        currentId = arraydeck[i];
        this.deck[i] = allCartes[currentId];
      }
    }
    this.deckName = this.deckStruct[this.deckId].name;
  }
  // init player collection
  this.initDefaultCollection = function() {
    console.log("initDefaultCollection");
    var csvcollection = this.collectionStruct[this.collectionId].cardIdList;
    var arraycollection = csvcollection.split(";");
    var currentId = 0;
    if (arraycollection.length > 0) {
      for (var i = 0; i < arraycollection.length; i++) {
        currentId = arraycollection[i];
        this.collection[i] = allCartes[currentId];
      }
    }
    this.collectionName = this.collectionStruct[this.collectionId].name;
  }
  // load current player decks
  this.loadPlayerListDecks = function () {
    console.log("loadPlayerListDecks");
    var idxad = 0;
    var idxd = 0;
    var thedeck;
    while (idxad < allPlayersDeck.length) {
      thedeck = allPlayersDeck[idxad];
      if (thedeck.playername == this.name) {
        this.deckStruct[idxd] = thedeck;
        idxd++;
        console.log("load deck : " + thedeck.name);
      }
      idxad++;
    }
  }
  // load current player collections
  this.loadPlayerListCollections = function () {
    console.log("loadPlayerListCollections");
    var idxac = 0;
    var idxc = 0;
    var thecollection;
    while (idxac < allPlayersCollection.length) {
      thecollection = allPlayersCollection[idxac];
      if (thecollection.playername == this.name) {
        this.collectionStruct[idxc] = thecollection;
        idxc++;
        console.log("load collection : " + thecollection.name);
      }
      idxac++;
    }
  }
}

///////////////////////////GLOBALE PART//////////////////////////
var maxCartes = 120;
var maxPlayer = 4;
var maxDeck = 8;
// from collection user
var allPlayers = [];
// from collection card-collection
var allCartes = [];
// from collection avatar
var allAvatars = [];
// from collection avatar-power
var allPowers = [];
// from collection mana
var allManas = [];
// from collection card-collection
var allPlayersCollection = [];
// from collection deck
var allPlayersDeck = [];
// internal list of current player decks
var currentPlayerDecks = [];
// internal list of current games
var allGames = [];
// internal list of move : not used
var allMoves = [];

// create a new player and load all infos from db
function createPlayer(playerName) {
  console.log("createPlayer");
  var auserid = userExist(playerName);
  if (auserid != -1) {
    var collectionid = allUsers[auserid].currentCollectionId;
    var deckid = allUsers[auserid].currentDeckId;
    var avatarid = allUsers[auserid].currentAvatarId;
    var nbwin = allUsers[auserid].nbWinGame;
    var nbplay = allUsers[auserid].playedGame;
    var newplayer = new Player(playerName, collectionid, deckid, avatarid, nbwin, nbplay);
    // initialize collection and deck array
    newplayer.loadPlayerListCollections();
    newplayer.loadPlayerListDecks();
    newplayer.initDefaultCollection();
    newplayer.initDefaultDeck();
    allPlayers.push(newplayer);
  }
}

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
function userExist(username) {
  for (var i = 0; i < allUsers.length; i++) {
    if (allUsers[i].name == username) {
      console.log('Users exist at index : ' + i);
      return i;
    }
  }
  return -1;
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
function deckExist(deckname) {
  for (var i = 0; i < currentPlayerDecks.length; i++) {
    if (currentPlayerDecks[i].name == deckname) {
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
