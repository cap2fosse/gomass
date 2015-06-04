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
/*
app.get('/', function(req, res){
  res.send('hello world');
});
*/
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
  this.state = ''; //'create', 'running', 'close'
}
// usernames which are currently connected to the chat
var allUsers = [];
var allGames = [];
var allMoves = [];
function storeMovement(user, srcx, srcy, dstx, dsty) {
  allMoves.push(new Move(user, srcx, srcy, dstx, dsty));
}

// default namespace
io.on('connection', function (socket) {
  console.log('connection to namespace : ' + io.name);
  console.log('connection to the soket : ' + socket.id);

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    console.log('received a add user : ' + username);
    // we store the username in the socket session for this client
    socket.username = username;
    socket.register = true;
    // add the client's username to the global list
    if (addToArray(allUsers, username)) {
      socket.emit('login', {
        accepted: true,
        player: username,
        numUsers: allUsers.length
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('user joined', {
        accepted: true,
        player: username,
        numUsers: allUsers.length
      });
    }
    else {
      socket.emit('login', {
        accepted: false,
        player: username,
        numUsers: allUsers.length
      });
    }
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
    socket.emit('new message', {
      username: socket.username,
      message: data
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
    socket.emit('myMove', {
      validated: "Move Ok.",
      move: data.message,
      player: socket.username
    });
    // send to all in the room except requester
    socket.broadcast.to(data.room).emit('hisMove', {
      validated: "New move.",
      move: data.message,
      player: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function (data) {
    console.log('disconnect1 : ' + data);
    if (allUsers.length > 0) {
      // remove the username from global allUsers list
      rmToArray(allUsers, socket.username);
      console.log('disconnect2 : ' + data);
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: allUsers.length
      });
    }
  });

  socket.on('newGame', function (gameName) {
    console.log('create a new game : ' + gameName);
    socket.game = gameName;
    // check if game exist
    if (addToArray(allGames, gameName)) {
      socket.join(gameName);
      // reply to the requester
      socket.emit('newGameOk', {
        validated: "The game is created : " + gameName,
        accepted: true,
        game: gameName
      });
      // send to all other
      socket.broadcast.emit('openGame', {
        validated: "A new game is created : " + gameName,
        accepted: true,
        game: gameName
      });
    }
    else {
      // reply to the requester
      socket.emit('newGameOk', {
        validated: "The game already exist : " + gameName,
        accepted: false,
        game: gameName
      });
    }
  });

  socket.on('joinGame', function (gameName) {
    console.log('join a game : ' + gameName);
    socket.game = gameName;
    socket.join(gameName);
    socket.emit('joinGameOk', {
      validated: "You join the game : " + gameName,
      game: gameName
    });
    socket.broadcast.emit('closeGame', {
      validated: "The game is closed : " + gameName,
      game: gameName
    });
  });
  
});

//OUTSIDE SOCKET//
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
    return true;
  }
  else {
    //console.log("don't add elt : " + elt);
    return false;
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