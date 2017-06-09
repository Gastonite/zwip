import Animation from './animation';
import { isInteger, isArray, isObject, EqualityChecker } from './utils';

const _parseOptions = options => {

  isObject(options, 'options');
  isInteger(options.duration, 'duration');
  isArray(options.animations, 'animations');

  if (!options.animations.length)
    throw new Error(`Chain expect an array of Zwip animations`);

  return options;
};

const Chain = (options = {}) => {

  const { animations, duration } = _parseOptions(options);

  const durationsSum = animations.reduce((sum, animation, i) => {

    if (!animation || animation.isZwipAnimation !== true)
      throw new Error(`Invalid Chain: Invalid "animations" option: item at position ${i} is not a Zwip animation`);

    return sum + animation.duration;
  }, 0);

  if (duration !== durationsSum)
    throw new Error(`Invalid Chain: The total duration is not equal to the sum of the duration of the "animations"`);

  return Animation({
    duration,
    start() {

      animations.forEach((animation, i) => {
        console.error('chain_'+i, animations.length,  i > 0 && i < animations.length - 1);


        animation.on('stop', () => {
          console.error('chain_'+i, 'stop');
          if (i < animations.length - 1) {

            animations[i + 1].start();
          }

        });


      });

      animations[0].start()
    }
  });
};

export default Chain;