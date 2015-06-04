/*
 * Carte prototype.
*/
function Carte(id, imgsrc, cout, att, def, titre, desc, visible, active) {
  this.id = id;
  this.visible = visible;
  this.imagej = new Image();
  this.imagej.src = imgsrc;
  this.cout = cout;
  this.attaque = att;
  this.defense = def;
  this.titre = titre;
  this.description = desc;
  this.effet = -1;
  this.active = active;
  this.change = function(id, imgsrc, cout, att, def, titre, desc, visible, active) {
    this.id = id;
    this.visible = true;
    this.imagej.src = imgsrc;
    this.cout = cout;
    this.attaque = att;
    this.defense = def;
    this.titre = titre;
    this.description = desc;
    this.active = active;
  };
  this.init = function() {
    this.id = -1;
    this.visible = false;
    this.imagej = new Image();
    this.cout = "";
    this.attaque = "";
    this.defense = "";
    this.titre = "";
    this.description = "";
    this.effet = -1;
    this.active = false;
  };
  this.equal = function(other) {
    if (this.id == other.id) return true;
    else return false;
  };
  this.changeId = function(id) {
    this.id = id;
  };
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
            + " - " + "defense: " + this.defense + " - " + "titre: " + this.titre + " - " + "description: " + this.description + " - " + "image: " + this.imagej.src  + " - " + "visible: " + this.visible  + " - " + "active: " + this.active;
  };
}
Carte.prototype = {
  id : -1,
  visible : false,
  imagej : new Image(),
  cout : "",
  attaque : "",
  defense : "",
  titre : "",
  description : "",
  effet : -1,
  active : false
};

function Effet() {
  id = -1;
  type = ''; // 'Invocation' | 'Sort' | 'Buff' | 'DeBuff'
  zone = ''; // 'Single' | 'Multi'
  impact = ''; // 'Allie' | 'Adversaire' | 'Tous'
  sens = ''; // 'Plus' | 'Moins'
  modificateur = 1; // An integer >= 1 
  declencheur = ''; // 'Immediat' | 'OnAttack' | 'OnDie'
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
  type : '', // 'Invocation' | 'Sort' | 'Buff' | 'DeBuff'
  zone : '', // 'Single' | 'Multi'
  impact : '', // 'Allie' | 'Adversaire' | 'Tous'
  sens : '', // 'Plus' | 'Moins'
  modificateur : 1, // An integer >= 1 
  declencheur : '' // 'Immediat' | 'OnAttack' | 'OnDie'
};