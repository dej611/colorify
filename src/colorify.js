/**
*
* Copyright (c) 2015 Marco Liberati
* Distributed under the GNU GPL v2. For full terms see the file LICENSE.
*
*/
(function (exports){

  // ref: http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
  function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }

  function isString(obj){
    return typeof obj === 'string';
  }

  function isSet(obj){
    // I'm a bit lazy here, but != will cast undefined to null
    return obj != null;
  }

  function ensureArray(obj, checkString){
    if(checkString){
      return Array.isArray(obj) ? obj : isString(obj) ? [obj] : [];
    }
    return Array.isArray(obj) ? obj : [obj];
  }
  
  function createCanvas(width, height){
    var canvas = document.createElement('canvas');
    canvas.width = width || 1;
    canvas.height = height || 1;
    return canvas;
  }

  // ref: https://gist.github.com/infn8/760d30977a89b0d3d975
  function hasBlendModes(){
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    var ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'screen';
    return ctx.globalCompositeOperation === 'screen';
  }

  function validateOptions(passed, booleans, strings, functions){
    var newOptions = {};

    var boolList = Object.keys(booleans);

    boolList.forEach(function (field){
      newOptions[field] = isSet(passed[field]) ? !!passed[field] : booleans[field];
    });

    var stringList = Object.keys(strings);
    stringList.forEach(function (field){
      newOptions[field] = isString(passed[field]) ? passed[field] : strings[field];
    });

    var fnList = Object.keys(functions);
    fnList.forEach(function (field){
      newOptions[field] = isFunction(passed[field]) ? passed[field] : functions[field];
    });

    var more = Object.keys(passed);
    more.forEach(function (field){
      if(!(field in newOptions)){
        newOptions[field] = passed[field];
      }
    });

    return newOptions;
  }

  function getErrors(errors){
    var error = null;
    if(errors.length){
      var list = errors.map(function (err){
        return err.message;
      });
      error = new Error('Error loading the following images: '+list.join(','));
    }
    return error;
  }

  function makeMask(images, opts, callback){

    // avoid the effort if there's no callback
    if(!isFunction(callback)){
      return;
    }

    // validate the input
    images = ensureArray(images, true);

    // validate the options
    opts = validateOptions(opts, {}, {}, {canvasMaker: createCanvas});

    // Which function to use to transform the image to grayscale?
    function average(r, g, b){
      return Math.floor((r + g + b) / 3);
    }

    function grayscale(r, g, b){
     return Math.floor((0.2125 * r) + (0.7154 * g) + (0.0721 * b));
    }
    var avgFn = {
      average: average,
      maxLuminosity: Math.max,
      minLuminosity: Math.min,
      // Oh English spelling....
      greyscale: grayscale,
      grayscale: grayscale
    };
    // Check if it has been passed
    opts.strategy = isSet(opts.strategy) ? opts.strategy : 'average';
    // Now check if it's a valid string passed
    opts.strategy = isString(opts.strategy) && (opts.strategy in avgFn) ? avgFn[opts.strategy] : opts.strategy;
    // Last, make it a function (or just get the passed function)
    opts.strategy = isFunction(opts.strategy) ? opts.strategy : avgFn.average;
    
    makeMasksFromImages(images, opts, function (errors, greys){
      // return an array of greys, with the same order of the given images
      var masks = images.map(function (url){
        return greys[url];
      });
      return callback(getErrors(errors), masks);
    });
  }

  function makeMasksFromImages(images, options, callback){
    // load images

    var loaded  = {};
    var counter = 0;
    var masks   = {};
    var errors = [];

    images.forEach(function (url){

      if(!loaded[url]){
        var image = new Image();
        image.onload = imageLoaded;
        // catch error too
        image.onerror = imageLoaded;
        image.src = url;
        loaded[url] = image;
      } else {
        imageLoaded();
      }
    });

    function errorCalled(error){
      errors.push(error);
      imageLoaded();
    }

    function imageLoaded(){
      counter++;
      if(counter === images.length){
        // exit
        processImages();
      }
      // drop it
    }

    function processImages(){
      // quicker than for .. in in V8
      var imgs = Object.keys(loaded);
      imgs.forEach(function (img){
        masks[img] = computeMask(loaded[img], options);
      });

      // now return
      callback(errors, masks);
    }
  }

  function computeMask(original, maker){
    // make a new canvas to store the greyscale mask
    var canvas  = maker.canvasMaker(original.width, original.height);
    var context = canvas.getContext('2d');

    context.drawImage(original, 0, 0);
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);

    var i, maxAvg = 0,
        data = imgData.data;

    // access a property can be expensive sometimes
    var avgFn = maker.strategy;

    for( i=0; i < data.length; i+=4){
      // filter transparent pixels
        if(data[i+3]){
          data[i] = data[i+1] = data[i+2] = avgFn(data[i], data[i+1], data[i+2]);
          maxAvg = Math.max(maxAvg, data[i]);
        }
    }

    // push the lightest color to white
    // This makes the mask match the passed color when recoloring
    var toWhite = (255 - maxAvg);

    for( i=0; i < data.length; i+=4){
      // filter transparent pixels
      if(data[i+3]){
        var pixel = data[i];
        data[i] = data[i+1] = data[i+2] = pixel + toWhite;
      }
    }
    context.putImageData(imgData, 0, 0);

    // return the mask
    return canvas;
  }

  function recolorMasks(mask, colors, opts){
    opts = validateOptions(opts, {}, {}, {canvasFn: createCanvas});
    colors = isGradient(colors) ? [colors] : ensureArray(colors);

    return recolorImage(mask, opts.canvasFn, colors);
  }

  // TODO: add WebGL version
  function recolorImage(mask, canvasFn, colors){

    var width  = mask.width,
        height = mask.height;

    var targets = [];

    colors.forEach(function (){
      targets.push(canvasFn(width, height));
    });

    if(hasBlendModes()){
      recolorNew(mask, targets, colors);
    } else {
      recolorOld(mask, targets, colors);
    }

    return targets.map(function (canvas){
      return canvas.toDataURL();
    });
  }

  function isGradient(color){
    return Array.isArray(color) && !isString(color[0]) && ('value' in color[0]);
  }

  function createColoredLayer(canvas, context, color){
    var style;
    if(isGradient(color)){
      style = context.createLinearGradient(canvas.width/2, 0, canvas.width/2, canvas.height);
      color.forEach(function (stop){
        style.addColorStop(stop.value, stop.color);
      });
    } else {
      style = color;
    }
    context.fillStyle = style;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function recolorNew(mask, targets, colors){

    var width  = mask.width,
        height = mask.height;

    targets.forEach(function (target, index){
      
      var context = target.getContext('2d');
      createColoredLayer(mask, context, colors[index]);
      context.globalCompositeOperation = 'multiply';
      context.drawImage(mask, 0, 0, width, height);
      // context.globalCompositeOperation = 'color-burn';
      // context.drawImage(mask, 0, 0, width, height);
      context.globalCompositeOperation = 'destination-atop';
      context.drawImage(mask, 0, 0, width, height);
    });
  }

  function recolorOld(mask, targets, colors){

    var width  = mask.width,
        height = mask.height;

    // Get the mask data
    context = mask.getContext('2d');
    var mData    = context.getImageData(0, 0, width, height);
    var maskData = mData.data;
    
    var contexts = [],
        imageDatas = [],
        rawDatas   = [];
    targets.forEach(function (target){
      var context = target.getContext('2d');
      // draw a the first layer with the color we want to apply
      createColoredLayer(mask, context, color);
      // dump the data
      var imgData = tContext.getImageData(0, 0, width, height);
      // now save a ref for each part
      contexts.push(context);
      imageDatas.push(imgData);
      rawDatas.push(imgData.data);
    });

    function colorPixel(grey, alpha){
      // return a clojure
      return function (data){
        data[i]   = Math.floor(grey * data[i]);
        data[i+1] = Math.floor(grey * data[i+1]);
        data[i+2] = Math.floor(grey * data[i+2]);
        // preserve the original mask alpha
        data[i+3] = alpha;
      };
    }
    // now iterate through the mask and for each visible pixel recolor it
    for( var i=0; i < maskData.length; i+=4){
      // skip the alpha when possible
      if(maskData[i+3]>0){
        rawDatas.forEach(colorPixel(maskData[i]/255, maskData[i+3]));
      }
    }
    contexts.forEach(function (context, index){
      context.putImageData(imagesDatas[index], 0, 0);
    });
  }

  function batchProcessor(images, colors, options, callback){

    if(!callback){
      return;
    }

    images = ensureArray(images, true);
    colors = isGradient(colors) ? [colors] : ensureArray(colors);

    // create the masks for all images (this already takes care of duplicates)
    makeMask(images, options, function (errors, masks){
      if(errors){
        return callback(errors);
      }
      // now colorize the masks with the passed colors
      // colorize duplicates only once
      var visited = {};
      masks.forEach(function (mask, index){

        if(!visited[images[index]]){
          visited[images[index]] = recolorMasks(mask, colors, options);
          return visited[images[index]];
        }
      });

      // now replace duplicates with resulting images
      var recolored = images.map(function (image){
        return visited[image];
      });

      return callback(null, recolored);
    });
  }
  
  exports.Colorify = {};

  Colorify.create = function(){
    return {
      recolor: batchProcessor,
      getMask: makeMask,
      paint:   recolorMasks
    };
  };

})(typeof exports === 'undefined'? this['Colorify']={}: exports);