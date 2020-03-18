import typescript from 'rollup-plugin-typescript2';
import {terser} from "rollup-plugin-terser";

export default [{
  input: 'src/typescript/core_api.ts', // our source file
  output: [
    {
    file: 'dist/essentia.js-core-module.js',
    format: 'es' // the preferred format
    },
    {
    file: 'dist/essentia.js-core.js',
    format: 'iife',
    name: 'Essentia' // the global which can be used in a browser
    }
  ],
  plugins: [
    typescript({
    typescript: require('typescript'),
    }),
    terser() // minifies generated bundles
  ]
}, {
 input: 'src/typescript/plot.ts', // our source file
 output: [
  {
   file: 'dist/essentia.js-plot-module.js',
   format: 'es' // the preferred format
  },
  {
   file: 'dist/essentia.js-plot.js',
   format: 'iife',
   name: 'EssentiaPlot' // the global which can be used in a browser
  }
 ],
 plugins: [
  typescript({
   typescript: require('typescript'),
  }),
  terser() // minifies generated bundles
 ]
}, {
  input: 'src/typescript/models.ts', // our source file
  output: [
   {
    file: 'dist/essentia.js-models-module.js',
    format: 'es' // the preferred format
   },
   {
    file: 'dist/essentia.js-models.js',
    format: 'iife',
    name: 'EssentiaModels' // the global which can be used in a browser
   }
  ],
  plugins: [
   typescript({
    typescript: require('typescript'),
   }),
   terser() // minifies generated bundles
  ]
 },
];