
import path from 'path';
import webpack from 'webpack';
// import MinifyPlugin from 'babel-minify-webpack-plugin';
import config from './index';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import baseConfig from './webpack.config.base';
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(baseConfig, {

    devtool: false,

    entry: [
        'babel-polyfill',
        `${config.client}/app.js`,
    ],

    output: {
        path: config.dist,
        filename: 'app.js'
    },
    plugins: [
        // https://github.com/webpack/webpack/issues/2545
        // Use babel-minify-webpack-plugin minify code
        // new MinifyPlugin(),

        // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
        // https://github.com/webpack/webpack/issues/864
        new webpack.optimize.OccurrenceOrderPlugin(),

        // NODE_ENV should be production so that modules do not perform certain development checks
        new webpack.DefinePlugin({
            DEBUG: false,
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new CopyWebpackPlugin([
            {
                from: `${config.assets}/fonts/**/*`,
                to: `${config.dist}/src`,
            },
            {
                from: `${config.assets}/images/**/*`,
                to: config.dist,
            },
            {
                from: path.resolve(__dirname, '../package.json'),
                to: config.dist,
            },
            {
                from: path.resolve(__dirname, '../src/dev.html'),
                to: `${config.dist}/src`,
            },
        ]),

        new HtmlWebpackPlugin({
            filename: `${config.dist}/src/index.html`,
            template: './src/index.html',
            inject: 'body',
            minify: {
                collapseWhitespace: true
            }
        })
    ],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: 'electron-renderer'
});
