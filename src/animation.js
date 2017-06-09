import Loop from './loop';
import Emitter from 'klak';
import { isInteger, isString, isObject, isFunction, isUndefined, noop } from './utils';
import { easings } from './easings';

const internal = {};

internal.parseEasing = (easing = easings.linear) => {

  if (easing) {

    if (isString(easing)) {

      if (!easings[easing])
        throw new Error(`Unknown "${easing}" easing function`);

      easing = easings[easing];
    }

    isFunction(easing, 'easing');
  }

  return easing;
};

internal.parseOptions = input => {
  const options = {};

  isObject(input, 'options');
  isUndefined(input.isZwipAnimation, 'isZwipAnimation');

  const { start, stop, update, render, reverse, duration, nbFrames, easing } = input;

  options.start = !start ? noop : isFunction(start, 'start');
  options.stop = !stop ? noop : isFunction(stop, 'stop');
  options.update = !update ? noop : isFunction(update, 'update');
  options.render = !render ? noop : isFunction(render, 'render');
  options.reverse = !!reverse;

  if (!(duration ^ nbFrames))
    throw new Error(`Exactly one option of ['duration', 'nbFrames'] is required`);

  options.duration = duration && isInteger(duration, 'duration');
  options.nbFrames = nbFrames && isInteger(nbFrames, 'nbFrames');

  options.easing = internal.parseEasing(easing);

  return options;
};

export default internal.Animation = (options = {}) => {

  const {
    start:_start,
    stop:_stop,
    update:_update,
    easing:_easing,
    render: _render,
    duration,
  } = options = internal.parseOptions(options);

  let { nbFrames, reverse } = options;

  let _startedAt;
  let _pausedAt;
  let _pausedTime;
  let _frameCounter;

  const animation = {
    isZwipAnimation: true,
    start(options = {}) {

      if (_startedAt)
        throw new Error(`Animation is already started`);

      isObject(options, 'options');

      if ('reverse' in options)
        reverse = !!options.reverse;

      _pausedAt = null;
      _startedAt = Date.now();
      _frameCounter = 0;
      _pausedTime = 0;

      _start(options);

      Loop.register(animation);

      animation.emit('start');
    },
    stop() {

      _pausedAt = null;
      _startedAt = null;
      _pausedTime = null;

      _stop();

      Loop.deregister(animation);

      animation.emit('stop');
    },
    pause() {

    if (!_pausedAt) {
      _pausedAt = Date.now();
      animation.emit('unpause');
      return;
    }

    _pausedTime = _pausedTime + (Date.now() - _pausedAt);
    _pausedAt = null;
      animation.emit('pause');

    },
    update() {

      if (!_startedAt)
        return;


      if (nbFrames && (_frameCounter >= nbFrames))
        return animation.stop();

      _frameCounter++;

      if (duration) {

        const playedTime = animation.played;

        nbFrames = Math.floor((_frameCounter * duration) / playedTime);
      }

      _update();
    },
    render() {
      _render();
    },
    get currentFrame() {
      return _frameCounter;
    },
    get pausedAt() {
      return _pausedAt;
    },
    get played() {

      if (!_startedAt)
        return 0;

      const now = Date.now();

      let totalTime = now - _startedAt;

      if (_pausedAt)
        totalTime = totalTime - (now - _pausedAt);

      return totalTime - _pausedTime;
    },
    get value() {

      const value = _frameCounter / nbFrames;

      return _easing(!reverse ? value : (1 - value));
    },
    get nbFrames() {

      if (nbFrames)
        return nbFrames;

      const duration = animation.duration;

      if (!duration)
        return;

      return (duration / 1000) * (Loop.fps)
    },
    get duration() {

      if (duration)
        return duration;

      const nbFrames = animation.nbFrames;

      if (!nbFrames)
        return;

      return nbFrames / (Loop.fps)
    },
    get state() {
      return {
        value: animation.value,
        nbFrames: animation.nbFrames,
        duration: animation.duration,
        played: animation.played,
        currentFrame: animation.currentFrame
      };
    }
  };

  return Object.assign(animation, Emitter(['start', 'stop', 'pause', 'unpause', 'tick']));
};
