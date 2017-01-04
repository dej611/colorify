/* @flow */

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loadImage = (url, onLoad) => {
  const image = document.createElement('img');
  // for now do not throw any error
  image.onload = image.onerror = onLoad;
  image.src = url;
};

// add a timeout: if the image takes longer than ms just return an empty result in the the promise
const promisify = (url, ms) =>
        new Promise((resolve) => Promise.race([
          loadImage(url, resolve),
          timeout(ms),
        ]));

export default (images, options) => {
  const toLoad = images
    .map( (url) => promisify(url, options.timeout) );

  return Promise.all(toLoad);
};
