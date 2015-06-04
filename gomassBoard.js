console.log('Start gomasBoard.js');
var opponentHand = new Board('opponentHand', 0, 0, 100, 150);
opponentHand.create(8, 1, 0);
document.body.appendChild(opponentHand);
opponentHand.onclick = function() { 
  console.log("Can't select carte!");
}
var opponentBoard = new Board('opponentBoard', 0, 170, 100, 150);
opponentBoard.create(8, 1, 0);
document.body.appendChild(opponentBoard);
opponentBoard.onclick = function() {
  if (selectedCarte.visible && myTurn) {
    var onHand = cardOnHand();
    switch (onHand) {
      case 1: // received attack from player
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        console.log('Player attack Opponent: ' + selectedCarte);
        // revolve attack here
        
        // reset
        player.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 2: // received attack from player hand
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        console.log('Player Hand attack Opponent: ' + selectedCarte);
        playerHand.remove(playerHand.selectedCaseId);
        // revolve attack here
        
        // reset
        playerHand.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 3: // received attack from player board
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        console.log('Player Board attack Opponent: ' + playerBoard.selectedCarte + '\n' + 'Attack ' + this.selectedCarte + '\n' + 
            'From case : ' + playerBoard.selectedCaseId + '\n' + 'To case : ' + this.selectedCaseId);
        // resolve attack here
        
        // end of attack
        // reset
        playerBoard.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      default:
        console.log("Can't select carte!");
    }
  }
}

var playerBoard = new Board('playerBoard', 0, 320, 100, 150);
playerBoard.create(8, 1, 0);
document.body.appendChild(playerBoard);
playerBoard.onclick = function() {
  var onHand = cardOnHand();
  if (!selectedCarte.visible && myTurn) {
    var dstboard = this.id;
    var caseId = selectedCaseId;
    switch (onHand) {
      case 1: // player do invocation on board
        if (player.get(0).description == 'invocus') {
          // add new invocation
          this.add(selectedCaseId, invocusCard.clone());
          console.log('Player invocation : ' + this.get(selectedCaseId));
          var carteId = player.selectedCarte.id;
          var srcboard = 'player';
          // emit message
          socket.emit('newcarte', {
            player: playerName,
            srcboard: srcboard,
            dstboard: dstboard,
            caseId: caseId,
            carte: invocusCard,
            game: gameName
          });
        }
        // remove mana
        manaBoard.remove(invocusCard.cout);
        // reset
        player.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 2: // playerHand drop a carte on the board
        this.add(selectedCaseId, playerHand.selectedCarte);
        playerHand.remove(playerHand.selectedCaseId);
        manaBoard.remove(playerHand.selectedCarte.cout);
        console.log('Put a carte on board : ' + this.get(selectedCaseId));
        var carteId = playerHand.selectedCarte.id;
        var srcboard = 'playerHand';
        // emit message
        socket.emit('addcarte', {
          player: playerName,
          srcboard: srcboard,
          dstboard: dstboard,
          caseId: caseId,
          carteId: carteId,
          game: gameName
        });
        // reset
        playerHand.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      default:
        console.log("Can't select carte!");
    }
  }
   // select a carte on board
  else if (selectedCarte.visible && myTurn && onHand == 0) {
    this.selectedCarte = selectedCarte.clone();
    this.selectedCaseId = selectedCaseId;
    console.log('Selected carte : ' + selectedCarte + ' at case id : ' + selectedCaseId);
    // reset
    selectedCarte.init();
    selectedCaseId = -1;
  }
  // unselect a carte on board
  else if (selectedCarte.visible && selectedCarte.equal(this.selectedCarte)) {
    this.initSelectedCarte();
    console.log('Unselected carte : ' + selectedCarte);
  }
  else {
    console.log("Can't select carte!");
  }
}

var playerHand = new Board('playerHand', 0, 490, 100, 150);
playerHand.create(8, 1, 0);
document.body.appendChild(playerHand);
playerHand.onclick = function() {
  if (selectedCarte.visible && myTurn) {
    var onHand = cardOnHand();
    switch (onHand) {
      case 0: // select a carte from hand
      // there is enough mana?
      if (manaBoard.getMana() >= selectedCarte.cout) {
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        console.log('Select a Carte in Hand : ' + this.selectedCarte);
      }
      break;
      default:
      if (selectedCarte.equal(this.selectedCarte)) {
        this.initSelectedCarte();
        console.log('Unselected carte in Hand : ' + selectedCarte);
      }
    }
  }
  else console.log("Can't select carte!");
  selectedCarte.init();
  selectedCaseId = -1;
}
var opponent = new Board('opponent', 850, 140, 100, 150);
opponent.create(1, 1, 0);
document.body.appendChild(opponent);
opponent.onclick = function() {
  if (selectedCarte.visible && myTurn) {
    var onHand = cardOnHand();
    switch (onHand) {
    case 1: // Player attack direct
      console.log('Player attack direct : ' + selectedCarte);
      this.selectedCarte = selectedCarte.clone();
      this.selectedCaseId = selectedCaseId;
      // resolve attack here
      console.log(player.selectedCarte + '\n' + 'Attack ' + this.selectedCarte + '\n' + 
          'From case : ' + player.selectedCaseId + '\n' + 'To case : ' + this.selectedCaseId);
      // reset
      player.initSelectedCarte();
      selectedCarte.init();
      selectedCaseId = -1;
      break;
    case 2: // Hand attack direct
      console.log('Hand attack direct : ' + selectedCarte);
      this.selectedCarte = selectedCarte.clone();
      this.selectedCaseId = selectedCaseId;
      playerHand.remove(playerHand.selectedCaseId);
      // resolve attack here
      console.log(playerHand.selectedCarte + '\n' + 'Attack ' + this.selectedCarte + '\n' + 
          'From case : ' + playerHand.selectedCaseId + '\n' + 'To case : ' + this.selectedCaseId);
      // reset
      playerHand.initSelectedCarte();
      selectedCarte.init();
      selectedCaseId = -1;
      break;
    case 3: // Board attack direct
      console.log('Board attack direct : ' + selectedCarte);
      this.selectedCarte = selectedCarte.clone();
      this.selectedCaseId = selectedCaseId;
      // resolve attack here
      console.log(playerBoard.selectedCarte + '\n' + 'Attack ' + this.selectedCarte + '\n' + 
          'From case : ' + playerBoard.selectedCaseId + '\n' + 'To case : ' + this.selectedCaseId);
      // reset
      playerBoard.initSelectedCarte();
      selectedCarte.init();
      selectedCaseId = -1;
      break;
    default:
      console.log("Can't select carte!");
    }
  }
}

var player = new Board('player', 850, 320, 100, 150);
player.create(1, 1, 0);
document.body.appendChild(player);
player.onclick = function() {
  if (selectedCarte.visible && myTurn) {
    var onHand = cardOnHand();
    switch (onHand) {
      case 0: // select a carte from player
      if (manaBoard.getMana() >= selectedCarte.cout) {
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        console.log('Selected player : ' + selectedCarte);
      }
      break;
      default:
      console.log("Can't select carte!");
    }
  }
  selectedCarte.init();
  selectedCaseId = -1;
}

var allCarte = new Board('allCarte', 0, 0, 100, 150);
allCarte.create(6, 14, 0);
document.body.appendChild(allCarte);
allCarte.onclick = function() {
  if (selectedCarte.visible) {
    var myMini = new Carte(selectedCarte.id, selectedCarte.imgid, selectedCarte.cout, selectedCarte.attaque, selectedCarte.defense, selectedCarte.titre, selectedCarte.description, selectedCarte.visible, selectedCarte.active, 1);
    playerDeck.addLast(myMini);
    console.log("Select carte : " + selectedCarte);
  }
  selectedCarte.init();
  selectedCaseId = -1;
}
// fill the cartes array from server
allCarte.fill = function(){
  var srvCard;
  var card;
  for (var id = 0; id < allGameCartes.length; id++) {
    srvCard = allGameCartes[id];
    card = new Carte(srvCard.id, srvCard.imgid, srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.titre, srvCard.description, srvCard.visible, srvCard.active, srvCard.type);
    this.add(id, card);
  }
}

var playerDeck = new Board('playerDeck', 650, 50, 100, 20);
playerDeck.create(1, maxDeckCarte, 1);
document.body.appendChild(playerDeck);
playerDeck.onclick = function() {
  if (selectedCarte.visible) {
    this.remove(selectedCaseId);
    console.log("Select carte : " + selectedCarte);
  }
  selectedCarte.init();
  selectedCaseId = -1;
}
// fill the deck randomly
playerDeck.fill = function() {
  var fid = 0;
  var idxCard;
  var srvCard;
  var miniCard;
  while (fid < this.cases.length) {
    if (!this.cases[fid].carte.visible) {
      // get a random carte from allCarte
      idxCard = Math.floor((Math.random() * maxCartes));
      srvCard = allGameCartes[idxCard];
      miniCard = new Carte(srvCard.id, srvCard.imgid, srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.titre, srvCard.description, srvCard.visible, srvCard.active, 1);
      this.addLast(miniCard);
    }
    fid++;
  }
}

var playerSelector = new Board('playerSelector', 200, 20, 100, 150);
playerSelector.create(3, 1, 0);
document.body.appendChild(playerSelector);
playerSelector.onclick = function() {
  if (selectedCarte.visible) {
    socket.emit('avatar', {
      player: playerName,
      id: selectedCarte.imgid
    });
    console.log("Select avatar : " + selectedCarte);
  }
  selectedCarte.init();
  selectedCaseId = -1;
}
playerSelector.fill = function(){
  var srvCard;
  var card;
  for (var id = 0; id < allAvatarsCartes.length; id++) {
    srvCard = allAvatarsCartes[id];
    card = new Carte(srvCard.id, srvCard.imgid, srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.titre, srvCard.description, srvCard.visible, srvCard.active, srvCard.type);
    this.add(id, card);
  }
  this.setVisibility(true);
}

var manaBoard = new ManageMana(960, 460, 10, 1);
manaBoard.create();
document.body.appendChild(manaBoard);

//////////////////////////////Usefull fonctions////////////////////////////
// return 0 if no card on hand
function cardOnHand() {
  if (player.selectedCarte.visible) return 1;
  else if (playerHand.selectedCarte.visible) return 2;
  else if (playerBoard.selectedCarte.visible) return 3;
  else return 0;
}
function showDeckBuilder(on) {
  allCarte.setVisibility(on);
  playerDeck.setVisibility(on);
  finishDeckB.hide(!on);
  deckB.hide(on);
  if (on) {
    allCarte.fill();
  }
}
function resetDeckBuilder() {
  allCarte.initCartes();
  playerDeck.initCartes();
}
function showGameBoards(on) {
  opponentHand.setVisibility(on);
  opponentBoard.setVisibility(on);
  playerBoard.setVisibility(on);
  playerHand.setVisibility(on);
  opponent.setVisibility(on);
  player.setVisibility(on);
  manaBoard.visible(on);
}
function resetAllBoards() {
  opponentHand.initCartes();
  opponentBoard.initCartes();
  playerBoard.initCartes();
  playerHand.initCartes();
  manaBoard.reset();
  opponent.initCartes();
  player.initCartes();
  playerSelector.initCartes();
  resetDeckBuilder();
}
console.log('Finish gomassBoard.js');