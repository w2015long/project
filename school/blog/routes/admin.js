
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

	/*
	约定每页显示3条 limit(3)

	每页要跳过3条数据 skip(3)

	第page页 跳过 (page - 1) * skip

	 */
	
	let { page } = req.query;
	//第一次进来没有page
	if(isNaN(page)){
		page = 1
	}

	page = parseInt(page);

	const limit = 3;

	//跳页不能为负
	if(page == 0){
		page = 1
	}

	//跳页不能大于总页数
	userModel.countDocuments({})
	.then(count=>{
		const pages = Math.ceil(count / limit);

		if(pages == 0){
			page = 1
		}
		if(page > pages){
			page = pages
		}

		let list = [];
		for(let i=1;i<=pages;i++){
			list.push(i)
		}

		let skip = (page - 1) * limit ;

		userModel.find({},"-password -__v")
		.skip(skip)
		.limit(limit)	
		.then(users=>{
			res.render('admin/users_list',{
				userInfo:req.userInfo,
				users,
				page,
				list
			})
		})		

	})




})



module.exports = router