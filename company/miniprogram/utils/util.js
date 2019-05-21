
const handleStar = str => {
  var num = str.toString().substring(0,1);
  var arr = [];
  for(var i=0;i<5;i++){
    if(i<num){
      arr.push(1)
    }else{
      arr.push(0)
    }
  }
  return arr;
}

function format(data){
  return data.map((item, index) => {
    return {
      coverImg: item.images.large,
      title: item.title,
      stars: handleStar(item.rating.stars),
      score: item.rating.average
    }
  })
}
const getMovie = (url,success)=>{
  wx.request({
    url: url,
    success:function(res){
      success(format(res.data.subjects))
    }
  })
}

module.exports = { handleStar, getMovie}

