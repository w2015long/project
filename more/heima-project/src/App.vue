<template>
	<div class="container">
		<mt-header fixed  title="黑马程序员">
		  <a href="#" slot="left" @click="goBack">
		    <mt-button icon="back">返回</mt-button>
		  </a>
		  <mt-button icon="more" slot="right"></mt-button>
		</mt-header>		
		<!-- 主体container区域 -->
		<transition>
			<router-view></router-view>
		</transition>	

		<nav class="mui-bar mui-bar-tab">
			<router-link class="mui-tab-item-me" to="/home">
				<span class="mui-icon mui-icon-home"></span>
				<span class="mui-tab-label">首页</span>
			</router-link>
			<router-link class="mui-tab-item-me" to="/member">
				<span class="mui-icon mui-icon-contact"></span>
				<span class="mui-tab-label">会员</span>
			</router-link>
			<router-link class="mui-tab-item-me" to="/shopcar">
				<span class="mui-icon mui-icon-extra mui-icon-extra-cart" id="carBox"><span class="mui-badge">{{ $store.getters.totalCar }}</span></span>
				<span class="mui-tab-label">购物车</span>
			</router-link>
			<router-link class="mui-tab-item-me" to="/search">
				<span class="mui-icon mui-icon-search"></span>
				<span class="mui-tab-label">搜索</span>
			</router-link>
		</nav>				
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';
	export default {
		name:"App",
		data () {
			return {
				carBox:this.$refs.carBox
			}
		},
		methods:{
			goBack(){
				window.history.go(-1);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.container{
		padding-top: 40px;
		padding-bottom: 50px;
		overflow-x: hidden;
	}
	.v-enter{
		opacity: 0;
		transform: translateX(100%);
	}
	.v-leave-to{
		opacity: 0;
		transform: translateX(-100%);
		position: absolute;		
	}
	.v-enter-active,
	.v-leave-active{
		transition: all .6s ease;
	}
	/*改类名 解决tabbar 点击无法切换的问题*/
	.mui-bar-tab .mui-tab-item-me.mui-active {
    	color: #007aff;
	}
	.mui-bar-tab .mui-tab-item-me {
		display: table-cell;
		overflow: hidden;
		width: 1%;
		height: 50px;
		text-align: center;
		vertical-align: middle;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #929292;
	}
	.mui-bar-tab .mui-tab-item-me .mui-icon {
		top: 3px;
		width: 24px;
		height: 24px;
		padding-top: 0;
		padding-bottom: 0;
	}
	.mui-bar-tab .mui-tab-item-me .mui-icon ~ .mui-tab-label {
		font-size: 11px;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
	}	
</style>