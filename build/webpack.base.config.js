const path = require('path');
const nodeExternals = require('webpack-node-externals');

const webpackConfig = {
    entry: {
        app: ['./src/index.ts']
    },
    target: 'node',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    externals: [nodeExternals()]
};

module.exports = webpackConfig;