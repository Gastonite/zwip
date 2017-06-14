import Animation from './animation';
import { noop, isInteger, isArray, isObject } from './utils';

const Chain = (options = {}) => {

  const {
    duration,
    frequency,
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

      error('Chain.start() actual:', _reverse, 'option:', reverse, '1:',animations[0].reverse, '2:',animations[1].reverse);

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

        // if (reverse && reverseHasChanged)
        // if (reverseHasChanged )
        if (reverseHasChanged)
          options.reverse = !animation.reverse;
        // options.reverse = reverse;

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
// const Chain = (options = {}) => {
//
//   const { animations, duration } = _parseOptions(options);
//
//   const durationsSum = animations.reduce((sum, animation, i) => {
//
//     if (!animation || animation.isZwipAnimation !== true)
//       throw new Error(`Invalid Chain: Invalid "animations" option: item at position ${i} is not a Zwip animation`);
//
//     return sum + animation.duration;
//   }, 0);
//
//   if (duration !== durationsSum)
//     throw new Error(`Invalid Chain: The total duration is not equal to the sum of the duration of the "animations"`);
//
//
//   return Animation({
//     duration,
//     start(options) {
//
//       console.log('Chain.start()', options.reverse);
//
//       let _items = animations;
//
//       if (options.reverse)
//         _items = _items.reverse();
//
//       _items.forEach((animation, i) => {
//
//         console.error('chain_'+i, animation.id, animation, options.reverse);
//
//         const _startNextAnimation = () => {
//
//           // console.error('chain_'+i, 'stop');
//
//           if (i < _items.length - 1) {
//
//             // console.error('chain_'+i, 'next', _items[i + 1].id, options.reverse);
//
//             _items[i + 1].start({ reverse: options.reverse });
//
//             animation.off('stop', _startNextAnimation);
//           }
//         };
//
//         animation.on('stop', _startNextAnimation);
//       });
//
//       animations[0].start();
//     }
//   });
// };

export default Chain;