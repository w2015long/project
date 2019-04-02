
const express = require('express')
const router = express.Router()
const userModel = require('../model/user.js')
const pagination = require('../util/pagination.js')

router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登陆</h1>')
	}
})

//显示后台首页
router.get('/', (req, res)=> {
  res.render('admin/index',{
  	userInfo:req.userInfo
  })
})

//显示用户列表
router.get('/users', (req, res)=> {

	pagination({
		page:req.query.page,
		model:userModel,
		query:{},
		projection:"-password -__v",
		sort:{id:-1}
	})
	.then(data=>{
		res.render('admin/users_list',{
			userInfo:req.userInfo,
			users:data.docs,
			page:data.page,
			pages:data.pages,
			list:data.list,
			url:'/admin/users'
		})		
	})
	
})



module.exports = router