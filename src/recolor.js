/* @flow */

import createMasks from './mask.js';
import colorize from './painter.js';
import imageLoader from './imageLoader.js';

export default async (definitions, options) => {
  // split image data from colour data
  const images = definitions.map(definition => definition.url);
  const loaded = await imageLoader(images);
  const masks = await createMasks(loaded, options);
  return colorize(masks, options);
};
