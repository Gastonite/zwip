import { Loop, Animation } from '../../src';

const style = 'position:absolute;left:0;background-color:#6495ed;width:30px;height:30px;text-align:center';

const MyAnimation = (element) => {

  const _width = element.clientWidth;
  const _parentWidth = element.parentNode.clientWidth;
  let _left;

  // const initialState = { left: 0 };

  const stop = () => console.error('STOOOOOPP!');
  const start = ({ reverse }) => ({ left: reverse ? _parentWidth : 0 });
  const update = () => {
    console.log('MyAnimation.update', animation.value);

    return { left: animation.value * (_parentWidth - _width) };
  };
  const render = ({ left }) => {
    element.style.left = `${left}px`;
  };

  const animation = Animation({
    start,                  // Called just before the animation starts (optional)
    stop,                   // Called just after the animation stops (optional)
    update,                 // Called once per frame before render (optional)
    render,                 // Called once per frame to render whatever you like (required)
    duration: 2000,        // Duration of the animation in milliseconds (required except when 'nbFrames' is provided)
    //nbFrames: 10,           // The total number of frames (required except when 'duration' is provided)
    easing: 'easeInCubic',  // Easing function (optional, default to linear)
    frequency: 1           // Controls the frequency at which the animation is updated by the loop (defaults to 1, which means every frames)
  });

  return animation;
};


let _myAnimation;


const _pauseAnimation = event => {

  console.log('stop button was clicked', event);

  if (!_myAnimation)
    return;

  _myAnimation.pause();
};
const _stopAnimation = event => {

  console.log('stop button was clicked', event);

  if (!_myAnimation)
    return;

  _myAnimation.stop();
};
const _resetAnimation = event => {

  console.log('reset button was clicked', event);

  if (!_myAnimation)
    return;

  _myAnimation.reset();
};


document.addEventListener('DOMContentLoaded', () => {

  const pauseButton = document.getElementById('pause');
  const stopButton = document.getElementById('stop');
  const resetButton = document.getElementById('reset');

  pauseButton.addEventListener('click', _pauseAnimation);
  stopButton.addEventListener('click', _stopAnimation);
  resetButton.addEventListener('click', _resetAnimation);


  const myElement = document.body.appendChild(document.createElement('div'));
  const loopState = document.body.appendChild(document.createElement('pre'));
  const animationState = document.body.appendChild(document.createElement('pre'));

  loopState.classList.add('loop-state');
  animationState.classList.add('animation-state');

  myElement.setAttribute('style', style);
  myElement.innerText = 'click me';

  _myAnimation = MyAnimation(myElement);

  const displayAnimationState = () => {
    animationState.innerHTML = `Animation state: ${JSON.stringify(_myAnimation.state, null, 2)}`;
  };
  const displayLoopState = () => {
    loopState.innerHTML = `Loop state: ${JSON.stringify(Loop.state, null, 2)}`;
  };

  let reverse = false;

  _myAnimation.on('start', () => console.error('It begins ...'));
  _myAnimation.on('stop', [() => reverse = !reverse, displayLoopState]);
  _myAnimation.on('tick', displayAnimationState);

  Loop.on('tick', displayLoopState);

  myElement.addEventListener('mouseup', () =>  _myAnimation.start({ reverse }));

  displayLoopState();
  displayAnimationState();
});
