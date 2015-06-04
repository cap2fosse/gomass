/*
 * Constante
*/
const caseWidth = 100;
const caseHeight = 150;
/*
 * Global used to store carte begin movement
*/
var mouvementCarte = [];

/*
 *Plateau object
*/
function Plateau(name, posx, posy) {
  var board = document.createElement("div");
  board.id = name;
  board.style.position = "absolute";
  board.style.width = 0;
  board.style.height = 0;
  board.style.left = posx;
  board.style.top = posy;
  //board.style.border = "2px solid blue";
  board.style.visibility = "hidden";
  board.style.padding = '0px';
  board.largeur = 0;
  board.hauteur = 0;
  board.name = name;
  board.cases = [];
  // create all cases and cartes
  board.create = function(largeur, hauteur) {
    this.largeur = largeur;
    this.hauteur = hauteur;
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
  board.display = function() {
    for (var i = 0; i < (this.largeur*this.hauteur); i++) {
      this.cases[i].draw();
    }
  };
  // add a carte to plateau
  board.add = function(caseid, img, cout, att, def, titre, desc) {
    this.cases[caseid].carte.add(img, cout, att, def, titre, desc);
    this.cases[caseid].draw();
  };
  // remove a carte to plateau
  board.remove = function(caseid) {
    this.cases[caseid].carte.remove();
    this.cases[caseid].draw();
  };
  // move a carte on the plateau
  board.move = function(srcid, dstid) {
    this.cases[dstid].carte = this.cases[srcid].carte.clone();
    this.cases[dstid].carte.changeId(dstid);
    this.cases[dstid].draw();
    this.cases[srcid].clear();
    this.cases[srcid].draw();
  };
  // clear all cartes
  board.clear = function() {
    for (var i = 0; i < (this.largeur*this.hauteur); i++) {
      this.cases[i].carte.remove();
      this.cases[i].draw();
    }
  };
  // set visibility of board and all canvas
  board.setVisibility = function(visible) {
    if (visible) {
      this.style.visibility = "visible";
    }
    else {
      this.style.visibility = "hidden";
    }
    for (var i = 0; i < (this.largeur*this.hauteur); i++) {
      this.cases[i].setVisibility(visible);
    }
  };
  board.getId = function(largeur, hauteur) {
    var id = parseInt(largeur) * this.hauteur + parseInt(hauteur);
    console.log(id);
    return id;
  };
  board.toString = function() {
    var plateauString = "Plateau : " + "largeur : " + this.largeur + " - " + "hauteur : " + this.hauteur + "\n";
    if (this.cases.length > 0) {
      for (var i = 0; i < (this.largeur*this.hauteur); i++) {
        plateauString = plateauString + this.cases[i].toString() + "\n";
      }
    }
    return plateauString;
  };
  return board;
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
  canvasCase.carte = new Carte(id);
  // overwrite canvas properties
  canvasCase.ctx = canvasCase.getContext("2d");
  canvasCase.id = id;
  canvasCase.width = caseWidth;
  canvasCase.height = caseHeight;
  //canvasCase.style.zIndex = 8;
  canvasCase.style.position = "absolute";
  canvasCase.style.left = casex * canvasCase.width;
  canvasCase.style.top = casey * canvasCase.height;
  canvasCase.style.border = "1px solid grey";
  canvasCase.style.visibility = "hidden";
  // overwrite canvas on click method
  canvasCase.onclick = function() {
    if (myTurn) {
      if (this.carte.visible) {
        carteToPush = this.carte.clone();
        mouvementCarte.push(carteToPush);
        this.carte.remove();
        this.draw();
        console.log("Let's move ! " + "\n" + "Array length : " + mouvementCarte.length + "\n" + "case.id : " + this.id + "\n" + "carte.id : " + this.carte.id);
      }
      else if (!this.carte.visible && mouvementCarte.length > 0) {
        var dstid = this.id; // id du canvas sur lequel on depose la carte
        this.carte = mouvementCarte.pop(); // on recupere la carte src
        var srcid = this.carte.id; // id du canvas source
        this.carte.changeId(dstid);
        this.draw();
        if (mouvementCarte.length == 0 && gameName != '') {
          var movement = srcid + ',' + dstid;
          // emit to everyone
          socket.emit('move', {
            player: playerName,
            room: gameName,
            message: movement
          });
          console.log('Send move :' + movement);
        }
      }
      else {
        console.log("Impossible to move ! " + "\n" + "Array length : " + mouvementCarte.length + "\n" + "case.id : " + this.id + "\n" + "carte.id : " + this.carte.id);
      }
    }
  };
  canvasCase.clear = function() {
    this.carte.remove();
    this.ctx.clearRect(0, 0, this.width, this.height);
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
      //canvasCase.style.visibility = "collapse";
    }
  };
  canvasCase.toString = function() {
    var caseString = "Case :" + "id : " + this.id + " - " + "name : " + this.name + " - " + "x : " + this.x + " - " + "y : " + this.y + " - " + "ctx : " + this.ctx;
    caseString = caseString + " - " + "width : " + this.width + " - " + "height : " + this.height + " - " + "zIndex : " + this.style.zIndex;
    return caseString + "\n" + this.carte.toString();
  };
  return canvasCase;
}

/*
 * Carte prototype.
*/
function Carte(id) {
  this.id = id;
  this.imagej = new Image();
  this.add = function(img, cout, att, def, titre, desc) {
    this.visible = true;
    this.imagej.src = img;
    this.cout = cout;
    this.attaque = att;
    this.defense = def;
    this.titre = titre;
    this.description = desc;
  };
  this.remove = function() {
    this.visible = false;
    this.imagej = new Image();
    this.cout = "";
    this.attaque = "";
    this.defense = "";
    this.titre = "";
    this.description = "";
  };
  this.changeId = function(id) {
    this.id = id;
  };
  this.clone = function() {
    var copy = this.constructor();
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
    }
    return copy;
  };
  this.toString = function() {
    return "Carte : " + "id : " + this.id + " - " + "cout : " + this.cout + " - " + "attaque: " + this.attaque
            + " - " + "defense: " + this.defense + " - " + "titre: " + this.titre + " - " + "description: " + this.description + " - " + "image: " + this.imagej.src  + " - " + "visible: " + this.visible;
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
};

/*
 * Effet prototype.
*/
function Effet() {
  this.attaque = '0';
  this.defense = '0';
  this.titre = "";
  this.description = "";
  this.clone = function() {
    var copy = this.constructor();
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
    }
    return copy;
  };
  this.toString = function() {
    return "Effet : " + "attaque: " + this.attaque + " - " + "defense: " + this.defense + " - " + "titre: " + this.titre + " - " + "description: " + this.description;
  };
}
Effet.prototype = {
  attaque : "",
  defense : "",
  titre : "",
  description : "",
};