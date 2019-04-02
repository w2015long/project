
const express = require('express')
const router = express.Router()
const categoryModel = require('../model/category.js')

router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登陆</h1>')
	}
})

//显示分类页面
router.get('/', (req, res)=> {
  res.render('admin/category_list',{
  	userInfo:req.userInfo
  })
})

//显示分类列表
router.get('/add', (req, res)=> {
  res.render('admin/category_add',{
  	userInfo:req.userInfo
  })
})

//处理新增分类
router.post('/add', (req, res)=> {
	//新增前查询是否数据库分类已存在
	const {name,order} = req.body;
	categoryModel.findOne({name,order})
	.then(category=>{
		if(category){//分类已存在
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'添加分类失败,分类已存在',

			})

		}else{//新增分类
			categoryModel.insertMany({name,order})
			.then(categories=>{
				res.render('admin/success',{
					userInfo:req.userInfo,
					message:'添加分类成功',
					url:'/category'

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




module.exports = router