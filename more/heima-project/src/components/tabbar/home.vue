<template>
	<div class="home">
		<swiper  :carousel="bannerList" :isFull="true" />
		<!-- 九宫格 -->
        <ul class="mui-table-view mui-grid-view mui-grid-9">
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><router-link to="/home/news">
                    <span class="mui-icon mui-icon-map"></span>
                    <div class="mui-media-body">新闻资讯</div></router-link></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><router-link to="/home/photoList">
                    <span class="mui-icon mui-icon-image"></span>
                    <div class="mui-media-body">图片分享</div></router-link></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><router-link to="/home/goodsList">
                    <span class="mui-icon mui-icon-extra mui-icon-extra-cart"></span>
                    <div class="mui-media-body">商品购物</div></router-link></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                    <span class="mui-icon mui-icon-extra mui-icon-extra-topic"></span>
                    <div class="mui-media-body">留言反馈</div></a></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                    <span class="mui-icon mui-icon-extra mui-icon-extra-computer"></span>
                    <div class="mui-media-body">视频专区</div></a></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                    <span class="mui-icon mui-icon-extra mui-icon-extra-peoples"></span>
                    <div class="mui-media-body">联系我们</div></a></li>
        </ul> 		
	</div>
</template>
<script>
	import { request } from '../../util';
	import { Toast } from 'mint-ui';
	import swiper from '../subComponents/swiper.vue';
	export default {
		name:"Home",
		components:{
			swiper
		},
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
			this.getBannerList();
		},		
		methods:{
			getBannerList:function(){
				request({
					method:"get",
					url:"http://www.liulongbin.top:3005/api/getlunbo"
				})
				.then(data=>{
					if (data.status == 0) {
						this.bannerList = data.message;
					}
				})
				.catch(err=>{
					Toast({
					  message: '请求轮播图失败',
					  iconClass: 'icon icon-success'
					});				
				});
			},

		}
	}
</script>
<style lang="scss" scoped>

	.mui-table-view{
		.mui-icon{
			color: #f67;
		}
	}
</style>