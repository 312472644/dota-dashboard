const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');

module.exports = {
  input: './app.js',
  output: [
    {
      file: 'dist/server.js',
      format: 'cjs',
      sourcemap: false
    }
  ],
  plugins: [resolve(), commonjs(), json()]
};
