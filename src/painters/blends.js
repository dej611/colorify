/* @flow */

import recolorLayer from './canvasUtil';

export default (mask, targets, colors) => {
  const width = mask.width;
  const height = mask.height;

  targets.forEach( (target, index) => {
    const ctx = target.getContext('2d');
    recolorLayer(ctx, width, height, colors[index]);
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(mask, 0, 0);
    ctx.globalCompositeOperation = 'destination-atop';
    ctx.drawImage(mask, 0, 0);
  });
};
