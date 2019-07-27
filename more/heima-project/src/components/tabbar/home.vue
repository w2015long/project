<template>
	<div class="home">
		<mt-swipe :auto="4000">
		  <mt-swipe-item v-for="(item,index) in bannerList" :key="index">
		  	<!-- <img :src=""> -->
		  </mt-swipe-item>
		</mt-swipe>			
	</div>
</template>
<script>
	import { request } from '../../util';
	export default {
		name:"Home",
		data(){
			return {
				bannerList:[]
			}
		},
		created(){
			this.getBannerList();
		},
		methods:{
			getBannerList:function(){
				request({
					methods:"get",
					url:"http://vue.studyit.io/api/getlunbo",
				})
				.then(data=>{
					console.log('data')
				})
				.catch(err=>{
					console.log('>>>>>>>>>>>>>>>>err')					
				});
			},

		}
	}
</script>
<style lang="sass" scoped>
	.mint-swipe{
		height: 200px;
		.mint-swipe-items-wrap{
			height: 200px;
			img{
				height: 200px;
			}
		}
	}
</style>