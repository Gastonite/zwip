import Emitter from 'klak';

import { assert, isRequired, isFunction, isString, isObject, isInteger, noop } from './utils';

const internal = {
  animations: [],
  state: {
    status: 'initialized'
  },
  fps: 60,
  listenerTypes: ['start', 'stop', 'pause', 'unpause']
};


internal.loop = () => {

  if (internal.state.status !== 'started')
    return;

  internal.requestId = requestAnimationFrame(internal.loop);
  internal.now = Date.now();


  internal.interval = 1000 / internal.fps;
  internal.delta = internal.now - internal.then;

  if (internal.delta > internal.interval) {

    internal.Zwip.frame();
  }
};

// internal.MethodCaller = (key, ...args) => {
//
//   isRequired(key, 'key');
//   isString(key, 'key');
//
//   return animation => {
//
//     // console.log(internal.counter, animation, animation.frequency, internal.counter % animation.frequency)
//     if (animation[key] && (internal.counter % animation.frequency === 0))
//       animation[key](...args);
//
//   }
// };
internal.MethodCaller = (key, ...args) => object => object[key](...args);

internal.emitTick = internal.MethodCaller('emit', 'tick');
internal.callUpdate = internal.MethodCaller('update');
internal.callRender = internal.MethodCaller('render');
internal.callPause = internal.MethodCaller('pause');

internal.isNotPaused = object => !object.pausedAt;

internal.isAnimationStale = animation => internal.counter % animation.frequency === 0;

internal.Zwip = {
  start() {

    if (internal.requestId)
      throw new Error('Loop is already started');

    internal.counter = 0;
    internal.paused = null;
    internal.then = Date.now();
    internal.state.status = 'started';

    internal.loop();

    internal.Zwip.emit('start');
  },
  stop() {

    if (internal.requestId)
      cancelAnimationFrame(internal.requestId);

    internal.requestId = null;
    internal.state.status = 'stopped';

    internal.Zwip.emit('stop');
  },
  pause() {

    if (internal.paused) {

      internal.paused = null;
      internal.state.status = 'started';

      internal.animations.forEach(internal.callPause);

      internal.Zwip.emit('unpause');

      internal.loop();
      return;
    }

    internal.animations.forEach(internal.callPause);

    internal.paused = Date.now();
    internal.state.status = 'paused';

    internal.Zwip.emit('pause');
  },
  isRegistered: animation => internal.animations.includes(animation),
  register(animation, auto = true) {

    isObject(animation, 'animation');

    assert(animation.isZwipAnimation === true, `'animation' must be a ZwipAnimation object`);

    assert(isFunction(animation.render) || isFunction(animation.update), `At least 'render' or 'update' method is required`);

    animation.render = animation.render || noop;
    animation.update = animation.update || noop;

    if (auto && !internal.requestId)
      internal.Zwip.start();

    if (internal.Zwip.isRegistered(animation))
      return;

    internal.animations.push(animation);
  },
  deregister(animation, auto = true) {

    const index = internal.animations.indexOf(animation);

    if (~index)
      internal.animations.splice(index, 1);

    if (auto && internal.requestId && internal.animations.length < 1)
      internal.Zwip.stop();

  },

  frame() {

    internal.Zwip.emit('tick');

    internal.counter++;

    internal.elapsed = internal.now - internal.then;
    internal.then = internal.now - (internal.delta % internal.interval);

    internal.state.fps = 1000 / internal.elapsed;
    internal.state.animations = internal.animations.length;
    internal.state.frames = internal.counter;

    const startedAnimations = internal.animations.filter(internal.isNotPaused);

    const staleAnimations = startedAnimations.filter(internal.isAnimationStale);

    staleAnimations.forEach(internal.emitTick);
    staleAnimations.forEach(internal.callUpdate);
    staleAnimations.forEach(internal.callRender);

    // const states = staleAnimations.map(internal.callUpdate);
    //
    // console.log('states:', states)
    // states.forEach((state, i) => {
    //   const animation = staleAnimations[i];
    //
    //   animation.render(state || {});
    // });

    // startedAnimations.forEach(internal.callRender);
  },

  get state() {
    return internal.state;
  },
  get fps() {
    return internal.fps;
  },
  set fps(newValue) {

    isInteger(newValue, 'fps');

    internal.fps = newValue;
  }
};

export default Object.assign(
  internal.Zwip,
  Emitter(['start', 'stop', 'pause', 'unpause', 'tick'])
);