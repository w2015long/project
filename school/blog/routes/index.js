const express = require('express')
const router = express.Router()
const categoryModel = require('../model/category.js')

router.get('/', (req, res)=> {

	categoryModel.find({})
	.sort({order:-1})
	.then(categories=>{
		res.render('main/index',{
			userInfo:req.userInfo,
			categories
		})		
	})
})



module.exports = router