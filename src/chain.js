import Animation from './animation';
import { noop, isInteger, isArray, isObject } from './utils';

const Chain = (options = {}) => {

  const {
    duration,
    animations,
    start = noop,
    stop = noop
  } = options = isObject(options, 'options');

  let { reverse = false } = options;

  isInteger(duration, 'duration');
  isArray(animations, 'animations');

  const durationsSum = animations.reduce((sum, animation, i) => {

    if (!Animation.isAnimation(animation))
      throw new Error(`Invalid Chain: Invalid "animations" option: item at position ${i} is not a Zwip animation`);

    return sum + animation.duration;
  }, 0);

  if (duration !== durationsSum)
    throw new Error(`Invalid Chain: 'duration' must be equal to the sum of 'animations' durations`);

  let _started = false;
  let _reverse = false;

  const chain = {
    duration,
    animations,
    start(options = {}) {

      if (_started)
        throw new Error(`Chain is already started`);

      _started = true;

      let { reverse } = isObject(options, 'options');

      reverse = !!reverse;

      start();

      let items = animations;

      const reverseHasChanged = reverse !== _reverse;
      if (reverseHasChanged) {
        _reverse = !_reverse;
      }
      if (reverse) {
        items = animations.slice(0).reverse();
      }

      const _startAnimation = animation => {

        const options = {};

        if (reverseHasChanged)
          options.reverse = !animation.reverse;

        animation.start(options);
      };

      items.forEach((item, i) => {

        const isFirst = i === 0;
        if (isFirst)
          _startAnimation(item);

        const _nextAnimation = () => {

          item.off('stop', _nextAnimation);

          if (i >= items.length - 1)
            return chain.stop();

          _startAnimation(items[i + 1]);
        };

        item.on('stop', _nextAnimation);
      });

    },
    stop() {

      stop();
      _started = false;
    }
  };

  return Object.freeze(chain);
};


export default Chain;