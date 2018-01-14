/* @flow */

import { ensureArray, ensureColors } from './util';
import createMasks from './mask';
import colorize from './painter.js';

export const createMask = createMasks;
export const recolor = colorize;

export default async (images, colors, options) => {
  images = ensureArray(images);
  colors = ensureColors(colors);

  const masks = await createMasks(images, options);
  const recolored = masks.reduce((loaded, mask, index) => {
    const url = images[index];

    if (!loaded.has(url)) {
      loaded.set(url, colorize(mask, colors, options));
    }

    return loaded;
  }, new Map());
  return images.map(url => recolored.get(url));
};
