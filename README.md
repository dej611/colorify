Colorify
----------

Install the library
----------



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

FAQ
----------

**The Javascript console reports "The canvas has been tainted by cross-origin data"**

This is most probably because you're trying to use an image from a different domain (Cross Origin Resource Sharing) which is not allowed for security reasons: see this [SO explanation](http://stackoverflow.com/questions/13674835/canvas-tainted-by-cross-origin-data) for some details.  
Also, it may happen if you're using some SVGs: still [for security reasons](https://code.google.com/p/chromium/issues/detail?id=294129) it still not allowed.
Last option: have you started the web server when you're looking at the HTML page in Chrome? Using the file protocol every request for an external resource is considered CORS by default (see first point here then).

License
-----------

Licensed under GPL v.2 (see LICENSE file)