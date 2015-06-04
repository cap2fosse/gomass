console.log('Start Board.js');
// default empty carte (empty = carte 0)
var emptyCarte = new Carte(-1, 0, '', '', '', '', '', false, false, 0);
var emptyMiniCarte = new Carte(-1, 0, '', '', '', '', '', false, false, 1);
var emptyAvatar = new Carte(-1, 0, '', '', '', '', '', false, false, 2);
var backCard = new Carte(100, 9, '', '', '', 'back', '', true, false, 0);
var invocusCard = new Carte(200, 0, '2', '1', '1', 'invocus', '', true, false, 2);
// the current selected carte
var selectedCarte = emptyCarte;
// store all cartes send by server
var allGameCartes = [];
var allAvatarsCartes = [];
// create a new Board at posx, posy absolute position
function Board(name, posx, posy, caseW, caseH) {
  var objBoard = document.createElement("div");
  objBoard.id = name;
  objBoard.style.position = "absolute";
  objBoard.style.width = 0;
  objBoard.style.height = 0;
  objBoard.style.left = posx;
  objBoard.style.top = posy;
  objBoard.style.visibility = "hidden";
  objBoard.caseWidth = caseW;
  objBoard.caseHeight = caseH;
  objBoard.nbCasesx = 0;
  objBoard.nbCasesy = 0;
  objBoard.cases = [];
  objBoard.selectedCarte = selectedCarte;
  objBoard.selectedCaseId = selectedCaseId;
  /* create all cases and cartes
   * largeur : number of case on x
   * hauteur : number of case on y 
   * type : type of case normal=0, small=1 */
  objBoard.create = function(largeur, hauteur, type) {
    this.nbCasesx = largeur;
    this.nbCasesy = hauteur;
    this.style.width = largeur * this.caseWidth;
    this.style.height = hauteur * this.caseHeight;
    var id = 0;
    for (var x = 0; x < largeur; x++) {
      for (var y = 0; y < hauteur; y++) {
        if (type == 0) {
          var caseInstance = new Case(x, y, id, this.id, this.caseWidth, this.caseHeight);
        }
        else if (type == 1) {
          var caseInstance = new MiniCase(x, y, id, this.id, this.caseWidth, this.caseHeight);
        }
        else {
          console.log('not a correct case type!');
          return;
        }
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
  // get a carte clone from board 
  objBoard.getClone = function(caseid) {
    if (caseid >= 0) {
      return this.cases[caseid].carte.clone();
    }
  };
  // get a carte from board 
  objBoard.get = function(caseid) {
    if (caseid >= 0) {
      return this.cases[caseid].carte;
    }
  };
  // get a Case from board 
  objBoard.getCase = function(caseid) {
    if (caseid >= 0) {
      return this.cases[caseid];
    }
  };
  // get all carte from board
  objBoard.getAll = function() {
    var carteArray = [];
    for (var caseid = 0; caseid < this.cases.length; caseid++) {
      carteArray.push(this.getClone(caseid));
    }
    return carteArray;
  };
  // add a carte to board at position caseid 
  objBoard.add = function(caseid, myCarte) {
    if (caseid >= 0) {
      if (this.cases[caseid].add(myCarte)) {
        this.cases[caseid].draw();
      }
    }
  };
  // add a carte to board at position caseid 
  objBoard.addClone = function(caseid, myCarte) {
    if (caseid >= 0) {
      if (this.cases[caseid].add(myCarte.clone())) {
        this.cases[caseid].draw();
      }
    }
  };
  // add carte in first empty carte
  objBoard.addLast = function(myCarte) {
    var caseid = 0;
    while (caseid < this.cases.length && this.cases[caseid].carte.visible) {
      caseid++;
    }
    if (caseid < this.cases.length) {
      if (this.cases[caseid].add(myCarte)) {
        this.cases[caseid].draw();
      }
    }
  };
  // active all visible carte
  objBoard.activateAll = function() {
    for (var caseid = 0; caseid < this.cases.length; caseid++) {
      if (this.cases[caseid].carte.visible) {
        this.cases[caseid].activate(true);
      }
      else {
        this.cases[caseid].activate(false);
      }
    }
  };
  // check if deck is complete
  objBoard.isComplete = function() {
    var cid = 0;
    while (cid < this.cases.length && this.cases[cid].carte.visible) {
      cid++;
    }
    if (cid == this.cases.length) {
      return true;
    }
    return false;
  };
  // return and remove the last carte
  objBoard.removeLast = function() {
    var rid = this.cases.length - 1;
    while (rid >= 0 && !this.cases[rid].carte.visible) {
      rid--;
    }
    if (rid >= 0) {
      this.remove(rid);
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
  // try to add carte
  canvasCase.add = function(carte) {
    if (!this.carte.equal(carte)) {
      this.carte = carte;
      return true;
    }
    else {
      return false;
    }
  };
  canvasCase.remove = function() {
      this.carte.init();
  };
  canvasCase.draw = function() {
    var carreCote = 12;
    // don't draw if no carte
    if (this.carte.visible) {
      // clear all first
      this.ctx.clearRect(0, 0, this.width, this.height);
      // and draw
      this.ctx.beginPath();
      if (this.carte.cout != '') {
        this.ctx.fillText(this.carte.cout, 2, carreCote-2);
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
        this.ctx.fillText(this.carte.attaque, 2, this.height-2);
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
  canvasCase.activate = function(on) {
    if (on) {
      this.style.border = "1px solid green";
    }
    else {
      this.style.border = "1px solid grey";
    }
    this.carte.active = on;
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
      if (this.carte.cout != '') {
        this.ctx.beginPath();
        this.ctx.fillText(this.carte.cout, 0, 10);
        this.ctx.drawImage(this.carte.imagej, 10, 0, 100, 20);
        this.ctx.stroke();
      }
    }
    else {
      this.clear();
    }
  };
  return miniCaz;
}

function Mana(id, posx, posy) {
  var aMana = document.createElement("div");
  aMana.id = id;
  aMana.style.position = "absolute";
  aMana.style.width = 10;
  aMana.style.height = 10;
  aMana.style.left = 10 * posx;
  aMana.style.top = 10 * posy;
  aMana.style.visibility = "hidden";
  aMana.img = new Image(); // must create a new image for each mana
  aMana.img.src = allManaImages[0].src;
  aMana.img.width = 10;
  aMana.img.height = 10;
  aMana.active = 0;
  aMana.appendChild(aMana.img);
  aMana.visible = function(on) {
    if (on) {
      this.style.visibility = "visible";
    }
    else {
      this.style.visibility = "hidden";
    }
  }
  aMana.change = function() {
    if (this.img.src == allManaImages[0].src) {
      this.img.src = allManaImages[1].src;
      console.log(this.id + " is on");
    }
    else {
      this.img.src = allManaImages[0].src;
      console.log(this.id + " is off");
    }
  };
  aMana.activate = function(on) {
    if (on) {
      this.img.src = allManaImages[1].src;
      this.active = 1;
    }
    else {
      this.img.src = allManaImages[0].src;
      this.active = 0;
    }
  };
  return aMana;
}
function ManageMana(posx, posy, nbManaX, nbManaY) {
  var allMana = document.createElement("div");
  allMana.text = document.createElement("p"); 
  allMana.appendChild(allMana.text);
  allMana.id = posx + posy;
  allMana.style.position = "absolute";
  allMana.style.width = 10 * nbManaX;
  allMana.style.height = 10 * nbManaY;
  allMana.style.left = posx;
  allMana.style.top = posy;
  allMana.style.visibility = "hidden";
  allMana.nbManaX = nbManaX;
  allMana.nbManaY = nbManaY;
  allMana.manas = new Array(10);
  allMana.max = 0;
  allMana.create = function() {
    var id = 0;
    for (var x = 0; x < this.nbManaX; x++) {
      for (var y = 0; y < this.nbManaY; y++) {
        var m = new Mana(id, x, y);
        this.manas[id] = m;
        this.appendChild(m);
        id++;
      }
    }
  };
  allMana.setText = function() {
    var currentMana = this.getMana();
    this.text.innerHTML = 'Mana : ' + currentMana + '/' + this.max;
  };
  allMana.visible = function(on) {
    if (on) {
      this.style.visibility = "visible";
      for (var i = 0; i < this.manas.length; i++) {
        this.manas[i].visible(true);
      }
    }
    else {
      this.style.visibility = "hidden";
      for (var i = 0; i < this.manas.length; i++) {
        this.manas[i].visible(false);
      }
    }
  };
  allMana.add = function(num) {
    if (num > this.manas.length) return;
    for (var i = 0; i < num; i++) {
      this.manas[i].activate(true);
      this.max++;
    }
    this.setText();
  };
  allMana.reset = function() {
    for (var i = 0; i < this.manas.length; i++) {
      this.manas[i].activate(false);
      this.max = 0;
    }
    this.setText();
  };
  allMana.getMana = function() {
    var myMana = 0;
    for (var i = 0; i < this.manas.length; i++) {
      myMana += this.manas[i].active;
    }
    return myMana;
  };
  allMana.remove = function(num) {
    if (num > this.manas.length) return;
    var newMana = this.getMana() - num;
    this.reset();
    this.add(newMana);
    this.setText();
  };
  return allMana;
}
console.log('Finish Board.js');