console.log('Start gomasBoard.js');
var allGameCartes = [];
var opponentHand = new Board('opponentHand', 0, 0);
opponentHand.create(8, 1);
document.body.appendChild(opponentHand);
opponentHand.onclick = function() { 
  console.log("Can't select carte!");
}
var opponentBoard = new Board('opponentBoard', 0, 170);
opponentBoard.create(8, 1);
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

var playerBoard = new Board('playerBoard', 0, 320);
playerBoard.create(8, 1);
document.body.appendChild(playerBoard);
playerBoard.onclick = function() {
  var onHand = cardOnHand();
  if (!selectedCarte.visible && myTurn) {
    switch (onHand) {
      case 1: // player do invocation on board
        this.add(selectedCaseId, player.selectedCarte.clone());
        console.log('Player invocation : ' + this.get(selectedCaseId));
        // reset
        player.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 2: // playerHand drop a carte on the board
        this.add(selectedCaseId, playerHand.selectedCarte);
        playerHand.remove(playerHand.selectedCaseId);
        console.log('Put a carte on board : ' + this.get(selectedCaseId));
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

var playerHand = new Board('playerHand', 0, 490);
playerHand.create(8, 1);
document.body.appendChild(playerHand);
playerHand.onclick = function() {
  if (selectedCarte.visible && myTurn) {
    var onHand = cardOnHand();
    switch (onHand) {
    case 0: // select a carte from hand
      this.selectedCarte = selectedCarte.clone();
      this.selectedCaseId = selectedCaseId;
      
      selectedCarte.init();
      selectedCaseId = -1;
      console.log('Select a Carte in Hand : ' + this.selectedCarte);
      break;
    default:
      if (selectedCarte.equal(this.selectedCarte)) {
        this.initSelectedCarte();
        console.log('Unselected carte in Hand : ' + selectedCarte);
      }
    }
  }
  else {
    console.log("Can't select carte!");
  }
}

var opponent = new Board('opponent', 850, 140);
opponent.create(1, 1);
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

var player = new Board('player', 850, 320);
player.create(1, 1);
document.body.appendChild(player);
player.onclick = function() {
  if (selectedCarte.visible && myTurn) {
    var onHand = cardOnHand();
    switch (onHand) {
    case 0: // select a carte from player
      this.selectedCarte = selectedCarte.clone();
      console.log('Selected player : ' + selectedCarte);
      break;
    default:
      console.log("Can't select carte!");
    }
  }
  selectedCarte.init();
  selectedCaseId = -1;
}

var allCarte = new Board('player', 0, 0);
allCarte.create(6, 8);
document.body.appendChild(allCarte);
allCarte.onclick = function() {
  if (selectedCarte.visible) {
    var myMini = new MiniCarte(selectedCarte.id, selectedCarte.imgid, selectedCarte.cout, selectedCarte.titre, selectedCarte.visible);
    playerDeck.add(myMini);
    console.log("Select carte : " + selectedCarte);
  }
  selectedCarte.init();
  selectedCaseId = -1;
}

var playerDeck = new MiniBoard('playerDeck', 650, 50);
playerDeck.create(1, 30);
document.body.appendChild(playerDeck);
playerDeck.onclick = function() {
  if (selectedCarte.visible) {
    console.log("Select carte : " + selectedCarte);
  }
  selectedCarte.init();
  selectedCaseId = -1;
}

// return 0 if no card on hand
function cardOnHand() {
  if (player.selectedCarte.visible) return 1;
  else if (playerHand.selectedCarte.visible) return 2;
  else if (playerBoard.selectedCarte.visible) return 3;
  else return 0;
}
function initAllBoards() {
  opponentHand.initCartes();
  opponentBoard.initCartes();
  playerBoard.initCartes();
  playerHand.initCartes();
}
function showDeckBuilder(on) {
  appendAllCarte();
  allCarte.setVisibility(on);
  playerDeck.setVisibility(on);
}
function showAllBoards(on) {
  var p1 = new Carte(0, 1, "", "", "30", playerName, "", true, false);
  var p2 = new Carte(0, 2, "", "", "30", opponentName, "", true, false);
  var c1 = new Carte(1, 1, "1", "1", "1", "soldat", "soldat", true, false);
  var c2 = new Carte(2, 2, "2", "2", "2", "sergent", "sergent", true, false);
  var c4 = new Carte(4, 4, "4", "4", "4", "lieutenant", "lieutenant", true, false);
  playerHand.add(0, c1);
  playerHand.add(1, c2);
  playerBoard.add(3, c4);
  playerHand.add(2, c1);
  playerBoard.add(4, c2);
  opponentBoard.add(3, c1);
  opponentBoard.add(5, c4);
  opponentHand.setVisibility(on);
  opponentBoard.setVisibility(on);
  playerBoard.setVisibility(on);
  playerHand.setVisibility(on);
  opponent.setVisibility(on);
  player.setVisibility(on);
  if (on) {
    player.add(0, p1);
    opponent.add(0, p2);
  }
  else {
    player.remove(0);
    opponent.remove(0);
  }
}
function appendAllCarte() {
  var id = 0;
  for (var x = 0; x < allCarte.nbCasesx; x++) {
    for (var y = 0; y < allCarte.nbCasesy; y++) {
      switch (y) {
        case 0:
        var c1 = new Carte(id, 1, "1", "1", "1", "soldat", "soldat"+x, true, false);
        allCarte.add(id, c1);
        break;
        case 1:
        var c2 = new Carte(id, 2, "2", "2", "2", "sergent", "sergent"+x, true, false);
        allCarte.add(id, c2);
        break;
        case 2:
        var c3 = new Carte(id, 3, "3", "3", "3", "adjudant", "adjudant"+x, true, false);
        allCarte.add(id, c3);
        break;
        case 3:
        var c4 = new Carte(id, 4, "4", "4", "4", "lieutenant", "lieutenant"+x, true, false);
        allCarte.add(id, c4);
        break;
        case 4:
        var c5 = new Carte(id, 5, "5", "5", "5", "capitaine", "capitaine"+x, true, false);
        allCarte.add(id, c5);
        break;
        case 5:
        var c6 = new Carte(id, 6, "6", "6", "6", "commandant", "commandant"+x, true, false);
        allCarte.add(id, c6);
        break;
        case 6:
        var c7 = new Carte(id, 7, "7", "7", "7", "colonel", "colonel"+x, true, false);
        allCarte.add(id, c7);
        break;
        case 7:
        var c8 = new Carte(id, 8, "8", "8", "8", "général", "général"+x, true, false);
        allCarte.add(id, c8);
        break;
      }
      id++;
    }
  }
/*
  var cm1 = new MiniCarte(0, 1, 1, 'soldat', true);
  playerDeck.add(0, cm1);
  var cm2 = new MiniCarte(0, 2, 2, 'sergent', true);
  playerDeck.add(1, cm2);
  */
}
console.log('Finish gomassBoard.js');
/*
mainBoard.add(4, "images/carte3.png", "10", "10", "10", "soldat", "012345678901234"); // add a carte number 3 to plateau and display it
mainBoard.add(7, "images/carte4.jpg", "10", "10", "10", "sergent", "012345678901234"); // add a carte number 3 to plateau and display it
mainBoard.add(9, "images/carte5.jpg", "10", "10", "10", "lieutenant", "012345678901234"); // add a carte number 3 to plateau and display it
mainBoard.add(12, "images/carte6.jpg", "10", "10", "10", "capitaine", "012345678901234"); // add a carte number 3 to plateau and display it
mainBoard.add(14, "images/carte7.jpg", "10", "10", "10", "colonel", "012345678901234"); // add a carte number 3 to plateau and display it
mainBoard.add(16, "images/carte8.jpg", "10", "10", "10", "général", "012345678901234"); // add a carte number 3 to plateau and display it
pile.add(0, "images/carte1.jpg", "", "", "30", "player1", "");
pile.add(1, "images/carte2.jpg", "", "", "30", "player2", "");

// insert some demo cards
playerHand.add(0, new Carte(0, "images/carte6.jpg", "10", "10", "10", "capitaine", "012345678901234", true, false));
playerHand.add(1, new Carte(1, "images/carte7.jpg", "10", "10", "10", "colonel", "012345678901234", true, false));
playerHand.add(2, new Carte(2, "images/carte8.jpg", "10", "10", "10", "général", "012345678901234", true, false));
playerBoard.add(3, new Carte(3, "images/carte3.png", "10", "10", "10", "soldat", "012345678901234", true, true));
playerBoard.add(4, new Carte(4, "images/carte4.jpg", "10", "10", "10", "sergent", "012345678901234", true, true));
playerBoard.add(5, new Carte(5, "images/carte5.jpg", "10", "10", "10", "lieutenant", "012345678901234", true, false));
opponentBoard.add(4, new Carte(4, "images/carte2.jpg", "10", "10", "10", "lieutenant", "012345678901234", true, false));

*/
