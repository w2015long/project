<template>
	<div class="TabBar">
		<ul class="tab-bar-wrap">
			<li class="tab-bar-item">
				<router-link to="/home">
					<i class="fa fa-home"></i>
					<span>首页</span>
				</router-link>
			</li>
			<li class="tab-bar-item">
				<router-link to="/cart">
					<i class="fa fa-shopping-cart"></i>
					<span>购物车</span>
				</router-link>
			</li>
			<li class="tab-bar-item">
				<router-link to="/me">
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
		.rem(height,60);
		position:fixed;
		bottom: 0;
		left: 0;
		.rem(padding,10);
		background: #ddd;
		.tab-bar-wrap{
			list-style: none;
			display: flex;
			direction: row;
			justify-content: space-around;
			.tab-bar-item{
				display: flex;
				direction:columns;
			}
		}
	}
</style>