module.exports = {
  /* 部署生产环境和开发环境下的URL：可对当前环境进行区分，baseUrl 从 Vue CLI 3.3 起已弃用，要使用publicPath */
  // publicPath: process.env.NODE_ENV === 'production' ? '/public/' : '/',
  /* 输出文件目录：在npm run build时，生成文件的目录名称 */
  outputDir: process.env.VUE_APP_FLAG,
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: "assets",
  /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
  productionSourceMap: false,
  /* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变) */
  filenameHashing: false,
  /* 代码保存时进行eslint检测 */
  lintOnSave: true,
  /* 注意sass，scss，less的配置 */
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "./src/styles/index";`,
      },
      less: {
        globalVars: {
          primary: '#fff'
        }
      },
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 37.5, //这个37.5就是当做750px的设计稿上1rem为37.5px
            //设计稿元素尺寸/37.5 换算的基数 750/37.5=20rem  css中设置了100px 也就是再750中的设计稿中量取到100px  这时候是这样算的： ( 100px / 37.5 ) * （当前html的font-size 也就是底下 rem.js 设置的font-size ）
            selectorBlackList: [], // 忽略转换正则匹配项
            propList: ['*'], //用来设定可以从 px 转为 rem 的属性
          }),
        ]
      },
    }, // Enable CSS modules for all css / pre-processor files. // This option does not affect *.vue files.
  },
  /* webpack-dev-server 相关配置 */
  devServer: {
    /* 自动打开浏览器 */
    open: true,
    /* 设置为0.0.0.0则所有的地址均能访问 */
    host: '0.0.0.0',
    port: 80,
    https: false,
    hotOnly: false,
    /* 使用代理 */
    proxy: {
      '/api': {
        /* 目标代理服务器地址 */
        // target: 'http://w3.morninggo.cn',
        target: 'https://api.morninggo.cn',
        /* 允许跨域 */
        changeOrigin: true,
        ws: true, //如果要代理 websockets，配置这个参数
        secure: true, //如果要代理 websockets，配置这个参数
        pathRewrite: {
          '^/api': '' //注意名字
        },
      },
    },
    before: app => {},
  }
}