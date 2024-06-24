const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
require('dotenv').config();

module.exports = (env, agrv) => {
    const isDev = agrv.mode === 'development';
    const isAnalyze = env && env.analyze;
    const basePlugins = [
        new Dotenv({
            path: './.env',
            ignoreStub: true
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: isDev ? '[name].css' : 'static/css/[name].[contenthash:6].css'
        }),
        new webpack.ProgressPlugin(),
        new webpack.ProvidePlugin({
            process: 'process/browser'
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env)
        }),
    ];
    let prodPlugins = [
        ...basePlugins,
        new CleanWebpackPlugin(),
        new CompressionPlugin({
            test: /\.(css|js|svg)$/
        })
    ];
    if (isAnalyze) {
        prodPlugins = [...prodPlugins, new BundleAnalyzerPlugin()];
    }

    return {
        entry: './src/index.tsx',
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    use: ['ts-loader'],
                    exclude: /node_modules/
                },
                {
                    test: /\.(s[ac]ss|css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isDev
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                    type: 'asset/resource',
                },
                {
                    test: /\.(ico|jpe?g|png|gif|webp|svg|mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
                    type: 'asset/resource',
                },
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
            alias: {
                'src': path.resolve('src'),
                '@@': path.resolve()
            }
        },
        output: {
            path: path.resolve('build'),
            publicPath: '/',
            filename: 'static/js/main.[contenthash:6].js',
            environment: {
                arrowFunction: false,
                bigIntLiteral: false,
                const: false,
                destructuring: false,
                dynamicImport: false,
                forOf: false,
                module: false
            }
        },
        devtool: isDev ? 'source-map' : false,
        devServer: {
            // contentBase: 'public',
            port: 3000,
            hot: true,
            // watchContentBase: true,
            historyApiFallback: true
        },
        plugins: isDev ? basePlugins : prodPlugins,
        performance: {
            // maxEntrypointSize: 800000,
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        }
    };
};
