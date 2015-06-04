"use strict";
console.log('Start Carte.js');
// Carte prototype.
function Carte(id, imgid, cout, att, def, titre, desc, visible, active, type) {
  this.id = id;
  this.visible = visible;
  this.imgid = imgid;
  this.cout = cout;
  this.attaque = att;
  this.defense = def;
  this.titre = titre;
  this.description = desc;
  this.effet = new Effet();
  this.active = active;
  this.selected = false;
  this.type = type; // [0=normal, 1=mini, 2=player]
  switch(type) {
    case 0:
      this.imagej = allImages[imgid];
      break;
    case 1:
      this.imagej = allImagesMini[imgid];
      break;
    case 2:
      this.imagej = allPlayersImages[imgid];
      break;
    default :
      this.imagej = allImages[imgid];
  }
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
            + " - " + "image: " + this.imagej.src  + " - " + "visible: " + this.visible  + " - " + "active: " + this.active  + " - " + "type: " + this.type;
  };
  this.equal = function(other) {
    if (this.id == other.id && this.imagej.src == other.imagej.src) return true;
    else return false;
  };
  this.init = function() {
    this.id = -1;
    this.visible = false;
    this.imagej = allImages[0];
    this.imgid = 0;
    this.cout = "";
    this.attaque = "";
    this.defense = "";
    this.titre = "";
    this.description = "";
    this.effet = new Effet();
    this.active = false;
    this.selected = false;
  };
  this.toMini = function() {
    return new MiniCarte(this.id, this.imgid, this.cout, this.titre, this.visible);
  }
}
Carte.prototype = {
  id : -1,
  visible : false,
  imagej : allImages[0],
  imgid : 0,
  cout : '',
  attaque : '',
  defense : '',
  titre : '',
  description : '',
  effet : Effet.prototype,
  active : false,
  selected : false
};

function Effet(id, zone, impact, declencheur, attack, defense, description) {
  this.id = id;
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