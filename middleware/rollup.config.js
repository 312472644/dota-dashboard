import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: './app.js',
  output: [
    {
      file: 'dist/server.mjs',
      format: 'es',
      sourcemap: false
    }
  ],
  plugins: [resolve(), commonjs(), json()]
};
