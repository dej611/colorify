import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import uglify from 'rollup-plugin-uglify';

const isProduction = process.env.NODE_ENV === 'production';
const rollupPlugins = [
  resolve(),
  babel({
    exclude: 'node_modules/**', // only transpile our source code
    runtimeHelpers: true, // make the babel-runtime plugin do its job
  }),
  commonjs(),
];

if (isProduction) {
  rollupPlugins.push(uglify());
} else {
  rollupPlugins.push(serve({ contentBase: ['dist', 'examples'] }));
}

export default {
  input: 'src/main.js',
  output: {
    name: 'colorify',
    file: 'dist/colorify.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: rollupPlugins,
};
