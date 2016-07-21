function loadCartes() {
  var c;
  for (var id = 0; id < maxCartes; id++) {
    var cardName = getName(5, 9, '', '');
    if (id >= 0 && id < 9) {
      c = new Carte(id, 'Normal', 'Invocation', 0, true, 1, 1, 1, 1, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 9 && id < 13) {
      c = new Carte(id, 'Normal', 'Spell', 0, true, 1, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 13 && id < 15) {
      c = new Carte(id, 'Normal', 'Equipment', 0, true, 1, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 15 && id < 24) {
      c = new Carte(id, 'Normal', 'Invocation', 1, true, 2, 2, 1, 2, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 24 && id < 28) {
      c = new Carte(id, 'Normal', 'Spell', 1, true, 2, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 28 && id < 30) {
      c = new Carte(id, 'Normal', 'Equipment', 1, true, 2, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 30 && id < 39) {
      c = new Carte(id, 'Normal', 'Invocation', 2, true, 3, 3, 1, 3, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 39 && id < 43) {
      c = new Carte(id, 'Normal', 'Spell', 2, true, 3, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 43 && id < 45) {
      c = new Carte(id, 'Normal', 'Equipment', 2, true, 3, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 45 && id < 54) {
      c = new Carte(id, 'Normal', 'Invocation', 3, true, 4, 4, 1, 4, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 54 && id < 58) {
      c = new Carte(id, 'Normal', 'Spell', 3, true, 4, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 58 && id < 60) {
      c = new Carte(id, 'Normal', 'Equipment', 3, true, 4, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 60 && id < 69) {
      c = new Carte(id, 'Normal', 'Invocation', 4, true, 5, 5, 1, 5, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 69 && id < 73) {
      c = new Carte(id, 'Normal', 'Spell', 4, true, 5, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 73 && id < 75) {
      c = new Carte(id, 'Normal', 'Equipment', 4, true, 5, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 75 && id < 84) {
      c = new Carte(id, 'Normal', 'Invocation', 5, true, 6, 6, 1, 6, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 84 && id < 88) {
      c = new Carte(id, 'Normal', 'Spell', 5, true, 6, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 88 && id < 90) {
      c = new Carte(id, 'Normal', 'Equipment', 5, true, 6, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 90 && id < 99) {
      c = new Carte(id, 'Normal', 'Invocation', 6, true, 7, 7, 1, 7, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 99 && id < 103) {
      c = new Carte(id, 'Normal', 'Spell', 6, true, 7, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 103 && id < 105) {
      c = new Carte(id, 'Normal', 'Equipment', 6, true, 7, 0, 0, 0, cardName);
      doEquipement(c);
    }
    if (id >= 105 && id < 114) {
      c = new Carte(id, 'Normal', 'Invocation', 7, true, 8, 8, 1, 8, cardName);
      doEtat(c);
      doInvocEffet(c);
    }
    if (id >= 114 && id < 118) {
      c = new Carte(id, 'Normal', 'Spell', 7, true, 8, 0, 0, 0, cardName);
      doSpellEffet(c);
    }
    if (id >= 118 && id < 120) {
      c = new Carte(id, 'Normal', 'Equipment', 7, true, 8, 0, 0, 0, cardName);
      doEquipement(c);
    }
    allCartes.push(c);
    console.log('push a new carte : '+ c);
  }
}

function doEtat(carte) {
  var hasard = Math.floor(Math.random() * 100);
  var defense = -1;
  var attack = -1;
  if (hasard < 10) {
    carte.special = 'Provocate';
    carte.etat.provoke = true;
    if (carte.cout > 0 && carte.cout < 5) {malus(-1, 1, 0);}
    else {malus(-2, 2, 0);}
  }
  if (hasard >= 10 && hasard < 20) {
    carte.special = 'Fury';
    carte.etat.activeFury();
    if (carte.cout > 0 && carte.cout < 5) {malus(0, -1, -1);}
    else {malus(-1, -1, -2);}
  }
  if (hasard >= 20 && hasard < 30) {
    carte.special = 'Divine';
    carte.etat.divine = true;
    if (carte.cout > 0 && carte.cout < 5) {malus(-1, 0, 0);}
    else {malus(-2, 0, 0);}
  }
  if (hasard >= 30 && hasard < 40) {
    carte.special = 'Hide';
    carte.etat.hide = true;
    if (carte.cout > 0 && carte.cout < 5) {malus(0, -1, -1);}
    else {malus(0, -1, -2);}
  }
  if (hasard >= 40 && hasard < 50) {
    carte.special = 'Charge';
    carte.etat.charge = true;
    if (carte.cout > 0 && carte.cout < 5) {malus(0, -1, -1);}
    else {malus(0, -1, -2);}
  }
  function malus(att, def, vie) {
    var a = carte.attaque + att;
    var d = carte.defense + def;
    var v = carte.vie + vie;
    if (a >= 0) {carte.attaque = a;}
    else {carte.attaque = 0;}
    if (d >= 0) {carte.defense = d;}
    else {carte.defense = 0;}
    if (v > 0) {carte.vie = v;}
    else {carte.vie = 1;}
  };
}

function doInvocEffet(carte) {
  var isSpell = Math.floor(Math.random() * 100);  // [0, 99]
  var zone = Math.floor(Math.random() * 100);
  var impact = Math.floor(Math.random() * 100);
  var declencheur = Math.floor(Math.random() * 100);
  var typeModif = Math.floor(Math.random() * 100);
  var singleBonus = parseInt(carte.cout);
  var multiBonus = Math.round(singleBonus/2);
  var isPair = Math.pow(-1, singleBonus); // true if > 0
  var bonusTab = []; //store calculated bonus
  var spell = carte.effet;
  spell.id = carte.id;
  // 30% of chance to get invocation with spell
  if (isSpell < 30) {
    if (declencheur < 20) { // 'Attack'
      spell.declencheur = 'Attack';
      if (isPair > 0) {
        if (zone < 70) {spell.zone = 'Multi';}
        else {spell.zone = 'Single';}
      }
      else {
        if (zone < 70) {spell.zone = 'Single';}
        else {spell.zone = 'Multi';}
      }
      if (impact < 50) {spell.impact = 'opponentBoard';}
      else {spell.impact = 'playerBoard';}
    }
    else if (declencheur < 40) { // 'Defense'
      spell.declencheur = 'Defense';
      if (isPair > 0) {
        if (zone < 70) {spell.zone = 'Multi';}
        else {spell.zone = 'Single';}
      }
      else {
        if (zone < 70) {spell.zone = 'Single';}
        else {spell.zone = 'Multi';}
      }
      if (impact < 50) {spell.impact = 'opponentBoard';}
      else {spell.impact = 'playerBoard';}
    }
    else if (declencheur < 60) { // 'Activated'
      spell.declencheur = 'Activated';
      spell.zone = 'Single';
      spell.impact = 'mySelf';
    }
    else if (declencheur < 80) { // 'Played'
      spell.declencheur = 'Played';
      spell.zone = 'Single';
      spell.impact = 'mySelf';
    }
    else { // 'Die'
      spell.declencheur = 'Die';
      spell.zone = 'Single';
      if (impact < 50) {spell.impact = 'opponent';}
      else {spell.impact = 'player';}
    }
    if (typeModif < 33) { // Attack
      malus(-1, 0, 0);
      // bonus for player
      if (spell.impact == 'player' || spell.impact == 'playerBoard' || spell.impact == 'mySelf') {
        if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'attack');}
        else {bonusTab = calculBonus(multiBonus, 'attack');}
        spell = applyBonus(spell, bonusTab, true);
      }
      // malus for opponent
      else if (spell.impact == 'opponent' || spell.impact == 'opponentBoard') {
        if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'attack');}
        else {bonusTab = calculBonus(multiBonus, 'attack');}
        spell = applyBonus(spell, bonusTab, false);
      }
    }
    else if (typeModif < 66) { // Defense
      malus(0, -1, 0);
      // bonus for player
      if (spell.impact == 'player' || spell.impact == 'playerBoard' || spell.impact == 'mySelf') {
        if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'defence');}
        else {bonusTab = calculBonus(multiBonus, 'defence');}
        spell = applyBonus(spell, bonusTab, true);
      }
      // malus for opponent
      else if (spell.impact == 'opponent' || spell.impact == 'opponentBoard') {
        if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'defence');}
        else {bonusTab = calculBonus(multiBonus, 'defence');}
        spell = applyBonus(spell, bonusTab, false);
      }
    }
    else { // Life
      malus(0, 0, -1);
      // bonus for player
      if (spell.impact == 'player' || spell.impact == 'playerBoard' || spell.impact == 'mySelf') {
        if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'life');}
        else {bonusTab = calculBonus(multiBonus, 'life');}
        spell = applyBonus(spell, bonusTab, true);
      }
      // malus for opponent
      else if (spell.impact == 'opponent' || spell.impact == 'opponentBoard') {
        if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'life');}
        else {bonusTab = calculBonus(multiBonus, 'life');}
        spell = applyBonus(spell, bonusTab, false);
      }
    }
    carte.setDescription();
  }
  function malus(att, def, vie) {
    var a = carte.attaque + att;
    var d = carte.defense + def;
    var v = carte.vie + vie;
    if (a >= 0) {carte.attaque = a;}
    else {carte.attaque = 0;}
    if (d >= 0) {carte.defense = d;}
    else {carte.defense = 0;}
    if (v > 0) {carte.vie = v;}
    else {carte.vie = 1;}
  };
}

function doSpellEffet(carte) {
  var zone = Math.floor(Math.random() * 100); // [0, 99]
  var impact = Math.floor(Math.random() * 100);
  var declencheur = Math.floor(Math.random() * 100);
  var typeModif = Math.floor(Math.random() * 100);
  var bonusSign = Math.floor(Math.random() * 100);
  var singleBonus = parseInt(carte.cout);
  var multiBonus = Math.round(singleBonus/2);
  var isPair = Math.pow(-1, singleBonus); // true if > 0
  var bonusTab = []; //store calculated bonus
  var spell = carte.effet;
  spell.id = carte.id;
  // Zone
  if (isPair > 0 && zone < 70) {spell.zone = 'Multi';}
  else if (isPair > 0) {spell.zone = 'Single';}
  else if (isPair < 0 && zone < 70) {spell.zone = 'Single';}
  else {spell.zone = 'Multi';}
  // Impact
  spell.impact = 'any';
  // choose bonus categories
  if (typeModif < 33) { // Attack
    // bonus
    if (bonusSign < 50) {
      if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'attack');}
      else {bonusTab = calculBonus(multiBonus, 'attack');}
      spell = applyBonus(spell, bonusTab, true);
    }
    // malus
    else {
      if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'attack');}
      else {bonusTab = calculBonus(multiBonus, 'attack');}
      spell = applyBonus(spell, bonusTab, false);
    }
  }
  else if (typeModif < 66) { // Defence
    // bonus
    if (bonusSign < 50) {
      if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'defence');}
      else {bonusTab = calculBonus(multiBonus, 'defence');}
      spell = applyBonus(spell, bonusTab, true);
    }
    // malus
    else {
      if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'defence');}
      else {bonusTab = calculBonus(multiBonus, 'defence');}
      spell = applyBonus(spell, bonusTab, false);
    }
  }
  else { // Life
    // bonus
    if (bonusSign < 50) {
      if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'life');}
      else {bonusTab = calculBonus(multiBonus, 'life');}
      spell = applyBonus(spell, bonusTab, true);
    }
    // malus
    else {
      if (spell.zone == 'Single') {bonusTab = calculBonus(singleBonus, 'life');}
      else {bonusTab = calculBonus(multiBonus, 'life');}
      spell = applyBonus(spell, bonusTab, false);
    }
  }
  // all spell are immediate and any
  spell.declencheur = 'Immediat';
  carte.attaque = spell.modifAttack;
  carte.defense = spell.modifDefense;
  carte.vie = spell.modifVie;
  carte.effet = spell;
  carte.setDescription();
}

function calculBonus(originalBonus, typeOfBonus) {
  var diff = originalBonus;
  var attackBonus = 0;
  var defenceBonus = 0;
  var lifeBonus = 0;
  if (typeOfBonus == 'attack') {
    attackBonus = Math.floor(Math.random() * diff) + 1;
    diff -= attackBonus;
    if (diff >= 1) {
      defenceBonus = Math.floor(Math.random() * diff) + 1;
      diff -= defenceBonus;
    }
    if (diff > 0) {
      lifeBonus = diff;
    }
  }
  if (typeOfBonus == 'defence') {
    defenceBonus = Math.floor(Math.random() * diff) + 1;
    diff -= defenceBonus;
    if (diff >= 1) {
      lifeBonus = Math.floor(Math.random() * diff) + 1;
      diff -= lifeBonus;
    }
    if (diff > 0) {
      attackBonus = diff;
    }
  }
  if (typeOfBonus == 'life') {
    lifeBonus = Math.floor(Math.random() * diff) + 1;
    diff -= lifeBonus;
    if (diff >= 1) {
      attackBonus = Math.floor(Math.random() * diff) + 1;
      diff -= attackBonus;
    }
    if (diff > 0) {
      defenceBonus = diff;
    }
  }
  return [attackBonus, defenceBonus, lifeBonus];
}
function applyBonus(theSpell, bonusArray, positive) {
  if (positive) {
    theSpell.modifAttack += bonusArray[0];
    theSpell.modifDefense += bonusArray[1];
    theSpell.modifVie += bonusArray[2];
  }
  else {
    theSpell.modifAttack -= bonusArray[0];
    theSpell.modifDefense -= bonusArray[1];
    theSpell.modifVie -= bonusArray[2];
  }
  return theSpell;
}

function doEquipement(carte) {
  var hasard = Math.floor(Math.random() * 100);
  var impact = Math.floor(Math.random() * 100);
  var armorBonus = parseInt(carte.cout);
  var weaponBonus = Math.round(armorBonus/2);
  var durability = Math.round(weaponBonus/2);
  if (durability <= 0) {durability = 0;}
  if (carte.type == 'Equipment') {
    var equip = carte.equipement;
    equip.id = carte.id;
    if (hasard < 50) {
      equip.type = 'Weapon';
      equip.durability = durability;
      equip.modifAttack = weaponBonus;
    }
    else {
      equip.type = 'Armor';
      equip.modifDefense = armorBonus;
    }
    if (impact < 20) {equip.impact = 'opponentBoard';}
    else if (impact < 40) {equip.impact = 'playerBoard';}
    else if (impact < 60) {equip.impact = 'opponent';}
    else if (impact < 80) {equip.impact = 'player';}
    else {equip.impact = 'any';}
    equip.impact = 'player'; // only for player
    carte.attaque = equip.modifAttack;
    carte.defense = equip.modifDefense;
    carte.equipement = equip;
    carte.setDescription();
  }
}
//-----------------------------------------------------------
//random name generator from
//http://leapon.net/files/namegen.html
//-----------------------------------------------------------
function getName(minlength, maxlength, prefix, suffix) {
  prefix = prefix || '';
  suffix = suffix || '';
  //these weird character sets are intended to cope with the nature of English (e.g. char 'x' pops up less frequently than char 's')
  //note: 'h' appears as consonants and vocals
  var vocals = 'aeiouyh' + 'aeiou' + 'aeiou';
  var cons = 'bcdfghjklmnpqrstvwxz' + 'bcdfgjklmnprstvw' + 'bcdfgjklmnprst';
  var allchars = vocals + cons;
  var length = rnd(minlength, maxlength) - prefix.length - suffix.length;
  var touse = '';
  if (length < 1) length = 1;
  var consnum = 0;
  if (prefix.length > 0) {
    for (var i = 0; i < prefix.length; i++) {
      if (consnum == 2) {consnum = 0;}
      if (cons.indexOf(prefix[i]) != -1) {consnum++;}
    }
  }
  else {
    consnum = 1;
  }
  var name = prefix;
  for (var i = 0; i < length; i++) {
    //if we have used 2 consonants, the next char must be vocal.
    if (consnum == 2) {
      touse = vocals;
      consnum = 0;
    }
    else {touse = allchars;}
    //pick a random character from the set we are goin to use.
    var c = touse.charAt(rnd(0, touse.length - 1));
    name = name + c;
    if (cons.indexOf(c) != -1) {consnum++;}
  }
  name = name.charAt(0).toUpperCase() + name.substring(1, name.length) + suffix;
  return name;
}
function rnd(minv, maxv){
  if (maxv < minv) return 0;
  return Math.floor(Math.random()*(maxv-minv+1)) + minv;
}