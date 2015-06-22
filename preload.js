'use strict';
console.log('Start preload.js');
// BEGIN GLOBAL VAR
var rootUrl = 'http://localhost:3333/'; // URL
var playerName = 'DEFAULT';
var opponentName = 'DEFAULT';
var creator = false; // if player create the game
var gameName = 'DEFAULT';
var langage = ['En', 'Fr'];
var myTurn = false; // if it's player turn
// store the current selected case id
var selectedCaseId = -1;
// max number  of carte in a deck
var maxDeckCarte = 30;
// max number of cartes
var maxCartes = 80;
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
console.log('Finish preload.js');