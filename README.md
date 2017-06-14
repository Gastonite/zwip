# Zwip

Utility for creating JS animations on top of W3C [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) function.

## Installation

```
npm install -D zwip
```
or
```
yarn add -D zwip
```

## Usage
Create that file and bundle it using your favorite es6 transpiler :

```
import { Loop, Animation } from 'zwip';

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
  myAnimation.on('stop', [() => reverse = !reverse, displayLoopState, displayAnimationState]);
  myAnimation.on('tick', displayAnimationState);

  Loop.on('tick', displayLoopState);

  myElement.addEventListener('mouseup', () =>  myAnimation.start({ reverse }));

  displayLoopState();
  displayAnimationState();
});

```
## Examples

To see it in action :

``` 
cd examples/<example-name>
```
then :
```
npm run demo
```
or
```
yarn demo
```
Now the demo is visible at [http://localhost:3000](http://localhost:3000)
