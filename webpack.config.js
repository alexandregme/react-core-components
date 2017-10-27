const webpack = require('webpack');
const fs      = require('fs');
const path    = require('path');
const debug   = require('debug')('app:webpack');
const cssnano = require('cssnano');
const glob    = require('glob');
const gracefulFs = require('graceful-fs');

const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const ManifestPlugin        = require('webpack-manifest-plugin');
const PurifyCssPlugin       = require('purifycss-webpack');
const ExtractSVGPlugin      = require('svg-sprite-loader/lib/extract-svg-plugin');

const {
  PUBLIC_PATH,
  IMG_ASSETS_PATH,
  BUILD_MANIFEST_FILENAME,
  IMG_ASSETS_MANIFEST_FILENAME
} = require('./server/config.bundle');

// Env variables definition
// In case when NODE_ENV is not defines use production mode by default
const __DEV__   = process.env.NODE_ENV === 'development';
const __PROD__  = !process.env.NODE_ENV || process.env.NODE_ENV === 'production';
//const __TEST__ = project.globals.__TEST__

const outputSvgSpriteFilename = __PROD__ ? '[name].[hash:6].svg' : '[name].svg';
const svgSpriteExtractFile = new ExtractSVGPlugin(outputSvgSpriteFilename, {
  allChunks: true
});

gracefulFs.gracefulify(fs);


// Below parameter gives possibility to skip generation of output styles
// and use default Webpack mechanism to deal with styles
const __DONT_EXTRACT_STYLES__  = process.env.DONT_EXTRACT_STYLES === '1';

debug('Creating configuration.');
const webpackConfig = {
  name    : 'client',
  target  : 'web',
  devtool : __DEV__ && 'inline-source-map',
  isProd  : __PROD__,
  resolve : {
    root       : './',
    extensions : ['', '.js', '.jsx', '.json']
  },
  module : {}
};


//TODO remove unsuable vendors
// ------------------------------------
// Entry Points TODO remove 
// ------------------------------------
webpackConfig.entry = {
  vendor : [
    'babel-polyfill',
    'react',
    'react-dom',
    'immutable',
    'axios',
    'redux',
    'react-redux',
    'redux-thunk',
    'classnames',
    'svg4everybody',
    'react-input-range',
    'js-ntc-logger/dist/es5/src/ntc-logger',
    'uuid/v4',
    'react-sticky-el',
    'react-transition-group'
  ]
};


// generate entry points for pages
webpackConfig.entry = glob.sync('app/domains/*/pages/*/client.run.js')
                          // filter all domains, which name begins with underscore character
                          .filter(filename => filename.split(/\\|\//)[2].indexOf('_') !== 0)
                          // build entry point list
                          .reduce(
                            (res, filename) => {
                              const domainName  = filename.split(/\\|\//)[2];
                              const pageName    = filename.split(/\\|\//)[4];

                              res[`${domainName}.${pageName}`] = './' + filename;

                              return res;
                            },
                            webpackConfig.entry
                          );

// ------------------------------------
// Path resolvers
// ------------------------------------
webpackConfig.resolve = {
  alias: {
    core: path.join(__dirname, 'app', 'core')
  }
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename   : '[name].js',
  path       : path.join(__dirname, 'public', 'build'),
  publicPath : PUBLIC_PATH
};

// Add hash string to bundle file names on Production to prevent caching issues
if (__PROD__) {
  webpackConfig.output.filename = '[name].[hash:6].js';
}

// ------------------------------------
// Externals
// ------------------------------------
webpackConfig.externals = {};
webpackConfig.externals['react/lib/ExecutionEnvironment'] = true;
webpackConfig.externals['react/lib/ReactContext'] = true;
webpackConfig.externals['react/addons'] = true;

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    names : ['vendor'],
    // for extracting all svg in one common svg chunk
    minChunks: (module, count) => {
      const minChunksForSVG = module.resource && /\.svg/.test(module.resource) && count >= 1;
      const minChunksForAllOther = module.resource && !(/\.svg/.test(module.resource)) && count >= 2;

      return minChunksForSVG || minChunksForAllOther;
    }
  }),

  new webpack.DefinePlugin({
    'process.env': {
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    },
    'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    __DEV__,
    __PROD__
  }),
];

if (__DEV__) {
  debug('Enabling plugins for live development (HMR, NoErrors).');

  // add webpack dev specific plugins
  webpackConfig.plugins.push(
    //new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
} else if (__PROD__) {
  debug('Enabling plugins for production (OccurenceOrder, Dedupe, UglifyJS & ManifestPlugin).');
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),

    new webpack.optimize.UglifyJsPlugin({
      compress : {
        unused    : true,
        dead_code : true,
        warnings  : false
      }
    }),

    // Generate manifest file with file names of output bundles
    // in order to build static file map on Server side rendering
    new ManifestPlugin({
      fileName: BUILD_MANIFEST_FILENAME,
      basePath: PUBLIC_PATH,
      stripSrc: true
    })
  );
}

// ------------------------------------
// Loaders
// ------------------------------------
const babelConfig = JSON.parse(fs.readFileSync('./.babelrc', {encoding: 'utf8'}));


babelConfig.babelrc = false;
babelConfig.plugins = babelConfig.plugins.filter(plugin => plugin[0] !== 'babel-plugin-transform-require-ignore');
babelConfig.plugins.push('transform-runtime');

// JavaScript / JSON
webpackConfig.module.loaders = [
  {
    test    : /\.(js|jsx)$/,
    exclude : /node_modules/,
    loader  : 'babel',
    query   : babelConfig
  },
  {
    test   : /\.json$/,
    loader : 'json'
  }
];

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
const BASE_CSS_LOADER = 'css?sourceMap&-minimize';

webpackConfig.module.loaders.push({
  test    : /\.scss$/,
  loaders : [
    'style',
    BASE_CSS_LOADER,
    'postcss',
    'sass?sourceMap'
  ]
});

webpackConfig.module.loaders.push({
  test    : /\.css$/,
  loaders : [
    'style',
    BASE_CSS_LOADER,
    'postcss'
  ]
});

webpackConfig.sassLoader = {
  includePaths : [path.join(__dirname, 'app'), path.join(__dirname, 'core')]
};

// ------------------------------------
// Specific options of PostCSS loader
// ------------------------------------
webpackConfig.postcss = [
  cssnano({
    autoprefixer : {
      add      : true,
      remove   : true,
      browsers : ['last 2 versions']
    },
    discardComments : {
      removeAll : true
    },
    discardUnused : false,
    mergeIdents   : false,
    reduceIdents  : false,
    safe          : true,
    sourcemap     : true
  })
];

// File loaders
/* eslint-disable */
const __HASH__ = __PROD__ ? '.[hash:6]' : '';

webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/,  loader: `url?name=assets/fonts/[name]${__HASH__}.[ext]&limit=10000&mimetype=application/font-woff` },
  { test: /\.woff2(\?.*)?$/, loader: `url?name=assets/fonts/[name]${__HASH__}.[ext]&limit=10000&mimetype=application/font-woff2` },
  { test: /\.otf(\?.*)?$/,   loader: `file?name=assets/fonts/[name]${__HASH__}.[ext]&limit=10000&mimetype=font/opentype` },
  { test: /\.ttf(\?.*)?$/,   loader: `url?name=assets/fonts/[name]${__HASH__}.[ext]&limit=10000&mimetype=application/octet-stream` },
  { test: /\.eot(\?.*)?$/,   loader: `file?name=assets/fonts/[name]${__HASH__}.[ext]` },
  // { test: /\.svg(\?.*)?$/,   loader: `url?name=assets/img/[name]${__HASH__}.[ext]&limit=10000&mimetype=image/svg+xml` },
  { test: /^((?!\.icon).)*\.svg(\?.*)?$/,   loader: `url?name=assets/img/[name]${__HASH__}.[ext]&limit=10000&mimetype=image/svg+xml` },
  {
    test: /\.icon.svg$/,
    loaders: [
      'svg-sprite',
      'svgo-loader?' + JSON.stringify({
        plugins: [
          //remove <title>
          {removeTitle: true},
          //remove width/height attributes if viewBox is present
          {removeDimensions: true},
          //convert Path data to relative or absolute (whichever is shorter), convert one segment to another, trim useless delimiters, smart rounding, and much more
          {convertPathData: true},
          //collapse multiple transforms into one, convert matrices to the short aliases, and much more
          {convertTransform: true},
          //convert some basic shapes to <path>
          {convertShapeToPath: true},
          {
            removeAttrs: {
              attrs: ['fill', 'stroke'],

            }
          }
        ]
      })
    ]
  },
  { test: /\.(png|jpg|gif)$/,    loader: `file??limit=15000&name=${path.join(IMG_ASSETS_PATH, `[name]${__HASH__}.[ext]`)}` }
);
/* eslint-enable */


// Generate output css files with "ExtractTextPlugin"
if (! __DONT_EXTRACT_STYLES__) {
  const outputStyleFilename = __PROD__ ? '[name].[hash:6].css' : '[name].css';

  const styleExtractFile = new ExtractTextPlugin(outputStyleFilename, {
    allChunks: true
  });

  // update loaders with ExtractTextPlugin
  webpackConfig.module.loaders.forEach(loaderItem => {
    if(loaderItem.loaders) {
      switch(loaderItem.loaders[0]) {
        case 'style':
          loaderItem.loader = styleExtractFile.extract('style-loader', loaderItem.loaders.slice(1).join('!'));
          delete loaderItem.loaders;
          break;
        case 'svg-sprite':
          loaderItem.loader = svgSpriteExtractFile.extract(['svg-sprite?extract=true', loaderItem.loaders.slice(1).join('!')]);
          delete loaderItem.loaders;
      }
    }
  });

  // add ExtractTextPlugin to plugin list
  webpackConfig.plugins.push(styleExtractFile);
  webpackConfig.plugins.push(svgSpriteExtractFile);
  webpackConfig.plugins.push(new PurifyCssPlugin({
    paths: [
      'app/**/*.html',
      'core/**/*.html',
      'app/**/*.js',
      'core/**/*.js',
      // in some cases our classnames depends on strings from json. For example in footer all info from static json file
      'app/**/*.json',
      'core/**/*.json',
      'config/**/*.json'
    ],
    purifyOptions: {
      whitelist: [
        '*add-to-cart-modal*',
        '*custom-scrollbar*',
        '*product-reviews*',
        '*rccs*'
      ]
    },
    minimize: __PROD__
  }));
}

module.exports = webpackConfig;
