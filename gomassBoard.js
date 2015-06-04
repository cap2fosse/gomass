
var opponentBoard = new Board('playerBoard', 0, 100);
opponentBoard.create(8, 1);
opponentBoard.add(4, new Carte(4, "images/carte3.png", "10", "10", "10", "soldat", "012345678901234", true, false));
opponentBoard.selectedCarte = new Carte();
opponentBoard.selectedCarte.init();
opponentBoard.selectedCaseId = -1;
opponentBoard.onclick = function() {
  // received attack from player board
  if (selectedCarte.visible && playerBoard.selectedCarte.visible) {
    this.selectedCarte = selectedCarte.clone();
    this.selectedCaseId = selectedCaseId
    console.log(playerBoard.selectedCarte + '\n' + 'Attack ' + this.selectedCarte + '\n' + 
        'From case : ' + playerBoard.selectedCaseId + '\n' + 'To case : ' + this.selectedCaseId);
    // resolve attack here
    
    // end of attack
    // reset
    playerBoard.initSelectedCarte();
    selectedCarte.init();
    selectedCaseId = -1;
  }
  // received attack from player
  else if (selectedCarte.visible && player.selectedCarte.visible) {
    this.selectedCarte = selectedCarte.clone();
    this.selectedCaseId = selectedCaseId
    console.log('Player attack Opponent: ' + selectedCarte);
    // revolve attack here
    
    // reset
    player.initSelectedCarte();
    selectedCarte.init();
    selectedCaseId = -1;
  }
}

var playerBoard = new Board('playerBoard', 0, 250);
playerBoard.create(8, 1);
playerBoard.onclick = function() {
  // first attack movement on board
  if (selectedCarte.visible && myTurn && !this.selectedCarte.visible) {
    this.selectedCarte = selectedCarte.clone();
    this.selectedCaseId = selectedCaseId
    console.log('Selected carte : ' + selectedCarte + ' at case id : ' + selectedCaseId);
    // reset
    selectedCarte.init();
    selectedCaseId = -1;
  }
  // playerHand drop a carte on the board
  else if (!selectedCarte.visible && playerHand.selectedCarte.visible && !this.selectedCarte.visible) {
    this.add(selectedCaseId, playerHand.selectedCarte);
    console.log('Put a carte on board : ' + this.get(selectedCaseId));
    // reset
    playerHand.initSelectedCarte();
    selectedCarte.init();
    selectedCaseId = -1;
  }
  // player do invocation on board
  else if (!selectedCarte.visible && player.selectedCarte.visible && !this.selectedCarte.visible) {
    this.add(selectedCaseId, player.selectedCarte.clone());
    console.log('Player invocation : ' + this.get(selectedCaseId));
    // reset
    player.initSelectedCarte();
    selectedCarte.init();
    selectedCaseId = -1;
  }
  // player stop attack
  else if (selectedCarte.equal(this.selectedCarte)) {
    this.selectedCarte.init();
    console.log('Player stop attack : ' + selectedCarte);
  }
}

var playerHand = new Board('playerHandBoard', 0, 420);
playerHand.create(8, 1);
playerHand.onclick = function() {
  if (selectedCarte.visible) {
    this.selectedCarte = selectedCarte.clone();
    this.selectedCaseId = selectedCaseId;
    playerHand.remove(selectedCaseId);
    selectedCarte.init();
    selectedCaseId = -1;
    console.log('Select a Carte in hand : ' + this.selectedCarte);
  }
}

var opponent = new Board('opponentBoard', 850, 140);
opponent.create(1, 1);
opponent.onclick = function() {
  if (selectedCarte.visible && player.selectedCarte.visible) {
      console.log('Player attack directe : ' + selectedCarte);
  }
  player.initSelectedCarte();
  selectedCarte.init();
  selectedCaseId = -1;
}

var player = new Board('playerBoard', 850, 320);
player.create(1, 1);
player.onclick = function() {
  if (selectedCarte.visible) {
    this.selectedCarte = selectedCarte.clone();
    console.log('Selected Carte in playerBoard : ' + selectedCarte);
  }
  selectedCarte.init();
  selectedCaseId = -1;
}
// insert some demo cards
playerHand.add(0, new Carte(0, "images/carte6.jpg", "10", "10", "10", "capitaine", "012345678901234", true, false));
playerHand.add(1, new Carte(1, "images/carte7.jpg", "10", "10", "10", "colonel", "012345678901234", true, false));
playerHand.add(2, new Carte(2, "images/carte8.jpg", "10", "10", "10", "général", "012345678901234", true, false));
playerBoard.add(3, new Carte(3, "images/carte3.png", "10", "10", "10", "soldat", "012345678901234", true, true));
playerBoard.add(4, new Carte(4, "images/carte4.jpg", "10", "10", "10", "sergent", "012345678901234", true, true));
playerBoard.add(5, new Carte(5, "images/carte5.jpg", "10", "10", "10", "lieutenant", "012345678901234", true, false));
