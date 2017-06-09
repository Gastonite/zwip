if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function(s) {
      const matches = (this.document || this.ownerDocument).querySelectorAll(s);
      let i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame   ||
    window.mozRequestAnimationFrame      ||
    window.oRequestAnimationFrame        ||
    window.msRequestAnimationFrame       ||
    function(callback){
      window.setTimeout(function(){

        callback(+new Date);
      }, 1000 / 60);
    };
})();
