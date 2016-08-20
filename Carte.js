'use strict';
console.log('Start Carte.js');
// Carte prototype.
function Carte(id, typeImg, type, imgid, visible, cout, att, def, vie, titre, desc, active, selected, showInBig, special, effet, etat, equipement) {
  if (id != undefined){this.id = id;}
  else {this.id = Carte.prototype.id;}
  if (imgid != undefined){this.imgid = imgid;}
  else {this.imgid = Carte.prototype.imgid;}
  if (type == 'Invocation' || type == 'Spell' || type == 'Equipment' || type == 'Player' || type == 'PlayerSpell' || type == 'Mana') {this.type = type;}
  else {this.type = Carte.prototype.type;}
  if (cout != undefined){this.cout = cout;}
  else {this.cout = Carte.prototype.cout;}
  if (att != undefined){this.attaque = att;}
  else {this.attaque = Carte.prototype.attaque;}
  if (def != undefined){this.defense = def;}
  else {this.defense = Carte.prototype.defense;}
  if (vie != undefined){this.vie = vie;}
  else {this.vie = Carte.prototype.vie;}
  if (titre != undefined){this.titre = titre;}
  else {this.titre = Carte.prototype.titre;}
  if (desc != undefined){this.description = desc;}
  else {this.description = Carte.prototype.description;}
  if (special != undefined){this.special = special;}
  else {this.special = Carte.prototype.special;}
  if (visible != undefined){this.visible = visible;}
  else {this.visible = Carte.prototype.visible;}
  if (active != undefined){this.active = active;}
  else {this.active = Carte.prototype.active;}
  if (selected != undefined){this.selected = selected;}
  else {this.selected = Carte.prototype.selected;}
  if (showInBig != undefined){this.showInBig = showInBig;}
  else {this.showInBig = Carte.prototype.showInBig;}
  if (effet != undefined){this.effet = effet;}
  else {this.effet = new Effet();}
  if (etat != undefined){this.etat = etat;}
  else {this.etat = new Etat();}
  if (equipement != undefined){this.equipement = equipement;}
  else {this.equipement = new Equipement();}
  if (typeImg == 'Normal' || typeImg == 'Mini' ||
      typeImg == 'Black' || typeImg == 'White') {
    this.typeimg = typeImg;
    if (typeImg == 'Normal') {
      if (this.type == 'Invocation') {
        this.activeColor = allCartesColorsOn[this.imgid];
        this.inactiveColor = allCartesColorsOn[this.imgid];
      }
      else if (this.type == 'Spell') {
        this.activeColor = allCartesColorsOn[this.imgid];
        this.inactiveColor = allCartesColorsOn[this.imgid];
      }
      else if (this.type == 'Equipment') {
        this.activeColor = allCartesColorsOn[this.imgid];
        this.inactiveColor = allCartesColorsOn[this.imgid];
      }
      else if (this.type == 'Player') {
        this.activeColor = allPlayersColorsOn[this.imgid];
        this.inactiveColor = allPlayersColorsOn[this.imgid];
      }
      else if (this.type == 'PlayerSpell') {
        this.activeColor = allPlayersColorsOn[this.imgid];
        this.inactiveColor = allPlayersColorsOff[this.imgid];
      }
      else if (this.type == 'Mana') {
        this.activeColor = manaColorsOn[this.imgid];
        this.inactiveColor = manaColorsOff[this.imgid];
      }
      else {
        this.activeColor = Carte.prototype.activeColor;
        this.inactiveColor = Carte.prototype.inactiveColor;
      }
    }
    else if (typeImg == 'Mini') {
      this.activeColor = allCartesColorsOn[this.imgid];
      this.inactiveColor = allCartesColorsOn[this.imgid];
    }
    else if (typeImg == 'Black') {
      this.activeColor = "rgb(77,77,77)";
      this.inactiveColor = "rgb(77,77,77)";
    }
    else if (typeImg == 'White') {
      this.activeColor = "white";
      this.inactiveColor = "white";
    }
  }
  else {this.typeimg = Carte.prototype.typeimg;}
  // set card gradien
  this.gradieny1 = Math.floor(Math.random() * 150);  // [0, 149]
  this.gradieny2 = Math.floor(Math.random() * 150);  // [0, 149]

  this.clone = function() {
    var copy = this.constructor();
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) {
          copy[attr] = this[attr];
        }
    }
    return copy;
  };
  this.toString = function() {
    return "Carte : " + "id : " + this.id + " - " + "cout : " + this.cout + " - " + "attaque: " + this.attaque
            + " - " + "defense: " + this.defense + " - " + "vie: " + this.vie + " - " + "titre: " + this.titre + " - " + "description: " + this.description
            + " - " + "visible: " + this.visible  + " - " + "active: " + this.active  + " - " + "typeimg: " + this.typeimg
            + " - " + "type : " + this.type + '|| ' + this.effet.toString() + '|| ' + this.etat.toString() + '|| ' + this.equipement.toString();
  };
  this.equal = function(other) {
    if (this.id == other.id && 
    this.imgid == other.imgid && 
    this.typeimg == other.typeimg && 
    this.type == other.type &&
    this.visible == other.visible &&
    this.cout == other.cout &&
    this.attaque == other.attaque &&
    this.defense == other.defense &&
    this.vie == other.vie &&
    this.titre == other.titre &&
    this.description == other.description &&
    this.special == other.special) return true;
    else return false;
  };
  this.init = function() {
    this.id = -1;
    this.visible = false;
    this.activeColor = "white";
    this.inactiveColor = "white";
    this.imgid = 0;
    this.typeimg = 'Normal'; // Normal | Mini
    this.type = ''; // 'Invocation' | 'Spell' | 'Equipment' | 'Player' | PlayerSpell | Mana
    this.cout = 0;
    this.attaque = 0;
    this.defense = 0;
    this.vie = 0;
    this.titre = "";
    this.description = "";
    this.special = "";
    this.active = false;
    this.selected = false;
    this.showInBig = false;
    this.effet = new Effet();
    this.etat = new Etat();
    this.equipement = new Equipement();
  };
  this.activate = function(on) {
    this.active = on;
  };
  this.setBig = function(on) {
    this.showInBig = on;
  };
  this.toMini = function() {
    this.typeimg = 'Mini';
    this.activeColor = allCartesColorsOn[this.imgid];
    this.inactiveColor = allCartesColorsOn[this.imgid];
  };
  this.applyEffect = function(effect) {
    if (effect.modifAttack != 0) {this.attaque += effect.modifAttack;}
    if (this.attaque < 0) {this.attaque = 0;}
    if (effect.modifDefense != 0) {this.defense += effect.modifDefense;}
    if (this.defense < 0) {this.defense = 0;}
    if (effect.modifVie < 0) {
      var defense = this.defense + effect.modifVie;
      var life = this.vie;
      if (defense >= 0) {
        this.defense = defense;
      }
      else {
        life += defense;
        this.defense = 0;
      }
      if (life > 0) {
        this.vie = life;
      }
      else {
        this.vie = 0;
      }
    }
    else {
      this.vie += effect.modifVie;
    }
  };
  this.applyEquipment = function(equipment) {
    this.attaque += equipment.modifAttack;
    if (this.attaque < 0) {this.attaque = 0;}
    this.defense += equipment.modifDefense;
    if (this.defense < 0) {this.defense = 0;}
  };
  this.toNormal = function() {
    this.typeimg = 'Normal';
    if (this.type == 'Invocation') {
      this.activeColor = allCartesColorsOn[this.imgid];
      this.inactiveColor = allCartesColorsOn[this.imgid];
    }
    else if (this.type == 'Spell') {
      this.activeColor = allCartesColorsOn[this.imgid];
      this.inactiveColor = allCartesColorsOn[this.imgid];
    }
    else if (this.type == 'Equipment') {
      this.activeColor = allCartesColorsOn[this.imgid];
      this.inactiveColor = allCartesColorsOn[this.imgid];
    }
    else if (this.type == 'Player') {
      this.activeColor = allPlayersColorsOn[this.imgid];
      this.inactiveColor = allPlayersColorsOn[this.imgid];
    }
    else {
      this.activeColor = Carte.prototype.activeColor;
      this.inactiveColor = Carte.prototype.inactiveColor;
    }
  };
  this.isNull = function() {
    if (this.id == -1) {return true;}
    else {return false;}
  };
  this.setDescription = function() {
    this.description = "";
    if (this.type == 'Invocation') {
      // line 0&1
      if (this.effet.declencheur != '') {
        this.description += 'Event : ;';
        if (this.effet.declencheur == 'Attack') {this.description += 'On Attack;';}
        else if (this.effet.declencheur == 'Die') {this.description += 'On Die;';}
        else if (this.effet.declencheur == 'Defense') {this.description += 'On Defense;';}
        else if (this.effet.declencheur == 'Activated') {this.description += 'On Activated;';}
        else if (this.effet.declencheur == 'Played') {this.description += 'On Played;';}
      }
      // line 2&3
      if (this.effet.zone != '') {
        this.description += 'Type of zone : ;';
        if (this.effet.zone == 'Single') {this.description += 'Zone Single;';}
        else if (this.effet.zone == 'Multi') {this.description += 'Zone Multi;';}
      }
      // line 4&5
      if (this.effet.impact != '') {
        this.description += 'Impacted zone : ;';
        if (this.effet.impact == 'playerBoard') {this.description += 'on playBoard;';}
        else if (this.effet.impact == 'opponentBoard') {this.description += 'on oppoBoard;';}
        else if (this.effet.impact == 'player') {this.description += 'on player;';}
        else if (this.effet.impact == 'opponent') {this.description += 'on opponent;';}
        else if (this.effet.impact == 'any') {this.description += 'on any;';}
        else if (this.effet.impact == 'mySelf') {this.description += 'on myself;';}
        // line 6&7&8&9
        this.description += 'Impact : ;';
        this.description += ' Attack : ' + this.effet.modifAttack + ';';
        this.description += ' Defense : ' + this.effet.modifDefense + ';';
        this.description += ' Life : ' + this.effet.modifVie + ';';
      }
    }
    if (this.type == 'Spell') {
      if (this.effet.zone == 'Single') {this.description = 'Single';}
      else if (this.effet.zone == 'Multi') {this.description = 'Multi';}
      else {this.description += '';}
      if (this.effet.impact == 'playerBoard') {this.description += ' on playBoard';}
      else if (this.effet.impact == 'opponentBoard') {this.description += ' on opponBoard';}
      else if (this.effet.impact == 'player') {this.description += ' on player';}
      else if (this.effet.impact == 'opponent') {this.description += ' on opponent';}
      else if (this.effet.impact == 'any') {this.description += ' on any';}
      else if (this.effet.impact == 'mySelf') {this.description += ' on myself';}
    }
    if (this.type == 'Equipment') {
      if (this.equipement.type == 'Weapon') {this.description = 'Weapon';}
      else if (this.equipement.type == 'Armor') {this.description = 'Armor';}
      else {this.description += '';}
      if (this.equipement.impact == 'playerBoard') {this.description += ' on playBoard;';}
      else if (this.equipement.impact == 'opponentBoard') {this.description += ' on opponBoard;';}
      else if (this.equipement.impact == 'player') {this.description += ' on player;';}
      else if (this.equipement.impact == 'opponent') {this.description += ' on opponent;';}
      else if (this.equipement.impact == 'any') {this.description += ' on any;';}
      if (this.equipement.durability != 0) {this.description += 'Durability: ' + this.equipement.durability;}
    }
  };
  this.isPlayable = function() {
    if (this.cout > 0) {
      return true;
    }
    return false;
  };
}
Carte.prototype = {
  id : -1,
  activeColor : "white",
  inactiveColor : "white",
  imgid : 0,
  type : '',
  typeimg : 'Normal',
  visible : false,
  cout : 0,
  attaque : 0,
  defense : 0,
  vie : 0,
  titre : '',
  description : '',
  active : false,
  selected : false,
	showInBig : false,
  special : '',
  effet : Effet.prototype,
  etat : Etat.prototype,
  equipement : Equipement.prototype
};

function Etat(provoke, charge, silent, fury, divine, stun, replace, hide) {
  if (provoke != undefined) {this.provoke = provoke;}
  else {this.provoke = Etat.prototype.provoke;}
  if (charge != undefined) {this.charge = charge;}
  else {this.charge = Etat.prototype.charge;}
  if (silent != undefined) {this.silent = silent;}
  else {this.silent = Etat.prototype.silent;}
  if (fury != undefined) {this.fury = fury;}
  else {this.fury = Etat.prototype.fury;}
  if (divine != undefined) {this.divine = divine;}
  else {this.divine = Etat.prototype.divine;}
  if (stun != undefined) {this.stun = stun;}
  else {this.stun = Etat.prototype.stun;}
  if (replace != undefined) {this.replace = replace;}
  else {this.replace = Etat.prototype.replace;}
  if (hide != undefined) {this.hide = hide;}
  else {this.hide = Etat.prototype.hide;}
  if (this.fury > 0) {this.maxfury = 1;}
  else {this.maxfury = 0;}
  this.toString = function() {
    return "Etat : " + "provoke : " + this.provoke + " - " + "charge : " + this.charge + " - " + "silent: " + this.silent
            + " - " + "fury: " + this.fury + " - " + "divine: " + this.divine
            + " - " + "stun: " + this.stun + " - " + "replace: " + this.replace + " - " + "hide: " + this.hide;
  };
  this.activeFury = function() {
    this.maxfury = 1;
    this.fury = this.maxfury;
  };
  this.setDescription = function() {
    var description = '';
    if (this.provoke) {description += 'Provocation';}
    if (this.charge) {description += 'Charge';}
    if (this.silent) {description += 'Silent';}
    if (this.fury) {description += 'Fury';}
    if (this.divine) {description += 'Divine';}
    if (this.stun) {description += 'Stun';}
    if (this.hide) {description += 'Hide';}
    if (this.replace) {description += 'Replace';}
    return description;
  };
}
Etat.prototype = {
  provoke : false,
  charge : false,
  silent : false,
  fury : 0,
  divine : false,
  stun : false,
  replace : false,
  hide : false,
  maxfury : 2
};

function Effet(id, zone, impact, declencheur, attack, defense, vie, description) {
  if (id != undefined) {this.id = id;}
  else {this.id = Effet.prototype.id;}
  if (zone != undefined) {
    if (zone == 'Single' || zone == 'Multi') {this.zone = zone;}
    else {this.zone = Effet.prototype.zone;}
  }
  else {this.zone = Effet.prototype.zone;}
  if (impact != undefined) {
    if (impact == 'opponentBoard' || impact == 'playerBoard' || impact == 'mySelf' ||
        impact == 'opponent' || impact == 'player' || impact == 'any') {this.impact = impact;}
    else {this.impact = Effet.prototype.impact;}
  }
  else {this.impact = Effet.prototype.impact;}
  if (declencheur != undefined) {
    if (declencheur == 'Immediat' || declencheur == 'Attack' || declencheur == 'Defense' || declencheur == 'Played' || declencheur == 'Activated' || declencheur == 'Die') {this.declencheur = declencheur;}
    else {this.declencheur = Effet.prototype.declencheur;}
  }
  else {this.declencheur = Effet.prototype.declencheur;}
  if (attack != undefined) {this.modifAttack = attack;} // An integer
  else {this.modifAttack = Effet.prototype.modifAttack;}  // if > 0 add attack else remove attack
  if (defense != undefined) {this.modifDefense = defense;} // An integer
  else {this.modifDefense = Effet.prototype.modifDefense;} // if > 0 add life else remove life
  if (vie != undefined) {this.modifVie = vie;} // An integer
  else {this.modifVie = Effet.prototype.modifVie;} // if > 0 add life else remove life
  if (description != undefined) {this.description = description;}
  else {this.description = Effet.prototype.description;}
  this.clone = function() {
    var copy = this.constructor();
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) {
          copy[attr] = this[attr];
        }
    }
    return copy;
  };
  this.setDescription = function() {
    this.description = 'Z:'+this.zone.substring(0, 1)
    +'/I:'+this.impact.substring(0, 1)
    +'/D:'+this.declencheur.substring(0, 1)
    +'/A:'+this.modifAttack+'/D:'+this.modifDefense+'/V:'+this.modifVie;
  }
  this.toString = function() {
    return "Effet : " + "id : " + this.id + " - " + "zone : " + this.zone + " - " + "impact: " + this.impact
            + " - " + "declencheur: " + this.declencheur + " - " + "attack: " + this.modifAttack
            + " - " + "defense: " + this.modifDefense + " - " + "vie: " + this.modifVie + " - " + "description: " + this.description;
  };
  this.clear = function() {
    this.id = Effet.prototype.id;
    this.zone = Effet.prototype.zone;
    this.impact = Effet.prototype.impact;
    this.declencheur = Effet.prototype.declencheur;
    this.modifAttack = Effet.prototype.modifAttack;
    this.modifDefense = Effet.prototype.modifDefense;
    this.modifVie = Effet.prototype.modifVie;
    this.description = Effet.prototype.description;
  };
}
Effet.prototype = {
  id : -1,
  zone : '', // 'Single' | 'Multi' | 'Left' | 'Right'
  impact : '', // 'opponentBoard' | 'playerBoard' | 'any' | 'opponent' | 'player' | 'mySelf'
  declencheur : '', // 'Immediat' | 'Attack' | 'Die' | 'Defense' | 'Activated' | Played
  modifAttack : 0, // An integer
  modifDefense : 0,
  modifVie : 0,
  description : ''
};

function Equipement(id, type, impact, durability, attack, defense, description) {
  if (id != undefined) {this.id = id;}
  else {this.id = Equipement.prototype.id;}
  if (type != undefined) {
    if (type == 'Weapon' || type == 'Armor') {this.type = type;}
    else {this.type = Equipement.prototype.type;}
  }
  else {this.type = Equipement.prototype.type;}
  if (impact != undefined) {
    if (impact == 'opponentBoard' || impact == 'playerBoard' || 
        impact == 'opponent' || impact == 'player' || impact == 'any') {this.impact = impact;}
    else {this.impact = Equipement.prototype.impact;}
  }
  else {this.impact = Equipement.prototype.impact;}
  if (durability != undefined) {this.durability = durability;} // An integer
  else {this.durability = Equipement.prototype.durability;}  // if > 0 add attack else remove attack
  if (attack != undefined) {this.modifAttack = attack;} // An integer
  else {this.modifAttack = Equipement.prototype.modifAttack;}  // if > 0 add attack else remove attack
  if (defense != undefined) {this.modifDefense = defense;} // An integer
  else {this.modifDefense = Equipement.prototype.modifDefense;} // if > 0 add life else remove life
  if (description != undefined) {this.description = description;}
  else {this.description = Equipement.prototype.description;}
  this.clone = function() {
    var copy = this.constructor();
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) {
          copy[attr] = this[attr];
        }
    }
    return copy;
  };
  this.setDescription = function() {
    this.description = '/Impact:'+this.impact
    +'/A:'+this.modifAttack+'/D:'+this.modifDefense;
  }
  this.toString = function() {
    return "Equipement : " + "id : " + this.id + " - " + "type: " + this.type
            + " - " + "impact: " + this.impact + " - " + "attack: " + this.modifAttack
            + " - " + "defense: " + this.modifDefense + " - " + "durability: " + this.durability + " - " + "description: " + this.description;
  };
  this.clear = function() {
    this.id = Equipement.prototype.id;
    this.type = Equipement.prototype.type;
    this.impact = Equipement.prototype.impact;
    this.durability = Equipement.prototype.durability;
    this.modifAttack = Equipement.prototype.modifAttack;
    this.modifDefense = Equipement.prototype.modifDefense;
    this.description = Equipement.prototype.description;
  };
}
Equipement.prototype = {
  id : -1,
  type : '', // 'Weapon' | 'Armor'
  impact : '', // 'opponentBoard' | 'playerBoard' | 'any' | 'opponent' | 'player'
  durability : 0, // An integer = cout
  modifAttack : 0, // An integer
  modifDefense : 0,
  description : ''
};
console.log('Finish Carte.js');