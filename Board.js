'use strict';
console.log('Start Board.js');
// default empty carte (empty = -1)
var emptyCarte = new Carte(-1, 'White');
var emptyEffet = new Effet();
var emptyMiniCarte = new Carte(-1, 'Mini', '', 0);
var backCard = new Carte(-1, 'Black', '', 0, true);
var invocusCard = new Carte(200, 'Normal', 'Invocation', 0, true, 2, 1, 0, 1, 'invocusSpell');
// the current selected carte
var selectedCarte = emptyCarte;
// store all cartes send by server
var allGameCartes = [];
var allAvatarsCartes = [];
var allPowerCartes = [];
var selectedButton = 0; // id of the clicked button
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
  objBoard.cartes = [];
  objBoard.selectedCarte = selectedCarte;
  objBoard.selectedCaseId = selectedCaseId;
  /* create all cases and cartes
   * largeur : number of case on x
   * hauteur : number of case on y 
   * type : type of case normal=0, small=1, spell=2*/
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
        else if (type == 2) {
          var caseInstance = new SpellCase(x, y, id, this.id, this.caseWidth, this.caseHeight);
        }
        else {
          console.log('not a correct case type!');
          return;
        }
        this.cases[id] = caseInstance;
        this.cartes[id] = caseInstance.carte;
        this.appendChild(caseInstance);
        id++;
      }
    }
  };
  // set all cartes 
  objBoard.setAll = function(cardArray) {
    for (var i = 0; i < cardArray.length; i++) {
      this.cartes[i] = cardArray[i];
    }
  };
  // display all cartes 
  objBoard.display = function() {
    for (var i = 0; i < (this.nbCasesx*this.nbCasesy); i++) {
      this.cases[i].draw();
    }
  };
  // clear all cartes 
  objBoard.clearAll = function() {
    for (var i = 0; i < (this.nbCasesx*this.nbCasesy); i++) {
      this.cases[i].clear();
    }
  };
  // select all cartes 
  objBoard.selectAll = function(on) {
    for (var i = 0; i < this.cases.length; i++) {
      if (on) {this.cases[i].carte.selected = true;}
      else {this.cases[i].carte.selected = false;}
    }
    for (var i = 0; i < this.cartes.length; i++) {
      if (on) {this.cartes[i].selected = true;}
      else {this.cartes[i].selected = false;}
    }
  };
  // get a carte clone from board 
  objBoard.getClone = function(caseid) {
    if (caseid >= 0 && caseid < this.cases.length) {
      return this.cases[caseid].carte.clone();
    }
  };
  // get a random carte not selected and visible from board on array of carte
  objBoard.getRandom = function() {
    var tryTime = 0;
    while (tryTime < 1000) {
      var rand = Math.floor(Math.random() * this.cartes.length);
      if (this.cartes[rand].visible && !this.cartes[rand].selected) {
        this.cartes[rand].selected = true;
        return this.cartes[rand];
      }
      tryTime++;
    }
  };
  // get a carte from array of carte 
  objBoard.getByCarteId = function(carteid) {
    var i = 0;
    while (this.cartes[i].id != carteid && i < this.cartes.length) {
      i++;
    }
    return this.cartes[i];
  };
  // get a carte from board 
  objBoard.get = function(caseid) {
    if (caseid >= 0 && caseid < this.cases.length) {
      return this.cases[caseid].carte;
    }
  };
  // get a Case from board 
  objBoard.getCase = function(caseid) {
    if (caseid >= 0 && caseid < this.cases.length) {
      return this.cases[caseid];
    }
  };
  // get a Case from carte id 
  objBoard.getCaseByCarteId = function(carteid) {
    for (var caseid = 0; caseid < this.cases.length; caseid++) {
      var checkedCard = this.get(caseid);
      if (checkedCard.id == carteid) {
        return caseid;
      }
    }
    return 0;
  };
  // get all cartes on board
  objBoard.getAll = function() {
    var carteArray = [];
    for (var caseid = 0; caseid < this.cases.length; caseid++) {
      carteArray.push(this.get(caseid));
    }
    return carteArray;
  };
  // change typeimg on all carte from board 'Normal' | 'Mini'
  objBoard.changeCardType = function(typeimg) {
    var originalArray = this.getAll();
    if (typeimg == 'Normal') {
      var tmpCarte;
      var finalArray = [];
      for (var caseid = 0; caseid < originalArray.length; caseid++) {
        tmpCarte = this.get(caseid);
        tmpCarte.toNormal();
        finalArray.push(tmpCarte);
      }
    }
    if (typeimg == 'Mini') {
      var tmpCarte;
      var finalArray = [];
      for (var caseid = 0; caseid < originalArray.length; caseid++) {
        tmpCarte = this.get(caseid);
        tmpCarte.toMini();
        finalArray.push(tmpCarte);
      }
    }
    return finalArray;
  };
  // add a carte to board at position caseid 
  objBoard.add = function(caseid, myCarte) {
    if (caseid >= 0 && caseid < this.cases.length) {
      if (this.cases[caseid].add(myCarte)) {
        this.cases[caseid].draw();
      }
    }
  };
  // add a carte to board at position caseid 
  objBoard.addClone = function(caseid, myCarte) {
    if (caseid >= 0 && caseid < this.cases.length) {
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
  // add carte in first empty carte
  objBoard.addLastNoDraw = function(myCarte) {
    var caseid = 0;
    while (caseid < this.cases.length && this.cases[caseid].carte.visible) {
      caseid++;
    }
    if (caseid < this.cases.length) {
      this.cases[caseid].add(myCarte);
    }
  };
  // active all visible carte
  objBoard.activateAll = function() {
    var card;
    for (var caseid = 0; caseid < this.cases.length; caseid++) {
      card = this.get(caseid);
      if (card.visible) {
        card.activate(true);
      }
      else {card.activate(false);}
      this.getCase(caseid).draw();
    }
  };
  // inactive all carte
  objBoard.inactivateAll = function() {
    for (var caseid = 0; caseid < this.cases.length; caseid++) {
      this.cases[caseid].carte.activate(false);
      this.cases[caseid].draw();
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
  // set div border
  objBoard.setBorder = function(up) {
    if (up) {
      this.style.borderStyle = "none none dotted none";
    }
    else {
      this.style.borderStyle = "dotted none none none";
    }
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
  canvasCase.y1 = Math.floor(Math.random() * 150);  // [0, 149]
  canvasCase.y2 = Math.floor(Math.random() * 150);  // [0, 149]
  // overwrite canvas properties
  canvasCase.ctx = canvasCase.getContext("2d");
  canvasCase.id = id;
  canvasCase.width = width;
  canvasCase.height = height;
  canvasCase.style.position = "absolute";
  canvasCase.style.left = casex * width;
  canvasCase.style.top = casey * height;
  //canvasCase.style.border = "1px solid grey";
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
    // don't draw if no carte
    if (this.carte.visible) {
      // clear all first
      this.ctx.clearRect(0, 0, this.width, this.height);
      // background
      var grd = this.ctx.createLinearGradient(0, this.y1, 100, this.y2);
      grd.addColorStop(0, "white");
      grd.addColorStop(1, this.carte.activeColor);
      this.ctx.fillStyle = grd;
      this.ctx.fillRect(2, 2, 98, 148);
      // shadows params
      this.ctx.shadowOffsetX = 2;
      this.ctx.shadowOffsetY = 2;
      this.ctx.shadowBlur = 2;
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      // informations
      if (this.carte.isPlayable()) {
        // cout
        this.ctx.font = "bold 16px serif";
        this.ctx.fillStyle = "rgb(255,255,0)";
        this.ctx.fillText(this.carte.cout, 8, 20);
        // vie
        this.ctx.font = "bold 16px serif";
        this.ctx.fillStyle = "rgb(255,51,51)";
        this.ctx.fillText(this.carte.vie, this.width-25, this.height-8);
        // attack
        this.ctx.font = "bold 16px serif";
        this.ctx.fillStyle = "rgb(128,255,0)";
        this.ctx.fillText(this.carte.attaque, 8, this.height-8);
        // defense
        this.ctx.font = "bold 16px serif";
        this.ctx.fillStyle = "rgb(235,80,0)";
        this.ctx.fillText(this.carte.defense, this.width-25, 20);

        if (this.carte.titre != '') {
          this.ctx.font = "bold 12px serif";
          // hight light title & borders
          if (this.carte.active) {
            this.ctx.fillStyle = "rgb(45,255,45)";
            this.ctx.strokeStyle = "rgb(45,255,45)";
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(4, 4, this.width-6, this.height-6);
          }
          else {
            this.ctx.fillStyle = "rgb(77,77,77)";
          }
          this.ctx.fillText(this.carte.titre, 10, 35);
        }
        if (this.carte.type != '') {
          this.ctx.font = "10px serif";
          this.ctx.fillStyle = "rgb(77,77,77)";
          this.ctx.fillText(this.carte.type, 20, 18);
        }
        if (this.carte.description != '') {
          var desc = this.carte.description.split(';');
          this.ctx.font = "10px serif";
          this.ctx.fillStyle = "rgb(77,77,77)";
          if (desc[0] != undefined) { // declencheur || spell Effect || equipment effect
            this.ctx.fillText(desc[0], 8, this.height-100);
          }
          if (desc[1] != undefined && desc[1] != 0) { // zone || durability
            this.ctx.fillText(desc[1], 8, this.height-85);
          }
          if (desc[2] != undefined && desc[2] != 0) { // impact
            this.ctx.fillText(desc[2], 8, this.height-70);
          }
          if (desc[3] != undefined) { // Attack
            this.ctx.fillText(desc[3], 8, this.height-55);
          }
          if (desc[4] != undefined) { // Defense
            this.ctx.fillText(desc[4], 8, this.height-40);
          }
          if (desc[5] != undefined) { // Life
            this.ctx.fillText(desc[5], 8, this.height-25);
          }
        }
        if (this.carte.special != '') {
          this.fillBorder();
        }
      }
      if (this.carte.selected) {
        this.ctx.fillStyle = "rgb(255,0,0)";
        this.ctx.strokeStyle = "rgb(255,0,0)";
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(80,40);
        this.ctx.lineTo(20,100);
        this.ctx.stroke();
      }
      //this.ctx.stroke();
    }
    else {
      this.clear();
    }
  };
  canvasCase.fillBorder = function() {
    var lineW = 2;
    if (this.carte.etat.provoke) {
      this.ctx.strokeStyle = "rgb(44,35,218)";
      this.ctx.fillStyle = "rgb(44,35,218)";
      this.ctx.lineWidth = lineW;
      this.ctx.fillRect(80, 30, 10, 10);
    }
    if (this.carte.etat.charge) {
      this.ctx.strokeStyle = "rgb(210,35,210)";
      this.ctx.fillStyle = "rgb(210,35,210)";
      this.ctx.lineWidth = lineW;
      this.ctx.fillRect(80, 45, 10, 10);
    }
    if (this.carte.etat.fury > 0) {
      this.ctx.strokeStyle = "rgb(207,27,0)";
      this.ctx.fillStyle = "rgb(207,27,0)";
      this.ctx.lineWidth = lineW;
      this.ctx.fillRect(80, 60, 10, 10);
    }
    if (this.carte.etat.divine) {
      this.ctx.strokeStyle = "rgb(205,205,0)";
      this.ctx.fillStyle = "rgb(205,205,0)";
      this.ctx.lineWidth = lineW;
      this.ctx.fillRect(80, 75, 10, 10);
    }
    if (this.carte.etat.hide) {
      this.ctx.strokeStyle = "rgb(20,33,0)";
      this.ctx.fillStyle = "rgb(20,33,0)";
      this.ctx.lineWidth = lineW;
      this.ctx.fillRect(80, 90, 10, 10);
    }
    this.ctx.font = "10px serif";
    this.ctx.fillText(this.carte.special, 20, this.height-10);
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
      this.ctx.font = "bold 12px serif";
      this.ctx.shadowOffsetX = 1;
      this.ctx.shadowOffsetY = 1;
      this.ctx.shadowBlur = 2;
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      if (this.carte.cout != '') {
        var grd = this.ctx.createLinearGradient(0,10,100,10);
        grd.addColorStop(0, "white");
        grd.addColorStop(1, this.carte.activeColor);
        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, 100, 20);
        this.ctx.fillStyle = "rgb(255,255,0)";
        this.ctx.fillText(this.carte.cout, 5, 15);
        this.ctx.fillText(this.carte.cout, 90, 15);
      }
      if (this.carte.titre != '') {
        this.ctx.fillStyle = "rgb(77,77,77)";
        this.ctx.fillText(this.carte.titre, 15, 15);
      }
    }
    else {
      this.clear();
    }
  };
  return miniCaz;
}
function SpellCase(casex, casey, id, boardName, width, height) {
  var spellCaz = new Case(casex, casey, id, boardName, width, height);
  spellCaz.carte = emptyCarte;
  spellCaz.draw = function() {
    var lineW = 4;
    if (this.carte.visible) {
      this.ctx.font = "12px serif";
      if (this.carte.active) {
        //this.ctx.beginPath();
        var grd = this.ctx.createLinearGradient(0,30,60,30);
        //grd.addColorStop(0,"rgb(0,255,156)");
        grd.addColorStop(0, "white");
        grd.addColorStop(1, this.carte.activeColor);
        this.ctx.fillStyle = grd;
        this.ctx.arc(30, 30, 25, 0, Math.PI*2, true);
        this.ctx.fill();
        this.ctx.fillStyle = this.carte.inactiveColor;
        this.ctx.fillText(this.carte.cout, 10, 35);
      }
      else {
        var grd = this.ctx.createLinearGradient(0,30,60,30);
        //grd.addColorStop(0,"rgb(0,128,93)");
        grd.addColorStop(0, "white");
        grd.addColorStop(1, this.carte.inactiveColor);
        this.ctx.fillStyle = grd;
        this.ctx.arc(30, 30, 25, 0, Math.PI*2, true);
        this.ctx.fill();
        this.ctx.fillStyle = this.carte.activeColor;
        this.ctx.fillText(this.carte.cout, 10, 35);
      }
    }
    else {
      this.clear();
    }
  };
  return spellCaz;
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
  allMana.id = 'ManageMana';
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
  allMana.set = function(num) {
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
    this.clean();
    this.add(newMana);
    this.setText();
  };
  allMana.add = function(num) {
    if (num > this.manas.length) return;
    for (var i = 0; i < num; i++) {
      this.manas[i].activate(true);
    }
  };
  allMana.clean = function() {
    for (var i = 0; i < this.manas.length; i++) {
      this.manas[i].activate(false);
    }
  };
  return allMana;
}
function coutButton(x, y, type, val) {
  var element = document.createElement("input");
  element.type = type;
  element.value = val;
  element.id = val;
  element.style.position = "absolute";
  element.style.left = x;
  element.style.top = y;
  element.disabled = false;
  element.hide = function(on) {
    this.disabled = on;
    if (on) {
      this.style.visibility = "hidden";
    }
    else {
      this.style.visibility = "visible";
    }
  };
  element.onclick = function() {
    selectedButton = this.id;
    //this.disabled = !this.disabled;
  };
  return element;
}
function manageCoutButton(posx, posy, nbButtonX, nbButtonY) {
  var allCoutB = document.createElement("div");
  allCoutB.id = 'ManageCoutButton';
  allCoutB.style.position = "absolute";
  allCoutB.style.width = 10 * nbButtonX;
  allCoutB.style.height = 10 * nbButtonY;
  allCoutB.style.left = posx;
  allCoutB.style.top = posy;
  allCoutB.style.visibility = "hidden";
  allCoutB.nbButtonX = nbButtonX;
  allCoutB.nbButtonY = nbButtonY;
  allCoutB.buttons = new Array(10);
  allCoutB.create = function() {
    var id = 0;
    for (var x = 0; x < this.nbButtonX; x++) {
      for (var y = 0; y < this.nbButtonY; y++) {
        var b = new coutButton(x+(30*id), y, 'button', id+1);
        this.buttons[id] = b;
        this.appendChild(b);
        id++;
      }
    }
  };
  allCoutB.visible = function(on) {
    if (on) {
      this.style.visibility = "visible";
      for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].hide(false);
      }
    }
    else {
      this.style.visibility = "hidden";
      for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].hide(true);
      }
    }
  };

  return allCoutB;
}
console.log('Finish Board.js');