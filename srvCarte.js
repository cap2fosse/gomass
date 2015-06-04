console.log('Start srvCarte.js');
// Carte prototype.
function Carte(id, imgid, cout, att, def, titre, desc, visible, active, type) {
  this.id = id;
  this.visible = visible;
  this.imgid = imgid;
  this.cout = cout;
  this.attaque = att;
  this.defense = def;
  this.titre = titre;
  this.description = desc;
  this.effet = -1;
  this.active = active;
  this.type = type; // [0=normal, 1=mini, 2=player]
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
    return "Carte : " + "id : " + this.id + " - " + "imgid: " + this.imgid  + " - " + "cout : " + this.cout + " - " + "attaque: " + this.attaque+ " - " + "defense: " + this.defense 
            + " - " + "titre: " + this.titre + " - " + "description: " + this.description + " - " + "visible: " + this.visible  + " - " + "active: " + this.active  + " - " + "type: " + this.type;
  };
  this.equal = function(other) {
    if (this.id == other.id) return true;
    else return false;
  };
  this.init = function() {
    this.id = -1;
    this.visible = false;
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
module.exports = Carte;
console.log('Finish srvCarte.js');