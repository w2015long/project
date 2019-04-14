

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
//css单独打包处理
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const publicPath = '/';

module.exports = {
	//指定打包环境
	mode:'development',
	// mode:'production',
	//入口(单入口写法)
	// entry:{main:'.src/index.js'}简写entry: './src/index.js',
	
	entry: {//多入口写法
	  //chunk名称:入口文件路径
	  index: "./src/index.js",
	},	
	
	//出口
	output: {
		//出口文件名(多个入口文件时，要加模板文件名)
		//[name] chunk名称
		//chunk内容的hash,每一个chunkhash值都不同
		//[hash] 模块标识符的hash,每一次打包的模块hash值都不同
		filename: '[name].[chunkhash].bundle.js',
		
		publicPath:publicPath,
		//出口文件路径
		path: path.resolve(__dirname, './dist')
	},

	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
				  ////css单独打包处理
		          {
		            loader: MiniCssExtractPlugin.loader,
		            options: {}
		          },
		          'css-loader'
				]
			},

		    //处理图片 
			{
				test: /\.(png|jpg|gif|jpeg)$/i,
				use: [
			  		{
			    		loader: 'url-loader',
			    		options: {
			    			//当图片大小超过limit值后,会生成一个文件
			    			//默认使用file-loader处理图片文件,所以需要额外安装file-loader
			      			limit: 10000
			    		}
			  		}
				]
			},
			//babel
			{
			    test:/\.js$/,
			    exclude: /(node_modules)/,
			    use: {
			        loader: 'babel-loader',
			        options: {
			            presets: ['env','es2015','react','stage-3'],
			            //antd按需加载
			            plugins: [
            						["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }] 
        						 ]			            
			        }
			    }               
			}					  
		],
		
	},


	
	plugins: [
		//插件(自动生成HTML)
		new HtmlWebpackPlugin({
			template: './src/index.html',//模板文件
			filename:'index.html',////输出的文件名
			inject:true,//脚本写在那个标签里,默认是true(在body结束后
			hash:true//给生成的js/css文件添加一个唯一的hash
		}),
		//时时清理更新后上一次文件
		new CleanWebpackPlugin(),
		//css单独打包处理
	    new MiniCssExtractPlugin({
	      filename: '[name].css',
	      chunkFilename: '[id].css',
	    })		
	],
	//启动一个服务器(webpack-dev-server)实时动态刷新页面
    devServer: {
    	contentBase: './dist',
    	port:8080,//服务运行的端口
    	historyApiFallback:true
    }		
};