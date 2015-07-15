'use strict';
console.log('Start preload.js');
// BEGIN GLOBAL VAR
var langage = 'Fr'; // 'Fr' | 'En'
var rootUrl = 'http://localhost:3333/'; // URL
var playerName = 'DEFAULT';
var opponentName = 'DEFAULT';
var creator = false; // if player create the game
var gameName = 'DEFAULT';
var myTurn = false; // if it's player turn
var startTime = false;
var currentTime = 0; // store current time
// store the current selected case id
var selectedCaseId = -1;
// max number  of carte in a deck
var maxDeckCarte = 30;
// max number of cartes
var maxCartes = 80;
// the secret
var secret = '';
// END GLOBAL VAR
// preload images
var allPlayersImages = [];
var allCartesImages = [];
var allInvocationImages = [];
var allSpellImages = [];
var allEquipmentImages = [];
var allImagesMini = [];
var allManaImages = [];
var allPlayerSpellImagesOn = [];
var allPlayerSpellImagesOff = [];
var whiteImage = new Image();
var blackImage = new Image();
// all colors
var allPlayersColorsOn = ["rgb(255,0,0)", "rgb(255,255,0)", "rgb(0,255,255)", "rgb(0,255,156)"];
var allPlayersColorsOff = ["rgb(85,0,0)", "rgb(128,128,0)", "rgb(0,0,255)", "rgb(0,128,93)"];
var allCartesColorsOn = ["rgb(255,204,170)", "rgb(172,147,147)", "rgb(67,137,188)", "rgb(255,127,42)", 
                          "rgb(0,128,0)", "rgb(85,68,0)", "rgb(128,0,128)", "rgb(85,34,0)"];
var allCartesColorsOff = ["rgb(255,204,170)", "rgb(172,147,147)", "rgb(67,137,188)", "rgb(255,127,42)", 
                          "rgb(0,128,0)", "rgb(85,68,0)", "rgb(128,0,128)", "rgb(85,34,0)"];
var manaColorsOn = ["rgb(0,0,255)"];
var manaColorsOff = ["rgb(0,0,0)"];
//                   0            1          2         3               4                 5         6               7          8     9         10          11       12             13
var buttonNameFr = ["Connexion", "Joueurs", "Cartes", "Créer partie", "Joindre partie", "Règles", "Entrainement", "Envoyer", "OK", "Toutes", "Terminer", "Vider", "Fin de tour", "Capituler"];
var buttonNameEn = ["Connect", "Players", "Cards", "Create game", "Join game", "Rules", "Training", "Send", "OK", "All", "Finish", "Clean", "End turn", "Surrender"];
var buttonName = {'Fr' : buttonNameFr, 'En' : buttonNameEn}
//                 0      1         2              3          4   5                6
var textNameFr = ["Nom", "Partie", "RobotPartie", "Message", "", "Temps restant", "Mot de passe"];
var textNameEn = ["Name", "Game", "RobotGame", "Message", "", "Time left", "Password"];
var textName = {'Fr' : textNameFr, 'En' : textNameEn}
var nameOfButton = buttonName[langage];
var nameOfText = textName[langage];
function loadImages() {
  var maxInvocationImage = 8;
  var maxSpellImage = 8;
  var maxEquipmentImage = 8;
  var maxCartesImage = 8;
  var maxImageMini = 8;
  var maxImagePlayer = 4;
  var maxImageMana = 2;
  var maxImagePlayerSpell = 4;
  // CartesImage images
  for (var i = 0; i < maxCartesImage; i++) {
    var img = new Image();
    img.src = 'images/carte'+i+'.png';
    allCartesImages[i] = img;
  }
  // InvocationImage images
  for (var i = 0; i < maxInvocationImage; i++) {
    var img = new Image();
    img.src = 'images/invocation'+i+'.png';
    allInvocationImages[i] = img;
  }
  // SpellImages images
  for (var i = 0; i < maxSpellImage; i++) {
    var img = new Image();
    img.src = 'images/spell'+i+'.png';
    allSpellImages[i] = img;
  }
  // EquipmentImages images
  for (var i = 0; i < maxEquipmentImage; i++) {
    var img = new Image();
    img.src = 'images/equipment'+i+'.png';
    allEquipmentImages[i] = img;
  }
  // small images
  for (var i = 0; i < maxImageMini; i++) {
    var img = new Image();
    img.src = 'images/mini'+i+'.png';
    allImagesMini[i] = img;
  }
  // players images
  for (var i = 0; i < maxImagePlayer; i++) {
    var img = new Image();
    img.src = 'images/player'+i+'.png';
    allPlayersImages[i] = img;
  }
  // mana images
  for (var i = 0; i < maxImageMana; i++) {
    var eimg = new Image();
    eimg.src = 'images/mana'+i+'.png';
    allManaImages[i] = eimg;
  }
  // player spell images
  for (var i = 0; i < maxImagePlayerSpell; i++) {
    var eimgon = new Image();
    eimgon.src = 'images/playerSpellOn'+i+'.png';
    var eimgoff = new Image();
    eimgoff.src = 'images/playerSpellOff'+i+'.png';
    allPlayerSpellImagesOn[i] = eimgon;
    allPlayerSpellImagesOff[i] = eimgoff;
  }
  // default images
  whiteImage.src = 'images/white.png';
  blackImage.src = 'images/black.png';
}
loadImages();
//-----------------------------------------------------------
////////////////////////////////USEFULL//////////////////////
//-----------------------------------------------------------
//function gomassButton(x, y, type, val) {
function gomassButton(type, val) {
  var element = document.createElement("input");
  element.type = type;
  element.value = val;
  element.id = val;
  element.style.marginLeft = '5px';
  element.style.marginTop = '5px';
  //element.style.position = "absolute";
  //element.style.left = x;
  //element.style.top = y;
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
  //document.body.appendChild(element);
  return element;
}
function gomassBox(val) {
  var element = document.createElement("textarea");
  element.cols = 40;
  element.rows = 4;
  element.id = val;
  element.name = val;
  element.readonly = true;
  element.style.marginLeft = '5px';
  element.style.marginTop = '5px';
  //element.style.position = "absolute";
  //element.style.left = x;
  //element.style.top = y;
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
  //document.body.appendChild(element);
  return element;
}
function gomassInfo(x, y, id) {
  var element = document.createElement("div");
  element.id = id;
  element.readonly = true;
  element.style.position = "absolute";
  element.style.left = x;
  element.style.top = y;
  element.style.width = 500;
  element.style.height = 200;
  //element.style.border = "1px solid grey";
  element.disabled = false;
  element.setText = function(info) {
    this.innerHTML = info;
  };
  element.setButton = function() {
    var b = document.createElement("input");
    b.type = "button";
    b.value = ".end.";
    b.id = ".end."; 
    this.appendChild(b);
    b.onclick = function() {
      // create a new game
      loadNewGame();
    };
  };
  element.visible = function(on) {
    this.disabled = on;
    if (on) {
      this.style.visibility = "visible";
    }
    else {
      this.style.visibility = "hidden";
    }
  };
  document.body.appendChild(element);
  return element;
}
function gomassCombo(val) {
  var element = document.createElement("select");
  element.id = val;
  element.name = val;
  element.readonly = true;
  element.style.marginLeft = '5px';
  element.style.marginTop = '5px';
  //element.style.position = "absolute";
  //element.style.left = x;
  //element.style.top = y;
  element.disabled = false;
  //document.body.appendChild(element);
  element.addOpt = function(name) {
    var opt = document.createElement("option");
    opt.value = name;
    opt.text = name;
    opt.selected = true;
    this.add(opt);
  };
  element.hide = function(on) {
    this.disabled = on;
    if (on) {
      this.style.visibility = "hidden";
    }
    else {
      this.style.visibility = "visible";
    }
  };
  return element;
}
function gomassDiv(x, y, w, h, id) {
  var element = document.createElement("div");
  element.id = id;
  element.style.position = "absolute";
  element.style.left = x;
  element.style.top = y;
  element.style.width = w;
  element.style.height = h;
  //element.style.border = "1px solid grey";
  element.disabled = false;
  element.addElement = function(elmt) {
    this.appendChild(elmt);
  };
  element.visible = function(on) {
    var allElem = document.getElementById(this.id).children;
    for (var i = 0; i < allElem.length; i++) {
      allElem[i].disabled = !on;
      if (on) {
        allElem[i].style.visibility = "visible";
      }
      else {
        allElem[i].style.visibility = "hidden";
      }
    }
    this.disabled = !on;
    if (on) {
      this.style.visibility = "visible";
    }
    else {
      this.style.visibility = "hidden";
    }
  };
  document.body.appendChild(element);
  return element;
}
console.log('Finish preload.js');