var Colorify = {
	version: '0.1.0'
};

// define Colorify for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = Colorify;

// define Colorify as an AMD module
} else if (typeof define === 'function' && define.amd) {
	define(Colorify);
}

// define Colorify as a global Colorify variable
if (typeof window !== 'undefined') {
	window.Colorify = Colorify;
}