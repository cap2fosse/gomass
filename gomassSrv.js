// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var server = require('http').createServer();
var io = require('socket.io')(server);
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
  this.player1 = '';
  this.player2 = '';
  this.name = name;
  this.turn = 0;
  this.state = ''; //'create', 'running', 'close'
}
// usernames which are currently connected to the chat
var allUsers = [];
var allGames = [];
var allMoves = [];
function storeMovement(user, srcx, srcy, dstx, dsty) {
  allMoves.push(new Move(user, srcx, srcy, dstx, dsty));
}
var maxRound = Math.floor(Math.random() * 10) + 1;
// default namespace
io.on('connection', function (socket) {
  console.log('connection to namespace : ' + io.name);
  console.log('connection to the soket : ' + socket.id);

  // when the client emits 'add user', this listens and executes
  socket.on('adduser', function (user) {
    console.log('received a add user : ' + user.name);
    // we store the username in the socket session for this client
    socket.username = user.name;
    socket.register = true;
    // add the client's username to the global list
    if (addToArray(allUsers, user.name)) {
      socket.emit('login', {
        accepted: true,
        player: user.name,
        numUsers: allUsers.length
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('userjoined', {
        accepted: true,
        player: user.name,
        numUsers: allUsers.length
      });
    }
    else {
      socket.emit('login', {
        accepted: false,
        player: user.name,
        numUsers: allUsers.length
      });
    }
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function (data) {
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

  // when the client emits 'new message', this listens and executes
  socket.on('newmessage', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('newmessageok', {
      username: data.player,
      message: data.message
    });
    socket.emit('newmessageok', {
      username: data.player,
      message: data.message
    });
  });

  // when the client emits 'move', we broadcast it to others
  socket.on('move', function (data) {
    console.log('received a move from : ' + data.room);
    tempMove = data.message; //srcid, dstid
    tempMove.split(",");
    storeMovement(socket.username, tempMove[0], tempMove[1]);
    console.log('emit to room : ' + socket.game);
    // send only to the requester
    socket.emit('mymove', {
      validated: "Move Ok.",
      move: data.message,
      player: socket.username
    });
    // send to all in the room except requester
    socket.broadcast.to(data.room).emit('hismove', {
      validated: "New move.",
      move: data.message,
      player: socket.username
    });
  });

  socket.on('newgame', function (game) {
    console.log('create a new game : ' + game.name);
    // check if game exist and add it
    myGame = new Game(game.name);
    idx = addToArray(allGames, myGame);
    if (idx != -1) {
      console.log('idx = ' + idx);
      socket.game = game.name;
      socket.join(game.name);
      // update game
      allGames[idx].player1 = socket.username;
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
    else {
      // reply to the requester
      socket.emit('newgameok', {
        validated: "The game already exist : " + game.name,
        accepted: false,
        game: game.name
      });
    }
  });

  socket.on('joingame', function (game) {
    console.log('join a game : ' + game.name);
    // game exist?
    idx = gameExist(game.name);
    if (idx != -1) {
      // store game and join
      socket.game = game.name;
      socket.join(game.name);
      // update game
      allGames[idx].player2 = socket.username;
      allGames[idx].state = 'running';
      // who play first?
      firstPlayer = whoPlayFirst(allGames[idx]);
      // answer to sender
      socket.emit('joingameok', {
        validated: "You join the game : " + game.name,
        game: game.name,
        first: firstPlayer
      });
      socket.emit('startgame', {
        validated: "The game start now. : " + game.name,
        game: game.name,
        first: firstPlayer
      });
      // answer in the game
      socket.broadcast.to(game.name).emit('startgame', {
        validated: "The game start now. : " + game.name,
        game: game.name,
        first: firstPlayer
      });
      // answer for all other
      socket.broadcast.emit('closegame', {
        validated: "The game is closed : " + game.name,
        game: game.name
      });
    }
  });
  // end turn
  socket.on('endturn', function (game) {
    console.log('Receveived endturn : ' + game.name + ' from player : ' + game.player);
    idx = gameExist(game.name);
    if (idx != 1) {
      allGames[idx].turn++;
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

  socket.on('endgame', function (game) {
    console.log('Receveived endgame : ' + game.name + ' from player : ' + game.player);
    idx = gameExist(game.name);
    if (idx != 1) {
      console.log('Turn : ' + allGames[idx].turn + ' on : ' + maxRound);
      if (allGames[idx].turn > maxRound) {
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

// return index of the winner
function whoPlayFirst(game) {
  secret = (game.player1 + game.player2).length;
  first = Math.pow((-1), secret);
  if (first) return game.player1; // player 1 win
  return game.player2;
}
function gameExist(gamename) {
  for (i = 0; i < allGames.length; i++) {
    if (allGames[i].name == gamename) {
      return i;
    }
  }
  return -1;
}

function addToArray(myArray, elt) {
  res = myArray.every(function(element, index, array) {
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
  res = myArray.every(function(element, index, array) {
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