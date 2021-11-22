import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import url from '@rollup/plugin-url'
import html from 'rollup-plugin-generate-html-template'
import { terser } from 'rollup-plugin-terser'

import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
const myIP = '192.168.0.104' // to see server from other devices get the local IP — on Windows terminal: ipconfig > "IPv4 Address" OR on Mac/Linux terminal: ifconfig > "en0" > "inet"
const port = '8000'

const mode = process.env.PROD ? 'production' : 'development'

export default {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'iife'
  },
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    resolve(),
    commonjs({
      include: /node_modules/
    }),
    babel({
      exclude: /node_modules/,
      babelHelpers: 'bundled'
    }),
    html({
      template: 'src/index.html',
      target: 'index.html'
    }),
    url({
      fileName: '[dirname][name][extname]'
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
