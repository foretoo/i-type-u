import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import url from '@rollup/plugin-url'
import css from 'rollup-plugin-css-only'
import glslify from 'rollup-plugin-glslify'
import { terser } from 'rollup-plugin-terser'

import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
const myIP = '192.168.1.44' // to see server from other devices get the local IP — on Windows terminal: ipconfig > "IPv4 Address" OR on Mac/Linux terminal: ifconfig > "en0" > "inet"
const port = '8000'

const mode = process.env.PROD ? 'production' : 'development'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs({
      include: /node_modules/
    }),
    url({
      emitFiles: false,
      publicPath: 'assets/',
      fileName: '[name][extname]'
    }),
    css({ output: 'bundle.css' }),
    glslify(),
    babel({
      exclude: /node_modules/,
      babelHelpers: 'bundled'
    }),
    process.env.PROD && terser(),
    process.env.DEV && (
      serve({
        open: true,
        historyApiFallback: true,
        contentBase: '',
        host: myIP,
        port: port
      })
    ),
    process.env.DEV && livereload()
  ]
};
