
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);//production环境

module.exports = {
    //第三方的插件
    pluginOptions: {},
    css: {
        modules: false,
        extract: IS_PROD,
        sourceMap: false,
    },
    devServer: {
        host: 'localhost',
        port: 8080,
        open: true, //配置自动启动浏览器
        hotOnly: false, // 热更新
        proxy: {
            '/api': {// 匹配所有以 '/api'开头的请求路径
                target: 'http://localhost:4000', //对应自己的接口
                changeOrigin: true,
                ws: true,// 支持跨域
                pathRewrite: {// 重写路径: 去掉路径中开头的'/api'
                    '^/api': ''
                }
            }
        }
    },

}