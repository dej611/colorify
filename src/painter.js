/* @flow */
import { isGradient, ensureArray, createCanvas, hasCanvasBlends } from './util';
import validator from './validator';
import recolorWithBlends from './painters/blends';
import recolorWithPixelManipulation from './painters/pixelByPixel';

const recolorImage = (mask, colors) => {
  const width = mask.width;
  const height = mask.height;

  // create a new canvas for each new colored version of the image
  const targets = colors.map(() => createCanvas(width, height));

  // Check the support for advanced canvas features and use the appropriate processor
  const processor = hasCanvasBlends
    ? recolorWithBlends
    : recolorWithPixelManipulation;
  processor(mask, targets, colors);

  return targets.map(canvas => canvas.toDataURL());
};

export default (mask, colors, options) => {
  const defaults = {
    booleans: {},
    strings: {},
    functions: {},
  };

  options = validator(options, defaults);
  colors = isGradient(colors) ? [colors] : ensureArray(colors);

  return recolorImage(mask, colors);
};
