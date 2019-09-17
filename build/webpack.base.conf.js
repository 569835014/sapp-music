const JSWebpackPlugin = require('../plugins/js-webpack-plugins');
const ReductionPlugin= require('../plugins/reduction-plugins')
const config = require('./config');
const appConfig = require('../src/config');
const path = require('path');
const { resolve } = require('path');
const HappyPack = require('happypack');
const webpack = require('webpack');
const _ = require('lodash');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const VueLoaderPlugin = require('../loaders/rx-loader/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { parseComponent } = require('vue-template-compiler');
const entry = () => _.reduce(appConfig.json.pages.concat(appConfig.json.components), (en, i) => {
    en[i] = resolve(__dirname, '../src', `${i}.mina`);

    return en;
}, {});
const filePath = '../';
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        ...entry(),
        app: resolve(__dirname, '../src', 'app.js'),
    },
    resolveLoader: {
        modules: [
            'node_modules',
            resolve(__dirname, '../loaders')
        ]
    },
    resolve: {
        extensions: [
            '.js',
            '.json',
            '.mina',
            '.ts',
        ],
        alias: {
            '@': config.workPath,
            static: config.staticPath,
            assets: config.assetsPath,
            utils: path.resolve(config.assetsPath, './utils'),
        },
    },
    output: {
        path: path.resolve(config.projectPath, 'dist'),
        filename: './[name].js',
        globalObject: 'my',
    },
    module: {
        rules: [
            {
                test: /\.(js|mina)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [config.workPath],
                options: {
                    formatter: require('eslint-friendly-formatter'),
                },
            },
            {
                test: /\.mina$/,
                include: [config.workPath],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            "presets": [
                                [
                                    "@babel/preset-env",
                                    {
                                        "targets":{
                                            "browsers":["last 2 version","safari >=7","ie >=9"]
                                        }
                                    }
                                ]
                            ],
                            "plugins": [
                                [
                                    "@babel/plugin-transform-runtime",
                                    {
                                        "corejs": 2,
                                        "helpers": true,
                                        "regenerator": true,
                                        "useESModules": false
                                    }
                                ]
                            ]
                        },
                    },
                    {
                        loader: 'sapp-webpack-loader',
                        // loader: 'rx-loader',
                        options: {
                            source: 'src',
                            target: 'dist',
                            minimize:true,
                            rest:false,
                            extension:{
                                style: 'acss',
                                template: 'axml',
                            }
                        }
                    },
                    {
                        loader: 'style-resources-loader',
                        options: {
                            patterns: [
                                path.resolve(__dirname, '../src/assets/styl/variables/*.styl'),
                                path.resolve(__dirname, '../src/assets/styl/mixins/*.styl'),
                            ],
                            injector: (source, resources) => {
                                debugger
                                const parts = parseComponent(source);
                                const combineAll = type => resources
                                    .filter(({ file }) => file.includes(type))
                                    .map(({ content }) => content)
                                    .join('');
                                if (parts.styles && parts.styles.length) {
                                    const style = parts.styles[0];
                                    if (style.lang === 'stylus') {
                                        const reg = new RegExp(`<${'style lang="stylus"'}>[\\\w\\W]*</${'style'}>`, 'g');
                                        const stylus = combineAll('variables') + combineAll('mixins') + parts.styles[0].content;
                                        source = source.replace(reg, `<style lang="stylus">${stylus}</style>`);
                                    }
                                }
                                return source;
                            },
                        },
                    },
                ]
            },
            // {
            //     test: /\.mina$/,
            //     use: [
            //         {
            //             loader: 'rx-loader',
            //             options: {
            //                 extension: {
            //                     style: 'acss',
            //                     template: 'axml',
            //                 },
            //             }
            //         }
            //     ],
            //
            // },
            // {
            //     test: /\.mina$/,
            //     use: [
            //         {
            //             loader: 'smallmina-loader',
            //             options: {
            //                 source: 'src',
            //                 target: 'dist',
            //                 dist: '',
            //                 babel: true,
            //                 extension: {
            //                     style: 'acss',
            //                     template: 'axml',
            //                 },
            //             },
            //         },
            //         {
            //             loader: 'style-resources-loader',
            //             options: {
            //                 patterns: [
            //                     path.resolve(__dirname, '../src/assets/styl/variables/*.styl'),
            //                     path.resolve(__dirname, '../src/assets/styl/mixins/*.styl'),
            //                 ],
            //                 injector: (source, resources) => {
            //                     const parts = parseComponent(source);
            //                     const combineAll = type => resources
            //                         .filter(({ file }) => file.includes(type))
            //                         .map(({ content }) => content)
            //                         .join('');
            //                     if (parts.styles && parts.styles.length) {
            //                         const style = parts.styles[0];
            //                         if (style.lang === 'stylus') {
            //                             const reg = new RegExp(`<${'style lang="stylus"'}>[\\\w\\W]*</${'style'}>`, 'g');
            //                             const stylus = combineAll('variables') + combineAll('mixins') + parts.styles[0].content;
            //                             source = source.replace(reg, `<style lang="stylus">${stylus}</style>`);
            //                         }
            //                     }
            //                     return source;
            //                 },
            //             },
            //         },
            //     ],
            //
            // },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                include: [path.resolve(config.workPath)],
                loader: "babel-loader",
                options: {
                    "presets": [
                        [
                            "@babel/preset-env",
                            {
                                "targets":{
                                    "browsers":["last 2 version","safari >=7","ie >=9"]
                                }
                            }
                        ]
                    ],
                    "plugins": [
                        [
                            "@babel/plugin-transform-runtime",
                            {
                                "corejs": 2,
                                "helpers": true,
                                "regenerator": true,
                                "useESModules": false
                            }
                        ]
                    ]
                },
                // use: {
                //     loader: 'happypack/loader?id=happyBabel',
                //
                // },
            },
            {
                test: /\.css$/,
                include: config.workPath,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer'),
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(styl|stylus)$/,
                include: config.workPath,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer'),
                            ],
                        },
                    },
                    'stylus-loader',

                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:6].[ext]',
                    publicPath: filePath,
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:7].[ext]',
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]',
                },
            },
        ],
    },
    plugins: [
        // new VueLoaderPlugin(),
        new JSWebpackPlugin(),
        new ReductionPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new CopyWebpackPlugin([
            {
                from: 'app.json',
                to: '',
                context: 'src/',

            },
            {
                from: 'app.acss',
                to: '',
                context: 'src/',

            },
            {
                from: '*.json',
                to: '',
                context: 'src/',

            },
            {
                from: 'pages/**/*.json',
                to: '',
                context: 'src/',

            },
            {
                from: 'components/**/*.json',
                to: '',
                context: 'src/',
            },
            {
                from: 'src/static',
                to: 'static',
            },
            {
                from: 'src/images',
                to: 'images',
            }
        ]),
        // new HappyPack(
        //     {
        //         id: 'happyBabel',
        //         loaders: [
        //             {
        //                 loader: 'babel-loader?cacheDirectory=true',
        //             },
        //         ],
        //         threadPool: happyThreadPool,
        //         verbose: true,
        //     }
        // ),
    ],
    optimization: {
        splitChunks: {
            chunks: 'initial',
            minSize: 30000, // 模块的最小体积
            minChunks: 1, // 模块的最小被引用次数
            maxAsyncRequests: 5, // 按需加载的最大并行请求数
            maxInitialRequests: 3, // 一个入口最大并行请求数
            automaticNameDelimiter: '~', // 文件名的连接符
            name: true,
            cacheGroups: { // 缓存组
                commons: { // 公共模块
                    name: 'commons',
                    chunks: 'initial', // 入口处开始提取代码
                    minSize: 0, // 代码最小多大，进行抽离
                    minChunks: 2, // 代码复 2 次以上的抽离
                },
                vendors: {
                    test: /node_modules/,
                    name: 'vendors',
                    minSize: 0,
                    minChunks: 1,
                    chunks: 'initial',
                    priority: 1, // 该配置项是设置处理的优先级，数值越大越优先处理
                },
            },
        },
    },

};
