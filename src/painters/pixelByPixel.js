/* @flow */

import recolorLayer from './canvasUtil';

export default (mask, targets, colors) => {
  const width = mask.width;
  const height = mask.height;

  const ctx = mask.getContext('2d');
  const imgData = ctx.getImageData(0, 0, width, height);
  const { data } = imgData;

  const contextes = [];
  const datas = [];

  targets.forEach((target, index) => {
    const targetCtx = target.getContext('2d');
    // draw the first layer with the color we want to apply
    recolorLayer(targetCtx, colors[index], width, height);
    // dump the data of the recolored image
    const targetData = targetCtx.getImageData(0, 0, width, height);
    // now save the references to be processed
    contextes.push(targetCtx);
    datas.push(targetData);
  });

  const colorPixel = grey => {
    // return a function
    return (data, i) => {
      data[i] = Math.floor(grey * data[i]);
      data[i + 1] = Math.floor(grey * data[i + 1]);
      data[i + 2] = Math.floor(grey * data[i + 2]);
    };
  };

  // iterate throught the mask raw data
  for (let i = 0; i < data.length; i += 4) {
    const pixelPainter = colorPixel(data[i] / 255);
    datas.forEach(imgData => {
      // color only pixels with alpha > 0
      if (data[i + 3]) {
        pixelPainter(imgData.data, i);
      }
      // preserve the alpha of the mask
      imgData.data[i + 3] = data[i + 3];
    });
  }

  // now paste the final image in the relative contextes
  contextes.forEach((context, index) =>
    context.putImageData(datas[index], 0, 0)
  );
};
