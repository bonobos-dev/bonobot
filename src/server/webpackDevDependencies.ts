
import webpack from 'webpack';

import webpackDevMiddleware from 'webpack-dev-middleware';

const webpackConfig:webpack.Configuration  = require('../webpack.config.js');


const compiler = webpack(webpackConfig);


const middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
})


export const webpackDevDependencies = (process.env.NODE_ENV === 'development')
  ? { 
      webpack, 
      webpackDevMiddleware, 
      webpackConfig,
      compiler,
      middleware
    }
  : null