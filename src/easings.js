export const EaseIn  = power => t => Math.pow(t, power);
export const EaseOut = power => t => 1 - Math.abs(Math.pow(t - 1, power));
export const EaseInOut = power => t =>
  t < .5
    ? EaseIn(power)(t * 2) / 2
    : EaseOut(power)(t * 2 - 1) / 2 + 0.5;


export const easings = {
  linear: EaseInOut(1),
  easeInQuad: EaseIn(2),
  easeOutQuad: EaseOut(2),
  easeInOutQuad: EaseInOut(2),
  easeInCubic: EaseIn(3),
  easeOutCubic: EaseOut(3),
  easeInOutCubic: EaseInOut(3),
  easeInQuart: EaseIn(4),
  easeOutQuart: EaseOut(4),
  easeInOutQuart: EaseInOut(4),
  easeInQuint: EaseIn(5),
  easeOutQuint: EaseOut(5),
  easeInOutQuint: EaseInOut(5),
  easeInCirc: t => -(Math.sqrt(1 - easings.easeInQuad(t)) - 1),
  easeOutCirc: t => Math.sqrt(easings.easeOutQuad(t))
};




