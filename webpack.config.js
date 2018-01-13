const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

var common = {
  externals: {
    jquery: 'window.$'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'assets': resolve('assets'),
      'components': resolve('components')
    }
  },
  performance: {
    hints: false
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: __dirname,
      exclude: /node_modules/
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          css: ExtractTextPlugin.extract({
            publicPath: '../',
            fallback: 'vue-style-loader', //this is a dep of vue-loader, so no need to explicitly install if using npm3
            use: 'css-loader'
          })
        },
        postcss: [
          require('autoprefixer')()
        ]
      }
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        publicPath: "../",
        fallback: "style-loader",
        use: "css-loader"
      })
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        publicPath: "../",
        fallback: "style-loader",
        use: "css-loader!less-loader"
      })
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        outputPath: "images/",
        limit: 10000,
        name: "[name].[hash:8].[ext]"
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        outputPath: "fonts/",
        limit: 10000,
        name: "[name].[hash:8].[ext]"
      }
    }, {
      test: /\.(swf|mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        outputPath: "media/",
        limit: 10000,
        name: "[name].[hash:8].[ext]"
      }
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      "window.jQuery": 'jquery',
      "window.$": 'jquery'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([
      { from: 'externals' }
    ]),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    })
  ]  
}

if (process.env.NODE_ENV === 'production') {
  common.plugins = (common.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}

module.exports = [Object.assign({
  entry: {
    "easy-cron-input-component": ['babel-polyfill', resolve('easy-cron-input-component.js')]
  },
  output: {
    path: resolve('dist/component'),
    filename: `js/[name].min.js`,
    library: 'EasyCronInput',
    libraryTarget: 'umd',
    umdNamedDefine: true
  }
}, common), Object.assign({
  entry: {
    "easy-cron-input-element": ['babel-polyfill', resolve('easy-cron-input-element.js')]
  },
  output: {
    path: resolve('dist/element'),
    filename: `js/[name].min.js`
  },
  devServer: {
    host: '0.0.0.0',
    useLocalIp: true,
    openPage: './element/index.html',
    proxy: [{
      context: ["/ws", "/wss"],
      target: 'ws://localhost:3000',
      ws: true
    }, {
      context: "*",
      target: 'http://localhost:3000',
      secure: false
    }]
  }
}, common)]

module.exports[1].plugins = (module.exports[1].plugins || []).concat([
  new HtmlWebpackPlugin({
    filename: 'index.html',
    title: 'easy-cron-input',
    inject: true, // head -> Cannot find element: #app
    chunks: ['easy-cron-input-element'],
    template: './index.html'
  })
])

if (process.env.NODE_ENV === 'production') {
  module.exports[0].plugins = (module.exports[0].plugins || []).concat([
    new CleanWebpackPlugin(['dist/component']),
  ])
  module.exports[1].plugins = (module.exports[1].plugins || []).concat([
    new CleanWebpackPlugin(['dist/element']),
  ])
}
