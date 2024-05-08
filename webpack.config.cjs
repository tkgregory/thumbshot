const slsw = require('serverless-webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: slsw.lib.entries,
    externals: [nodeExternals(),
    {
        '@sparticuz/chromium': '@sparticuz/chromium',
    }
    ],
    target: 'node',
    mode: slsw.lib.webpack.isLocal ? "development" : "production",
    optimization: {
        minimize: false
    },
    module: {
        rules: [
            {
                test: /\.js.map$/,
                loader: 'ignore-loader'
            }
        ]
    }
};