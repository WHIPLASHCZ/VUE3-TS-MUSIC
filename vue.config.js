const registerRouter = require('./backend/router')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin
        prependData: `
          @import "@/assets/css/variable.scss";
          @import "@/assets/css/mixin.scss";
        `
      }
    }
  },
  devServer: {
    before(app) {
      registerRouter(app)
    }
  },
  productionSourceMap:false,
  publicPath:process.env.NODE_ENV === 'production' ? '/music-next/' : '/'
//   configureWebpack: (config) => {
//     if (process.env.npm_config_report) {
//       const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
//       config.plugins.push(new BundleAnalyzerPlugin())
//     }
//   },
//   productionSourceMap: false,
//   publicPath: process.env.NODE_ENV === 'production' ? '/music-next/' : '/'
}
