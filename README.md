Colorify
----------

While working on some file manipulation I thought it may be useful to have a library to encapsulate some code I've been writing.
Maybe it can be useful for somebody, so here it is.

This library enable you to colorize images in one go to multiple colors.

for the moment only Canvas HTML5 API is used: in modern browsers it can use blend modes while the fallback for older browsers (IE...) is a more expensive pixel by pixel manipulation.

Install the library
----------

Browser installation: get the minified `colorify.min.js` file and add it to your page:

```html
<script src="./path/to/colorify.min.js"></script>
```

NPM & Bower: coming soon...

Use the library
----------

Create a painter, then use it to colorize your images: the result will be the second argument in the callback.

```js
var painter = Colorify.create();

painter.colorify('my-image-url.png', ['red', 'blue', etc...], {}, function(error, results){
	// here results will be an array of images (encoded in Base64 format)
	imageElement.src = results[0];
});
```

For the full API documentation have a look at: [Colorify page](...)


Run the examples
----------

Open the Command Prompt in Windows, the Terminal in OSX or the console in Linux and type:

```bash
python -m SimpleHTTPServer
```

Now open your browser and go to `http://localhost:8000/examples/<name-of-the-example>.htm`

Contribute
----------

Any contribute is very welcome:

* In case you find some bug please log an issue
* In case there's a pull request, please add a test for the issue fixed (testing arriving soon...)

In case you have any good idea to propose to the project let me know, you can find me here: [@dej611](https://twitter.com/dej611).

This project uses Gulp as build system, so it's enough to run `gulp` in your console to make the minified version.

FAQ
----------

**The Javascript console reports "The canvas has been tainted by cross-origin data"**

This is most probably because you're trying to use an image from a different domain (Cross Origin Resource Sharing) which is not allowed for security reasons: see this [SO explanation](http://stackoverflow.com/questions/13674835/canvas-tainted-by-cross-origin-data) for some details.  
Also, it may happen if you're using some SVGs: still [for security reasons](https://code.google.com/p/chromium/issues/detail?id=294129) it still not allowed.
Last option: have you started the web server when you're looking at the HTML page in Chrome? Using the file protocol every request for an external resource is considered CORS by default (see first point here).

License
-----------

Licensed under GPL v.2 (see LICENSE file)