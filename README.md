# Zwip

Utility for creating JS animations on top of W3C [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

It's a thin layer on top of requestAnimationFrame.

## Installation

```
npm install -D zwip
```
or
```
yarn add -D zwip
```

## Usage
```
import Animation from 'zwip/src/animation';

const style = 'position:absolute;background-color:#6495ed;width:60px;height:60px;';

const MyAnimation = (element) => {

  const _width = element.clientWidth;
  const _parentWidth = element.parentNode.clientWidth;
  let _left;
  
  const start = ({ reverse }) => _left = reverse ? _parentWidth : 0;

  const update = () => _left = animation.value * (_parentWidth - _width);

  const render = () => element.style.left = `${_left}px`;

  const animation = Animation({ start, update, render, duration: 1000, frequency: 10 });

  return animation;
};

document.addEventListener('DOMContentLoaded', () => {

  const myElement = document.body.appendChild(document.createElement('div'));

  myElement.setAttribute('style', style);
  myElement.innerText = 'click me';

  const myAnimation = MyAnimation(myElement);

  let reverse = false;

  myAnimation.on('stop', () => reverse = !reverse);

  myElement.addEventListener('mouseup', () =>  myAnimation.start({ reverse }))
});

```
## Examples

To see it in action :

``` 
cd examples/<example>
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
