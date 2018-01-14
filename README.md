## Colorify

While working on some file manipulation I thought it may be useful to have a library to encapsulate some code I've been writing.
Maybe it can be useful for somebody, so here it is.

This library enable you to colorize images in one go to multiple colors.

For the moment only Canvas HTML5 API is used: in modern browsers it can use blend modes while the fallback for older browsers (IE...) is a more expensive pixel by pixel manipulation.

## Install the library

If you use `npm` just install the library:

```sh
$ npm install @dej611/colorify
```

or with `yarn`:

```sh
$ yarn add @dej611/colorify
```

If you want instead a drop-in file to use directly in your page, no problem, just grab the `colorify.min.js` file from the Release page and put it into your page:

```html
<script src="./path/to/colorify.min.js"></script>
```

## Use the library

There is a single main function exported by this library: `colorify`:

```js
import colorify from 'colorify'

const recolored = await colorify('my-image-url.png', ['red', 'blue']);

// here results will be an array of images (encoded in Base64 format)
for ( const newUrl of recolored ){
  const img = new Image();
  img.src = newUrl;
  // append it to the page
  document.body.appendChild(img);
}
```

This function will take an image as input, produce a mask and recolor the mask to produce the desired output. For deeper control over the API gives access to the function to produce the mask and to recolor it.

## Run the examples

Open the Command Prompt in Windows, the Terminal in OSX or the console in Linux and type:

```bash
python -m SimpleHTTPServer
```

Now open your browser and go to `http://localhost:8000/examples/<name-of-the-example>.htm`

# API Reference

### `colorify`

The full signature of the `colorify` function is the following:

```js
colorify(
  urls: String | Array<String>,
  colors: String | Array<String> | Gradient | Array<Gradient>,
  options: Object
)
  -> Promise<Array<String>>
```

* `url` can be either a `String` or an `Array` of `String`s. This parameter is mandatory.
* `colors` can be a `String` of color or an `Array` of `String` colors for solid colors. To use a gradient pass a `Gradient` object or an `Array` of `Gradient` objects. This parameter is mandatory.
* `options` is an `Object` that can change the default behaviour of the `colorify` process. This parameter is optional.
  The available options are:

  * `strategy`: is a `String`. This option tells `colorify` what strategy use to generate the `mask` for computing the recoloring. Available values are:

    * `average`: compute the mathematical average from the RGB values of each pixel. This is the **default**.
    * `grayscale`: compute the mask using a fix RGB formula based on human eye perception (ITU-R BT709)
    * `min`: compute the mask using the minimum RGB value found in the image.
    * `max`: compute the mask using the maximum RGB value found in the image.

For each `url` passed to `colorify`, a recolored copy will be generated based on the `Array` of colors passed next.
This means that for a single `url` passed with 2 colors the result will be made of 2 `base64` images.

```js
const results = await colorify('my-image.png', ['blue', 'red']);
// results here is an array of 2 images
...

// ... or without the async/await, just plain Promises
colorify('my-image.png', ['blue', 'red']).then(function(results) {
  // results here is an array of 2 images
});
```

If 2 `url`s are passed together with 2 colors, then 2 \* 2 = 4 `base64` images will be generated: each image recolored by the array of colors.

```js
const results = await colorify(['my-image.png', 'my-other-image.png'], ['blue', 'red']);
  // results here is an array of 4 images
...

// ... or without the async/await, just plain Promises
colorify(['my-image.png', 'my-other-image.png'], ['blue', 'red']).then(function(
  results
) {
  // results here is an array of 4 images
});
```

### `createMask`

This function is used by `colorify` to generate a mask (grey-based image) from the input Image. The full signature of the `createMask` function is the following:

```js
createMask(
  urls: String | Array<String>,
  options: Object
)
  -> Promise<Array<String>>
```

* `url` can be either a `String` or an `Array` of `String`s. This parameter is mandatory.
* `options` is an `Object` that can change the default behaviour of the `colorify` process. This parameter is optional.
  The available options are:

  * `strategy`: is a `String`. This option tells `colorify` what strategy use to generate the `mask` for computing the recoloring. Available values are:

    * `average`: compute the mathematical average from the RGB values of each pixel. This is the **default**.
    * `grayscale`: compute the mask using a fix RGB formula based on human eye perception (ITU-R BT709)
    * `min`: compute the mask using the minimum RGB value found in the image.
    * `max`: compute the mask using the maximum RGB value found in the image.

### `colorize`

This function is used by `colorify` to recolor a mask Image to the final output. The full signature of the `recolor` function if the following:

```js
colorize(
  mask: CanvasNode,
  colors: String | Array<String> | Gradient | Array<Gradient>
)
  -> Array<String>
```

* `mask` is an `HTML Canvas` node containing the mask image to use as fundation for the recolor. This parameter is mandatory.
* `colors` can be a `String` of color or an `Array` of `String` colors for solid colors. To use a gradient pass a `Gradient` object or an `Array` of `Gradient` objects. This parameter is mandatory.

#### Color

Colorify supports 4 types of color format:

* Color strings as <color-named> values: i.e. `"red"` (See [MDN page](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Interpolation) for more information)
* Color hex values: i.e. `"#FF0000"` (case doesn't matter)
* Color in rgb(a) format: i.e. `"rgb(255, 0, 0)"` or `"rgba(255, 0, 0, 1)"`
* Color in HSL(a) format (**note**: not supported for Gradients): i.e. `"hsl(0, 100%, 50%)"`

#### Gradient

A `Gradient` is an object with the following format:

```js
{
  gradient: [
    // list of steps for the gradient
    { value: 0, color: 'red' },
    { value: 0.3, color: '#00FF00' },
    { value: 0.6, color: 'rgb(0,0,255)' },
    { value: 1, color: 'rgba(0,0,0,1)' },
  ];
}
```

## Contribute

Any contribute is very welcome:

* In case you find some bug please log an issue
* In case there's a pull request, please add a test for the issue fixed (testing arriving soon...)

You're very welcome to fork the project and, of course, send a PR if you think you can improve or fix it.

To start the project in development mode just clone this repository locally and type:

```sh
$ npm start
```

In case you have any good idea to propose to the project let me know, you can find me here: [@dej611](https://twitter.com/dej611).

## FAQ

**The Javascript console reports "The canvas has been tainted by cross-origin data"**

This is most probably because you're trying to use an image from a different domain (Cross Origin Resource Sharing) which is not allowed for security reasons: see this [SO explanation](http://stackoverflow.com/questions/13674835/canvas-tainted-by-cross-origin-data) for some details.  
Also, it may happen if you're using some SVGs: still [for security reasons](https://code.google.com/p/chromium/issues/detail?id=294129) it still not allowed.
Last option: have you started the web server when you're looking at the HTML page in Chrome? Using the file protocol every request for an external resource is considered CORS by default (see first point here).

## Roadmap

* [ ] Example with Custom mask
* [ ] Apply Flow types
* [ ] Test suite
* [ ] React / Vue example
* [ ] Angular 2+ example
* [ ] WebGL version?

## License

Licensed under GPL v.2 (see LICENSE file)
