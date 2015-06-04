// BEGIN GLOBAL VAR
var playerName = 'DEFAULT';
var opponentName = 'DEFAULT';
var creator = false; // if player create the game
var gameName = 'DEFAULT';
var myTurn = false; // if it's player turn
// store the current selected case id
var selectedCaseId = -1;
// max number  of carte in a deck
var maxDeckCarte = 30;
// max number of cartes
var maxCartes = 80;
// specials cartes
var playerAvatar;
var opponentAvatar;
// END GLOBAL VAR
// preload images
var allPlayersImages = [];
var allImages = [];
var allImagesMini = [];
function loadImages() {
  var maxImage = 10;
  var maxImageMini = 9;
  var maxImagePlayer = 6;
  for (var i = 0; i < maxImage; i++) {
    var img = new Image();
    img.src = 'images/carte'+i+'.jpg';
    allImages[i] = img;
  }
  for (var i = 0; i < maxImageMini; i++) {
    var img = new Image();
    img.src = 'images/miniCarte'+i+'.png';
    allImagesMini[i] = img;
  }
  for (var i = 0; i < maxImagePlayer; i++) {
    var img = new Image();
    img.src = 'images/player'+i+'.png';
    allPlayersImages[i] = img;
  }
}
loadImages();