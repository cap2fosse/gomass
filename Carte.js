'use strict';
console.log('Start Carte.js');
// Carte prototype.
function Carte(id, typeImg, type, imgid, visible, cout, att, def, vie, titre, desc, active, selected, special, effet, etat) {
  if (id != undefined){this.id = id;}
  else {this.id = Carte.prototype.id;}
  if (imgid != undefined){this.imgid = imgid;}
  else {this.imgid = Carte.prototype.imgid;}
  if (type == 'Invocation' || type == 'Spell' || type == 'Equipment' || type == 'Player') {this.type = type;}
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
  if (typeImg == 'Normal' || typeImg == 'Mini' || typeImg == 'Black' || typeImg == 'White') { // Normal | Mini | Black
    this.typeimg = typeImg;
    if (typeImg == 'Normal') {
      if (this.type == 'Invocation') {
        this.imagej = allInvocationImages[this.imgid];
      }
      else if (this.type == 'Spell') {
        this.imagej = allSpellImages[this.imgid];
      }
      else if (this.type == 'Equipment') {
        this.imagej = allEquipmentImages[this.imgid];
      }
      else if (this.type == 'Player') {
        this.imagej = allPlayersImages[imgid];
      }
      else {this.imagej = Carte.prototype.imagej}
    }
    else if (typeImg == 'Mini') {
      this.imagej = allImagesMini[imgid];
    }
    else if (typeImg == 'Black') {
      this.imagej = blackImage;
    }
    else if (typeImg == 'White') {
      this.imagej = whiteImage;
    }
  }
  else {this.typeimg = Carte.prototype.typeimg;}
  
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
            + " - " + "defense: " + this.defense + " - " + "titre: " + this.titre + " - " + "description: " + this.description
            + " - " + "visible: " + this.visible  + " - " + "active: " + this.active  + " - " + "typeimg: " + this.typeimg
            + " - " + "type : " + this.type + " - " + "image : " + this.imagej.src + '|| ' + this.effet.toString() + '|| ' + this.etat.toString();
  };
  this.equal = function(other) {
    if (this.id == other.id && this.imgid == other.imgid && this.typeimg == other.typeimg && this.type == other.type) return true;
    else return false;
  };
  this.init = function() {
    this.id = -1;
    this.visible = false;
    this.imagej = whiteImage;
    this.imgid = 0;
    this.typeimg = 'Normal'; // Normal | Mini
    this.type = ''; // 'Invocation' | 'Spell' | 'Equipment' | 'Player'
    this.cout = 0;
    this.attaque = 0;
    this.defense = 0;
    this.vie = 0;
    this.titre = "";
    this.description = "";
    this.special = "";
    this.effet = new Effet();
    this.etat = new Etat();
    this.active = false;
    this.selected = false;
  };
  this.activate = function(on) {
    this.active = on;
    if (on && this.etat.maxfury > 0) {
      this.etat.fury = this.etat.maxfury;
    }
  };
  this.toMini = function() {
    this.typeimg = 'Mini';
    this.imagej = allImagesMini[this.imgid];
  };
  this.applyEffect = function(effect) {
    this.attaque += effect.modifAttack;
    if (this.attaque < 0) {this.attaque = 0;}
    this.defense += effect.modifDefense;
    if (this.defense < 0) {this.defense = 0;}
    this.vie += effect.modifVie;
    if (this.vie < 0) {this.vie = 0;}
  };
  this.toNormal = function() {
    this.typeimg = 'Normal';
    if (this.type == 'Invocation') {
      this.imagej = allInvocationImages[this.imgid];
    }
    else if (this.type == 'Spell') {
      this.imagej = allSpellImages[this.imgid];
    }
    else if (this.type == 'Equipment') {
      this.imagej = allEquipmentImages[this.imgid];
    }
    else if (this.type == 'Player') {
      this.imagej = allPlayersImages[imgid];
    }
    else {this.imagej = Carte.prototype.imagej}
  };
  this.isNull = function() {
    if (this.id == -1 && !visible) {return true;}
  else {return false;}
  };
  this.setDescription = function() {
    if (this.type == 'Invocation') {
      if (this.effet.zone == 'Single') {this.description = 'Single';}
      if (this.effet.zone == 'Multi') {this.description = 'Multi';}
      if (this.effet.declencheur == 'Attack') {this.description += ' OnAttack';}
      if (this.effet.declencheur == 'Die') {this.description += ' OnDie';}
      if (this.effet.modifAttack != 0) {this.description += ' A:' + this.effet.modifAttack;}
      if (this.effet.modifDefense != 0) {this.description += ' D:' + this.effet.modifDefense;}
      if (this.effet.modifVie != 0) {this.description += ' V:' + this.effet.modifVie;}
    }
    if (this.type == 'Spell') {
     if (this.effet.zone == 'Single') {this.description = 'Single';}
     if (this.effet.zone == 'Multi') {this.description = 'Multi';}
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
  imagej : whiteImage,
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
  special : '',
  effet : Effet.prototype,
  etat : Etat.prototype,
  active : false,
  selected : false,
};

function Etat(provocator, charge, silent, fury, divine, stun, rage, hide) {
  if (provocator != undefined) {this.provocator = provocator;}
  else {this.provocator = Etat.prototype.provocator;}
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
    return "Etat : " + "provocator : " + this.provocator + " - " + "charge : " + this.charge + " - " + "silent: " + this.silent
            + " - " + "fury: " + this.fury + " - " + "divine: " + this.divine
            + " - " + "stun: " + this.stun + " - " + "rage: " + this.rage + " - " + "hide: " + this.hide;
  };
  this.activeFury = function() {
    this.maxfury = 1;
    this.fury = this.maxfury;
  }
}
Etat.prototype = {
  provocator : false,
  charge : false,
  silent : false,
  fury : 0,
  divine : false,
  stun : false,
  rage : false,
  hide : false,
  maxfury : 2
};

function Effet(id, zone, impact, declencheur, attack, defense, vie, description) {
  if (id != undefined) {this.id = id;}
  else {this.id = Effet.prototype.id;}
  if (zone == 'Single' || zone == 'Multi') {this.zone = zone;}
  else {this.zone = Effet.prototype.zone;}
  if (impact == 'opponentBoard' || impact == 'playerBoard' || 
      impact == 'opponent' || impact == 'player' || impact == 'every') {this.impact = impact;}
  if (declencheur == 'Immediat' || declencheur == 'Attack' || declencheur == 'Die') {this.declencheur = declencheur;}
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
  zone : '', // 'Single' | 'Multi'
  impact : '', // 'opponentBoard' | 'playerBoard' | 'every' | 'opponent' | 'player'
  declencheur : '', // 'Immediat' | 'Attack' | 'Die'
  modifAttack : 0, // An integer
  modifDefense : 0,
  modifVie : 0,
  description : ''
};
console.log('Finish Carte.js');