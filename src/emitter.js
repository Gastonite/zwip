import { isArray, isString, isFunction } from '../src/utils';

const internals = {};

internals.TypeFilter = type => value => value.type === type;
internals.getHandler = value => value.handler;

internals.Emitter = (types) => {

  isArray(types, 'types');

  const _listeners = [];

  const emitter =  {
    on(type, handler) {

      if (isArray(type))
        return type.map(type => emitter.on(type, handler));

      isString(type, 'type');

      if (!types.includes(type))
        throw new Error(`"${type}" listener type is not allowed`);

      if (isArray(handler))
        return handler.map(handler => emitter.on(type, handler));

      isFunction(handler, 'handler');

      const handlerExists = _listeners
        .filter(internals.TypeFilter(type))
        .map(internals.getHandler)
        .includes(handler);

      if (handlerExists)
        return;

      _listeners.push({ type, handler });
    },
    emit(type, ...args) {

      isString(type, 'type');

      _listeners
        .filter(internals.TypeFilter(type))
        .map(internals.getHandler)
        .forEach(handler => {
          handler(...args);
        })

    }
  };

  return emitter;
};

export default internals.Emitter;
