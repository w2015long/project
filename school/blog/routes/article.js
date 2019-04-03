
const express = require('express')
const router = express.Router()
const articleModel = require('../model/article.js')
const pagination = require('../util/pagination.js')

router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登陆</h1>')
	}
})

//显示博文列表
router.get('/', (req, res)=> {
	pagination({
		page:req.query.page,
		model:articleModel,
		query:{},
		projection:"-__v",
		sort:{_id:-1}
	})
	.then(data=>{
		res.render('admin/article_list',{
			userInfo:req.userInfo,
			articles:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:'/article'
		})		
	})
})


/*
//显示分类
router.get('/add', (req, res)=> {
  res.render('admin/article_add_edit',{
  	userInfo:req.userInfo
  })
})

//处理新增分类
router.post('/add', (req, res)=> {
	//新增前查询是否数据库分类已存在
	const {name,order} = req.body;
	articleModel.findOne({name})
	.then(article=>{
		if(article){//分类已存在
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'添加分类失败,分类已存在',

			})

		}else{//新增分类
			articleModel.insertMany({name,order})
			.then(categories=>{
				res.render('admin/success',{
					userInfo:req.userInfo,
					message:'添加分类成功',
					url:'/article'

				})
			})
			.catch(err=>{
				throw err;
			})


		}
	})
	.catch(err=>{
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'添加分类失败,请稍后重试'
		})		
	})

})

//显示编辑页面
router.get('/edit/:id',(req,res)=>{
	const {id} = req.params;
	articleModel.findById(id)
	.then(article=>{
		res.render('admin/article_add_edit',{
			userInfo:req.userInfo,
			article
		})		
	})
})

//处理编辑
router.post('/edit',(req,res)=>{
	const {id,name,order} = req.body;

	articleModel.findById(id)
	.then(article=>{
		if(article.name == name && article.order == order){//没有更改
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'请修改后在提交'
			})				

		}else{//查找数据库不存在的分类(不存在才能)
			articleModel.findOne({name:name,_id:{$ne:id}})
			.then(newarticle=>{
				if(newarticle){
					res.render('admin/error',{
						userInfo:req.userInfo,
						message:'修改分类失败,分类已存在'
					})
				}else{
					articleModel.updateOne({_id:id},{name,order})
					.then(result=>{
						res.render('admin/success',{
							userInfo:req.userInfo,
							message:'修改分类成功',
							url:'/article'
						})						
					})
					.catch(err=>{
						throw err
					})
				}
			})
			.catch(err=>{
				throw err
			})
		}
	})
	.catch(err=>{
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'修改分类失败,请稍后重试'
		})		
	})
})


//处理删除分类
router.get('/delete/:id',(req,res)=>{
	const {id} = req.params;
	articleModel.deleteOne({_id:id})
	.then(result=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'删除分类成功',
		})		
	})
	.catch(err=>{
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'删除分类失败,请稍后重试'
		})		
	})	
})

*/
module.exports = router