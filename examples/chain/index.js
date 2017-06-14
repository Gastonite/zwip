import Loop from '../../src/loop';
import Animation from '../../src/animation';
import { isObject, isElement, isArray, isInteger, noop } from '../../src/utils';
import Chain from '../../src/chain';
import LastAnimation from 'zwip-fade';
import '../../src/polyfills/requestAnimationFrame';
import '../../src/polyfills/matchesSelector';

window.log = console.log.bind(console);
window.error = console.error.bind(console);


const FirstAnimation = ({ element, duration, reverse }) => {

  const parentWidth = element.parentNode.clientWidth;
  const width = element.clientWidth;

  const min = 0;
  const max = parentWidth - width;
  let _reverse;

  element.style.position = 'absolute';

  const _setLeft = (left) => element.style.left = `${left}px`;

  const start = () => {
    log('Slide.start()', animation.reverse);

    _setLeft(animation.reverse ? max : min );
  };

  const render = () => {
    const v = animation.value;
    // log('v:',v);
    element.style.left = v * max;
  };

  const animation = Animation({ start, render, duration, reverse });

  return animation;
};



const MyChain = ({ element, reverse, duration, frequency }) => {

  const firstAnimation = FirstAnimation({ element, reverse: reverse, frequency, duration: Math.ceil(duration * (1/3)) });

  const lastAnimation = LastAnimation({ element, reverse: !reverse, frequency, duration: Math.floor(duration * (2/3)) });

  return Chain({
    duration,
    frequency,
    animations: [
      firstAnimation,
      lastAnimation
    ],
    start() {
      // log('MyChain.start()');
    },
    stop() {
      // log('MyChain.stop()');
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {

  const circle = document.body.appendChild(document.createElement('div'));
  const loopState = document.body.appendChild(document.createElement('pre'));
  const state = document.body.appendChild(document.createElement('pre'));

  circle.classList.add('circle');
  circle.innerText = 'click me';

  loopState.classList.add('loop-state');
  state.classList.add('animation-state');

  const myChain = MyChain({ element: circle, duration: 3000, frequency: 1000 });

  let reverse = false;

  const displayState = () => {
    loopState.innerHTML = `Loop state: ${JSON.stringify(Loop.state, null, 2)}`;
    state.innerHTML = `Animation state: ${JSON.stringify(myChain.state, null, 2)}`;
  };

  // const resetAnimation = () => {
  //   myAnimation.stop();
  //   reverse = !reverse;
  //   myAnimation.start({ reverse })
  // };

  circle.addEventListener('mouseup', () => {

    myChain.start({ reverse });
    reverse = !reverse;
    // log('REVERSED', reverse)

  });

  myChain.animations[1].on('tick', displayState);
  //
  // myAnimation.on('start', () => {
  //   log('start()')
  // });
  //
  // myAnimation.on('stop', () => {
  //   reverse = !reverse;
  // });


  displayState()

});
