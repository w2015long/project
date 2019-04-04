const express = require('express')
const router = express.Router()
const articleModel = require('../model/article.js')
const categoryModel = require('../model/category.js')



//获取各种数据
async function getCommonData(req){
	let categoriesPromise = categoryModel.find({}).sort({order:-1});
	let pageArticlesPromise = articleModel.getPaginationArticles(req);

	const categories = await categoriesPromise;
	const pageArticles = await pageArticlesPromise;

	return {
		categories,
		pageArticles
	}
}
router.get('/', (req, res)=> {
	//查询后台数据显示前台首页
	getCommonData(req)
	.then(data=>{
		const {categories,pageArticles} = data
		res.render('main/index',{
			userInfo:req.userInfo,
			categories,
			articles:pageArticles.docs,
			page:pageArticles.page,
			list:pageArticles.list,
			pages:pageArticles.pages,
			url:'/article'			

		})		
	})
})

//处理博文文章分页数据
router.get('/articles',(req,res)=>{
	//点击页码发送请求获取博文数据
	articleModel.getPaginationArticles(req)
	.then(data=>{
		res.json({
			status:0,
			data
		})		
	})
})

module.exports = router