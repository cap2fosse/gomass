"use strict";
console.log('Start Carte.js');
// Carte prototype.
function Carte(id, typeImg, type, imgid, visible, cout, att, def, titre, desc, active, selected, special, effet, etat) {
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
            + " - " + "type : " + this.type + " - " + "image : " + this.imagej.src + '||' + this.effet.toString() + '||' + this.etat.toString();
  };
  this.equal = function(other) {
    if (this.id == other.id && this.imagej.src == other.imagej.src) return true;
    else return false;
  };
  this.init = function() {
    this.id = -1;
    this.visible = false;
    this.imagej = whiteImage;
    this.imgid = 0;
    this.typeimg = 'Normal'; // Normal | Mini
    this.type = ''; // 'Invocation' | 'Spell' | 'Equipment' | 'Player'
    this.cout = "";
    this.attaque = "";
    this.defense = "";
    this.titre = "";
    this.description = "";
    this.special = "";
    this.effet = new Effet();
    this.etat = new Etat();
    this.active = false;
    this.selected = false;
  };
  this.toMini = function() {
    return new MiniCarte(this.id, this.imgid, this.cout, this.titre, this.visible);
  }
}
Carte.prototype = {
  id : -1,
  imagej : whiteImage,
  imgid : 0,
  type : '',
  typeimg : 'Normal',
  visible : false,
  cout : '',
  attaque : '',
  defense : '',
  titre : '',
  description : '',
  special : '',
  effet : Effet.prototype,
  etat : Etat.prototype,
  active : false,
  selected : false,
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
  this.toString = function() {
    return "Etat : " + "provocator : " + this.provocator + " - " + "charge : " + this.charge + " - " + "silent: " + this.silent
            + " - " + "furie: " + this.furie + " - " + "divin: " + this.divin
            + " - " + "stun: " + this.stun + " - " + "rage: " + this.rage + " - " + "hide: " + this.hide;
  };
}
Etat.prototype = {
  provocator : false,
  charge : false,
  silent : false,
  furie : false,
  divin : false,
  stun : false,
  rage : false,
  hide : false
};

function Effet(id, zone, impact, declencheur, attack, defense, description) {
  if (id != undefined) {this.id = id;}
  else {this.id = Effet.prototype.id;}
  if (zone == 'Single' || zone == 'Multi') {this.zone = zone;}
  else {this.zone = Effet.prototype.zone;}
  if (impact == 'Allie' || impact == 'Adversaire' || impact == 'Tous') {this.impact = impact;}
  else {this.impact = Effet.prototype.impact;}
  if (declencheur == 'Immediat' || declencheur == 'OnAttack' || declencheur == 'OnDie') {this.declencheur = declencheur;}
  else {this.declencheur = Effet.prototype.declencheur;}
  if (attack != undefined) {this.modifAttack = attack;} // An integer
  else {this.modifAttack = Effet.prototype.modifAttack;}
  if (defense != undefined) {this.modifDefense = defense;} // An integer
  else {this.modifDefense = Effet.prototype.modifDefense;}
  if (description != undefined) {this.description = description;} // An integer
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
    this.description = 'Att:'+this.modifAttack+'Def:'+this.modifDefense+'\n'+this.zone+':'+this.impact+':'+this.declencheur;
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
  impact : '', // 'Allie' | 'Adversaire' | 'Tous'
  declencheur : '', // 'Immediat' | 'OnAttack' | 'OnDie'
  modifAttack : 0, // An integer
  modifDefense : 0,
  description : ''
};
console.log('Finish Carte.js');