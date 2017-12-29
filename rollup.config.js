import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  input: 'src/main.js',
  output: {
    name: 'colorify',
    file: 'dist/colorify.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      runtimeHelpers: true, // make the babel-runtime plugin do its job
    }),
    uglify(),
  ],
};
