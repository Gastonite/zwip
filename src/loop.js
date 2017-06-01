import Emitter from './emitter';

import { isRequired, isFunction, isString, isObject, isInteger, noop } from './utils';

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

    internals.Loop.frame();
  }
};

internals.MethodCaller = (key, ...args) => {

  isRequired(key, 'key');
  isString(key, 'key');

  return object => {

    if (object[key])
      object[key](...args);

  }
};
internals.callUpdate = internals.MethodCaller('update');
internals.callRender = internals.MethodCaller('render');
internals.callPause = internals.MethodCaller('pause');

internals.isNotPaused = object => !object.pausedAt;

internals.Loop = {
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

    animation.update = animation.update || noop;

    isFunction(animation.update, 'update');
    isFunction(animation.render, 'render');

    if (auto && !internals.requestId)
      internals.Loop.start();

    if (internals.animations.includes(animation))
      return;

    internals.animations.push(animation);

  },
  deregister(animation, auto = true) {

    const index = internals.animations.indexOf(animation);

    if (~index)
      internals.animations.splice(index, 1);

    if (auto && internals.requestId && !internals.animations.length)
      internals.Loop.stop();

  },

  frame() {

    internals.counter++;

    internals.elapsed = internals.now - internals.then;
    internals.then = internals.now - (internals.delta % internals.interval);

    internals.state.fps = 1000 / internals.elapsed;
    internals.state.animations = internals.animations.length;
    internals.state.frames = internals.counter;

    const animations = internals.animations.filter(internals.isNotPaused);

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
  internals.Loop,
  Emitter(['start', 'stop', 'pause', 'unpause'])
);