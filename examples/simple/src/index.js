import 'file-loader!./index.html';
import Loop from '../../../src/loop';
import Animation from '../../../src/animation';

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function(s) {
      const matches = (this.document || this.ownerDocument).querySelectorAll(s)
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



const MySlideAnimation = (element) => {

  const start = () => element.style.position = 'relative';

  const render = () => element.style.left = `${(animation.value * 800)}px`;

  const animation = Animation({ start, render, duration: 10000 });

  return animation;
};



document.addEventListener('DOMContentLoaded', () => {

  const circle = document.getElementById('circle');

  const startLoopButton = document.getElementById('startLoop');
  const pauseLoopButton = document.getElementById('pauseLoop');
  const stopLoopButton = document.getElementById('stopLoop');
  const reverseAnimationButton = document.getElementById('reverseAnimation');
  const playAnimationButton = document.getElementById('playAnimation');
  const pauseAnimationButton = document.getElementById('pauseAnimation');
  const stopAnimationButton = document.getElementById('stopAnimation');


  startLoopButton.addEventListener('mouseup', event => Loop.start());
  pauseLoopButton.addEventListener('mouseup', event => Loop.pause());
  stopLoopButton.addEventListener('mouseup', event => Loop.stop());

  playAnimationButton.addEventListener('mouseup', event => myAnimation.start());
  reverseAnimationButton.addEventListener('mouseup', event => myAnimation.start({ reverse: true }));
  pauseAnimationButton.addEventListener('mouseup', event => myAnimation.pause());
  stopAnimationButton.addEventListener('mouseup', event => myAnimation.stop());

  const state = document.createElement('pre');

  document.getElementById('right').appendChild(state);

  const myAnimation = MySlideAnimation(circle);

  const displayState = () => {

    state.innerHTML = JSON.stringify(Loop.state, null, 2);

    let { value, nbFrames, duration, played, currentFrame } = myAnimation;


    value = Math.round(value * 100) + '%';

    circle.innerHTML = JSON.stringify({
      value,
      frames: `${currentFrame}/${nbFrames}`,
      duration: `${played}/${duration}`
    }, null, 2);
  };

  Loop.register({ render: displayState }, false);

  const disable = element => element.disabled = true;
  const enable = element => element.disabled = false;

  myAnimation.on('stop', [
    disable.bind(null, pauseAnimationButton),
    disable.bind(null, stopAnimationButton),
    enable.bind(null, playAnimationButton),
    enable.bind(null, reverseAnimationButton),
    () => console.log('The animation has just been stopped!')
  ]);

  myAnimation.on('start', [
    enable.bind(null, pauseAnimationButton),
    enable.bind(null, stopAnimationButton),
    disable.bind(null, playAnimationButton),
    disable.bind(null, reverseAnimationButton),
    () => console.log('The animation is being played!')
  ]);


  Loop.on(['pause', 'stop'], displayState);

  Loop.on('start', [
    enable.bind(null, stopLoopButton),
    disable.bind(null, startLoopButton),
    () => console.log('The loop has begun ...')
  ]);

  Loop.on('stop', [
    enable.bind(null, startLoopButton),
    disable.bind(null, stopLoopButton),
    () => console.log('The loop ended')
  ]);



  // It's just for disable pause and stop buttons (loop and animation are already stopped)
  myAnimation.stop();
  Loop.stop();
  circle.innerHTML = '';
});