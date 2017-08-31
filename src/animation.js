import Zwip from './zwip';
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

  try {
    isObject(options, 'options');
    isUndefined(options.isZwipAnimation, 'isZwipAnimation');

    const {
      start:_start = noop,
      stop:_stop = noop,
      update:_update = noop,
      render:_render = noop,
      duration:_duration,
      frequency:_frequency = 1
    } = options;

    let {
      reverse:_reverse,
      easing:_easing,
      nbFrames:_nbFrames,
    } = options;

    assert(isFunction(_start), `'start' must be a function`);
    assert(isFunction(_stop), `'stop' must be a function`);
    assert(isFunction(_update), `'update' must be a function`);
    assert(isFunction(_render), `'render' must be a function`);

    assert(isInteger(_frequency) && _frequency > 0, `'frequency' must be an integer greater than 0`);

    assert(_duration ^ _nbFrames, `Exactly one option of ['duration', 'nbFrames'] is required`);

    if (_duration)
      assert(isInteger(_duration) && _duration > 0, `'duration' must be an integer greater than 0`);

    if (_nbFrames)
      assert(isInteger(_nbFrames) && _nbFrames > 0, `'nbFrames' must be an integer greater than 0`);

    _easing = internal.parseEasing(_easing);
    _reverse = !!_reverse;

    let _status = 'created';
    let _state = {};
    let _startedAt;
    let _pausedAt;
    let _pausedTime;
    let _frameCounter = 0;

    const _setState = newState => _state = isObject(newState) ? newState : {};

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

        _setState(_start(options));

        _status = 'started';

        Zwip.register(animation);

        animation.emit('start');
      },
      reset() {

        assert(_status === 'stopped', `Animation must be stopped`);

        _frameCounter = 0;
        _setState(_update());
        animation.render();
      },
      stop() {

        _pausedAt = null;
        _startedAt = null;
        _pausedTime = null;
        _status = 'stopping';

        _frameCounter = _nbFrames;
        _setState(_update());
        animation.render();

        Zwip.deregister(animation);

        _status = 'stopped';

        _stop();

        // animation.deregister();
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
        console.log('_status=', _status);
        console.log('_state=', _state);

        const isStopping = _status === 'stopping';

        if (!_startedAt/* && !isStopping*/)
          return;

 /*       if (isStopping) {

        }
          console.error('stopping');*/

        if (_nbFrames && (_frameCounter >= _nbFrames))
          return animation.stop();

        _frameCounter++;

        if (_duration) {

          const playedTime = animation.played;

          const recalculated = Math.floor((_frameCounter * _duration) / playedTime);

          if (recalculated > _frameCounter)
            _nbFrames = recalculated;
        }

        _setState(_update());

      },
      render() {
        _render(_state);
      },
      deregister: Zwip.deregister.bind(null, animation),
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

        if (_nbFrames)
          return _nbFrames;

        const duration = animation.duration;

        if (!duration)
          return;

        return (duration / 1000) * (Zwip.fps)
      },
      get duration() {

        if (_duration)
          return _duration;

        const nbFrames = animation.nbFrames;

        if (!nbFrames)
          return;

        return nbFrames / (Zwip.fps)
      },
      set duration(newDuration) {
        const isRegistered = Zwip.isRegistered(animation);
        console.log('set duration', isRegistered, _duration);
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

    return animation;
  } catch (err) {


    err.message = `Invalid animation: ${err.message}`;
    throw err;
  }


};

internal.Animation.isAnimation = input => isObject(input) && input.isZwipAnimation === true;
