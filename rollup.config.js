import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/main.js',
  format: 'umd',
  moduleName: 'colorify',
  plugins: [
    babel({exclude: 'node_modules/**'}),
    uglify(),
  ],
  dest: 'dist/colorify.js',
  sourceMap: true,
};
