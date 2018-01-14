/* @flow */

export const isDefined = value => value != null;

export const isString = value => typeof value === 'string';

export const isFunction = value => typeof value === 'function';

export const ensureArray = value => (Array.isArray(value) ? value : [value]);

export const isGradient = color =>
  Array.isArray(color) && !isString(color[0]) && 'value' in color[0];

export const ensureColors = colors =>
  isGradient(colors) ? [colors] : ensureArray(colors);

export const createCanvas = (w, h) => {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
};

const checkBlendsSupport = () => {
  const canvas = createCanvas(1, 1);
  const ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'screen';
  return ctx.globalCompositeOperation === 'screen';
};

export const hasCanvasBlends = checkBlendsSupport();
