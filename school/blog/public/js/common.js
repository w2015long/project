;(function($){
	var $login = $('#login');
	var $register = $('#register');
	//已有账号去登陆
	$('#go-login').on('click',function(){
		$register.hide();
		$login.show();
	})
	//注册账号
	$('#go-register').on('click',function(){
		
		$login.hide();
		$register.show();		
	})

	//验证的正则
	var usernameReg = /^[a-z][a-z|0-9|_]{2,9}$/i;
	var passwordReg = /^\w{3,10}$/;

	//2.用户注册
	$('#sub-register').on('click',function(){
		var username = $register.find('[name="username"]').val();
		var password = $register.find('[name="password"]').val();
		var repassword = $register.find('[name="repassword"]').val();
		//验证用户名
		//字母下划线开头3-6位
		var errMags = '';
		if(!usernameReg.test(username)){
			errMags = '用户名以字母开头包含数字字母和下划线,3-10个字符';
		}//密码3-6位字符
		else if(!passwordReg.test(password)){
			errMags = '密码3-6位字符'
		}
		else if(repassword != password){
			errMags = '两次密码不一致'
		}

		if(errMags){//验证不通过
			$register.find('.err').html(errMags)
			return
		}else{//验证通过发送ajax请求
			$register.find('.err').html('');

			$.ajax({
				url:'/user/register',
				type:'post',
				dataType:'json',
				data:{
					username:username,
					password:password
				}
			})
			.done(function(result){
				if(result.status == 0){//注册成功
					//跳转登陆页面
					$('#go-login').trigger('click');
				}else{
					$register.find('.err').html(result.message)
				}
			})
			.fail(function(err){
				$register.find('.err').html('请求失败')
			})

		}
	})


	//3.用户登陆
	$('#sub-login').on('click',function(){
		var username = $login.find('[name="username"]').val();
		var password = $login.find('[name="password"]').val();
		//验证用户名
		//字母下划线开头3-6位
		var errMags = '';
		if(!usernameReg.test(username)){
			errMags = '用户名以字母开头包含数字字母和下划线,3-10个字符';
		}//密码3-6位字符
		else if(!passwordReg.test(password)){
			errMags = '密码3-6位字符'
		}


		if(errMags){//验证不通过
			$login.find('.err').html(errMags)
			return
		}else{//验证通过发送ajax请求
			$login.find('.err').html('');

			$.ajax({
				url:'/user/login',
				type:'post',
				dataType:'json',
				data:{
					username:username,
					password:password
				}
			})
			.done(function(result){
				if(result.status == 0){//登录成功
					/*
					$login.hide();
					$('#user-info span').html(result.data.username);
					$('#user-info').show()
					*/
					window.location.reload();

				}else{
					$login.find('.err').html(result.message)
				}
			})
			.fail(function(err){
				$login.find('.err').html('请求失败')
			})

		}
	})




})(jQuery);