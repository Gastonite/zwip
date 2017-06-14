import Loop from './loop';
import Emitter from 'klak';
import { isInteger, isString, isObject, isFunction, isUndefined, noop, assert } from './utils';
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

export default internal.Animation = (options = {}) => {

  isObject(options, 'options');
  isUndefined(options.isZwipAnimation, 'isZwipAnimation');

  const {
    start:_start = noop,
    stop:_stop = noop,
    update:_update = noop,
    render:_render = noop,
    duration,
    frequency:_frequency = 1
  } = options;

  let {
    reverse:_reverse,
    easing:_easing,
    nbFrames,
  } = options;

  assert(isFunction(_start), `'start' must be a function`);
  assert(isFunction(_stop), `'stop' must be a function`);
  assert(isFunction(_update), `'update' must be a function`);
  assert(isFunction(_render), `'render' must be a function`);

  assert(isInteger(_frequency) && _frequency > 0, `'frequency' must be an integer greater than 0`);

  // console.log(duration, nbFrames, )
  if (!(!isUndefined(duration) ^ !isUndefined(nbFrames)))
    throw new Error(`Exactly one option of ['duration', 'nbFrames'] is required`);


  if (duration)
    assert(isInteger(duration) && duration > 0, `'duration' must be an integer greater than 0`);

  if (nbFrames)
    assert(isInteger(nbFrames) && nbFrames > 0, `'nbFrames' must be an integer greater than 0`);

  _easing = internal.parseEasing(_easing);
  _reverse = !!_reverse;

  let _startedAt;
  let _pausedAt;
  let _pausedTime;
  let _frameCounter;
  console.log('frequency', _frequency)

  const animation = {
    isZwipAnimation: true,
    start(options = {}) {

      if (_startedAt)
        throw new Error(`Animation is already started`);

      // console.log('Animation.start()', options)

      isObject(options, 'options');

      // const reverse = 'reverse' in options ? !!options.reverse : _reverse;
      if ('reverse' in options)
        _reverse = !!options.reverse;

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
    get reverse() {
      return _reverse;
    },
    get frequency() {
      return _frequency;
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

      return _easing(!_reverse ? value : (1 - value));
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

internal.Animation.isAnimation = input => isObject(input) && input.isZwipAnimation === true;
