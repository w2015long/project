const express = require('express');
const swig = require('swig')
const mongoose = require('mongoose')
const bodyParser = require('body-parser') 

const app = express();
const port = 3000;

//1.连接服务器(创建数据库)
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', err=>{
	console.log('connection error:');
	if(err) throw err;
});
//连接数据库
db.once('open',()=>{
	console.log('db connected.....')
});

app.use(express.static('public'))
//设置(设置false 不走缓存)
swig.setDefaults({
  cache: false
})


//配置应用模板
app.engine('html', swig.renderFile);


//配置模板的存放目录
app.set('views', './views')

//注册模板引擎
app.set('view engine', 'html')


//配置bodyParser中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//处理理由
app.use('/',require('./routes/index.js'))
app.use("/user",require('./routes/user.js'));


app.listen(port, () => console.log(`app listening on port ${port}`));

