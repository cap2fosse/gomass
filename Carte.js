console.log('Start Carte.js');
// preload images
var allImages = [];
var allImagesMini = [];
function loadImages() {
  for (var i = 0; i < 10; i++) {
    var img = new Image();
    img.src = 'images/carte'+i+'.jpg';
    allImages[i] = img;
  }
  for (var i = 0; i < 9; i++) {
    var img = new Image();
    img.src = 'images/miniCarte'+i+'.png';
    allImagesMini[i] = img;
  }
}
loadImages();
// Carte prototype.
function Carte(id, imgid, cout, att, def, titre, desc, visible, active) {
  this.id = id;
  this.visible = visible;
  this.imagej = allImages[imgid];
  this.imgid = imgid;
  this.cout = cout;
  this.attaque = att;
  this.defense = def;
  this.titre = titre;
  this.description = desc;
  this.effet = -1;
  this.active = active;
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
  this.equal = function(other) {
    if (this.id == other.id) return true;
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
}
Carte.prototype = {
  id : -1,
  visible : false,
  imagej : allImages[0],
  imgig : 0,
  cout : '',
  attaque : '',
  defense : '',
  titre : '',
  description : '',
  effet : -1,
  active : false,
};

function MiniCarte(id, imgid, cout, titre, visible) {
  var miniCard = new Carte(id, imgid, cout, '', '', titre, '', visible, false);
  miniCard.id = id;
  miniCard.imagej = allImagesMini[imgid];
  miniCard.imgid = imgid;
  miniCard.cout = cout;
  miniCard.titre = titre;
  miniCard.visible = visible;
  return miniCard;
}

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