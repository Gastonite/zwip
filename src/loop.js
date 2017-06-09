import Emitter from 'klak';

import { assert, isRequired, isFunction, isString, isObject, isInteger, noop } from './utils';

const internals = {
  animations: [],
  listeners: [],
  state: {
    status: 'initialized'
  },
  fps: 60,
  listenerTypes: ['start', 'stop', 'pause', 'unpause']
};


internals.loop = () => {

  if (internals.paused)
    return;

  internals.requestId = requestAnimationFrame(internals.loop);
  internals.now = Date.now();


  internals.interval = 1000 / internals.fps;
  internals.delta = internals.now - internals.then;

  if (internals.delta > internals.interval) {

    internals.AnimationLoop.frame();
  }
};

internals.MethodCaller = (key, ...args) => {

  isRequired(key, 'key');
  isString(key, 'key');

  return animation => {

    if (animation[key] && (internals.counter % animation.frequency === 0))
      animation[key](...args);

  }
};

internals.emitTick = internals.MethodCaller('emit', 'tick');
internals.callUpdate = internals.MethodCaller('update');
internals.callRender = internals.MethodCaller('render');
internals.callPause = internals.MethodCaller('pause');

internals.isNotPaused = object => !object.pausedAt;

internals.AnimationLoop = {
  start() {

    if (internals.requestId)
      throw new Error('Loop is already started');

    internals.counter = 0;
    internals.paused = null;
    internals.then = Date.now();
    internals.state.status = 'started';

    internals.loop();

    this.emit('start');
  },
  stop() {

    if (internals.requestId)
      cancelAnimationFrame(internals.requestId);

    internals.requestId = null;
    internals.state.status = 'stopped';

    this.emit('stop');
  },
  pause() {

    if (internals.paused) {

      internals.paused = null;
      internals.state.status = 'started';

      internals.animations.forEach(internals.callPause);

      this.emit('unpause');

      internals.loop();
      return;
    }

    internals.animations.forEach(internals.callPause);

    internals.paused = Date.now();
    internals.state.status = 'paused';

    this.emit('pause');
  },
  register(animation, auto = true) {

    isObject(animation, 'animation');

    animation.frequency = animation.frequency || 1;

    isInteger(animation.frequency, 'frequency');

    assert(isFunction(animation.render) || isFunction(animation.update), `'render' or 'update' method is required`);


    animation.render = animation.render || noop;
    animation.update = animation.update || noop;

    if (auto && !internals.requestId)
      internals.AnimationLoop.start();

    if (internals.animations.includes(animation))
      return;

    internals.animations.push(animation);

  },
  deregister(animation, auto = true) {

    const index = internals.animations.indexOf(animation);

    if (~index)
      internals.animations.splice(index, 1);

    if (auto && internals.requestId && !internals.animations.length)
      internals.AnimationLoop.stop();

  },

  frame() {

    internals.counter++;

    internals.elapsed = internals.now - internals.then;
    internals.then = internals.now - (internals.delta % internals.interval);

    internals.state.fps = 1000 / internals.elapsed;
    internals.state.animations = internals.animations.length;
    internals.state.frames = internals.counter;

    const animations = internals.animations.filter(internals.isNotPaused);

    animations.forEach(internals.emitTick);

    animations.forEach(internals.callUpdate);

    animations.forEach(internals.callRender);
  },

  get state() {
    return internals.state;
  },
  get fps() {
    return internals.fps;
  },
  set fps(newValue) {

    isInteger(newValue, 'fps');

    internals.fps = newValue;
  }
};

export default Object.assign(
  internals.AnimationLoop,
  Emitter(['start', 'stop', 'pause', 'unpause'])
);