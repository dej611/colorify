/* @flow */

import {isGradient} from '../util';

export default (context, color, width, height) => {
  let style;
  if(isGradient(color)) {
    // Linear Gradient top to bottom direction
    style = context.createLinearGradient(width/2, 0, width/2, height);
    color.forEach( (stop) => {
      style.addColorStop(stop.value, stop.color);
    });
  } else {
    style = color;
  }
  context.fillStyle = style;
  context.fillRect(0, 0, width, height);
};
