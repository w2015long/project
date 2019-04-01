
const express = require('express')
const router = express.Router()
const userModel = require('../model/user.js')

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
	userModel.find({},"-password -__v")
	.then(users=>{
		console.log(users)
		res.render('admin/users_list',{
			userInfo:req.userInfo,
			users
		})
	})


})



module.exports = router