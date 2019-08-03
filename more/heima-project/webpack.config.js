const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
	//指定打包环境
	mode:'development',	
	entry:path.resolve(__dirname,'./src/main.js'),//入口文件
	output:{//出口文件相关配置
		//[name] chunk名称
		//chunk内容的hash,每一个chunkhash值都不同
		//[hash] 模块标识符的hash,每一次打包的模块hash值都不同
		filename:"[name]-[hash]-bundle.js",
		path:path.resolve(__dirname,'./dist')
	},
	plugins:[//插件配置
		new webpack.HotModuleReplacementPlugin(),//热更新的模块对象
		new htmlWebpackPlugin({
			template:path.resolve(__dirname,'./src/index.html'),////模板文件
			filename:'index.html',//输出文件名
			inject:true,//脚本写在那个标签里,默认是true(在body结束后
			hash:true
		}),
		new VueLoaderPlugin(),//vue loader
	],
	module:{//配置 所有第三方模块加载器
		rules:[//第三方模块匹配规则
			{test:/\.css$/i,use:['style-loader','css-loader']},
			{test:/\.less$/i,use:['style-loader','css-loader','less-loader']},
			{test:/\.s[ca]ss$/i,use:['style-loader','css-loader','sass-loader']},
			{//url-loader处理图片
				test:/\.(jpg|png|gif|jpeg|bmp)/i,
				use:[{
						loader:'url-loader',
						options:{
							limit:10000,//limit值大于 引用的图片则图片被转成base64的字符串
							name:'[name]-[hash].[ext]'//图片名
						}
					}

				]

			},
			//处理icon字体文件
			{test:/\.(ttf|woff2|woff|eot|svg)\??.*$/i,use:'url-loader'},
			
			{//处理高级语法ES5/6/7
				test:/\.js$/,
				exclude:/(node_modules)/,
				use:{loader:'babel-loader'}
			},
			{test:/\.vue$/,loader:'vue-loader'},//vue loader
		]
	},
	resolve:{//配置别名
		alias:{
			'vue$':path.resolve(__dirname,'node_modules/vue/dist/vue.min.js')
		}
	},
	devServer:{
		contentBase:"./dist",
		open:true,
		port:3000,
		hot:true,//启用热更新	
	}
}