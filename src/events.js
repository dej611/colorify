var events = {};

Colorify.Bus = {
  trigger: function(evt, arg1, arg2){
    if(evt in events){
      var callbacks = events[evt];
      // iterate through all the callbacks and call them with the passed args
      callbacks.forEach(function callCallback(fn){
        callCallback(arg1, arg2);
      });
    }
    // drop it if no registered callback is there
  },
  on: function(evt, callback){
    var Util = Colorify.Util;
    // drop it if no event or function is passed
    if(!Util.isString(evt) || !Util.isFunction(callback) ){
      return;
    }
    // add the event if it's not present yet
    if(!(evt in events)){
      events[evt] = [];
    }
    // register the callback now
    events[evt].push(callback);
  },
  off: function(evt, callback){
    if(evt in events){
      var callbacks = events[evt];
      // remove the passed callback from the registered ones
      callbacks = callbacks.filter(function getSameCb(cb){
        // note that the callback identity has to be exactly the same
        return callback !== cb;
      });
    }
  }
}