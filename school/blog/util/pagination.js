

/*
page:请求页码
model:数据模型
query:查询条件
projection:投影
sort:排序

*/

async function pagination(options){


	let {page,model,query,projection,sort} = options;
	const count = await model.countDocuments(query);


}

module.exports = pagination