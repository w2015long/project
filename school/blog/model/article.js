const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
	title: {
		type:String,
	},
	intro:{
		type:String,
	},
	content:{
		type:String
	},
	user:{
		type:mongoose.Schema.Types.ObjectId
	},
	category:{
		type:mongoose.Schema.Types.ObjectId
	},
	createAt:{
		type:Date,
		default:Date.now
	},
	click:{
		type:Number,
		default:100
	}
});


//3.生成模型model 
const articleModel = mongoose.model('article', articleSchema);
//4.导出模块
module.exports = articleModel;