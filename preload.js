'use strict';
console.log('Start preload.js');
// BEGIN GLOBAL VAR
var langage = 'Fr'; // 'Fr' | 'En'
var rootUrl = 'http://localhost:3333/'; // URL
var playerName = 'DEFAULT';
var opponentName = 'DEFAULT';
var currentPlayerDeckName = 'DEFAULT';
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
// END GLOBAL VAR
// all colors
var allPlayersColorsOn = ["rgb(255,0,0)", "rgb(255,255,0)", "rgb(0,255,255)", "rgb(0,255,156)"];
var allPlayersColorsOff = ["rgb(85,0,0)", "rgb(128,128,0)", "rgb(0,0,255)", "rgb(0,128,93)"];
var allCartesColorsOn = ["rgb(255,204,170)", "rgb(172,147,147)", "rgb(67,137,188)", "rgb(255,127,42)", 
                          "rgb(0,128,0)", "rgb(85,68,0)", "rgb(128,0,128)", "rgb(85,34,0)"];
var allCartesColorsOff = ["rgb(255,204,170)", "rgb(172,147,147)", "rgb(67,137,188)", "rgb(255,127,42)", 
                          "rgb(0,128,0)", "rgb(85,68,0)", "rgb(128,0,128)", "rgb(85,34,0)"];
var manaColorsOn = ["rgb(0,0,255)"];
var manaColorsOff = ["rgb(0,0,0)"];
// All texts
//                  0            1          2         3               4                 5         6               7          8     9         10         11              12             13           14         15           16            17             18             19
var buttonNameFr = ["Connexion", "Joueurs", "Cartes", "Créer partie", "Joindre partie", "Règles", "Entrainement", "Envoyer", "OK", "Toutes", "Terminer", "Nouveau Deck", "Fin de tour", "Capituler", "Suivant", "Précédent", "Créer Deck", "Nom du deck", "Sauver Deck", "Supprimer Deck"];
var buttonNameEn = ["Connect", "Players", "Cards", "Create game", "Join game", "Rules", "Training", "Send", "OK", "All", "Finish Deck", "New Deck", "End turn", "Surrender", "Next", "Back", "Create Deck", "Name of deck", "Save Deck", "Del Deck"];
var buttonName = {'Fr' : buttonNameFr, 'En' : buttonNameEn}
//                0      1         2              3          4   5                6
var textNameFr = ["Nom", "Partie", "RobotPartie", "Message", "", "Temps restant", "Mot de passe"];
var textNameEn = ["Name", "Game", "RobotGame", "Message", "", "Time left", "Password"];
var textName = {'Fr' : textNameFr, 'En' : textNameEn}
//                 0             1          2       3        4         5          6                 7
var etatCarteFr = ["Provocation", "Charge", "Fury", "Divin", "Cacher", "Silence", "Etourdissement", "Remplacement"];
var etatCarteEn = ["Provocation", "Charge", "Fury", "Divin", "Hide", "Silent", "Stun", "Change"];
var etatCarte = {'Fr' : etatCarteFr, 'En' : etatCarteEn}

var nameOfButton = buttonName[langage];
var nameOfText = textName[langage];
var nameOfEtatCarte = etatCarte[langage];
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
  element.onclick = function() {
    selectedButton = this.id;
  };  
  return element;
}
function gomassBox(val) {
  var element = document.createElement("textarea");
  element.cols = 40;
  element.rows = 4;
  element.maxlength = 40;
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
  element.addOption = function(name) {
    var opt = document.createElement("option");
    opt.value = name;
    opt.text = name;
    opt.selected = true;
    this.add(opt);
  };
  element.delOption = function(optid) {
    this.remove(optid);
    this.selectedIndex = 0;
  };
  element.getOption = function(optid) {
    return this.options[optid].text;
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