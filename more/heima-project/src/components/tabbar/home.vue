<template>
	<div class="home">
		<mt-swipe :auto="4000">
		  <mt-swipe-item v-for="(item,index) in bannerList" :key="index">
		  	<img :src="item.imgUrl">
		  </mt-swipe-item>
		</mt-swipe>	
		<!-- 九宫格 -->
        <ul class="mui-table-view mui-grid-view mui-grid-9">
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                    <span class="mui-icon mui-icon-home"></span>
                    <div class="mui-media-body">Home</div></a></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                    <span class="mui-icon mui-icon-email"><span class="mui-badge">5</span></span>
                    <div class="mui-media-body">Email</div></a></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                    <span class="mui-icon mui-icon-chatbubble"></span>
                    <div class="mui-media-body">Chat</div></a></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                    <span class="mui-icon mui-icon-location"></span>
                    <div class="mui-media-body">location</div></a></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                    <span class="mui-icon mui-icon-search"></span>
                    <div class="mui-media-body">Search</div></a></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                    <span class="mui-icon mui-icon-phone"></span>
                    <div class="mui-media-body">Phone</div></a></li>
        </ul> 		
	</div>
</template>
<script>
	import { request } from '../../util';
	export default {
		name:"Home",
		data(){
			return {
				bannerList:[
					{
						"title":"小米手机",
						"imgUrl":require("../../assets/images/banner/carousel1.jpg")
					},{
						"title":"大米电视",
						"imgUrl":require("../../assets/images/banner/carousel2.jpg")
					},{
						"title":"联想笔记本",
						"imgUrl":require("../../assets/images/banner/carousel3.jpg")
					},{
						"title":"小新本",
						"imgUrl":require("../../assets/images/banner/carousel4.jpg")
					}
				]
			}
		},
		created(){
			// this.getBannerList();
		},
		methods:{
			getBannerList:function(){
				request({
					method:"get",
					url:"http://vue.studyit.io/api/getlunbo"
				})
				.then(data=>{
					if (data.code == 200) {
						this.bannerList = data.bannerList;
					}
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
			background-color: #cece;
			height: 200px;
			img{
				height: 200px;
			}
		}
	}
</style>