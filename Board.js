/*
 * Constante
*/
var caseWidth = 100;
var caseHeight = 150;
/*
 * Global used to store carte begin movement
*/
var selectedCarte = new Carte();selectedCarte.init();
var selectedCaseId = -1;
/*
 *Plateau object
*/
function Board(name, posx, posy) {
  var objBoard = document.createElement("div");
  objBoard.id = name;
  objBoard.style.position = "absolute";
  objBoard.style.width = 0;
  objBoard.style.height = 0;
  objBoard.style.left = posx;
  objBoard.style.top = posy;
  objBoard.style.visibility = "hidden";
  objBoard.nbCasesx = 0;
  objBoard.nbCasesy = 0;
  objBoard.cases = [];
  objBoard.selectedCarte = new Carte();
  objBoard.selectedCarte.init();
  objBoard.selectedCaseId = -1;
  // create all cases and cartes
  objBoard.create = function(largeur, hauteur) {
    this.nbCasesx = largeur;
    this.nbCasesy = hauteur;
    this.style.width = largeur * caseWidth;
    this.style.height = hauteur * caseHeight;
    var id = 0;
    for (var x = 0; x < largeur; x++) {
      for (var y = 0; y < hauteur; y++) {
        var caseInstance = new Case(x, y, id);
        this.cases[id] = caseInstance;
        this.appendChild(caseInstance);
        id++;
      }
    }
  };
  // display all cartes
  objBoard.display = function() {
    for (var i = 0; i < (this.nbCasesx*this.nbCasesy); i++) {
      this.cases[i].draw();
    }
  };
  // add a carte to board
  objBoard.get = function(caseid) {
    return this.cases[caseid].carte.clone();
  };
  // add inactive carte to board
  objBoard.add = function(caseid, myCarte) {
    myCarte.active = false;
    this.cases[caseid].add(myCarte.clone());
    this.cases[caseid].draw();
  };
  // remove a carte to board
  objBoard.remove = function(caseid) {
    this.cases[caseid].remove();
    this.cases[caseid].draw();
  };
  // initialize all
  objBoard.init = function() {
    for (var i = 0; i < (this.nbCasesx*this.nbCasesy); i++) {
      this.cases[i].init();
      this.cases[i].draw();
    }
  };
  // initialize all
  objBoard.initSelectedCarte = function() {
    this.selectedCarte.init();
    this.selectedCaseId = -1;
  };
  // set visibility of objBoard and all canvas
  objBoard.setVisibility = function(visible) {
    if (visible) {
      this.style.visibility = "visible";
    }
    else {
      this.style.visibility = "hidden";
    }
    for (var i = 0; i < (this.nbCasesx*this.nbCasesy); i++) {
      this.cases[i].setVisibility(visible);
    }
  };
  objBoard.getId = function(largeur, hauteur) {
    var id = parseInt(largeur) * this.nbCasesy + parseInt(hauteur);
    console.log(id);
    return id;
  };
  objBoard.toString = function() {
    var plateauString = "Plateau : " + "largeur : " + this.nbCasesx + " - " + "hauteur : " + this.nbCasesy + "\n";
    if (this.cases.length > 0) {
      for (var i = 0; i < (this.nbCasesx*this.nbCasesy); i++) {
        plateauString = plateauString + this.cases[i].toString() + "\n";
      }
    }
    return plateauString;
  };
  return objBoard;
}

/*
 * Case inherit from Canvas
 * See Plateau.create() function.
*/
function Case(casex, casey, id) {
  var canvasCase = document.createElement('canvas');
  // new properties
  canvasCase.x = casex;
  canvasCase.y = casey;
  canvasCase.name = "case" + casex + "-" + casey;
  canvasCase.carte = new Carte();
  canvasCase.carte.init();
  // overwrite canvas properties
  canvasCase.ctx = canvasCase.getContext("2d");
  canvasCase.id = id;
  canvasCase.width = caseWidth;
  canvasCase.height = caseHeight;
  canvasCase.style.position = "absolute";
  canvasCase.style.left = casex * canvasCase.width;
  canvasCase.style.top = casey * canvasCase.height;
  canvasCase.style.border = "1px solid grey";
  canvasCase.style.visibility = "hidden";
  // only in case
  canvasCase.init = function() {
    this.x = -1;
    this.y = -1;
    this.name = "case" + canvasCase.x + "-" + canvasCase.y;
    this.carte = new Carte();
    this.ctx = canvasCase.getContext("2d");
    this.id = -1;
    this.width = caseWidth;
    this.height = caseHeight;
    this.style.position = "absolute";
    this.style.border = "1px solid grey";
    this.style.visibility = "hidden";
  };
  // overwrite canvas on click method
  canvasCase.onclick = function() {
    selectedCarte = this.carte.clone();
    selectedCaseId = this.id;
  };
  canvasCase.clear = function() {
    this.remove();
    this.ctx.clearRect(0, 0, this.width, this.height);
  };
  canvasCase.add = function(carte) {
      this.carte = carte;
  };
  canvasCase.remove = function() {
      this.carte.init();
  };
  canvasCase.draw = function() {
    var carreCote = 12;
    // don't draw if no carte
    if (this.carte.visible) {
      this.ctx.beginPath();
      this.ctx.fillText(this.carte.cout, 0, carreCote-2);
      this.ctx.fillText(this.carte.titre, carreCote+2, carreCote-2);
      this.ctx.fillText(this.carte.defense, this.width-carreCote, this.height-2);
      this.ctx.fillText(this.carte.attaque, 0, this.height-2);
      this.ctx.fillText(this.carte.description, carreCote/2, this.height-(carreCote+2));
      if (this.carte.imagej.src != "") {
        this.ctx.drawImage(this.carte.imagej, carreCote+2, carreCote+2, this.width-2*(carreCote+2), this.height-3*(carreCote+2));
        this.ctx.rect(0, 0, carreCote, carreCote);//haut gauche
        this.ctx.rect(this.width-carreCote, this.height-carreCote, carreCote, carreCote);//bas droite
        this.ctx.rect(0, this.height-carreCote, carreCote, carreCote);// bas gauche
      }
      this.ctx.stroke();
    }
    else {
      this.clear();
    }
  };
  canvasCase.setVisibility = function(visible) {
    if (visible) {
      this.style.visibility = "visible";
    }
    else {
      this.style.visibility = "hidden";
    }
  };
  canvasCase.toString = function() {
    var caseString = "Case :" + "id : " + this.id + " - " + "name : " + this.name + " - " + "x : " + this.x + " - " + "y : " + this.y + " - " + "ctx : " + this.ctx;
    caseString = caseString + " - " + "width : " + this.width + " - " + "height : " + this.height;
    return caseString + "\n" + this.carte.toString();
  };
  return canvasCase;
}

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