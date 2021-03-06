const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const dev = process.env.NODE_ENV === "dev"


let cssLoaders = [
    {loader: 'css-loader', options: {importLoaders: 1, minimize: !dev}}
]


if (!dev) {
    cssLoaders.push({
        loader: 'postcss-loader', options: {
            plugins: (loader) => [
            require('autoprefixer')({
                browsers: ['last 2 versions', 'ie > 8']
            }),
        ]
    }
    })
}

let config = {
    entry: {
        app: './js/dev/app.js'
    },
    watch: true,
    output: {
        path: path.resolve('./js/dist'),
        filename: '[name].js',
        publicPath: 'js/dist/'
    },
    devtool: dev ? "cheap-module-eval-source-map" : false,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [...cssLoaders]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [...cssLoaders, 'sass-loader']
                })

            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename:  (getPath) => {
      return getPath('../../css/[name].css').replace('css/js', 'css');
    },
            disable: dev
        })
    ]
}

if (!dev) {
    config.plugins.push(new UglifyJSPlugin({
        sourceMap: false
    }))
}


module.exports = config