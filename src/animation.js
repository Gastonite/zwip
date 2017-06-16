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

  assert(!isUndefined(duration) ^ !isUndefined(nbFrames), `Exactly one option of ['duration', 'nbFrames'] is required`);

  if (duration)
    assert(isInteger(duration) && duration > 0, `'duration' must be an integer greater than 0`);

  if (nbFrames)
    assert(isInteger(nbFrames) && nbFrames > 0, `'nbFrames' must be an integer greater than 0`);

  _easing = internal.parseEasing(_easing);
  _reverse = !!_reverse;

  let _startedAt;
  let _pausedAt;
  let _pausedTime;
  let _frameCounter = 0;

  const animation = {
    isZwipAnimation: true,
    start(options = {}) {

      if (_startedAt)
        throw new Error(`Animation is already started`);

      isObject(options, 'options');

      if ('reverse' in options)
        _reverse = !!options.reverse;

      _pausedAt = null;
      _startedAt = Date.now();
      _frameCounter = 0;
      _pausedTime = 0;
      _start(options);
      _status = 'started';

      Loop.register(animation);

      animation.emit('start');
    },
    stop() {

      _pausedAt = null;
      _startedAt = null;
      _pausedTime = null;
      _status = 'stopped';
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

        const recalculated = Math.floor((_frameCounter * duration) / playedTime);

        if (recalculated > _frameCounter)
          nbFrames = recalculated;
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

      const value = _frameCounter / animation.nbFrames;

      if (value < 0) {
        console.error('value is < 0', value);
        return 0;
      }

      if (value > 1) {
        console.error('value is > 1', value);
        return 1;
      }

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
        status: _status,
        value: animation.value,
        nbFrames: animation.nbFrames,
        duration: animation.duration,
        played: animation.played,
        currentFrame: animation.currentFrame
      };
    }
  };

  Object.assign(animation, Emitter(['start', 'stop', 'pause', 'unpause', 'tick']));

  let _status = 'created';

  return animation;
};

internal.Animation.isAnimation = input => isObject(input) && input.isZwipAnimation === true;
