/* @flow */

import createMasks from './mask.js';
import colorize from './painter.js';
import imageLoader from './imageLoader.js';

export default (definitions, options) => {
  // split image data from colour data
  const images = definitions.map((definition) => definition.url);
  return imageLoader(images)
    .then((loaded) => createMasks(loaded, options))
    .then((masks) => colorize(masks, options));
};
