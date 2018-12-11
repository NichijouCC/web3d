const path = require('path');
var rootDir = path.resolve(__dirname);

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    devtool:'source-map',
    output: {
        filename: 'web3d.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [           
            {
                enforce: 'pre',
                test: /\.js$/,
                use: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.ts?$/,
                use: "source-map-loader"
            },
            {
                // For our normal typescript
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ],
                exclude: /(?:node_modules)/,
            },
        ]
    },
    plugins: [
        new DtsBundlePlugin()
    ],
    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        extensions: [
            '.js',
            '.ts'
        ]
    },
    devServer: {
        hot: true,
        compress: true,
        host: 'localhost',
        port: 8888
      } 
};

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', function () {
        var dts = require('dts-bundle');

        dts.bundle({
            name: 'web3d',
            main: rootDir + '/dist/typing/index.d.ts',
            out: rootDir + '/dist/web3d.d.ts',
            removeSource: false,
            outputAsModuleFolder: true,
            exclude:[] 
        });
    });
};