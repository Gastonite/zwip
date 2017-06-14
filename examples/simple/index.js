import Loop from '../../src/loop';
import Animation from '../../src/animation';
import '../../src/polyfills/requestAnimationFrame';
import '../../src/polyfills/matchesSelector';

const MyAnimation2 = (element) => {

  const start = () => element.style.position = 'absolute';

  const render = () => element.style.left = `${(animation.value * (document.body.clientWidth - element.clientWidth - 2) )}px`;

  const animation = Animation({ start, render, duration: 1000 });

  return animation;
};





// document.addEventListener('DOMContentLoaded', () => {
//
//   const myElement = document.body.appendChild(document.createElement('div'));
//
//   myElement.setAttribute('style', 'position:absolute; background-color:#6495ed;border-radius:50%;width:200px;height:200px;');
//
//   const myAnimation = MyAnimation(myElement);
//
//   myElement.addEventListener('mouseup', () => {
//     console.log('click');
//     myAnimation.start({ reverse: true });
//   });
//
//   // const displayState = () => {
//   //   loopState.innerHTML = `Loop state: ${JSON.stringify(Loop.state, null, 2)}`;
//   //   state.innerHTML = `Animation state: ${JSON.stringify(myAnimation.state, null, 2)}`;
//   // };
//   // myAnimation.on('tick', displayState);
//
//
//
//
//
//   // const circle = document.body.appendChild(document.createElement('div'));
//   // const loopState = document.body.appendChild(document.createElement('pre'));
//   // const state = document.body.appendChild(document.createElement('pre'));
//   //
//   // circle.classList.add('circle');
//   // circle.innerText = 'click me';
//   //
//   // loopState.classList.add('loop-state');
//   // state.classList.add('animation-state');
//   //
//   // const myAnimation = MyAnimation(circle);
//   //
//   // let reverse = true;
//   //
//   // const displayState = () => {
//   //   loopState.innerHTML = `Loop state: ${JSON.stringify(Loop.state, null, 2)}`;
//   //   state.innerHTML = `Animation state: ${JSON.stringify(myAnimation.state, null, 2)}`;
//   // };
//   //
//   // const resetAnimation = () => {
//   //   myAnimation.stop();
//   //   reverse = !reverse;
//   //   myAnimation.start({ reverse })
//   // };
//   //
//   // circle.addEventListener('mouseup', resetAnimation);
//   //
//   // myAnimation.on('tick', displayState);
//   //
//   // myAnimation.on('start', () => {
//   //   console.log('start()')
//   // });
//   //
//   // myAnimation.on('stop', () => {
//   //   console.log('stop()')
//   // });
//   //
//   //
//   // displayState()
//
// });
