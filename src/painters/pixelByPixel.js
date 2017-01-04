/* @flow */

import recolorLayer from './canvasUtil';

export default (mask, targets, colors) => {
  const width = mask.width;
  const height = mask.height;

  const ctx = mask.getContext('2d');
  const imgData = ctx.getImageData(0, 0, width, height);
  const {data} = imgData;

  const contextes = [];
  const datas = [];

  targets.forEach( (target, index) => {
    const targetCtx = target.getContext('2d');
    // draw a the first layer with the color we want to apply
    recolorLayer(targetCtx, width, height, colors[index]);
    // dump the data of the recolored image
    const targetData = targetCtx.getImageData(0, 0, width, height);
    // now save the references to be processed
    contextes.push(targetCtx);
    datas.push(targetData);
  });

  const colorPixel = (grey, alpha) => {
    // return a function
    return (data, i) => {
      data[i] = Math.floor(grey * data[i]);
      data[i+1] = Math.floor(grey * data[i+1]);
      data[i+2] = Math.floor(grey * data[i+2]);
      // preserve the original mask alpha
      data[i+3] = alpha;
    };
  };

  // iterate throught the mask raw data
  for( let i=0; i < data.length; i +=4 ) {
    // skip transparent pixels
    if(data[i+3]) {
      datas.forEach( (imgData) => {
        const pixelPainter = colorPixel(data[i]/255, data[i+3]);
        pixelPainter(imgData.data, i);
      });
    }
  }

  // now paste the final image in the relative contextes
  contextes.forEach( (context, index) => {
    context.putImageData(data[index], 0, 0);
  });
};
