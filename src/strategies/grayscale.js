// Based on the human eye perception: ITU-R BT709 Greyscale
export default (r, g, b) => Math.floor(0.2125 * r + 0.7154 * g + 0.0721 * b);
