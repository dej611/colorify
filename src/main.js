/* @flow */

import { ensureArray, ensureColors } from './util';
import createMask from './mask';
import recolorMask from './recolor';

export default async (images, colors, options) => {
  images = ensureArray(images);
  colors = ensureColors(colors);

  const masks = await createMask(images, options);
  const recolored = masks.reduce((loaded, mask, index) => {
    const url = images[index];

    if (!loaded.has(url)) {
      loaded.set(url, recolorMask(mask, colors, options));
    }

    return loaded;
  }, new Map());
  return images.map(recolored.get);
};
