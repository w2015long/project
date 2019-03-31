
const express = require('express')
const router = express.Router()


router.use((req,res,next)=>{
	if(userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登陆</h1>')
	}
})


router.get('/', function (req, res) {
  res.render('main/admin')
})



module.exports = router