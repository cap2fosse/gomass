'use strict';
console.log('Start gomassClt.js');
// socket creation
var socket;
var token;
//BEGIN CONNECTED
function safeConnect() {
  socket = io.connect(token ? ('?token=' + token) : '', {
    'forceNew': true
  });
  socket.on('login', function(message) {
    if (message.accepted) {
      console.log('Received login : you are accepted : ' + message.player);
      var decoded = jwt_decode(token);
      console.log('Decoded message : ' + decoded.name);
      // fill array of carte and avatar
      var srvAllGameCartes = message.cartes;
      var srvAllCollectionCartes = message.collection;
      var srvAllDeckCartes = message.deck;
      var srvAllAvatarsCartes = message.avatar;
      var srvAllPowerCartes = message.power;
      var srvAllManaCartes = message.mana;
      createArrayCarte(srvAllGameCartes, allGameCartes);
      createArrayCarte(srvAllCollectionCartes, allCollectionCartes);
      createArrayCarte(srvAllDeckCartes, allDeckCartes);
      createArrayCarte(srvAllAvatarsCartes, allAvatarsCartes);
      createArrayCarte(srvAllPowerCartes, allPowerCartes);
      createArrayCarte(srvAllManaCartes, allManaCartes);
      // set all player collections
      allCollections = message.allcollections;
      // set all player decks
      allDecks = message.alldecks;
      // set player deck name
      currentPlayerDeckName = message.deckname;
      // get last avatar and set it
      var lastAvatar = allAvatarsCartes[message.avatarId];
      selectedAvatar.addClone(0, lastAvatar);
      //set all cartes in boards
      allCarte.setAll(allGameCartes);
      carteCollection.setAll(allCollectionCartes);
      // active main commands
      disableMainCmd(false);
      // change info
      displayInfo(2);
    }
    else {
      console.log('Received connect : login already exist : ' + message.player);
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
      // set new avatar
      var avatarCard = allAvatarsCartes[message.avatarId];
      selectedAvatar.addClone(0, avatarCard);
      // active deck button
      cardsB.disabled = false;
      // hide avatar board
      playerSelector.setVisibility(false);
      // show commands
      disableCmd(false);
      hideCmd(false);
      // display info
      displayInfo(3);
      console.log('Received avatarok : ' + message.accepted);
    }
    else {
      console.log('Received avatarok : ' + message.accepted);
    }
  })
  socket.on('deckok', function(message) {
      console.log('Received deckok : ' + message.accepted);
    if (message.accepted) {
      // hide the deck builder
      showDeckBuilder(false);
      // show commands
      disableCmd(false);
      hideCmd(false);
      // display info
      displayInfo(4);
    }
  })
  socket.on('savedeckok', function(message) {
    console.log('Received savedeckok : ' + message.accepted);
    if (message.accepted) {
      if (message.saved) {
        currentPlayerDeckName = message.deckname;
        allDecks.push(message.deck);
        listDecks.addOption(currentPlayerDeckName);
        console.log('Deck saved : ' + message.saved);
      }
      else {
        console.log('Deck not saved, capacity exceded : ' + message.saved);
      }
    }
    else {
      console.log('Deck already exist : ' + message.accepted);
    }
  })
  socket.on('deldeckok', function(message) {
    console.log('Received deldeckok : ' + message.accepted);
    if (message.accepted) {
      // remove option
      listDecks.delOption(message.deckid);
    }
    else {
      console.log("Can't delete deck : " + message.accepted);
    }
  })
  socket.on('newgameok', function(message) {
  console.log('Received newgameok : ' + message.validated);
    if (message.accepted) {
      gameName = message.game;
      currentTime = message.time;
      disableCmd(true);
      // show info
      displayInfo(5);
    }
    else {
      console.log('Received newgameko : ' + message.validated);
    }
  })
  socket.on('joingameok', function(message) {
    gameName = message.game;
    currentTime = message.time;
    createT.value = gameName;
    disableCmd(true);
    console.log('Received joingameok : ' + message.validated + gameName + ' player : ' + message.first + ' start the game!');
  })
  socket.on('opengame', function(message) {
    gomassListGame.addOption(message.game);
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
      srvCardOp = allAvatarsCartes[message.avatarId2]; // set the carte
      srvCardPl = allAvatarsCartes[message.avatarId1];
      srvPowerOp = allPowerCartes[message.avatarId2];
      srvPowerPl = allPowerCartes[message.avatarId1];
    }
    else {
      opponentName = message.player1;
      srvCardOp = allAvatarsCartes[message.avatarId1];
      srvCardPl = allAvatarsCartes[message.avatarId2];
      srvPowerOp = allPowerCartes[message.avatarId1];
      srvPowerPl = allPowerCartes[message.avatarId2];
    }
    // add avatar to the board
    opponent.addClone(0, srvCardOp);
    player.addClone(0, srvCardPl);
    // set name of players
    player.setName();
    opponent.setName();
    // add power
    playerPower.addClone(0, srvPowerPl);
    opponentPower.addClone(0, srvPowerOp);
    // fill mana board
    manaBoard.fill();
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
    // active button
    cardSelectorCommandsDiv.visible(true);
    displayInfo(6);
  })
  socket.on('newhandcard', function(data) {
    console.log('Received newhandcard : ' + data.message + data.game + ' from player : ' + data.player);
    var newCards = [];
    createArrayCarte(data.newcards, newCards);
    // hide cardSelector & button
    cardSelector.setVisibility(false);
    cardSelectorCommandsDiv.visible(false);
    // get the rest
    playerHand.fill(cardSelector.getAll());
    // add new hand & active
    playerHand.fill(newCards);
    playerHand.activateAll();
    // set hiding opponent hand
    var backC = [backCard, backCard, backCard];
    opponentHand.fill(backC);
    displayInfo(7);
  })
  socket.on('showgame', function(data) {
    console.log('Received showgame : ' + data.message + data.game + ' from player : ' + data.player);
    // hide the info
    infoDiv.visible(false);
    // hide the selected objects
    selectedAvatar.setVisibility(false);
    // show commands
    gameCommandsDiv.visible(true);
    timeCommandDiv.visible(true);
    if (myTurn) {
      endTurnB.disabled  = false;
      startTime = true;
    }
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
    startTime = false;
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
    playerHand.inactivateAll();
    manaBoard.inactivateAll();
  })
  socket.on('newturn', function(message) {
    console.log('Received newturn : ' + message.player + ' game : ' + message.game + ' mana : ' + message.mana + ' message : ' + message.validated);
    myTurn = true;
    startTime = true;
    currentTime = message.time;
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
    playerHand.activateAll();
    opponentPower.inactivateAll();
    opponentBoard.inactivateAll();
    opponent.inactivateAll();
  })
  socket.on('defausseattackok', function(message) {
    console.log('Received defausseattackok : ' + message.player + ' game : ' + message.game + ' message : ' + message.validated);
    var srvDefausse = message.defausse;
    var cltDefausse = [];
    createArrayCarte(srvDefausse, cltDefausse);
    defausseAttack.fillCard(cltDefausse);
  })
  socket.on('defaussedefenseok', function(message) {
    console.log('Received defaussedefenseok : ' + message.player + ' game : ' + message.game + ' message : ' + message.validated);
    var srvDefausse = message.defausse;
    var cltDefausse = [];
    createArrayCarte(srvDefausse, cltDefausse);
    defausseDefense.fillCard(cltDefausse);
  })
  socket.on('endgameok', function(message) {
    var infoTxt = '';
    console.log('Received endgameok : ' + message.player + ' game : ' + message.game + ' message : ' + message.validated);
    // win the game?
    if (message.win) {
      // display info of end of game
      displayInfo(8);
      infoDiv.setButton();
      infoDiv.visible(true);
    }
    else {
      // display info of end of game
      displayInfo(9);
      infoDiv.setButton();
      infoDiv.visible(true);
    }
    // game is finish
    startTime = false;
    gameCommandsDiv.visible(false);
    timeCommandDiv.visible(false);
    // hide all
    showGameBoards(false);
  })
  //END GAME
  socket.on('time', function (data) {
    console.log('- broadcast: ' + data);
  })
  socket.on("error", function(error) {
    if (error.type == "UnauthorizedError" || error.code == "invalid_token") {
      // redirect user to login page perhaps?
      console.log("User's token has expired");
    }
  })
}
function createArrayCarte(srvCarteArray, cltCarteArray) {
  for (var i = 0; i < srvCarteArray.length; i++) {
    var srvCard = srvCarteArray[i];
    if (srvCard.effet != undefined) {
      var cltCardEffect = new Effet(srvCard.effet.id, srvCard.effet.zone, srvCard.effet.impact, 
      srvCard.effet.declencheur, srvCard.effet.modifAttack, srvCard.effet.modifDefense, 
      srvCard.effet.modifVie, srvCard.effet.description);
    }
    else {
      var cltCardEffect = new Effet();
    }
    if (srvCard.etat != undefined) { // provoke, charge, silent, fury, divine, stun, replace, hide
      var cltCardEtat = new Etat(srvCard.etat.provoke, srvCard.etat.charge, srvCard.etat.silent, 
      srvCard.etat.fury, srvCard.etat.divine, srvCard.etat.stun, srvCard.etat.replace, srvCard.etat.hide, 
      srvCard.etat.maxfury);
    }
    else {
      var cltCardEtat = new Etat();
    }
    if (srvCard.equipement != undefined) {
      var cltCardEquipment = new Equipement(srvCard.equipement.id, srvCard.equipement.type, srvCard.equipement.impact, 
      srvCard.equipement.durability, srvCard.equipement.modifAttack, srvCard.equipement.modifDefense, 
      srvCard.equipement.description);
    }
    else {
      var cltCardEquipment = new Equipement();
    }
    // create the card
    var cltCard = new Carte(srvCard.id, srvCard.typeimg, srvCard.type, srvCard.imgid, srvCard.visible,
    srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.vie, srvCard.titre, srvCard.description, srvCard.active, 
    srvCard.selected, srvCard.special, cltCardEffect, cltCardEtat, cltCardEquipment);
    // set the description
    cltCard.setDescription();
    // add it
    cltCarteArray.push(cltCard);
  }
}
console.log('Finish gomassClt.js');
