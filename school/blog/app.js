const express = require('express');
const swig = require('swig')
const mongoose = require('mongoose')

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


app.get('/', (req, res) => {
    //4.渲染模板
    //第一个参数是相对于模板目录的文件
    //第二个参数是传递给模板的数据
    res.render('main/index')
	
});

app.listen(port, () => console.log(`app listening on port ${port}`));

