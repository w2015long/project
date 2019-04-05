const express = require('express')
const router = express.Router()
const articleModel = require('../model/article.js')
const categoryModel = require('../model/category.js')



//获取各种数据
async function getCommonData(){
	let categoriesPromise = categoryModel.find({}).sort({order:-1});
	//拿到博文排行数据
	let topArticlesPromise = articleModel.find({},'_id click title').sort({click:-1}).limit(10);

	const categories = await categoriesPromise;
	const topArticles = await topArticlesPromise;

	return {
		categories,
		topArticles
	}
}
router.get('/', (req, res)=> {
	//查询后台数据显示前台首页
	getCommonData()
	.then(data=>{
		const {categories,topArticles} = data;
		articleModel.getPaginationArticles(req)
		.then(data=>{
			res.render('main/index',{
				userInfo:req.userInfo,
				categories,
				topArticles,
				//首页博文分页
				articles:data.docs,
				page:data.page,
				list:data.list,
				pages:data.pages,
				url:'/article'			
			})	
		})
	
	})
})

//收到ajax请求 处理博文文章分页数据
router.get('/articles',(req,res)=>{
	//query:字符串带问号形式的请求(例如：/?page=1$id=123)
	const { id } = req.query;

	let query = null;
	if(id){
		query = {category:id}
	}
	//点击页码发送请求获取博文数据
	articleModel.getPaginationArticles(req,query)
	.then(data=>{
		res.json({
			status:0,
			data
		})		
	})
})

//detail详情页
router.get('/view/:id',(req,res)=>{
	// 具体文章的id (article._id.toString())
	const {id} = req.params;//(params:后边带id的请求)
	getCommonData()
	.then(data=>{
		const {categories,topArticles} = data;
		//更新点击量
		articleModel.findOneAndUpdate({_id:id},{$inc:{click:1}},{new:true})
		.populate('user','username')
		.populate('category','name')
		.then(article=>{
			// console.log(article)//关联的user作者 与category回传
			res.render('main/detail',{
				userInfo:req.userInfo,
				categories,
				topArticles,
				article,
				//回传id 详情页博文具体属于哪一分类
				category:article.category._id

			})			
		})

	})
})

//list详情页
router.get('/list/:id',(req,res)=>{

	//具体分类的id (category._id.toString())
	const {id} = req.params;//params:后边带id的请求(example /list/123) 
	getCommonData()
	.then(data=>{
		const {categories,topArticles} = data;
		articleModel.getPaginationArticles(req,{category:id})
		.then(data=>{
			res.render('main/list',{
				userInfo:req.userInfo,
				categories,
				topArticles,
				//list页面分页
				articles:data.docs,
				page:data.page,
				list:data.list,
				pages:data.pages,
				//回传id 知道属于哪一个分类
				category:id
			})	
		})

	})
})
module.exports = router