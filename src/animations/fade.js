import Animation from '../animation';

import { isElement, isFunction, isObject, renderStyle, noop, round } from '../utils';

const FadeAnimation = (options = {}) => {

  isObject(options, 'options');

  const { element, start:_start = noop, stop:_stop = noop } = options;

  isElement(element, 'element');
  isFunction(_start, 'start');

  const style = {};

  const update = () => {

    style.opacity = round(animation.value, 4);
  };

  const render = () => {

    element.setAttribute('style', renderStyle(style));
  };

  const start = () => {

    style.opacity = element.style.opacity ? parseFloat(element.style.opacity) : (animation.reverse ? 0 : 1);

    _start();
  };

  const stop = () => {

    _stop();
  };


  const animation =  Animation(Object.assign(options, { update, render, start, stop  }));

  return animation;
};

export default FadeAnimation;