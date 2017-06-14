import { Loop, Animation } from '../../src';

const style = 'position:absolute;left:0;background-color:#6495ed;width:30px;height:30px;text-align:center';

const MyAnimation = (element) => {

  const _width = element.clientWidth;
  const _parentWidth = element.parentNode.clientWidth;
  let _left;

  const start = ({ reverse }) => _left = reverse ? _parentWidth : 0;
  const stop = () => console.error('STOOOOOPP!');
  const update = () => _left = animation.value * (_parentWidth - _width);
  const render = () => element.style.left = `${_left}px`;

  const animation = Animation({
    start,                  // Called just before the animation starts (optional)
    stop,                   // Called just after the animation stops (optional)
    update,                 // Called once per frame before render (optional)
    render,                 // Called once per frame to render whatever you like (required)
    //duration: 800,        // Duration of the animation in milliseconds (required except when 'nbFrames' is provided)
    nbFrames: 10,           // The total number of frames (required except when 'duration' is provided)
    easing: 'easeInCubic',  // Easing function (optional, default to linear)
    frequency: 10           // Controls the frequency at which the animation is updated by the loop (defaults to 1, which means every frames)
  });

  return animation;
};


document.addEventListener('DOMContentLoaded', () => {

  const myElement = document.body.appendChild(document.createElement('div'));
  const loopState = document.body.appendChild(document.createElement('pre'));
  const animationState = document.body.appendChild(document.createElement('pre'));

  loopState.classList.add('loop-state');
  animationState.classList.add('animation-state');

  myElement.setAttribute('style', style);
  myElement.innerText = 'click me';

  const myAnimation = MyAnimation(myElement);

  const displayAnimationState = () => {
    animationState.innerHTML = `Animation state: ${JSON.stringify(myAnimation.state, null, 2)}`;
  };
  const displayLoopState = () => {
    loopState.innerHTML = `Loop state: ${JSON.stringify(Loop.state, null, 2)}`;
  };

  let reverse = false;

  myAnimation.on('start', () => console.error('It begins ...'));
  myAnimation.on('stop', [() => reverse = !reverse, displayLoopState]);
  myAnimation.on('tick', displayAnimationState);

  Loop.on('tick', displayLoopState);

  myElement.addEventListener('mouseup', () =>  myAnimation.start({ reverse }));

  displayLoopState();
  displayAnimationState();
});














// import Loop from '../../src/loop';
// import '../../src/polyfills/requestAnimationFrame';
// import '../../src/polyfills/matchesSelector';
//
// const MyAnimation2 = (element) => {
//
//   const start = () => element.style.position = 'absolute';
//
//   const render = () => element.style.left = `${(animation.value * (document.body.clientWidth - element.clientWidth - 2) )}px`;
//
//   const animation = Animation({ start, render, duration: 1000 });
//
//   return animation;
// };
//
//
//
//
//
// // document.addEventListener('DOMContentLoaded', () => {
// //
// //   const myElement = document.body.appendChild(document.createElement('div'));
// //
// //   myElement.setAttribute('style', 'position:absolute; background-color:#6495ed;border-radius:50%;width:200px;height:200px;');
// //
// //   const myAnimation = MyAnimation(myElement);
// //
// //   myElement.addEventListener('mouseup', () => {
// //     console.log('click');
// //     myAnimation.start({ reverse: true });
// //   });
// //
// //   // const displayState = () => {
// //   //   loopState.innerHTML = `Loop state: ${JSON.stringify(Loop.state, null, 2)}`;
// //   //   state.innerHTML = `Animation state: ${JSON.stringify(myAnimation.state, null, 2)}`;
// //   // };
// //   // myAnimation.on('tick', displayState);
// //
// //
// //
// //
// //
// //   // const circle = document.body.appendChild(document.createElement('div'));
// //   // const loopState = document.body.appendChild(document.createElement('pre'));
// //   // const state = document.body.appendChild(document.createElement('pre'));
// //   //
// //   // circle.classList.add('circle');
// //   // circle.innerText = 'click me';
// //   //
// //   // loopState.classList.add('loop-state');
// //   // state.classList.add('animation-state');
// //   //
// //   // const myAnimation = MyAnimation(circle);
// //   //
// //   // let reverse = true;
// //   //
//   const displayState = () => {
//     loopState.innerHTML = `Loop state: ${JSON.stringify(Loop.state, null, 2)}`;
//     state.innerHTML = `Animation state: ${JSON.stringify(myAnimation.state, null, 2)}`;
//   };
// //   //
// //   // const resetAnimation = () => {
// //   //   myAnimation.stop();
// //   //   reverse = !reverse;
// //   //   myAnimation.start({ reverse })
// //   // };
// //   //
// //   // circle.addEventListener('mouseup', resetAnimation);
// //   //
// //   // myAnimation.on('tick', displayState);
// //   //
// //   // myAnimation.on('start', () => {
// //   //   console.log('start()')
// //   // });
// //   //
// //   // myAnimation.on('stop', () => {
// //   //   console.log('stop()')
// //   // });
// //   //
// //   //
// //   // displayState()
// //
// // });
