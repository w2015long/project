<template>
	<div class="TabBar">
		<ul class="tab-bar-wrap">
			<li class="tab-bar-item">
				<router-link class="tab-bar-link" :class="{active:$route.path.includes('/home')}" to="/home">
					<i class="fa fa-home"></i>
					<span>首页</span>
				</router-link>
			</li>
			<li class="tab-bar-item">
				<router-link class="tab-bar-link" :class="{active:$route.path.includes('/cart')}" to="/cart">
					<i class="fa fa-shopping-cart"></i>
					<span>购物车</span>
				</router-link>
			</li>
			<li class="tab-bar-item">
				<router-link class="tab-bar-link" :class="{active:$route.path.includes('/me')}" to="/me">
					<i class="fa fa-user"></i>
					<span>个人中心</span>
				</router-link>
			</li>						
		</ul>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	export default {
		name:'TabBar',
		methods:{
		
		}
	}
</script>
<style scoped lang="less">
	.TabBar{
		width: 100%;
		position:fixed;
		bottom: 0;
		left: 0;
		background: #ddd;
		.tab-bar-wrap{
			list-style: none;
			display: flex;
			.rem(padding,0,5,5);
			flex-direction: row;
			justify-content: space-around;
			.tab-bar-link{
				display: flex;
				flex-direction: column;
				text-align: center;
				text-decoration: none;
				color:#333;
				i{
					.rem(font-size,60);
				}
			}
			.tab-bar-link.active{
				color:#f88;
			}
		}
	}
</style>