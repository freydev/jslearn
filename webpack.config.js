const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        watchContentBase: true,
        publicPath: '.',
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.svg/i,
                loader: 'svg-inline-loader?classPrefix',
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html')
        }),
    ]
};