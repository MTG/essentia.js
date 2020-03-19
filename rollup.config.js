import typescript from 'rollup-plugin-typescript2';
import {terser} from "rollup-plugin-terser";

export default [{
  input: 'src/typescript/core_api.ts', // our source file
  output: [
    {
    file: 'dist/essentia.js-core.es.js',
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
   file: 'dist/essentia.js-plot.es.js',
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
    file: 'dist/essentia.js-models.es.js',
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
 }, {
  input: 'src/typescript/extractor.ts', // our source file
  output: [
   {
    file: 'dist/essentia.js-extractor.es.js',
    format: 'es' // the preferred format
   },
   {
    file: 'dist/essentia.js-extractor.js',
    format: 'iife',
    name: 'EssentiaExtractor' // the global which can be used in a browser
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