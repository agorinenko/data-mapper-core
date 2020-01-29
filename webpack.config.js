const path = require('path');

let config = {
    mode: 'none',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'data-mapper-core.js',
        library: 'dataMapperCore',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader',
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules)/,
                loader: 'ts-loader'
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    optimization: {
        runtimeChunk: true
    },
    externals: {
        axios: {
            commonjs: 'axios',
            commonjs2: 'axios',
            amd: 'axios',
            root: '_',
        },
    },
};

module.exports = (env, argv) => {
    if (argv.mode) {
        config.mode = argv.mode
    }

    if (argv.mode === 'development') {
        config.devtool = 'eval-source-map';
    }
    return config;
};
