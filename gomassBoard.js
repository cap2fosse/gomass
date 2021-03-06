'use strict';
console.log('Start gomasBoard.js');

///////////////////////////GAME BOARDS////////////////////////////

var opponentHand = new Board(nameOfBordName[0], 250, 150, 100, 150);
opponentHand.create(6, 1, 0);
opponentHand.type = 'Opponent';
document.body.appendChild(opponentHand);
opponentHand.onclick = function() { 
  console.log("Can't select carte!");
  cleanHand();
  select.display();
}
opponentHand.fill = function(cardList){
  var card;
  for (var id = 0; id < cardList.length; id++) {
    card = cardList[id];
    this.addClone(id, card);
  }
  //this.setVisibility(true);
}

var opponentBoard = new Board(nameOfBordName[1], 250, 320, 100, 150);
opponentBoard.create(6, 1, 0);
opponentBoard.type = 'Opponent';
opponentBoard.setBorder(true);
document.body.appendChild(opponentBoard);
opponentBoard.onclick = function() {
  if (selectedCarte.visible && myTurn) {
    var onHand = cardOnHand();
    switch (onHand) {
      case 1: // received attack from player
        console.log('Player attack direct : ' + selectedCarte);
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        console.log(player.selectedCarte + '\n' + 'Attack ' + this.selectedCarte + '\n' + 
            'From case : ' + player.selectedCaseId + '\n' + 'To case : ' + this.selectedCaseId);
        // resolve attack here
        var attackerBoard = player.id;
        var defenderBoard = this.id;
        var attackerCaseId = player.selectedCaseId;
        var defenderCaseId = selectedCaseId;
        if (player.selectedCarte.visible && player.selectedCarte.active) {
          // no provocate on board & not hide
          if (!this.provocate() && !this.selectedCarte.etat.hide) {
            resolveAttackDefense(attackerBoard, attackerCaseId , defenderBoard, defenderCaseId);
            // fill defausse boards
            defausseAttack.addFirst(player.selectedCarte);
            defausseDefense.addFirst(this.selectedCarte);
          }
          // attack not hide provoke
          else if (this.selectedCarte.etat.provoke && !this.selectedCarte.etat.hide) {
            resolveAttackDefense(attackerBoard, attackerCaseId , defenderBoard, defenderCaseId);
            // fill defausse boards
            defausseAttack.addFirst(player.selectedCarte);
            defausseDefense.addFirst(this.selectedCarte);
          }
          else {console.log("Can't attack Provocation on board!");}
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
            // fill defausse boards
            defausseAttack.addFirst(playerHand.selectedCarte);
            defausseDefense.addFirst(this.selectedCarte);
            // remove mana & card
            manaBoard.remove(playerHand.selectedCarte.cout);
            playerHand.remove(playerHand.selectedCaseId);
            // compute playable cards
            playerHand.activateAll();
            playerPower.activateAll();
          }
        }
        // reset
        playerHand.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 3: // received attack from player board
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        var attackerBoard  = playerBoard.id;
        var defenderBoard = this.id;
        var attackerCaseId = playerBoard.selectedCaseId;
        var defenderCaseId = selectedCaseId;
        console.log('Player Board attack Opponent: ' + playerBoard.selectedCarte + '\n' + 'Attack ' + selectedCarte + '\n' + 
            'From case : ' + playerBoard.selectedCaseId + '\n' + 'To case : ' + selectedCaseId);
        // resolve attack here
        if (playerBoard.selectedCarte.visible && playerBoard.selectedCarte.active) {
          // no provocate on board ?
          if (!this.provocate() && !this.selectedCarte.etat.hide) {
            resolveAttackDefense(attackerBoard, attackerCaseId , defenderBoard, defenderCaseId);
            // fill defausse boards
            defausseAttack.addFirst(playerBoard.selectedCarte);
            defausseDefense.addFirst(this.selectedCarte);
          }
          else if (this.selectedCarte.etat.provoke && !this.selectedCarte.etat.hide) { // attack provoke
            resolveAttackDefense(attackerBoard, attackerCaseId , defenderBoard, defenderCaseId);
            // fill defausse boards
            defausseAttack.addFirst(playerBoard.selectedCarte);
            defausseDefense.addFirst(this.selectedCarte);
          }
          else {console.log('Provocation on board!');}
        }
        playerBoard.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 4: // received attack from player power
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        var power = playerPower.get(0);
        if (playerPower.selectedCarte.titre != allPowerCartes[0].titre) { // if its not invocus
          console.log('Player attack Opponent with Power : ' + selectedCarte);
          var attackerBoard  = playerPower.id;
          var defenderBoard = this.id;
          var attackerCaseId = playerPower.selectedCaseId;
          var defenderCaseId = selectedCaseId;
          if (!this.selectedCarte.etat.hide) { // no spell on hidden card
            applySpellEffect(attackerBoard, attackerCaseId, defenderBoard, defenderCaseId);
            playerPower.inactivateAll(); // inactive power player
            manaBoard.remove(power.cout); // remove mana
            // compute playable cards
            playerHand.activateAll();
          }
        }
        // reset
        playerPower.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      default:
        console.log("Can't select carte!");
    }
    // clean
    cleanHand();
    select.display();
  }
  else {
    console.log("Can't select carte!");
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
opponentBoard.activateAll = function(){
  var card;
  for (var caseid = 0; caseid < this.cases.length; caseid++) {
    card = this.get(caseid);
    if (card.visible && card.attaque > 0) {
      if (card.effet.declencheur == 'Activated') {
        card.applyEffect(card.effet);
      }
      if (card.etat.maxfury > 0) {
        card.etat.fury = card.etat.maxfury;
      }
      card.activate(true);
    }
    else {card.activate(false);}
    this.getCase(caseid).draw();
  }
}
// to remove a card from playerDeck
opponentBoard.addEventListener('drop', function(evt) {
	console.log('opponentBoard drop');
	evt.preventDefault(); // drop is possible
  if (dragCarte.visible && myTurn) {
	switch (dragStartBoardName) {
		case nameOfBordName[0] : // opponentHand
			console.log(nameOfBordName[0] + " on " + nameOfBordName[1]);
			break;
		case nameOfBordName[2] : // playerBoard
		console.log(nameOfBordName[2] + " on " + nameOfBordName[1]);
		break;
		case nameOfBordName[3] : // playerHand
		console.log(nameOfBordName[3] + " on " + nameOfBordName[1]);
		break;
		case nameOfBordName[4] : // opponent
		console.log(nameOfBordName[4] + " on " + nameOfBordName[1]);
		break;
		case nameOfBordName[5] : // player
			console.log(nameOfBordName[5] + " on " + nameOfBordName[1]);
			// resolve attack here
			var attackerBoard = player.id;
			var defenderBoard = this.id;
			var attackerCaseId = dragCaseId;
			var defenderCaseId = dropCaseId;
			if (player.selectedCarte.visible && player.selectedCarte.active) {
				// no provocate on board & not hide
				if (!this.provocate() && !this.selectedCarte.etat.hide) {
					resolveAttackDefense(attackerBoard, attackerCaseId , defenderBoard, defenderCaseId);
					// fill defausse boards
					defausseAttack.addFirst(player.selectedCarte);
					defausseDefense.addFirst(this.selectedCarte);
				}
				// attack not hide provoke
				else if (this.selectedCarte.etat.provoke && !this.selectedCarte.etat.hide) {
					resolveAttackDefense(attackerBoard, attackerCaseId , defenderBoard, defenderCaseId);
					// fill defausse boards
					defausseAttack.addFirst(player.selectedCarte);
					defausseDefense.addFirst(this.selectedCarte);
				}
				else {console.log("Can't attack Provocation on board!");}
			}
			break;
	}
	}
	dragCarte.init();
	dragStartBoardName = "";
});
opponentBoard.addEventListener('dragend', function(evt) {
	console.log('opponentBoard dragend');
	dragCarte.init();
	dragStartBoardName = "";
  });
opponentBoard.addEventListener('dragover', function(evt) {
	console.log('opponentBoard dragover');
    evt.preventDefault(); // drop is possible
  });

var playerBoard = new Board(nameOfBordName[2], 250, 470, 100, 150);
playerBoard.create(6, 1, 0);
playerBoard.type = 'Allie';
playerBoard.setBorder(false);
document.body.appendChild(playerBoard);
// pass active all visible cartes in playerBoard
playerBoard.onclick = function() {
  var onHand = cardOnHand();
  if (!selectedCarte.visible && myTurn) {
    var dstboard = this.id;
    switch (onHand) {
      case 1: // from player
        // reset
        player.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 2: // playerHand drop a carte on the board (Invocation or Spell)
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        var hand = playerHand.selectedCarte;
        if (hand.type == 'Invocation') {
          // clone it and put it on board
          this.addClone(this.selectedCaseId, hand);
          // remove from hand
          playerHand.remove(playerHand.selectedCaseId);
          manaBoard.remove(hand.cout);
          // compute playable cards
          playerHand.activateAll();
          playerPower.activateAll();
          console.log('Put a carte on board : ' + this.get(selectedCaseId));
          // prepare msg
          var thecarte = hand.clone();
          var srcboard = playerHand.id;
          // emit message : add new card on board
          socket.emit('addcarte', {
            player: playerName,
            srcboard: srcboard,
            dstboard: dstboard,
            caseid: selectedCaseId,
            carte: thecarte,
            game: gameName
          });
        }
        else {
          console.log("Can't play this card on board : " + this.get(selectedCaseId));
        }
        // reset
        playerHand.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 4: // from power
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        if (playerPower.get(0).titre == allPowerCartes[0].titre) { // if its invocus
          // remove mana & inactive power
          playerPower.inactivateAll();
          // add new invocation
          var invocus = invocusCard.clone();
          manaBoard.remove(invocus.cout);
          playerPower.inactivateAll();
          // compute playable cards
          playerHand.activateAll();
          InvocateCard(this.id, invocus, this.selectedCaseId);
        }
        // reset
        playerPower.initSelectedCarte();
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
    switch (onHand) {
    case 0: // empty hand
      if (selectedCarte.active) {
        // store it
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        // fill select board
        select.add(0, this.selectedCarte);
        console.log('Selected carte : ' + selectedCarte + ' at case id : ' + selectedCaseId);
        // reset
        selectedCarte.init();
        selectedCaseId = -1;
      }
    break;
    case 1: // from player
      // reset
      player.initSelectedCarte();
      selectedCarte.init();
      selectedCaseId = -1;
    break;
    case 2: // from hand
      if (playerHand.selectedCarte.type == 'Spell') {
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        applySpellEffect(playerHand.id, playerHand.selectedCaseId, this.id, this.selectedCaseId);
        // fill defausse boards
        defausseAttack.addFirst(playerHand.selectedCarte);
        defausseDefense.addFirst(this.selectedCarte);
         // remove mana & card
        manaBoard.remove(playerHand.selectedCarte.cout);
        playerHand.remove(playerHand.selectedCaseId);
        // compute playable cards
        playerHand.activateAll();
        playerPower.activateAll();
        // reset
        playerHand.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
      }
    break;
    case 3: // from here => unselect
      console.log('Unselected carte : ' + selectedCarte);
      // reset
      this.initSelectedCarte();
      // fill select board
      select.display();
      selectedCarte.init();
      selectedCaseId = -1;
    break;
    case 4: // from power
      if (playerPower.selectedCarte.titre != allPowerCartes[0].titre) { // if its not invocus
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        var attackerBoard  = playerPower.id;
        var defenderBoard = this.id;
        var attackerCaseId = playerPower.selectedCaseId;
        var defenderCaseId = this.selectedCaseId;
        applySpellEffect(attackerBoard, attackerCaseId, defenderBoard, defenderCaseId);
        manaBoard.remove(playerPower.get(0).cout); // remove mana
        playerPower.inactivateAll();
        // compute playable cards
        playerHand.activateAll();
        // reset
        playerPower.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
      }
    break;
    default: 
      console.log("Can't select carte!");
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
  // clean
  cleanHand(playerBoard.id);
  select.display();
}
playerBoard.activateAll = function(){
  var card;
  for (var caseid = 0; caseid < this.cases.length; caseid++) {
    card = this.get(caseid);
    if (card.visible && card.attaque > 0) {
      if (card.effet.declencheur == 'Activated') {
        card.applyEffect(card.effet);
      }
      if (card.etat.maxfury > 0) {
        card.etat.fury = card.etat.maxfury;
      }
      card.activate(true);
    }
    else {card.activate(false);}
    this.getCase(caseid).draw();
  }
}
playerBoard.addEventListener('drop', function(evt) {
	console.log('playerBoard drop');
  evt.preventDefault(); // drop is possible
	switch (dragStartBoardName) {
		case nameOfBordName[0] : // opponentHand
		console.log(nameOfBordName[0] + " on " + nameOfBordName[2]);
		break;
		case nameOfBordName[1] : // opponentBoard
		console.log(nameOfBordName[1] + " on " + nameOfBordName[2]);
		break;
		case nameOfBordName[3] : // playerHand
		console.log(nameOfBordName[3] + " on " + nameOfBordName[2]);
		break;
		case nameOfBordName[4] : // opponent
		console.log(nameOfBordName[4] + " on " + nameOfBordName[2]);
		break;
		case nameOfBordName[5] : // player
		console.log(nameOfBordName[5] + " on " + nameOfBordName[2]);
		break;
	}
	dragCarte.init();
	dragStartBoardName = "";
});
playerBoard.addEventListener('dragend', function(evt) {
	console.log('playerBoard dragend');
	evt.preventDefault(); // drop is possible
	dragCarte.init();
	dragStartBoardName = "";
  });
playerBoard.addEventListener('dragover', function(evt) {
	console.log('playerBoard dragover');
    evt.preventDefault(); // drop is possible
  });

var playerHand = new Board(nameOfBordName[3], 250, 640, 100, 150);
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
        // clone and inactive it
        this.selectedCarte = selectedCarte.clone();
        this.selectedCarte.activate(false);
        // fill select board
        select.add(0, this.selectedCarte);
        // if charge active it
        if (this.selectedCarte.etat.charge) {
          this.selectedCarte.active = true;
          this.selectedCarte.etat.charge = false;
        }
        // if has active & onActivated apply effect
        if (this.selectedCarte.active && this.selectedCarte.effet.declencheur == 'Activated') {
          //applySpellEffect(this.id, this.selectedCaseId, this.id, this.selectedCaseId);
          this.selectedCarte.applyEffect(this.selectedCarte.effet);
        }
        // if has onPlayed effect
        if (this.selectedCarte.effet.declencheur == 'Played') { // apply effect on myself
          //applySpellEffect(this.id, this.selectedCaseId, this.id, this.selectedCaseId);
          this.selectedCarte.applyEffect(this.selectedCarte.effet);
        }
        this.selectedCaseId = selectedCaseId;
        console.log('Select a Carte in Hand : ' + this.selectedCarte);
      }
      else {console.log('Not enough mana!');}
      break;
      default:
      if (selectedCarte.equal(this.selectedCarte)) {
        this.initSelectedCarte();
        // fill select board
        select.display();
        console.log('Unselected carte in Hand : ' + selectedCarte);
      }
    }
  }
  else {console.log("Can't select carte!");}
  // reset
  cleanHand(playerHand.id);
  select.display();
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
playerHand.activateAll = function(){
  var card;
  var mana = manaBoard.getMana();
  for (var caseid = 0; caseid < this.cases.length; caseid++) {
    card = this.get(caseid);
    if (card.visible) {
      if (mana >= card.cout) {
        card.activate(true);
      }
      else {card.activate(false);}
    }
    this.getCase(caseid).draw();
  }
}

var opponent = new Board(nameOfBordName[4], 1050, 150, 100, 150);
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
      var attackerBoard  = player.id;
      var defenderBoard = this.id;
      var attackerCaseId = player.selectedCaseId;
      var defenderCaseId = selectedCaseId;
      if (player.selectedCarte.visible && player.selectedCarte.active) {
        // no provocate on board ?
        if (!opponentBoard.provocate() && !this.selectedCarte.etat.hide) {
          resolveAttackDefense(attackerBoard, attackerCaseId , defenderBoard, defenderCaseId);
          // fill defausse boards
          defausseAttack.addFirst(player.selectedCarte);
          defausseDefense.addFirst(this.selectedCarte);
        }
        else if (this.selectedCarte.etat.provoke && !this.selectedCarte.etat.hide) { // attack provoke
          resolveAttackDefense(attackerBoard, attackerCaseId , defenderBoard, defenderCaseId);
          // fill defausse boards
          defausseAttack.addFirst(player.selectedCarte);
          defausseDefense.addFirst(this.selectedCarte);
        }
        else {console.log('Provocation on board!');}
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
        // fill defausse boards
        defausseAttack.addFirst(playerHand.selectedCarte);
        defausseDefense.addFirst(this.selectedCarte);
         // remove mana
        manaBoard.remove(playerHand.selectedCarte.cout);
        playerHand.remove(playerHand.selectedCaseId);
        // compute playable cards
        playerHand.activateAll();
        playerPower.activateAll();
      }
      // reset
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
          // fill defausse boards
          defausseAttack.addFirst(playerBoard.selectedCarte);
          defausseDefense.addFirst(this.selectedCarte);
        }
        else if (this.selectedCarte.etat.provoke) { // attack provoke
          resolveAttackOpponent(attackerBoard, attackerCaseId);
          // fill defausse boards
          defausseAttack.addFirst(playerBoard.selectedCarte);
          defausseDefense.addFirst(this.selectedCarte);
        }
        else {console.log('Provocation on board!');}
      }
      // reset
      playerBoard.initSelectedCarte();
      selectedCarte.init();
      selectedCaseId = -1;
      break;
    case 4: // Player power attack direct
      console.log('Player power attack direct : ' + selectedCarte);
      this.selectedCarte = selectedCarte.clone();
      this.selectedCaseId = selectedCaseId;
      console.log(playerPower.selectedCarte + '\n' + 'Attack ' + this.selectedCarte + '\n' + 
          'From case : ' + playerPower.selectedCaseId + '\n' + 'To case : ' + this.selectedCaseId);
      // resolve attack here
      if (playerPower.selectedCarte.titre != allPowerCartes[0].titre) { // if its not invocus
        var attackerBoard  = playerPower.id;
        var defenderBoard = this.id;
        var attackerCaseId = playerPower.selectedCaseId;
        var defenderCaseId = selectedCaseId;
        applySpellEffect(attackerBoard, attackerCaseId, defenderBoard, defenderCaseId);
        manaBoard.remove(playerPower.selectedCarte.cout); // remove mana
        playerPower.inactivateAll();
        // compute playable cards
        playerHand.activateAll();
      }
      // reset
      playerPower.initSelectedCarte();
      selectedCarte.init();
      selectedCaseId = -1;
      break;
    default:
      console.log("Can't select carte!");
    }
  }
  // clean
  cleanHand(); // clean all selected carte
  select.display();
}
opponent.setName = function(){
  this.get(0).description = opponentName;
}
opponent.activateAll = function() {
  if (this.get(0).attaque > 0) {
    this.get(0).activate(true);
  }
  else {
    this.get(0).activate(false);
  }
  this.getCase(0).draw();
}
// to remove a card from playerDeck
opponent.addEventListener('drop', function(evt) {
	console.log('opponent drop');
  evt.preventDefault(); // drop is possible
	switch (dragStartBoardName) {
		case nameOfBordName[0] : // opponentHand
		console.log(nameOfBordName[0] + " on " + nameOfBordName[4]);
		break;
		case nameOfBordName[1] : // opponentBoard
		console.log(nameOfBordName[1] + " on " + nameOfBordName[4]);
		break;
		case nameOfBordName[2] : // playerBoard
		console.log(nameOfBordName[2] + " on " + nameOfBordName[4]);
		break;
		case nameOfBordName[3] : // playerHand
		console.log(nameOfBordName[3] + " on " + nameOfBordName[4]);
		break;
		case nameOfBordName[5] : // player
		console.log(nameOfBordName[5] + " on " + nameOfBordName[4]);
		break;
	}
	dragCarte.init();
	dragStartBoardName = "";
});
opponent.addEventListener('dragend', function(evt) {
	console.log('opponent dragend');
	evt.preventDefault(); // drop is possible
	dragCarte.init();
	dragStartBoardName = "";
  });
opponent.addEventListener('dragover', function(evt) {
	console.log('opponent dragover');
    evt.preventDefault(); // drop is possible
  });

var player = new Board(nameOfBordName[5], 1050, 640, 100, 150);
player.create(1, 1, 0);
player.type = 'Allie';
document.body.appendChild(player);
player.onclick = function() {
  if (selectedCarte.visible && myTurn) {
    var onHand = cardOnHand();
    switch (onHand) {
      case 0: // select a carte from player
        // store it
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        // fill select board
        select.add(0, this.selectedCarte);
        console.log('Selected player : ' + this.selectedCarte);
        selectedCarte.init();
        selectedCaseId = -1;
      break;
      case 1: // unselect
        this.initSelectedCarte();
        select.display(); // display unselection
        selectedCarte.init();
        selectedCaseId = -1;
        console.log('Unselected player : ' + selectedCarte);
      break;
      case 2: // spell from hand
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        if (playerHand.selectedCarte.type == 'Spell') { // if its spell
          applySpellEffect(playerHand.id, playerHand.selectedCaseId, this.id, selectedCaseId);
          // fill defausse boards
          defausseAttack.addFirst(playerHand.selectedCarte);
          defausseDefense.addFirst(this.selectedCarte);
           // remove mana
          manaBoard.remove(playerHand.selectedCarte.cout);
          playerHand.remove(playerHand.selectedCaseId); // remove the card in the hand
          // compute playable cards
          playerHand.activateAll();
          playerPower.activateAll();
        }
        if (playerHand.selectedCarte.type == 'Equipment') { // if it Equipment
          applyEquipmentEffect(playerHand.id, playerHand.selectedCaseId, this.id, selectedCaseId);
          // fill defausse boards
          defausseAttack.addFirst(playerHand.selectedCarte);
          defausseDefense.addFirst(this.selectedCarte);
           // remove mana
          manaBoard.remove(playerHand.selectedCarte.cout);
          playerHand.remove(playerHand.selectedCaseId); //remove the card in the hand
          // compute playable cards
          playerHand.activateAll();
          playerPower.activateAll();
        }
        // reset
        playerHand.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      case 4: // Player power attack direct
        console.log('Player power attack direct : ' + selectedCarte);
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        console.log(playerPower.selectedCarte + '\n' + 'Attack ' + this.selectedCarte + '\n' + 
            'From case : ' + playerPower.selectedCaseId + '\n' + 'To case : ' + this.selectedCaseId);
        // resolve attack here
        if (playerPower.selectedCarte.titre != allPowerCartes[0].titre) { // if its not invocus
          var attackerBoard  = playerPower.id;
          var defenderBoard = this.id;
          var attackerCaseId = playerPower.selectedCaseId;
          var defenderCaseId = selectedCaseId;
          applySpellEffect(attackerBoard, attackerCaseId, defenderBoard, defenderCaseId);
          manaBoard.remove(playerPower.selectedCarte.cout); // remove mana
          playerPower.inactivateAll();
          // compute playable cards
          playerHand.activateAll();
        }
        // reset
        playerPower.initSelectedCarte();
        selectedCarte.init();
        selectedCaseId = -1;
        break;
      default:
        console.log("Can't select carte!");
    }
  }
  // clean
  cleanHand(player.id);
  select.display();
  selectedCarte.init();
  selectedCaseId = -1;
}
player.setName = function() {
  this.get(0).description = playerName;
}
player.activateAll = function() {
  if (this.get(0).attaque > 0) {
    this.get(0).activate(true);
  }
  else {
    this.get(0).activate(false);
  }
  this.getCase(0).draw();
}
// to remove a card from playerDeck
player.addEventListener('drop', function(evt) {
	console.log('player drop');
  evt.preventDefault(); // drop is possible
	switch (dragStartBoardName) {
		case nameOfBordName[0] : // opponentHand
		console.log(nameOfBordName[0] + " on " + nameOfBordName[5]);
		break;
		case nameOfBordName[1] : // opponentBoard
		console.log(nameOfBordName[1] + " on " + nameOfBordName[5]);
		break;
		case nameOfBordName[2] : // playerBoard
		console.log(nameOfBordName[2] + " on " + nameOfBordName[5]);
		break;
		case nameOfBordName[3] : // playerHand
		console.log(nameOfBordName[3] + " on " + nameOfBordName[5]);
		break;
		case nameOfBordName[4] : // opponent
		console.log(nameOfBordName[4] + " on " + nameOfBordName[5]);
		break;
	}
	dragCarte.init();
	dragStartBoardName = "";
});
player.addEventListener('dragend', function(evt) {
	console.log('player dragend');
	evt.preventDefault(); // drop is possible
	dragCarte.init();
	dragStartBoardName = "";
  });
player.addEventListener('dragover', function(evt) {
	console.log('player dragover');
    evt.preventDefault(); // drop is possible
  });

var select = new Board(nameOfBordName[6], 1050, 400, 100, 150);
select.create(1, 1, 0);
document.body.appendChild(select);

var playerPower = new Board(nameOfBordName[7], 900, 680, 60, 60);
playerPower.create(1, 1, 2);
document.body.appendChild(playerPower);
playerPower.onclick = function() {
  if (selectedCarte.visible && myTurn) {
    var onHand = cardOnHand();
    switch (onHand) {
      case 0: // select playerPower card
      if (manaBoard.getMana() >= selectedCarte.cout) {
        this.selectedCarte = selectedCarte.clone();
        this.selectedCaseId = selectedCaseId;
        // fill select board
        select.add(0, this.selectedCarte);
        console.log('Selected power : ' + selectedCarte);
      }
      else {console.log('Not enougth mana!');}
      break;
      case 4: // unselect the carte
        this.initSelectedCarte();
        // fill select board
        select.display();
        console.log('Unselected power : ' + selectedCarte);
      break;
      default:
        console.log("Can't select carte!");
    }
  }
  cleanHand(playerPower.id);
  selectedCarte.init();
  selectedCaseId = -1;
}
playerPower.activateAll = function(){
  var powerIdx = 0;
  if (this.get(powerIdx).visible) {
    if (manaBoard.getMana() >= this.get(powerIdx).cout) {
      this.get(powerIdx).activate(true);
    }
    else {this.get(powerIdx).activate(false);}
  }
  this.getCase(powerIdx).draw();
}

var opponentPower = new Board(nameOfBordName[8], 900, 190, 60, 60);
opponentPower.create(1, 1, 2);
document.body.appendChild(opponentPower);
opponentPower.activateAll = function(){
  var powerIdx = 0;
  if (this.get(powerIdx).visible) {
    if (manaBoard.getMana() >= this.get(powerIdx).cout) {
      this.get(powerIdx).activate(true);
    }
    else {this.get(powerIdx).activate(false);}
  }
  this.getCase(powerIdx).draw();
}

var manaBoard = new Board(nameOfBordName[9], 900, 580, 20, 20);
manaBoard.create(10, 1, 3);
document.body.appendChild(manaBoard);
manaBoard.max = 0;
manaBoard.setText = function() {
  var currentMana = this.getMana();
  manaBoardText.innerHTML = 'Mana : ' + currentMana + '/' + this.max;
};
manaBoard.set = function(num) {
  if (num > this.cases.length) return;
  for (var i = 0; i < num; i++) {
    this.get(i).activate(true);
    this.max++;
  }
  this.display();
  this.setText();
};
manaBoard.add = function(num) {
  if (num > this.cases.length) return;
  for (var i = 0; i < num; i++) {
    this.get(i).activate(true);
  }
  this.display();
  this.setText();
};
manaBoard.fill = function() {
  for (var i = 0; i < allManaCartes.length; i++) {
    this.addClone(i, allManaCartes[i]);
  }
  this.setText();
};
manaBoard.clean = function() {
  for (var i = 0; i < this.cases.length; i++) {
    this.get(i).activate(false);
  }
};
manaBoard.reset = function() {
  for (var i = 0; i < this.cases.length; i++) {
    this.get(i).activate(false);
    this.max = 0;
  }
  this.display();
  this.setText();
};
manaBoard.remove = function(num) {
  var mymana = this.getMana();
  if (num > mymana) return;
  var newMana = mymana - num;
  this.setText();
  this.inactivateAll();
  this.add(newMana);
};
manaBoard.getMana = function() {
  var myMana = 0;
  for (var i = 0; i < this.cases.length; i++) {
    myMana += this.get(i).active ? 1 : 0;
  }
  return myMana;
};

var defausseAttack = new Board(nameOfBordName[10], 0, 150, 100, 150);
defausseAttack.create(1, 4, 0);
document.body.appendChild(defausseAttack);
defausseAttack.onclick = function() {
  if (selectedCarte.visible) {
    console.log("Select carte : " + this.selectedCarte);
  }
  selectedCarte.init();
  selectedCaseId = -1;
}
// fill the cartes
defausseAttack.addFirst = function(card){
  card.active = false;
  this.insertFirstCard(card);
  socket.emit('defausseattack', {
    game: gameName,
    player: playerName,
    defausse: this.getAll()
  });
}

var defausseDefense = new Board(nameOfBordName[11], 100, 150, 100, 150);
defausseDefense.create(1, 4, 0);
document.body.appendChild(defausseDefense);
defausseDefense.onclick = function() {
  if (selectedCarte.visible) {
    console.log("Select carte : " + this.selectedCarte);
  }
  selectedCarte.init();
  selectedCaseId = -1;
}
// fill the cartes
defausseDefense.addFirst = function(card){
  card.active = false;
  this.insertFirstCard(card);
  socket.emit('defaussedefense', {
    game: gameName,
    player: playerName,
    defausse: this.getAll()
  });
}

var timeCommandDiv = new gomassDiv(900, 400, 200, 40, 'timeCommand');
var timeText = document.createElement("h3");
timeCommandDiv.addElement(timeText);
timeCommandDiv.visible(false);
timeCommandDiv.set = function(sec) {
  timeText.innerHTML = sec;
}
var timeInter = setInterval(function () {setTextTime()}, 1000);
function setTextTime() {
  if (startTime) {
    if (currentTime > 0) {
      timeText.innerHTML = nameOfText[5] + ' : ' + currentTime;
      currentTime -= 1;
    }
    else { // time ended
      startTime = false;
      currentTime = 0;
      window.clearInterval(timeInter);
      // force end turn
      socket.emit('endturn', {
        name: gameName,
        player: playerName,
        opponent: opponentName
      });
      endTurnB.disabled = true;
      // reload
      timeInter = setInterval(function () {setTextTime()}, 1000);
    }
  }
}

var gameCommandsDiv = new gomassDiv(900, 480, 100, 70, 'gameCommands');
var endTurnB = new gomassButton("button",  nameOfButton[12]);
endTurnB.style.visibility = "hidden";
endTurnB.onclick = function() {
  socket.emit('endturn', {
    name: gameName,
    player: playerName,
    opponent: opponentName
  });
  endTurnB.disabled = true;
}
gameCommandsDiv.addElement(endTurnB);
var capitulB = new gomassButton("button",  nameOfButton[13]);
capitulB.style.visibility = "hidden";
capitulB.onclick = function() {
  socket.emit('surrender', {
    name: gameName,
    player: playerName
  });
  capitulB.disabled = true;
  startTime = false;
}
gameCommandsDiv.addElement(capitulB);
gameCommandsDiv.visible(false);
var manaBoardText = document.createElement("h4");
gameCommandsDiv.addElement(manaBoardText);

/////////////////////INITIAL CARD SELECTION BOARD/////////////////

var cardSelector = new Board(nameOfBordName[12], 300, 150, 100, 150);
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

var cardSelectorCommandsDiv = new gomassDiv(480, 320, 120, 34, 'cardSelectorCommands');
var finishSelectB = new gomassButton("button", nameOfButton[8]);
finishSelectB.style.visibility = "hidden";
finishSelectB.onclick = function() {
  socket.emit('removedhandcard', {
    player: playerName,
    iscreator: creator,
    myturn: myTurn,
    numbercard: cardSelector.numberOfCardAsked,
    room: gameName
  });
  console.log('ask for new cards');
}
cardSelectorCommandsDiv.addElement(finishSelectB);
var finishAllSelectB = new gomassButton("button", nameOfButton[9]);
finishAllSelectB.style.visibility = "hidden";
finishAllSelectB.onclick = function() {
  // clean selector
  cardSelector.clearAll();
  // ask for 3 cards
  socket.emit('removedhandcard', {
    player: playerName,
    iscreator: creator,
    myturn: myTurn,
    numbercard: 3,
    room: gameName
  });
  console.log('ask for all new cards');
}
cardSelectorCommandsDiv.addElement(finishAllSelectB);
cardSelectorCommandsDiv.visible(false);

///////////////////////DECK BUILDER BOARDS////////////////////////

var allCarte = new Board(nameOfBordName[13], 200, 150, 100, 150);
allCarte.create(5, 2, 0);
document.body.appendChild(allCarte);
allCarte.onclick = function() {
  if (selectedCarte.visible && !selectedCarte.selected) { // player select a carte to put on deck
    this.selectedCarte = selectedCarte.clone();
    // draw the selection
    this.selectCard(true, selectedCaseId, selectedCarte.id);
    // cast to mini & show
    var myMini = selectedCarte.clone();
    myMini.toMini();
    playerDeck.addLast(myMini);
    console.log("Select carte : " + this.selectedCarte);
  }
  selectedCarte.init();
  selectedCaseId = -1;
}
// fill the cartes array from server by page start to 0
allCarte.fill = function(page){
  var theCard;
  var idC = 0;
  var cardsByPage = 10;
  for (var id = page*cardsByPage; id < (page*cardsByPage)+cardsByPage ; id++) {
    theCard = this.getCarte(id);
    this.add(idC, theCard);
    idC++;
  }
}
allCarte.selectCard = function(on, caseId, cardId){
  if (on) {
    this.get(caseId).selected = true; // force to selected
    this.getByCarteId(cardId).selected = true; // force to selected
  }
  else {
    this.get(caseId).selected = false; // force to selected
    this.getByCarteId(cardId).selected = false; // force to selected
  }
  this.getCase(caseId).draw();
}

var carteCollection = new Board(nameOfBordName[14], 200, 150, 100, 150);
carteCollection.create(5, 3, 0);
document.body.appendChild(carteCollection);
carteCollection.cardsByPage = 15;
// show card in big
carteCollection.onclick = function() {
	console.log('carteCollection onclick');
  if (selectedCarte.visible) {
		bigCardView.clean();
		bigCardView.addClone(0, selectedCarte);
		// change carte to big
		var caseIdCarteCollection = this.getCaseByCarteId(selectedCarte.id);
		this.get(caseIdCarteCollection).setBig(true);
	}
  selectedCarte.init();
  selectedCaseId = -1;
}
// fill the cartes array from server by page start to 0
carteCollection.fill = function(page){
  var theCard;
  var idC = 0;
  for (var id = page * this.cardsByPage; id < (page * this.cardsByPage) + this.cardsByPage; id++) {
    theCard = this.getCarte(id);
    this.add(idC, theCard);
    idC++;
  }
}
carteCollection.selectCard = function(on, caseId, cardId){
  if (on) {
    if (caseId != undefined) {this.get(caseId).selected = true;} // force to selected
    if (cardId != undefined) {this.getByCarteId(cardId).selected = true;} // force to selected
  }
  else {
    if (caseId != undefined) {this.get(caseId).selected = false;} // force to selected
    if (cardId != undefined) {this.getByCarteId(cardId).selected = false;} // force to selected
  }
  if (caseId != undefined) {this.getCase(caseId).draw()};
}
// to remove a card from playerDeck
carteCollection.addEventListener('drop', function(evt) {
	console.log('carteCollection drop');
	evt.preventDefault(); // drop is possible
  if (dragStartBoardName == nameOfBordName[15] && dragCarte.visible) { // card must come from playerDeck board
		var carteId = dragCarte.id;
		var caseIdPlayerDeck = playerDeck.getCaseByCarteId(carteId);
		var caseIdCollectionDeck = this.getCaseByCarteId(carteId);
		// remove card from player deck
		playerDeck.remove(caseIdPlayerDeck);
		// unselect it
		this.selectCard(false, caseIdCollectionDeck, carteId);
		// update card number
		nbCardText.set(playerDeck.getNumberOfCardsVisible());
	}
	dragCarte.init();
	dragStartBoardName = "";
});
carteCollection.addEventListener('dragend', function(evt) {
	console.log('carteCollection dragend');
	evt.preventDefault(); // drop is possible
	dragCarte.init();
	dragStartBoardName = "";
  });
carteCollection.addEventListener('dragover', function(evt) {
	console.log('carteCollection dragover');
	evt.preventDefault(); // drop is possible
  });

var playerDeck = new Board(nameOfBordName[15], 750, 150, 100, 20);
playerDeck.create(1, maxDeckCarte, 1);
document.body.appendChild(playerDeck);
// show card selected card in big
playerDeck.onclick = function() {
	console.log('playerDeck onclick');
  if (selectedCarte.visible) {
		bigCardView.clean();
		bigCardView.addClone(0, selectedCarte);
		// change carte to big
		var caseIdPlayerDeck = this.getCaseByCarteId(selectedCarte.id);
		this.get(caseIdPlayerDeck).setBig(true);
  }
  selectedCarte.init();
  selectedCaseId = -1;
}
// fill the deck randomly
playerDeck.fill = function(isDraw) {
  var fid = 0;
  var srvCard;
  var miniCard;
  while (fid < this.cases.length) {
    if (!this.cases[fid].carte.visible) {
      // get a random carte from carteCollection
      srvCard = carteCollection.getRandom();
      miniCard = srvCard.clone();
      miniCard.toMini();
      if (isDraw) {
        this.addLast(miniCard);
      }
      else {
        this.addLastNoDraw(miniCard);
      }
    }
    fid++;
  }
}
// set the deck from sever cards
playerDeck.set = function(isDraw) {
  var fid = 0;
  var srvCard;
  var miniCard;
  var caseId;
  while (fid < this.cases.length) {
    srvCard = allDeckCartes[fid];
    miniCard = srvCard.clone();
    miniCard.toMini();
    if (isDraw) {this.addLast(miniCard);}
    else {this.addLastNoDraw(miniCard);}
    // select collection cards
    caseId = carteCollection.getCaseByCarteId(miniCard.id);
    carteCollection.selectCard(true, caseId, miniCard.id);
    fid++;
  }
}
playerDeck.change = function(deckid) {
  var fid = 0;
  if (deckid <= allDecks.length) {
    var currentDeck = allDecks[deckid];
    var csvdeck = currentDeck.cardIdList;
    var arraydeck = csvdeck.split(";");
    var currentCardId = 0;
    var currentCaseId = 0;
    var currentCard;
    var miniCard;
    // clear
    this.clearAll();
    carteCollection.selectAll(false);
    carteCollection.display();
    // add
    if (arraydeck.length > 0) {
      for (var i = 0; i < arraydeck.length; i++) {
        currentCardId = arraydeck[i];
        currentCard = allCollectionCartes[currentCardId];
        miniCard = currentCard.clone();
        miniCard.toMini();
        this.addLast(miniCard);
        currentCaseId = carteCollection.getCaseByCarteId(currentCardId);
        carteCollection.selectCard(true, currentCaseId, currentCardId);
      }
    }
  }
}
playerDeck.addEventListener('dragend', function(evt) {
	console.log('playerDeck dragend');
	evt.preventDefault(); // drop is possible
	dragCarte.init();
	dragStartBoardName = "";
  });
playerDeck.addEventListener('dragover', function(evt) {
	console.log('playerDeck dragover');
	evt.preventDefault(); // drop is possible
  });
// to add card to playerDeck
playerDeck.addEventListener('drop', function(evt) {
	console.log('playerDeck drop');
	evt.preventDefault(); // drop is possible
  if (dragStartBoardName == nameOfBordName[14] && dragCarte.visible && !dragCarte.selected) { // player select a carte to put on deck
    if (this.getNumberOfCardsVisible() < maxDeckCarte) { // no more cards to add
			var carteId = dragCarte.id;
			var miniCard = dragCarte.clone();
			// add card to playerDeck
			miniCard.toMini();
			this.addLast(miniCard);
			// select card from carteCollection
			var caseIdCarteCollection = carteCollection.getCaseByCarteId(carteId);
			carteCollection.selectCard(true, caseIdCarteCollection, carteId);
			// update card number
			nbCardText.set(playerDeck.getNumberOfCardsVisible());
		}
	}
  dragCarte.init();
	dragStartBoardName = "";
});
	
var bigCardView = new Board(nameOfBordName[16], 900, 380, 200, 300);
bigCardView.create(1, 1, 4);
document.body.appendChild(bigCardView);
bigCardView.clean = function() {
	var bigCarte = this.get(0);
	if (!bigCarte.isNull()) {
		// set big property to false
		if (this.boardName == "playerDeck") {
			playerDeck.get(bigCarte.id).setBig(false);
		}
		if (this.boardName == "carteCollection") {
			carteCollection.get(bigCarte.id).setBig(false);
		}
	}
	// remove the card
	this.remove(0);
}

var pageBoard = new gestionPage(200, 620);
pageBoard.create();
document.body.appendChild(pageBoard);
pageBoard.currentPage = 0;
pageBoard.onclick = function() {
  var cardNum = carteCollection.getNumberOfCards();
  if (selectedButton == buttonNameFr[14]) { // Next button
    if (cardNum > this.currentPage * carteCollection.cardsByPage + carteCollection.cardsByPage) {
      this.currentPage++;
      carteCollection.fill(this.currentPage);
    }
  }
  if (selectedButton == buttonNameFr[15]) { // Back button
    if (this.currentPage > 0) {
      this.currentPage--;
      carteCollection.fill(this.currentPage);
    }
  }
}

var deckBuilderCommandsDiv = new gomassDiv(900, 150, 150, 7*34, 'builderCommands');
var nameDeckT = new gomassButton("text", nameOfButton[17]);
nameDeckT.style.visibility = "hidden";
deckBuilderCommandsDiv.addElement(nameDeckT);
var listDecks = new gomassCombo("deckList");
listDecks.onchange = function() {
  // change deck name value
  nameDeckT.value = listDecks.getOption(listDecks.selectedIndex);
  // change deck
  playerDeck.change(listDecks.selectedIndex);
} 
listDecks.fill = function() {
  var i = 0;
  while (i < allDecks.length) {
    listDecks.addOption(allDecks[i].name);
    i++;
  }
  listDecks.selectedIndex = 0;
}
listDecks.addDeck = function(adeckname, deckid) {
  listDecks.addOption(adeckname);
}
deckBuilderCommandsDiv.addElement(listDecks);
var newB = new gomassButton("button", nameOfButton[11]);
newB.style.visibility = "hidden";
newB.onclick = function() {
  playerDeck.clearAll();
  carteCollection.selectAll(false);
  carteCollection.display();
}
deckBuilderCommandsDiv.addElement(newB);
var saveDeckB = new gomassButton("button", nameOfButton[18]);
saveDeckB.style.visibility = "hidden";
saveDeckB.onclick = function() {
    // check if deck is complete
  if (!playerDeck.isComplete()) {
    playerDeck.fill(false);
  }
  // unselect all
  playerDeck.selectAll(false);
  // get all and change type
  var myDeck = playerDeck.changeCardType('Normal');
  console.log(myDeck);
  // save deck
  socket.emit('savedeck', {
    player: playerName,
    deck: myDeck,
    deckname: nameDeckT.value
  });
}
deckBuilderCommandsDiv.addElement(saveDeckB);
var delDeckB = new gomassButton("button", nameOfButton[19]);
delDeckB.style.visibility = "hidden";
delDeckB.onclick = function() {
  var ideckid = listDecks.selectedIndex;
  var ideckname = nameDeckT.value;
  // unselect all
  playerDeck.selectAll(false);
  // delete deck
  socket.emit('deldeck', {
    player: playerName,
    deckid: ideckid,
    deckname: ideckname
  });
}
deckBuilderCommandsDiv.addElement(delDeckB);
var finishDeckB = new gomassButton("button", nameOfButton[10]);
finishDeckB.style.visibility = "hidden";
finishDeckB.onclick = function() {
  // check if deck is complete
  if (!playerDeck.isComplete()) {
    playerDeck.fill(false);
  }
  // unselect all
  playerDeck.selectAll(false);
  // get all and change type
  var myDeck = playerDeck.changeCardType('Normal');
  console.log(myDeck);
  // save deck
  socket.emit('savedeck', {
    player: playerName,
    deck: myDeck,
    deckname: nameDeckT.value
  });
  // send deck to server
  socket.emit('deck', {
    player: playerName,
    deck: myDeck,
    deckname: nameDeckT.value
  });
  // hide finish and clear buttons
  this.hide(true);
  newB.hide(true);
}
deckBuilderCommandsDiv.addElement(finishDeckB);
deckBuilderCommandsDiv.visible(false);
var nbCardText = document.createElement("p");
nbCardText.set = function(nbcard) {
	this.style.marginLeft = 6;
  this.innerHTML = nameOfText[7] + " : <b>" + nbcard + "</b> / 30";
}
deckBuilderCommandsDiv.addElement(nbCardText);

//////////////////////PLAYER SELECTION BOARD////////////////////////

var playerSelector = new Board(nameOfBordName[17], 250, 150, 100, 150);
playerSelector.create(4, 1, 0);
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

///////////////////////USEFULL FUNCTION////////////////////////////

// return 0 if no card on hand
function cardOnHand() {
  if (player.selectedCarte.visible) return 1;
  else if (playerHand.selectedCarte.visible) return 2;
  else if (playerBoard.selectedCarte.visible) return 3;
  else if (playerPower.selectedCarte.visible) return 4;
  else return 0;
}

function cleanHand(except) {
  if (except != playerHand.id) {playerHand.initSelectedCarte();}
  if (except != playerBoard.id) {playerBoard.initSelectedCarte();}
  if (except != opponentBoard.id) {opponentBoard.initSelectedCarte();}
  if (except != opponentHand.id) {opponentHand.initSelectedCarte();}
  if (except != opponent.id) {opponent.initSelectedCarte();}
  if (except != player.id) {player.initSelectedCarte();}
  if (except != playerPower.id) {playerPower.initSelectedCarte();}
  if (except != opponentPower.id) {opponentPower.initSelectedCarte();}
}

function showDeckBuilder(on) {
  carteCollection.display();
  carteCollection.setVisibility(on);
  playerDeck.set(on);
  playerDeck.setVisibility(on);
  bigCardView.setVisibility(on);
  pageBoard.visible(on);
  deckBuilderCommandsDiv.visible(on);
  if (on) {
    nameDeckT.value = currentPlayerDeckName;
    listDecks.fill();
    carteCollection.fill(0);
		nbCardText.set(playerDeck.getNumberOfCardsVisible());
  }
}

function resetDeckBuilder() {
  carteCollection.initCartes();
  playerDeck.initCartes();
}

function showGameBoards(on) {
  opponentHand.setVisibility(on);
  opponentBoard.setVisibility(on);
  playerBoard.setVisibility(on);
  playerHand.setVisibility(on);
  opponent.setVisibility(on);
  player.setVisibility(on);
  playerPower.setVisibility(on);
  opponentPower.setVisibility(on);
  manaBoard.setVisibility(on);
  defausseAttack.setVisibility(on);
  defausseDefense.setVisibility(on);
  select.setVisibility(on);
}

function resetGameBoards() {
  opponentHand.initCartes();
  opponentBoard.initCartes();
  playerBoard.initCartes();
  playerHand.initCartes();
  manaBoard.initCartes();
  opponent.initCartes();
  player.initCartes();
  cardSelector.initCartes();
  cardSelector.numberOfCardAsked = 0;
  playerPower.initCartes();
  opponentPower.initCartes();
  defausseAttack.initCartes();
  defausseDefense.initCartes();
  select.initCartes();
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
  if (name == carteCollection.id) return carteCollection;
  if (name == playerDeck.id) return playerDeck;
  if (name == playerSelector.id) return playerSelector;
  if (name == playerPower.id) return playerPower;
  if (name == opponentPower.id) return opponentPower;
  if (name == select.id) return select;
  return;
}

function InvocateCard(onBoard, card, caseId) {
  var board = getBoard(onBoard);
  board.add(caseId, card);
  console.log('New invocation at case id : ' + caseId);
  // emit message
  socket.emit('newcarte', {
    player: playerName,
    dstboard: onBoard,
    caseId: caseId,
    carte: card,
    game: gameName
  });
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
  if (attCarte.type == 'Spell') {
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
          player: playerName,
          creator: creator
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

function applyEquipmentEffect(attackerBoard, attackerCaseId, defenderBoard, defenderCaseId) {
  var attBoard = getBoard(attackerBoard);
  var defBoard = getBoard(defenderBoard);
  var attCarte = attBoard.get(attackerCaseId);
  var defCarte = defBoard.get(defenderCaseId);
  socket.emit('cardplayed', {
    game: gameName,
    player: playerName
  });
  defCarte.applyEquipment(attCarte.equipement);
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
  // draw all changes
  attBoard.getCase(attackerCaseId).draw();
  defBoard.getCase(defenderCaseId).draw();
}

// attaque sans perte de vie
function resolveAttackOpponent(attackerBoard, attackerCaseId) {
  var attBoard = getBoard(attackerBoard);
  var defBoard = getBoard('opponent');
  var attCarte = attBoard.get(attackerCaseId);
  var defCarte = defBoard.get(0);
  var defDefense = defCarte.defense - attCarte.attaque;
  var defLife = defCarte.vie;
  if (defDefense < 0) {
    defLife = defCarte.vie + defDefense;
    defCarte.defense = 0;
  }
  else {defCarte.defense = defDefense;}
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
      player: playerName,
      creator: creator
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

  attCarte.active = false; // inactive attack carte
  if (attCarte.etat.hide) { // unhidden
    attCarte.etat.hide = false;
  }
  if (defCarte.etat.divine) { // it's not a divine carte
    defLife = defCarte.vie;
    defDefense = defCarte.defense;
    defCarte.etat.divine = false;
  }
  if (attCarte.etat.divine) { // it's not a divine carte
    attLife = attCarte.vie;
    attDefense = attCarte.defense;
    attCarte.etat.divine = false;
  }
  if (attCarte.etat.fury > 0) {
    attCarte.active = true;
    attCarte.etat.fury--;
  }
  // resolve fight
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
  // apply for defender
  if (defLife <= 0) {
    if (defCarte.effet.declencheur == 'Die') { // apply effect on Die
      // in this case we have to translate board
      if (defCarte.effet.impact == 'player') {
        applySpellEffect(defenderBoard, defenderCaseId, 'opponent', 0);
      }
      if (defCarte.effet.impact == 'opponent') {
        applySpellEffect(defenderBoard, defenderCaseId, 'player', 0);
      }
    }
    // the opponent is dead
    if (defCarte.type == 'Player') {
      // send the end game message
      socket.emit('endgame', {
        name: gameName,
        player: opponentName,
        creator: creator
      });
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
    if (defCarte.effet.declencheur == 'Defense') { // apply effect on Defense
      if (defCarte.effet.impact == 'playerBoard') {
        applySpellEffect(defenderBoard, defenderCaseId, defenderBoard, defenderCaseId);
      }
      if (defCarte.effet.impact == 'opponentBoard') {
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
  // apply for attacker
  if (attLife <= 0) { // attack is dead
    if (attCarte.effet.declencheur == 'Die') { // apply effect on Die
      if (attCarte.effet.impact == 'player') {
        applySpellEffect(attackerBoard, attackerCaseId, 'player', 0);
      }
      if (attCarte.effet.impact == 'opponent') {
        applySpellEffect(attackerBoard, attackerCaseId, 'opponent', 0);
      }
    }
    // the player is dead
    if (attCarte.type == 'Player') {
      // send the end game message
      socket.emit('endgame', {
        name: gameName,
        player: playerName,
        creator: creator
      });
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
      if (attCarte.effet.impact == 'playerBoard') {
        applySpellEffect(attackerBoard, attackerCaseId, attackerBoard, attackerCaseId);
      }
      if (attCarte.effet.impact == 'opponentBoard') {
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
  if (srvCard.effet != undefined) {
    var cltCardEffect = new Effet(srvCard.effet.id, srvCard.effet.zone, srvCard.effet.impact, 
    srvCard.effet.declencheur, srvCard.effet.modifAttack, srvCard.effet.modifDefense, 
    srvCard.effet.modifVie, srvCard.effet.description);
  }
  else {
    var cltCardEffect = new Effet();
  }
  if (srvCard.etat != undefined) {
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
  srvCard.selected, srvCard.showInBig, srvCard.special, cltCardEffect, cltCardEtat, cltCardEquipment);
  // set the description
  cltCard.setDescription();
  return cltCard;
}
console.log('Finish gomassBoard.js');