
import path from 'path';
import config from './index';
const {resolve} = require('path');
export default {

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: ['babel-loader', 'eslint-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                exclude: [/icomoon\/style.css$/, /icomoon\\style.css$/, /global.css$/],
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // Note that we’ve set importLoaders: 1 on css-loader.
                            // We’re setting this because we want PostCSS to git @import statements first
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[path][name]__[local]--[hash:base64:5]'
                        },
                    },
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('postcss-import')(),
                                require('postcss-cssnext')({
                                    browsers: [
                                        'last 2 Chrome versions',
                                        'last 2 Edge versions',
                                        'last 2 Safari versions',
                                        'last 2 Firefox versions',
                                    ],
                                }),
                            ]
                        }
                    }
                ],
            },
            {
                test: /\.less$/,
                exclude: [/icomoon\/style.css$/, /icomoon\\style.css$/, /global.css$/],
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            javascriptEnabled: true,
                            // 这里配置全局变量
                            globalVars: {
                                'ten': '10px', // ten可以是ten，也可以是@ten，效果一样，下同
                                'hundred': '100px'
                            }
                        }
                    }
                ]
            },
            {
                test: /icomoon(\/|\\)style.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test: /global.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
            {
                test: /\.html/,
                loader: 'html-loader',
            },
            {
                test: /\.woff(\?.*)?$/,
                loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=40000&mimetype=application/font-woff',
            },
            {
                test: /\.woff2(\?.*)?$/,
                loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=40000&mimetype=application/font-woff2',
            },
            {
                test: /\.otf(\?.*)?$/,
                loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=40000&mimetype=font/opentype',
            },
            {
                test: /\.ttf(\?.*)?$/,
                loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=40000&mimetype=application/octet-stream',
            },
            {
                test: /\.svg(\?.*)?$/,
                loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=40000&mimetype=image/svg+xml',
            },
            {
                test: /\.eot(\?.*)?$/,
                loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=40000',
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'url-loader'
            },
        ]
    },

    output: {
        path: config.dist,
        filename: 'bundle.js',

        // https://github.com/webpack/webpack/issues/1114
        libraryTarget: 'commonjs2'
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json', '.less', '.sql'],
        alias: {
            components: path.join(config.client, 'js/components/'),
            utils: path.join(config.client, 'js/utils/'),
            images: path.join(config.client, 'assets/images/'),
            fonts: path.join(config.client, 'assets/fonts/'),
            'dbopration': resolve(__dirname, '../DBOpration/'),
            'shared-md': resolve(__dirname, '../shared/')
        },
    },
};
