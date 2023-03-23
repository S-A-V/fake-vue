import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/platforms/entry-runtime-with-compiler.js',
  output: {
    file: 'dist/vue.js',
    format: 'umd',
    name: 'Vue',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    process.env.ENV === 'development'
      ? serve({
          open: true,
          openPage: '/examples/index.html',
          contentBase: '',
          port: 3000,
        })
      : null,
  ],
};
