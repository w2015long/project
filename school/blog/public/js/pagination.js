(function($){
	$.fn.extend({
		pagination:function(options){

			var $elem = $(this);
			//事件代理
			$elem.on('clcik','a',function(){
				var $this = $(this);
				var page = 1;
				var currentPage = $elem.find('.active a').html();
				var lable = $this.attr('aria-label');
				if(lable == 'Next'){
					page = currentPage -1 ;
				}else if(lable == 'Previous'){
					page = currentPage + 1 ;
				}else{//点击的页码数
					page = $this.html();
				}

				//发送ajax请求
				$.ajax({
					url:options.url + '?page=' + page,
					type:'get',
					dataType:'json'
				})
				.done(function(result){
					if(result.status == 0){
						$elem.trigger('get-data',[result.data]);
					}
				})
				.fail(function(err){
					console.error(err);
				})

			})			
		}

	})



})(jQuery);