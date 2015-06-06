'use strict';
console.log('Start srvCarte.js');
// Carte prototype.
function Carte(id, typeImg, type, imgid, visible, cout, att, def, vie, titre, desc, active, selected, special, effet, etat, equipement) {
  if (id != undefined){this.id = id;}
  else {this.id = Carte.prototype.id;}
  if (imgid != undefined){this.imgid = imgid;}
  else {this.imgid = Carte.prototype.imgid;}
  if (type == 'Invocation' || type == 'Spell' || type == 'Equipment' || type == 'Player' || type == 'PlayerSpell') {this.type = type;}
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
  if (effet != undefined){this.effet = effet;}
  else {this.effet = new Effet();}
  if (etat != undefined){this.etat = etat;}
  else {this.etat = new Etat();}
  if (equipement != undefined){this.equipement = equipement;}
  else {this.equipement = new Equipement();}
  if (typeImg == 'Normal' || typeImg == 'Mini' || typeImg == 'Black'|| typeImg == 'White') {this.typeimg = typeImg;}
  else {this.typeimg = Carte.prototype.typeimg;}

  this.toString = function() {
    return "Carte : " + "id : " + this.id + " - " + "cout : " + this.cout + " - " + "attaque: " + this.attaque
            + " - " + "defense: " + this.defense + " - " + "titre: " + this.titre + " - " + "description: " + this.description
            + " - " + "visible: " + this.visible  + " - " + "active: " + this.active  + " - " + "typeimg: " + this.typeimg
            + " - " + "type : " + this.type + '|| ' + this.effet.toString() + '|| ' + this.etat.toString() + '|| ' + this.equipement.toString();
  };
  this.init = function() {
    this.id = -1;
    this.visible = false;
    this.imgid = 0;
    this.typeimg = "Normal"; // 'Normal' | 'Mini'
    this.type = ""; // 'Invocation' | 'Spell' | 'Equipment' | 'Player'
    this.cout = 0;
    this.attaque = 0;
    this.defense = 0;
    this.vie = 0;
    this.titre = "";
    this.description = "";
    this.special = "";
    this.effet = new Effet();
    this.etat = new Etat();
    this.equipement = new Equipement();
    this.active = false;
    this.selected = false;
  };
  this.activate = function(on) {
    this.active = on;
    if (on && this.etat.maxfury > 0) {
      this.etat.fury = this.etat.maxfury;
    }
  };
  this.setDescription = function() {
    if (this.type == 'Invocation') {
      // line 1
      if (this.effet.declencheur == 'Attack') {this.description += 'On Attack;';}
      else if (this.effet.declencheur == 'Die') {this.description += 'On Die;';}
      else if (this.effet.declencheur == 'Defense') {this.description += 'On Defense;';}
      else if (this.effet.declencheur == 'Activated') {this.description += 'On Activated;';}
      else if (this.effet.declencheur == 'Played') {this.description += 'On Played;';}
      // line 2
      if (this.effet.zone == 'Single') {this.description += 'Single';}
      else if (this.effet.zone == 'Multi') {this.description += 'Multi';}
      if (this.effet.impact == 'playerBoard') {this.description += ' on playBoard;';}
      else if (this.effet.impact == 'opponentBoard') {this.description += ' on oppoBoard;';}
      else if (this.effet.impact == 'player') {this.description += ' on player;';}
      else if (this.effet.impact == 'opponent') {this.description += ' on opponent;';}
      else if (this.effet.impact == 'any') {this.description += ' on any;';}
      else if (this.effet.impact == 'mySelf') {this.description += ' on my self;';}
      // line 3, 4 & 5
      if (this.effet.modifAttack != 0) {this.description += ' Attack : ' + this.effet.modifAttack + ';';}
      if (this.effet.modifDefense != 0) {this.description += ' Defense : ' + this.effet.modifDefense + ';';}
      if (this.effet.modifVie != 0) {this.description += ' Life : ' + this.effet.modifVie;}
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
      else if (this.effet.impact == 'mySelf') {this.description += ' on my self';}
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
}
Carte.prototype = {
  id : -1,
  visible : false,
  typeimg : 'Normal', 
  imgid : 0,
  type : '',
  cout : 0,
  attaque : 0,
  defense : 0,
  vie : 0,
  titre : '',
  description : '',
  special : '',
  effet : Effet.prototype,
  etat : Etat.prototype,
  equipement : Equipement.prototype,
  active : false,
  selected : false
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
            + " - " + "defense: " + this.modifDefense + " - " + "description: " + this.description;
  };
}
Effet.prototype = {
  id : -1,
  zone : '', // 'Single' | 'Multi'
  impact : '', // 'opponentBoard' | 'playerBoard' | 'any' | 'opponent' | 'player' | 'mySelf'
  declencheur : '', // 'Immediat' | 'Attack' | 'Die' | 'Defense' | Played | Activated
  modifAttack : 0, // An integer
  modifDefense : 0,
  modifVie : 0,
  description : ''
};
function Etat(provoke, charge, silent, fury, divine, stun, rage, hide) {
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
  if (rage != undefined) {this.rage = rage;}
  else {this.rage = Etat.prototype.rage;}
  if (hide != undefined) {this.hide = hide;}
  else {this.hide = Etat.prototype.hide;}
  if (this.fury > 0) {this.maxfury = 1;}
  else {this.maxfury = 0;}
  this.toString = function() {
    return "Etat : " + "provoke : " + this.provoke + " - " + "charge : " + this.charge + " - " + "silent: " + this.silent
            + " - " + "fury: " + this.fury + " - " + "divine: " + this.divine
            + " - " + "stun: " + this.stun + " - " + "rage: " + this.rage + " - " + "hide: " + this.hide;
  };
  this.activeFury = function() {
    this.maxfury = 1;
    this.fury = this.maxfury;
  };
  this.setDescription = function() {
    var description = '';
    if (this.provocator) {description += 'Provocation';}
    if (this.charge) {description += 'Charge';}
    if (this.silent) {description += 'Silent';}
    if (this.fury) {description += 'Fury';}
    if (this.divine) {description += 'Divine';}
    if (this.stun) {description += 'Stun';}
    if (this.hide) {description += 'Hide';}
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
  rage : false,
  hide : false,
  maxfury : 2
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
module.exports = Carte;
console.log('Finish srvCarte.js');