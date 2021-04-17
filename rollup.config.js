import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import packageJson from "./package.json"
export default {
  input: 'src/index.tsx',
  output: [{ 
    file: packageJson.main,
    format: 'cjs',
    chunkFileNames: true,
    sourcemap: true,
    plugins: [terser()]
  },{
    file: packageJson.module,
    format: 'esm',
    chunkFileNames: true,
    sourcemap: true,
    plugins: [terser()]
  },{
    file: "dist/index.uncompressed.es.js",
    format: 'esm',
    chunkFileNames: true,
    sourcemap: true
  }],
  external: ['react', 'react-dom'],
  plugins: [nodeResolve(), typescript()]
};