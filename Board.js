console.log('Start Board.js');
// default empty carte (empty = carte 0)
var emptyCarte = new Carte(-1, 0, '', '', '', '', '', false, false);
var emptyMiniCarte = new MiniCarte(-1, 0, '', '', false);
// the current selected carte
var selectedCarte = emptyCarte;
// store the current selected case id
var selectedCaseId = -1;
/*
 * posx : absolute position on x
 * posy : absolute position on y
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
  objBoard.caseWidth = 100;
  objBoard.caseHeight = 150;
  objBoard.nbCasesx = 0;
  objBoard.nbCasesy = 0;
  objBoard.cases = [];
  objBoard.selectedCarte = selectedCarte;
  objBoard.selectedCaseId = selectedCaseId;
  /* create all cases and cartes
   * largeur : number of case on x
   * hauteur : number of case on y */
  objBoard.create = function(largeur, hauteur) {
    this.nbCasesx = largeur;
    this.nbCasesy = hauteur;
    this.style.width = largeur * this.caseWidth;
    this.style.height = hauteur * this.caseHeight;
    var id = 0;
    for (var x = 0; x < largeur; x++) {
      for (var y = 0; y < hauteur; y++) {
        var caseInstance = new Case(x, y, id, this.id, this.caseWidth, this.caseHeight);
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
  // get a carte from board 
  objBoard.get = function(caseid) {
    if (caseid >= 0) {
      return this.cases[caseid].carte.clone();
    }
  };
  // add a carte to board at position caseid 
  objBoard.add = function(caseid, myCarte) {
    if (caseid >= 0) {
      this.cases[caseid].add(myCarte.clone());
      this.cases[caseid].draw();
    }
  };
  // remove a carte to board at position caseid 
  objBoard.remove = function(caseid) {
    if (caseid >= 0) {
      this.cases[caseid].remove();
      this.cases[caseid].draw();
    }
  };
  // initialize all Cartes 
  objBoard.initCartes = function() {
    for (var i = 0; i < (this.nbCasesx*this.nbCasesy); i++) {
      this.cases[i].carte.init();
      this.cases[i].draw();
    }
  };
  // initialize all Cases 
  objBoard.init = function() {
    for (var i = 0; i < (this.nbCasesx*this.nbCasesy); i++) {
      this.cases[i].init();
      this.cases[i].draw();
    }
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
  objBoard.initSelectedCarte = function() {
    this.selectedCarte.init();
    this.selectedCaseId = -1;
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
function MiniBoard(name, posx, posy) {
  var miniBoar = new Board(name, posx, posy);
  miniBoar.id = name;
  miniBoar.maxCarte = 0;
  miniBoar.caseWidth = 100;
  miniBoar.caseHeight = 20;
  miniBoar.create = function(largeur, hauteur) {
    this.nbCasesx = largeur;
    this.nbCasesy = hauteur;
    this.style.width = largeur * this.caseWidth;
    this.style.height = hauteur * this.caseHeight;
    var id = 0;
    for (var x = 0; x < largeur; x++) {
      for (var y = 0; y < hauteur; y++) {
        var caseInstance = new MiniCase(x, y, id, this.id, this.caseWidth, this.caseHeight);
        this.cases[id] = caseInstance;
        this.appendChild(caseInstance);
        id++;
      }
    }
    this.maxCarte = id;
  };
  miniBoar.add = function(myCarte) {
    var caseid = 0;
    while (this.cases[caseid].carte.visible) {
      caseid++;
    }
    this.cases[caseid].add(myCarte.clone());
    this.cases[caseid].draw();
  };
  return miniBoar;
}
/*
 * Case inherit from Canvas
 * See Plateau.create() function.
*/
function Case(casex, casey, id, boardName, width, height) {
  var canvasCase = document.createElement('canvas');
  // new properties
  canvasCase.x = casex;
  canvasCase.y = casey;
  canvasCase.boardName = boardName;
  canvasCase.carte = emptyCarte;
  // overwrite canvas properties
  canvasCase.ctx = canvasCase.getContext("2d");
  canvasCase.id = id;
  canvasCase.width = width;
  canvasCase.height = height;
  canvasCase.style.position = "absolute";
  canvasCase.style.left = casex * width;
  canvasCase.style.top = casey * height;
  canvasCase.style.border = "1px solid grey";
  canvasCase.style.visibility = "hidden";
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
      if (this.carte.cout != '') {
        this.ctx.fillText(this.carte.cout, 0, carreCote-2);
        this.ctx.rect(0, 0, carreCote, carreCote);//haut gauche
      }
      if (this.carte.titre != '') {
        this.ctx.fillText(this.carte.titre, carreCote+2, carreCote-2);
      }
      if (this.carte.defense != '') {
        this.ctx.fillText(this.carte.defense, this.width-carreCote, this.height-2);
        this.ctx.rect(this.width-carreCote, this.height-carreCote, carreCote, carreCote);//bas droite
      }
      if (this.carte.attaque != '') {
        this.ctx.fillText(this.carte.attaque, 0, this.height-2);
        this.ctx.rect(0, this.height-carreCote, carreCote, carreCote);// bas gauche
      }
      if (this.carte.description != '') {
        this.ctx.fillText(this.carte.description, carreCote/2, this.height-(carreCote+2));
      }
      this.ctx.drawImage(this.carte.imagej, carreCote+2, carreCote+2, this.width-2*(carreCote+2), this.height-3*(carreCote+2));
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
    var caseString = "Case :" + "id : " + this.id + " - " + "boardName : " + this.boardName + " - " + "x : " + this.x + " - " + "y : " + this.y + " - " + "ctx : " + this.ctx;
    caseString = caseString + " - " + "width : " + this.width + " - " + "height : " + this.height;
    return caseString + "\n" + this.carte.toString();
  };
  return canvasCase;
}

function MiniCase(casex, casey, id, boardName, width, height) {
  var miniCaz = new Case(casex, casey, id, boardName, width, height);
  miniCaz.carte = emptyMiniCarte;
  miniCaz.draw = function() {
    if (this.carte.visible) {
      this.ctx.beginPath();
      if (this.carte.cout != '') {
        this.ctx.fillText(this.carte.cout, 0, 10);
        this.ctx.drawImage(this.carte.imagej, 10, 0, 100, 20);
        this.ctx.stroke();
      }
    }
  };
  return miniCaz;
}
console.log('Finish Board.js');