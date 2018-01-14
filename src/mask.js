/* @flow */

import { ensureArray, createCanvas } from './util';
import imageLoader from './imageLoader';
import validator, { validateStrategy } from './validator';
// Some greyscale strategies
import strategies from './strategies/index';

const maskMaker = (image, strategy) => {
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  // paste the image in the canvas
  ctx.drawImage(image, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // grab the raw pixels from the imgData
  const { data } = imgData;

  // TODO: make a WebWorker do this stuff to avoid blocking the main thread
  let maxAvg = 0;

  for (let i = 0; i < data.length; i += 4) {
    // do not process transparent pixels (fourth component of the pixel data)
    if (data[i + 3]) {
      data[i] = data[i + 1] = data[i + 2] = strategy(data[i], data[1], data[2]);
      // remember the highest average
      maxAvg = Math.max(maxAvg, data[i]);
    }
  }

  // Now find how far the highest average is from the white
  const toWhite = 255 - maxAvg;

  // Iterate again and push all the averages by $toWhite
  for (let i = 0; i < data.length; i += 4) {
    // filter transparent pixels again
    if (data[i + 3]) {
      // it is an average, so the $i value is fine for the whole pixel
      const pixel = data[i];
      data[i] = data[i + 1] = data[i + 2] = pixel + toWhite;
    }
  }

  // now paste the processed image (the mask) in the canvas again
  ctx.putImageData(imgData, 0, 0);

  // return the mask
  return canvas;
};

const makeMasksFromImages = async (images, options) => {
  const loaded = await imageLoader(images, options);
  return loaded.reduce((memo, image, index) => {
    memo[images[index]] = maskMaker(image, options.strategy);
    return memo;
  }, {});
};

// Mask Maker
export default async (images, options) => {
  images = ensureArray(images);

  const defaults = {
    booleans: {},
    strings: {},
    functions: {},
  };

  const opts = validator(options, defaults);
  // the mask strategy requires a dedicated validator
  opts.strategy = validateStrategy(opts, strategies);

  const masks = await makeMasksFromImages(images, opts);
  return images.map(url => masks[url]);
};
