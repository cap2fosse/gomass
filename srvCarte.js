"use strict";
console.log('Start srvCarte.js');
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
  if (typeImg == 'Normal' || typeImg == 'Mini' || typeImg == 'Black'|| typeImg == 'White') {this.typeimg = typeImg;}
  else {this.typeimg = Carte.prototype.typeimg;}

  this.toString = function() {
    return "Carte : " + "id : " + this.id + " - " + "cout : " + this.cout + " - " + "attaque: " + this.attaque
            + " - " + "defense: " + this.defense + " - " + "titre: " + this.titre + " - " + "description: " + this.description
            + " - " + "visible: " + this.visible  + " - " + "active: " + this.active  + " - " + "typeimg: " + this.typeimg
            + " - " + "type : " + this.type + '|| ' + this.effet.toString() + '|| ' + this.etat.toString();
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
    this.active = false;
    this.selected = false;
  };
  this.activate = function(on) {
    this.active = on;
    if (on && this.etat.maxfurie > 0) {
      this.etat.furie = this.etat.maxfurie;
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
  active : false,
  selected : false
};
function Effet(id, zone, impact, declencheur, attack, defense, vie, description) {
  this.id = id;
  if (id != undefined) {this.id = id;}
  else {this.id = Effet.prototype.id;}
  if (zone == 'Single' || zone == 'Multi') {this.zone = zone;}
  else {this.zone = Effet.prototype.zone;}
  if (impact == 'Allie' || impact == 'Opponent' || impact == 'Every') {this.impact = impact;}
  else {this.impact = Effet.prototype.impact;}
  if (declencheur == 'Immediat' || declencheur == 'Attack' || declencheur == 'Die') {this.declencheur = declencheur;}
  else {this.declencheur = Effet.prototype.declencheur;}
  if (attack != undefined) {this.modifAttack = attack;} // An integer to do attack buff
  else {this.modifAttack = Effet.prototype.modifAttack;} // if > 0 add attack else remove attack
  if (defense != undefined) {this.modifDefense = defense;} // An integer to do defence buff
  else {this.modifDefense = Effet.prototype.modifDefense;} // if > 0 add defence or life else remove defence or life
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
    +'-I:'+this.impact.substring(0, 1)
    +'-D:'+this.declencheur.substring(0, 1)
    +'-A:'+this.modifAttack+'-D:'+this.modifDefense+'-V:'+this.modifVie;
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
  impact : '', // 'Allie' | 'Opponent' | 'Every'
  declencheur : '', // 'Immediat' | 'Attack' | 'Die'
  modifAttack : 0, // An integer
  modifDefense : 0,
  modifVie : 0,
  description : ''
};
function Etat(provocator, charge, silent, furie, divin, stun, rage, hide) {
  if (provocator != undefined) {this.provocator = provocator;}
  else {this.provocator = Etat.prototype.provocator;}
  if (charge != undefined) {this.charge = charge;}
  else {this.charge = Etat.prototype.charge;}
  if (silent != undefined) {this.silent = silent;}
  else {this.silent = Etat.prototype.silent;}
  if (furie != undefined) {this.furie = furie;}
  else {this.furie = Etat.prototype.furie;}
  if (divin != undefined) {this.divin = divin;}
  else {this.divin = Etat.prototype.divin;}
  if (stun != undefined) {this.stun = stun;}
  else {this.stun = Etat.prototype.stun;}
  if (rage != undefined) {this.rage = rage;}
  else {this.rage = Etat.prototype.rage;}
  if (hide != undefined) {this.hide = hide;}
  else {this.hide = Etat.prototype.hide;}
  if (this.furie > 0) {this.maxfurie = 1;}
  else {this.maxfurie = 0;}
  this.toString = function() {
    return "Etat : " + "provocator : " + this.provocator + " - " + "charge : " + this.charge + " - " + "silent: " + this.silent
            + " - " + "furie: " + this.furie + " - " + "divin: " + this.divin
            + " - " + "stun: " + this.stun + " - " + "rage: " + this.rage + " - " + "hide: " + this.hide;
  };
  this.activeFurie = function() {
    this.maxfurie = 1;
    this.furie = this.maxfurie;
  };
}
Etat.prototype = {
  provocator : false,
  charge : false,
  silent : false,
  furie : 0,
  divin : false,
  stun : false,
  rage : false,
  hide : false,
  maxfurie : 2
};
module.exports = Carte;
console.log('Finish srvCarte.js');