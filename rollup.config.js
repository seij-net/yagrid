import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import packageJson from "./package.json"
export default {
  input: 'src/index.tsx',
  output: [{
    
    file: packageJson.main,
    format: 'cjs',
    sourcemap: true
  },{
    
    file: packageJson.module,
    format: 'esm',
    sourcemap: true
  }],
  external: ['react'],
  plugins: [nodeResolve(), typescript()],
};