const { when } = require('@craco/craco')
const CracoLessPlugin = require('craco-less')
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // config less variable here
            modifyVars: {
              '@primary-color': '#31D7A0',
              '@link-color': '#0fcd8c',
              '@logo-color': '#39E1A4',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    plugins: [
      ...when(
        process.env.NETWORK === 'main',
        () => [
          new TerserPlugin({
            sourceMap: true, // Must be set to true if using source-maps in production
            terserOptions: {
              ecma: undefined,
              warnings: false,
              parse: {},
              compress: {
                drop_console: process.env.NODE_ENV === 'production',
                drop_debugger: true,
                pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log'] : '',
              },
            },
          }),
        ],
        []
      ),
    ],
  },
}
