const path = require('path')

const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const FixStyleOnlyEntries = require('webpack-fix-style-only-entries')

const isDev = process.argv.indexOf('--develop') >= 0
const isWatch = process.argv.indexOf('--watch') >= 0

const previewSrc = path.resolve(__dirname, '../preview') // preview源目录
const previewDist = path.resolve(__dirname, '../miniprogram_dev') // preview目标目录

const src = path.resolve(__dirname, '../src')
const dist = path.resolve(__dirname, '../dist') // 生产 目标目录
const dev = path.join(previewDist, 'components') // 开发 目标目录
const docPath = path.resolve(__dirname, '../doc/docs'); // 文档目录

module.exports = {
    entry: ['index'],
    isDev,
    isWatch,
    previewSrc,
    previewDist,
    srcPath: src, // 源目录
    distPath: isDev ? dev : dist, // 目标目录
    docPath,
    js: {
        webpack: true, // 使用 webpack 来构建 js
    },

    wxss: {
        webpack: true, // 使用 webpack 来编译scss和wxss
    },

    copy: isDev ? ['src/**/*.md', 'src/common/**/**', 'src/**/type.d.ts', 'src/**/*.ts', 'tsconfig.json', 'typings/**'] : ['src/common/**/**'],

    srcMdPath: 'src/**/*.md',
    
    webpack: {
        mode: 'production',
        output: {
            filename: '[name].js', // 当有多个入口时,需要赋予每个bundle唯一的名称:[name]代表入口名称
            libraryTarget: 'commonjs2', // 入口起点的返回值将分配给 module.exports 对象。
        },
        target: 'node', // 编译为类node环境可用（使用 Node.js require 加载 chunk）
        externals: [nodeExternals()], // 忽略 node_modules
        module: {
            rules: [
                {
                    test: /\.js$/i,
                    use: ['babel-loader', 'eslint-loader'],
                    exclude: /node_modules/, // 排除 node_modules
                },
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: path.resolve(__dirname, '../tsconfig.json'), // 指定特定的ts编译配置，为了区分脚本的ts配置
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(scss|wxss)$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'resolve-url-loader', 
                        {   
                            loader: 'sass-loader',
                            options: {
                                'sourceMap': true
                            }
                        }
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(jpg|png|gif|bmp|jpeg|ttf|woff|woff2)$/i,
                    loader: 'url-loader'    // url-loader将文件编译为base64,微信小程序在wxss中不可以引入本地字体/图片文件
                }
            ],
        },
        resolve: {
            modules: [src, 'node_modules'],
            extensions: ['.ts', '.js', '.json'],
        },
        plugins: [
            new webpack.DefinePlugin({
                COLOR_TEST:JSON.stringify('yellow')
            }),
            new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
            new MiniCssExtractPlugin({ filename: "[name].wxss", chunkFilename: "[id].wxss" }),
            new FixStyleOnlyEntries(),
            new BundleAnalyzerPlugin({ analyzerPort: 8081 })    // 打包情况分析
        ],
        optimization:{
            minimizer:[
                new UglifyJsPlugin({//压缩js
                    cache: true,
                    parallel: true,
                    sourceMap: true
                }),
                new CssMinimizerPlugin({parallel: true })//压缩css
            ]
        },
        performance: {
            hints: 'warning',
            assetFilter: (assetFilename) => assetFilename.endsWith('.js'),
        },
    }
}
