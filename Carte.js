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
  this.effet = -1;
  this.active = active;
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
    this.effet = -1;
    this.active = false;
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
console.log('Finish Carte.js');