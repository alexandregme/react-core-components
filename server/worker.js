import express from 'express';
import compress from 'compression';
import fs from 'fs';
import path from 'path';
//import { createServerIocContainer } from 'core/frontController';
//import { logData } from 'core/logging';
//import cookieParser from 'cookie-parser';
import router from './router.js';


//TODO refactor
const
  app = express(),
  versionFilePath = path.join(__dirname, 'version'),
  port = process.env.PORT || 8080;

// logging of process behaviour
process.on('uncaughtException', err =>
    console.error('Server worker precess uncaughtException', err)
);
process.on('exit',
  code => log.info('Server worker process exit', appLogData.extend({ process_exit_code: code}))
);

// Reading version from file if exist (prod mode)
// Or get from package.json if not
if (fs.existsSync(versionFilePath)) {
  global.version = fs.readFileSync(versionFilePath);
} else {
  global.version = require('../package.json').version;
}

// Serve dist if development mode
if (process.env.NODE_ENV === 'development') {
  // attach webpack-dev-middleware to server instance
  // https://github.com/webpack/webpack-dev-middleware
  const webpack           = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackConfig     = require('../webpack.config');

  const webpackCompiler = webpack(webpackConfig);

  app.use(webpackMiddleware(
    webpackCompiler,
    {
      // public path to bind the middleware to
      // use the same as in webpack
      publicPath: webpackConfig.output.publicPath,

      // display no info to console (only warnings and errors)
      noInfo: true,

      // display nothing to the console
      quiet: false,

      // switch into lazy mode
      // that means no watching, but recompilation on every request
      lazy: false,

      headers: { 'X-Custom-Header': 'yes' },
      // custom headers

      // options for formatting the statistics
      stats: {
        colors: true
      },
    }
  ));

  // Do "hot-reloading" of app stuff on the server
  // Throw away the cached client modules and let them be re-required next time
  webpackCompiler.plugin('done', function() {
    console.info('Clearing /app/ module cache from server');
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\](app|core)[\/\\]/.test(id)) {
        delete require.cache[id];
      }
    });
  });


  // serve rest static content with static middleware
  app.use(express.static('public', {index: false}));
}

// Apply gzip compression
app.use(compress());

// Server Side Rendering
app.use(router());

app.listen(port, () => {
  console.log('Server worker is running');
});