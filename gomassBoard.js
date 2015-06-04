
var opponentBoard = new Board('playerBoard', 0, 100);
opponentBoard.create(8, 1);
opponentBoard.add(4, new Carte(4, "images/carte3.png", "10", "10", "10", "soldat", "012345678901234", true, false));
opponentBoard.selectedCarte = new Carte();
opponentBoard.selectedCarte.init();
opponentBoard.selectedCaseId = -1;
opponentBoard.onclick = function() {
  if (selectedCarte.visible && myTurn) {
    var onHand = cardOnHand();
    switch (onHand) {
      case 1: // received attack from player
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId
        console.log('Player attack Opponent: ' + selectedCarte);
        // revolve attack here
        
        // reset
        player.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 2: // received attack from player hand
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId
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
        this.selectedCaseId = selectedCaseId
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

var playerBoard = new Board('playerBoard', 0, 250);
playerBoard.create(8, 1);
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
    this.selectedCaseId = selectedCaseId
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

var playerHand = new Board('playerHandBoard', 0, 420);
playerHand.create(8, 1);
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

var opponent = new Board('opponentBoard', 850, 140);
opponent.create(1, 1);
opponent.onclick = function() {
  if (selectedCarte.visible && myTurn) {
    var onHand = cardOnHand();
    switch (onHand) {
    case 1: // Player attack direct
      console.log('Player attack direct : ' + selectedCarte);
      this.selectedCarte = selectedCarte.clone();
      this.selectedCaseId = selectedCaseId
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
      this.selectedCaseId = selectedCaseId
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
// return 0 if no card on hand
function cardOnHand() {
  if (player.selectedCarte.visible) return 1;
  else if (playerHand.selectedCarte.visible) return 2;
  else if (playerBoard.selectedCarte.visible) return 3;
  else return 0;
}
// insert some demo cards
playerHand.add(0, new Carte(0, "images/carte6.jpg", "10", "10", "10", "capitaine", "012345678901234", true, false));
playerHand.add(1, new Carte(1, "images/carte7.jpg", "10", "10", "10", "colonel", "012345678901234", true, false));
playerHand.add(2, new Carte(2, "images/carte8.jpg", "10", "10", "10", "général", "012345678901234", true, false));
playerBoard.add(3, new Carte(3, "images/carte3.png", "10", "10", "10", "soldat", "012345678901234", true, true));
playerBoard.add(4, new Carte(4, "images/carte4.jpg", "10", "10", "10", "sergent", "012345678901234", true, true));
playerBoard.add(5, new Carte(5, "images/carte5.jpg", "10", "10", "10", "lieutenant", "012345678901234", true, false));
/*
mainBoard.add(4, "images/carte3.png", "10", "10", "10", "soldat", "012345678901234"); // add a carte number 3 to plateau and display it
mainBoard.add(7, "images/carte4.jpg", "10", "10", "10", "sergent", "012345678901234"); // add a carte number 3 to plateau and display it
mainBoard.add(9, "images/carte5.jpg", "10", "10", "10", "lieutenant", "012345678901234"); // add a carte number 3 to plateau and display it
mainBoard.add(12, "images/carte6.jpg", "10", "10", "10", "capitaine", "012345678901234"); // add a carte number 3 to plateau and display it
mainBoard.add(14, "images/carte7.jpg", "10", "10", "10", "colonel", "012345678901234"); // add a carte number 3 to plateau and display it
mainBoard.add(16, "images/carte8.jpg", "10", "10", "10", "général", "012345678901234"); // add a carte number 3 to plateau and display it
pile.add(0, "images/carte1.jpg", "", "", "30", "player1", "");
pile.add(1, "images/carte2.jpg", "", "", "30", "player2", "");
*/
