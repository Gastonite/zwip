import Zwip from '../../src/zwip';
import Animation from '../../src/animation';
import { isObject, isElement, isArray, isInteger, noop } from '../../src/utils';
import Chain from '../../src/chain';
import FadeAnimation from 'zwip-fade';
import '../../src/polyfills/requestAnimationFrame';
import '../../src/polyfills/matchesSelector';

window.log = console.log.bind(console);
window.error = console.error.bind(console);


const SlideAnimation = ({ element, duration, reverse }) => {

  const parentWidth = element.parentNode.clientWidth;
  const width = element.clientWidth;

  const min = 0;
  const max = parentWidth - width;

  element.style.position = 'absolute';

  const _setLeft = (left) => element.style.left = `${left}px`;

  const start = () => {
    log('Slide.start()', animation.reverse);

    _setLeft(animation.reverse ? max : min );
  };

  const render = () => {
    const v = animation.value;
    element.style.left = v * max;
  };

  const animation = Animation({ start, render, duration, reverse });

  return animation;
};



const MyChain = ({ element, reverse, duration, frequency }) => {

  const firstAnimation = SlideAnimation({ element, reverse: reverse, frequency, duration: Math.ceil(duration * (1/3)) });

  const lastAnimation = FadeAnimation({ element: element.firstChild, reverse: !reverse, frequency, duration: Math.floor(duration * (2/3)) });

  return Chain({
    duration,
    frequency,
    animations: [
      firstAnimation,
      lastAnimation
    ]
  });
};

document.addEventListener('DOMContentLoaded', () => {

  const circle = document.body.appendChild(document.createElement('div'));
  const loopState = document.body.appendChild(document.createElement('pre'));
  const container = document.body.appendChild(document.createElement('pre'));
  const firstAnimationState = container.appendChild(document.createElement('pre'));
  const lastAnimationState = container.appendChild(document.createElement('pre'));

  circle.classList.add('circle');
  circle.innerHTML = '<div></div><strong>click me</strong>';

  loopState.classList.add('loop-state');
  container.classList.add('animation-state');

  const myChain = MyChain({ element: circle, duration: 1000, frequency: 1 });

  let reverse = false;

  const displayLoopState = () => {
    loopState.innerHTML = `Loop state: ${JSON.stringify(Loop.state, null, 2)}`;
  };
  const displaySlideAnimationState = () => {
    firstAnimationState.innerHTML = `firstAnimation state: ${JSON.stringify(myChain.animations[0].state, null, 2)}`;
  };
  const displayFadeAnimationState = () => {
    lastAnimationState.innerHTML = `lastAnimation state: ${JSON.stringify(myChain.animations[1].state, null, 2)}`;
  };

  circle.addEventListener('mouseup', () => {

    myChain.start({ reverse });
    reverse = !reverse;

    myChain.animations[0].on('tick', displaySlideAnimationState);
    myChain.animations[1].on('tick', displayFadeAnimationState);
  });

  Loop.on(['tick', 'stop'], displayLoopState);

  displayLoopState();
  displaySlideAnimationState();
  displayFadeAnimationState();
});
