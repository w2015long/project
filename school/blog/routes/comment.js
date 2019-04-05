
const express = require('express')
const commentModel = require('../model/comment.js')
const router = express.Router()

router.use((req,res,next)=>{
	if(req.userInfo._id){
		next()
	}else{
		res.json({
			status:10,
			message:'请登录'
		})
	}
})

router.post('/add',(req,res)=>{
	const {content , article} = req.body;
	commentModel.insertMany({
		content,
		user:req.userInfo._id,
		article
	})
	.then(comments=>{
		res.json({
			status:0,
			data:comments
		})		
	})

})

module.exports = router