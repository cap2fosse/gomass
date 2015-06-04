'use strict';
console.log('Start gomasBoard.js');
var opponentHand = new Board('opponentHand', 0, 0, 100, 150);
opponentHand.create(6, 1, 0);
opponentHand.type = 'Opponent';
document.body.appendChild(opponentHand);
opponentHand.onclick = function() { 
  console.log("Can't select carte!");
  cleanHand();
}
opponentHand.fill = function(cardList){
  var card;
  for (var id = 0; id < cardList.length; id++) {
    card = cardList[id];
    this.addClone(id, card);
  }
  //this.setVisibility(true);
}
var opponentBoard = new Board('opponentBoard', 0, 170, 100, 150);
opponentBoard.create(6, 1, 0);
opponentBoard.type = 'Opponent';
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
        if (player.get(0).titre == allAvatarsCartes[1].titre) { // if its spellus
          var attackerBoard  = player.id;
          var defenderBoard = this.id;
          var attackerCaseId = player.selectedCaseId;
          var defenderCaseId = selectedCaseId;
          if (!selectedCarte.etat.hide) { // no spell on hidden card
            applySpellEffect(player.id, player.selectedCaseId, defenderBoard, defenderCaseId);
            manaBoard.remove(player.get(0).cout); // remove mana
          }
        }
        // reset
        player.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 2: // received attack from player hand
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        console.log('Player Hand attack Opponent: ' + selectedCarte);
        // revolve attack here
        if (playerHand.selectedCarte.type == 'Spell') { // if its spell
          if (!selectedCarte.etat.hide) { // no spell on hidden card
            applySpellEffect(playerHand.id, playerHand.selectedCaseId, this.id, selectedCaseId);
            manaBoard.remove(playerHand.selectedCarte.cout); // remove mana
          }
        }
        // reset
        playerHand.remove(playerHand.selectedCaseId);
        playerHand.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 3: // received attack from player board
        var attackerBoard  = playerBoard.id;
        var defenderBoard = this.id;
        var attackerCaseId = playerBoard.selectedCaseId;
        var defenderCaseId = selectedCaseId;
        console.log('Player Board attack Opponent: ' + playerBoard.selectedCarte + '\n' + 'Attack ' + selectedCarte + '\n' + 
            'From case : ' + playerBoard.selectedCaseId + '\n' + 'To case : ' + selectedCaseId);
        // resolve attack here
        if (playerBoard.selectedCarte.visible && playerBoard.selectedCarte.active) {
          // no provocate on board ?
          if (!this.provocate()) {
            resolveAttackDefense(attackerBoard, attackerCaseId , defenderBoard, defenderCaseId);
          }
          else if (selectedCarte.etat.provoke) { // attack provoke
            resolveAttackDefense(attackerBoard, attackerCaseId , defenderBoard, defenderCaseId);
          }
        }
        // end of attack
        // reset
        playerBoard.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      default:
        console.log("Can't select carte!");
    }
    cleanHand();
  }
}
opponentBoard.provocate = function() {
  var idx = 0;
  while (idx < this.cases.length) {
    var card = this.get(idx);
    if (card.etat.provoke) {
      return true;
    }
    idx++;
  }
  return false;
}

var playerBoard = new Board('playerBoard', 0, 320, 100, 150);
playerBoard.create(6, 1, 0);
playerBoard.type = 'Allie';
document.body.appendChild(playerBoard);
// pass active all visible cartes in playerBoard
playerBoard.onclick = function() {
  var onHand = cardOnHand();
  if (!selectedCarte.visible && myTurn) {
    var dstboard = this.id;
    var caseId = selectedCaseId;
    switch (onHand) {
      case 1: // player do invocation on board
        // if its invocus
        if (player.get(0).titre == allAvatarsCartes[0].titre) {
          // add new invocation
          var invocusCard = player.get(0).clone();
          invocusCard.vie = 1; invocusCard.attaque = 1; invocusCard.defense = 0;
          this.add(selectedCaseId, invocusCard);
          console.log('Player invocation : ' + this.get(selectedCaseId));
          var srcboard = player.id;
          // emit message
          socket.emit('newcarte', {
            player: playerName,
            srcboard: srcboard,
            dstboard: dstboard,
            caseId: selectedCaseId,
            carte: invocusCard,
            game: gameName
          });
          // remove mana
          manaBoard.remove(invocusCard.cout);
        }
        // reset
        player.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 2: // playerHand drop a carte on the board (Invocation or Spell)
        var hand = playerHand.selectedCarte;
        if (hand.type == 'Invocation') {
          // if charge change to active
          if (hand.etat.charge) {
            hand.active = true;
            hand.etat.charge = false;
          }
          // clone it and put it on board
          this.addClone(selectedCaseId, hand);
          // remove
          playerHand.remove(playerHand.selectedCaseId);
          manaBoard.remove(hand.cout);
          console.log('Put a carte on board : ' + this.get(selectedCaseId));
          // prepare msg
          var thecarte = hand.clone();
          var srcboard = playerHand.id;
          // emit message
          socket.emit('addcarte', {
            player: playerName,
            srcboard: srcboard,
            dstboard: dstboard,
            caseid: selectedCaseId,
            carte: thecarte,
            game: gameName
          });
        }
        // reset
        playerHand.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      default:
        console.log("Can't select carte!");
        selectedCarte.init();
        selectedCaseId = -1;
    }
  }
  else if (selectedCarte.visible && myTurn) {
    // if its heallus
    if (onHand == 1) {
      if (player.get(0).titre == allAvatarsCartes[2].titre) {
        applySpellEffect(player.id, player.selectedCaseId, this.id, selectedCaseId);
        manaBoard.remove(player.get(0).cout); // remove mana
        // reset
        player.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
      }
    }
    // if its spell
    if (onHand == 2 && playerHand.selectedCarte.type == 'Spell') {
      applySpellEffect(playerHand.id, playerHand.selectedCaseId, this.id, selectedCaseId);
      manaBoard.remove(playerHand.selectedCarte.cout); // remove mana
      playerHand.remove(playerHand.selectedCaseId);
      // reset
      playerHand.initSelectedCarte();
      selectedCarte.init();
      selectedCaseId = -1;
    }
     // select a carte on board
    if (onHand == 0 && selectedCarte.active) {
      this.selectedCarte = selectedCarte.clone();
      this.selectedCaseId = selectedCaseId;
      console.log('Selected carte : ' + selectedCarte + ' at case id : ' + selectedCaseId);
      // reset
      selectedCarte.init();
      selectedCaseId = -1;
    }
    // unselect a carte on board
    if (selectedCarte.equal(this.selectedCarte)) {
      this.initSelectedCarte();
      console.log('Unselected carte : ' + selectedCarte);
      // reset
      selectedCarte.init();
      selectedCaseId = -1;
    }
  }
  else {
    console.log("Can't select carte!");
    // reset
    selectedCarte.init();
    selectedCaseId = -1;
  }
  cleanHand(playerBoard.id);
}

var playerHand = new Board('playerHand', 0, 490, 100, 150);
playerHand.create(6, 1, 0);
playerHand.type = 'Allie';
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
  else {console.log("Can't select carte!");}
  cleanHand(playerHand.id);
  selectedCarte.init();
  selectedCaseId = -1;
}
playerHand.fill = function(cardList){
  var card;
  for (var id = 0; id < cardList.length; id++) {
    card = cardList[id];
    this.addLast(card);
  }
  //this.setVisibility(true);
}
var opponent = new Board('opponent', 650, 140, 100, 150);
opponent.create(1, 1, 0);
opponent.type = 'Opponent';
document.body.appendChild(opponent);
opponent.onclick = function() {
  if (selectedCarte.visible && myTurn) {
    var onHand = cardOnHand();
    switch (onHand) {
    case 1: // Player attack direct
      console.log('Player attack direct : ' + selectedCarte);
      this.selectedCarte = selectedCarte.clone();
      this.selectedCaseId = selectedCaseId;
      console.log(player.selectedCarte + '\n' + 'Attack ' + this.selectedCarte + '\n' + 
          'From case : ' + player.selectedCaseId + '\n' + 'To case : ' + this.selectedCaseId);
      // resolve attack here
      if (player.selectedCarte.titre == allAvatarsCartes[1].titre) { // if its spellus
        var attackerBoard  = player.id;
        var defenderBoard = this.id;
        var attackerCaseId = player.selectedCaseId;
        var defenderCaseId = selectedCaseId;
        applySpellEffect(player.id, player.selectedCaseId, defenderBoard, defenderCaseId);
        manaBoard.remove(player.selectedCarte.cout); // remove mana
      }
      // reset
      player.initSelectedCarte();
      selectedCarte.init();
      selectedCaseId = -1;
      break;
    case 2: // Hand attack direct
      console.log('Hand attack direct : ' + selectedCarte);
      this.selectedCarte = selectedCarte.clone();
      this.selectedCaseId = selectedCaseId;
      // resolve attack here
      console.log(playerHand.selectedCarte + '\n' + 'Attack ' + this.selectedCarte + '\n' + 
          'From case : ' + playerHand.selectedCaseId + '\n' + 'To case : ' + this.selectedCaseId);
       // if its spell
      if (playerHand.selectedCarte.type == 'Spell') {
        applySpellEffect(playerHand.id, playerHand.selectedCaseId, this.id, selectedCaseId);
        manaBoard.remove(playerHand.selectedCarte.cout); // remove mana
      }
      // reset
      playerHand.remove(playerHand.selectedCaseId);
      playerHand.initSelectedCarte();
      selectedCarte.init();
      selectedCaseId = -1;
      break;
    case 3: // Board attack direct
      console.log('Board attack direct : ' + selectedCarte);
      this.selectedCarte = selectedCarte.clone();
      this.selectedCaseId = selectedCaseId;
      console.log(playerBoard.selectedCarte + '\n' + 'Attack ' + this.selectedCarte + '\n' + 
          'From case : ' + playerBoard.selectedCaseId + '\n' + 'To case : ' + this.selectedCaseId);
      // resolve attack here
      var attackerBoard  = playerBoard.id;
      var attackerCaseId = playerBoard.selectedCaseId;
      if (playerBoard.selectedCarte.visible && playerBoard.selectedCarte.active) {
        if (!opponentBoard.provocate()) { // no provocate on board ?
          resolveAttackOpponent(attackerBoard, attackerCaseId);
        }
        else if (selectedCarte.etat.provoke) { // attack provoke
          resolveAttackOpponent(attackerBoard, attackerCaseId);
        }
      }
      // reset
      playerBoard.initSelectedCarte();
      selectedCarte.init();
      selectedCaseId = -1;
      break;
    default:
      console.log("Can't select carte!");
    }
    cleanHand(); // clean all selected carte
  }
}

var player = new Board('player', 650, 320, 100, 150);
player.create(1, 1, 0);
player.type = 'Allie';
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
      case 1: // unselect the carte
        this.initSelectedCarte();
        console.log('Unselected player : ' + selectedCarte);
      break;
      case 2: // spell from hand
        // if its spell
        if (playerHand.selectedCarte.type == 'Spell') {
          applySpellEffect(playerHand.id, playerHand.selectedCaseId, this.id, selectedCaseId);
          manaBoard.remove(playerHand.selectedCarte.cout); // remove mana
        }
        // reset
        playerHand.remove(playerHand.selectedCaseId);
        playerHand.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
      default:
        console.log("Can't select carte!");
    }
  }
  cleanHand(player.id);
  selectedCarte.init();
  selectedCaseId = -1;
}

var allCarte = new Board('allCarte', 100, 0, 100, 150);
allCarte.create(5, 3, 0);
document.body.appendChild(allCarte);
allCarte.onclick = function() {
  if (selectedCarte.visible && !selectedCarte.selected) { // player select a carte to put on deck
    this.selectedCarte = selectedCarte.clone();
    this.get(selectedCaseId).selected = true; // force to selected
    this.getByCarteId(selectedCarte.id).selected = true; // force to selected
    var myMini = selectedCarte.clone();
    myMini.toMini();
    playerDeck.addLast(myMini);
    console.log("Select carte : " + this.selectedCarte);
  }
  selectedCarte.init();
  selectedCaseId = -1;
}
// fill the cartes array from server bye page start to 0
allCarte.fill = function(page){
  var theCard;
  var idC = 0;
  for (var id = page*15; id < (page*15)+15 ; id++) {
    theCard = this.cartes[id];
    this.add(idC, theCard);
    idC++;
  }
}
var pageBoard = new manageCoutButton(200, 500, 10, 1);
pageBoard.create();
document.body.appendChild(pageBoard);
pageBoard.onclick = function() {
  if (selectedButton > 0 && selectedButton <= 8) {
    allCarte.fill(selectedButton-1);
  }
  selectedButton = 0;
}
var playerDeck = new Board('playerDeck', 650, 50, 100, 20);
playerDeck.create(1, maxDeckCarte, 1);
document.body.appendChild(playerDeck);
playerDeck.onclick = function() {
  if (selectedCarte.visible) {
    var carteid = selectedCarte.id;
    var unselect = allCarte.getByCarteId(carteid);
    unselect.selected = false;
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
      srvCard = allCarte.getRandom();
      miniCard = srvCard.clone();
      miniCard.toMini();
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
  var playerCard;
  for (var id = 0; id < allAvatarsCartes.length; id++) {
    playerCard = allAvatarsCartes[id];
    this.addClone(id, playerCard);
  }
  this.setVisibility(true);
}

var cardSelector = new Board('cardSelector', 200, 20, 100, 150);
cardSelector.create(3, 1, 0);
document.body.appendChild(cardSelector);
cardSelector.numberOfCardAsked = 0;
cardSelector.onclick = function() {
  if (selectedCarte.visible) {
    // remove the card
    this.remove(selectedCaseId);
    this.numberOfCardAsked++; // used by removedhandcard message
    console.log("Removed card : " + selectedCarte);
  }
  selectedCarte.init();
  selectedCaseId = -1;
}
cardSelector.fill = function(cardList){
  var card;
  for (var id = 0; id < cardList.length; id++) {
    card = cardList[id];
    this.add(id, card);
  }
  this.setVisibility(true);
}

var manaBoard = new ManageMana(650, 500, 10, 1);
manaBoard.create();
document.body.appendChild(manaBoard);

//////////////////////////////Useful functions////////////////////////////
// return 0 if no card on hand
function cardOnHand() {
  if (player.selectedCarte.visible) return 1;
  else if (playerHand.selectedCarte.visible) return 2;
  else if (playerBoard.selectedCarte.visible) return 3;
  else return 0;
}
function cleanHand(except) {
  if (except != playerHand.id) {playerHand.initSelectedCarte();}
  if (except != playerBoard.id) {playerBoard.initSelectedCarte();}
  if (except != opponentBoard.id) {opponentBoard.initSelectedCarte();}
  if (except != opponentHand.id) {opponentHand.initSelectedCarte();}
  if (except != opponent.id) {opponent.initSelectedCarte();}
  if (except != player.id) {player.initSelectedCarte();}
}
function showDeckBuilder(on) {
  allCarte.setVisibility(on);
  playerDeck.setVisibility(on);
  pageBoard.visible(on);
  deckB.hide(on);
  finishDeckB.hide(!on);
  clearB.hide(!on);
  if (on) {
    allCarte.fill(0);
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
  cardSelector.initCartes();
  //playerSelector.initCartes();
  //resetDeckBuilder();
}
function getBoard(name) {
  if (name == opponentHand.id) return opponentHand;
  if (name == playerSelector.id) return playerSelector;
  if (name == opponentBoard.id) return opponentBoard;
  if (name == playerBoard.id) return playerBoard;
  if (name == playerHand.id) return playerHand;
  if (name == opponent.id) return opponent;
  if (name == player.id) return player;
  if (name == allCarte.id) return allCarte;
  if (name == playerDeck.id) return playerDeck;
  if (name == playerSelector.id) return playerSelector;
  return;
}

function applySpellEffect(attackerBoard, attackerCaseId, defenderBoard, defenderCaseId) {
  var attBoard = getBoard(attackerBoard);
  var defBoard = getBoard(defenderBoard);
  var attCarte = attBoard.get(attackerCaseId);
  var defCarte = [];
  var defCaseId = [];
  defCarte[0] = defBoard.get(defenderCaseId);
  defCaseId[0] = defenderCaseId;
  if (attCarte.effet.zone == 'Single') {
    defCarte[0].applyEffect(attCarte.effet);
  }
  if (attCarte.effet.zone == 'Multi') {
    var caseid = 0;
    for (var i = 0; i < defBoard.cases.length; i++) {
      if (!defBoard.get(i).isNull()) { // if carte not null
        defCarte[caseid] = defBoard.get(i);
        defCarte[caseid].applyEffect(attCarte.effet);
        defCaseId[caseid] = i;
        caseid++;
      }
    }
  }
  // remove the spell from hand
  if (attCarte.type != 'Player') {
    socket.emit('cardplayed', {
      game: gameName,
      player: playerName
    });
  }
  // send result to server
  for (var i = 0; i < defCarte.length; i++) {
    if (defCarte[i].vie <= 0) {
      if (defenderBoard == opponent.id) { // the opponent is dead
        defCarte[i].init(); // carte is dead
        // send the end game message
        socket.emit('endgame', {
          name: gameName,
          player: playerName
        });
      }
      else {
        defCarte[i].init(); // carte is dead
        // emit the remove message
        socket.emit('remove', {
          player: playerName,
          game: gameName,
          defboard: defenderBoard,
          defcaseid: defCaseId[i],
          attboard: attackerBoard,
          attcaseid: attackerCaseId,
          attcarte: attCarte
        });
      }
    }
    else {
      // emit the change message
      socket.emit('change', {
        player: playerName,
        game: gameName,
        defboard: defenderBoard,
        defcaseid: defCaseId[i],
        defcarte: defCarte[i],
        attboard: attackerBoard,
        attcaseid: attackerCaseId,
        attcarte: attCarte
      });
    }
    // draw all changes
    defBoard.getCase(defCaseId[i]).draw();
  }
}
// attaque sans perte de vie
function resolveAttackOpponent(attackerBoard, attackerCaseId) {
  var attBoard = getBoard(attackerBoard);
  var defBoard = getBoard('opponent');
  var attCarte = attBoard.get(attackerCaseId);
  var defCarte = defBoard.get(0);
  var defDefense = defCarte.defense - attCarte.attaque;
  var defLife = defCarte.vie + defDefense;
  if (defDefense > 0) {defCarte.defense = defDefense;}
  else {defCarte.defense = 0;}
  attCarte.active = false; // inactive attack carte
  if (attCarte.etat.hide) { // unhidden
    attCarte.etat.hide = false;
  }
  if (attCarte.etat.fury > 0) { // change fury nb
    attCarte.active = true;
    attCarte.etat.fury--;
  }
  if (defLife <= 0) {
    // the opponent is dead
    defCarte.init(); // carte is dead
    // send the end game message
    socket.emit('endgame', {
      name: gameName,
      player: playerName
    });
  }
  else {
    defCarte.vie = defLife; // not die change is life
    // emit the change message
    socket.emit('change', {
      player: playerName,
      game: gameName,
      defboard: 'opponent',
      defcaseid: 0,
      defcarte: defCarte,
      attboard: attackerBoard,
      attcaseid: attackerCaseId,
      attcarte: attCarte
    });
  }
  // draw all changes
  attBoard.getCase(attackerCaseId).draw();
  defBoard.getCase(0).draw();
}
function resolveAttackDefense(attackerBoard, attackerCaseId , defenderBoard, defenderCaseId) {
  var attBoard = getBoard(attackerBoard);
  var defBoard = getBoard(defenderBoard);
  var attCarte = attBoard.get(attackerCaseId);
  var defCarte = defBoard.get(defenderCaseId);
  var defDefense = defCarte.defense - attCarte.attaque;
  var attDefense = attCarte.defense - defCarte.attaque;
  var defLife = defCarte.vie;
  var attLife = attCarte.vie;
  if (defDefense > 0) {
    defCarte.defense = defDefense;
  }
  else {
    defLife += defDefense;
    defCarte.defense = 0;
  }
  if (attDefense > 0) {
    attCarte.defense = attDefense;
  }
  else {
    attLife += attDefense;
    attCarte.defense = 0;
  }
  attCarte.active = false; // inactive attack carte
  if (defCarte.etat.hide) { //hide nothing happen
    attCarte.active = true;
    return;
  }
  if (attCarte.etat.hide) { // unhidden
    attCarte.etat.hide = false;
  }
  if (defCarte.etat.divine) { // it's not a divine carte
    defLife = defCarte.vie;
    defCarte.etat.divine = false;
  }
  if (attCarte.etat.divine) { // it's not a divine carte
    attLife = attCarte.vie;
    attCarte.etat.divine = false;
  }
  if (attCarte.etat.fury > 0) {
    attCarte.active = true;
    attCarte.etat.fury--;
  }
  // defender
  if (defLife <= 0) {
    if (defCarte.effet.declencheur == 'Die') { // apply effect on Die
      if (defCarte.effet.impact == 'player' || defCarte.effet.impact == 'every') {
        applySpellEffect(defenderBoard, defenderCaseId, 'player', 0);
      }
      if (defCarte.effet.impact == 'playerBoard' || defCarte.effet.impact == 'every') {
        applySpellEffect(defenderBoard, defenderCaseId, defenderBoard, defenderCaseId);
      }
      if (defCarte.effet.impact == 'opponent' || defCarte.effet.impact == 'every') {
        applySpellEffect(defenderBoard, defenderCaseId, 'opponent', 0);
      }
      if (defCarte.effet.impact == 'opponentBoard' || defCarte.effet.impact == 'every') {
        applySpellEffect(defenderBoard, defenderCaseId, attackerBoard, attackerCaseId);
      }
    }
    defCarte.init(); // carte is dead
    // emit the remove message
    socket.emit('remove', {
      player: playerName,
      game: gameName,
      defboard: defenderBoard,
      defcaseid: defenderCaseId,
      attboard: attackerBoard,
      attcaseid: attackerCaseId,
      attcarte: attCarte
    });
  }
  else {
    if (defCarte.effet.declencheur == 'Attack') { // apply effect on Attack
      if (defCarte.effet.impact == 'player' || defCarte.effet.impact == 'every') {
        applySpellEffect(defenderBoard, defenderCaseId, 'player', 0);
      }
      if (defCarte.effet.impact == 'playerBoard' || defCarte.effet.impact == 'every') {
        applySpellEffect(defenderBoard, defenderCaseId, defenderBoard, defenderCaseId);
      }
      if (defCarte.effet.impact == 'opponent' || defCarte.effet.impact == 'every') {
        applySpellEffect(defenderBoard, defenderCaseId, 'opponent', 0);
      }
      if (defCarte.effet.impact == 'opponentBoard' || defCarte.effet.impact == 'every') {
        applySpellEffect(defenderBoard, defenderCaseId, attackerBoard, attackerCaseId);
      }
    }
    defCarte.vie = defLife; // not die change is life
    // emit the change message
    socket.emit('change', {
      player: playerName,
      game: gameName,
      defboard: defenderBoard,
      defcaseid: defenderCaseId,
      defcarte: defCarte,
      attboard: attackerBoard,
      attcaseid: attackerCaseId,
      attcarte: attCarte
    });
  }
  // attack
  if (attLife <= 0) { // attack is dead
    if (attCarte.effet.declencheur == 'Die') { // apply effect on Die
      if (attCarte.effet.impact == 'player' || attCarte.effet.impact == 'every') {
        applySpellEffect(attackerBoard, attackerCaseId, 'player', 0);
      }
      if (attCarte.effet.impact == 'playerBoard' || attCarte.effet.impact == 'every') {
        applySpellEffect(attackerBoard, attackerCaseId, attackerBoard, attackerCaseId);
      }
      if (attCarte.effet.impact == 'opponent' || attCarte.effet.impact == 'every') {
        applySpellEffect(attackerBoard, attackerCaseId, 'opponent', 0);
      }
      if (attCarte.effet.impact == 'opponentBoard' || attCarte.effet.impact == 'every') {
        applySpellEffect(attackerBoard, attackerCaseId, defenderBoard, defenderCaseId);
      }
    }
    attCarte.init();
    socket.emit('remove', {
      player: playerName,
      game: gameName,
      defboard: attackerBoard,
      defcaseid: attackerCaseId,
      attboard: defenderBoard,
      attcaseid: defenderCaseId,
      attcarte: defCarte
    });
  }
  else { 
    if (attCarte.effet.declencheur == 'Attack') { // apply effect on Attack
      if (attCarte.effet.impact == 'player' || attCarte.effet.impact == 'every') {
        applySpellEffect(attackerBoard, attackerCaseId, 'player', 0);
      }
      if (attCarte.effet.impact == 'playerBoard' || attCarte.effet.impact == 'every') {
        applySpellEffect(attackerBoard, attackerCaseId, attackerBoard, attackerCaseId);
      }
      if (attCarte.effet.impact == 'opponent' || attCarte.effet.impact == 'every') {
        applySpellEffect(attackerBoard, attackerCaseId, 'opponent', 0);
      }
      if (attCarte.effet.impact == 'opponentBoard' || attCarte.effet.impact == 'every') {
        applySpellEffect(attackerBoard, attackerCaseId, defenderBoard, defenderCaseId);
      }
    }
    attCarte.vie = attLife;
    socket.emit('change', {
      player: playerName,
      game: gameName,
      defboard: attackerBoard,
      defcaseid: attackerCaseId,
      defcarte: attCarte,
      attboard: defenderBoard,
      attcaseid: defenderCaseId,
      attcarte: defCarte
    });
  }
  // draw all changes
  attBoard.getCase(attackerCaseId).draw();
  defBoard.getCase(defenderCaseId).draw();
}
function fromSrvCarte(srvCard) {
  var localCard = new Carte(srvCard.id, srvCard.typeimg, srvCard.type, srvCard.imgid, srvCard.visible,
  srvCard.cout, srvCard.attaque, srvCard.defense, srvCard.vie, srvCard.titre, srvCard.description, srvCard.active, 
  srvCard.selected, srvCard.special, srvCard.effet, srvCard.etat);
  return localCard;
}
console.log('Finish gomassBoard.js');