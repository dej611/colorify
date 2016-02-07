Colorify.Util = {
  isString: function(obj){
    return typeof obj === 'string';
  },
  
  // ref: http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
  isFunction: function(fn){
    return fn && {}.toString.call(fn) === '[object Function]';
  },
  
  // undefined and null in one signle go!
  isDef: function(obj){
    return obj != null;
  },
  
  isGradient: function(color){
    return Array.isArray(color) && ('value' in color[0]);
  },
  
  ensureArray: function(obj){
    return Array.isArray(obj) ? obj : [obj];
  },
  
  createCanvas: function(w, h){
    var canvas = document.createElement('canvas');
    // we're always sure that width are height are >=0
    canvas.width = w || 1;
    canvas.height = h || 1;
    return canvas;
  },
  
  // ref: https://gist.github.com/infn8/760d30977a89b0d3d975
  hasBlendModes: function(){
    var canvas = Colorify.Util.createCanvas(1, 1);
    var ctx = canvas.getContext('2d');
    // Set it the operation to a blended one
    ctx.globalCompositeOperation = 'screen';
    // now check if the browser accepted it or not
    return ctx.globalCompositeOperation === 'screen';
  },
  // Take a list of errors and write them in a single line
  getErrors: function(errs){
    var error = null;
    if(errs.length){
      var list = errs.map(function (err){
        return err.message;
      });
      error = new Error('Error loading the following images: '+list.join(','));
    }
    return error;
  }
};