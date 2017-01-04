/* @flow */

import {ensureArray, ensureColors} from './util';
import createMask from './mask';
import recolorMask from './recolor';

export default (images, colors, options) => {
  images = ensureArray(images);
  colors = ensureColors(colors);

  return createMask(images, options)
    .then( (masks) => masks.reduce( (loaded, mask, index) => {
        const url = images[index];

        if(!loaded.has(url)) {
          loaded.set( url, recolorMask(mask, colors, options) );
        }

        return loaded;
      }, new Map())
    )
    .then( (recolored) => images.map( recolored.get ) );
};
