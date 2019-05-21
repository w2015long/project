<template>
	<div class="Home">
		<div class="swiper-container">
		    <div class="swiper-wrapper">   		        		    	
		        <div class="swiper-slide" v-for="(item,index) in images" :key="index">
					<img :src="item.src">
		        </div>
	    	</div>
		    <!-- 如果需要分页器 -->
		    <div class="swiper-pagination"></div>
		</div>	
		<!--首页商品列表-->
		<ul class="product-wrap" v-if="homeProducts.length > 0">
			<li class="product-floor" v-for="(floor,floorIndex) in homeProducts" :key="floorIndex">
				<h3 class="floor-title">{{floor.title}}</h3>
				<ul class="product-list">
					<li class="product-item" v-for="(pro,proIndex) in floor.products" :key="proIndex">
						<img class="product-image" :src="pro.image" alt="">
						<div class="product-content">
							<h4 class="product-name">{{pro.name}}</h4>
							<p class="product-price">{{pro.price | formatPrice}}</p>
							<span class="btn-buy">购买</span>
						</div>
					</li>														
				</ul>
			</li>		
		</ul>		
	</div>
</template>
<script type="text/javascript">
	import Swiper from 'swiper';
	import { mapState } from 'vuex'
	import 'swiper/dist/css/swiper.min.css';
	export default{
		name:'Home',
		data(){
			return {
				images:[
					{src:require('../../assets/images/carousel1.jpg')},
					{src:require('../../assets/images/carousel2.jpg')},
					{src:require('../../assets/images/carousel3.jpg')}
				]
			}
		},
		mounted(){
			new Swiper ('.swiper-container', {
				// 循环模式选项
				loop: true,
				autoplay:true,
				//分页器
				pagination: {
					el: '.swiper-pagination',
					clickable:true
				}
			});
			this.$store.dispatch('getProducts');     
		},
		computed:{
			...mapState(['homeProducts'])
		}
	}

</script>
<style scoped lang="less">
	.swiper-slide img{
		width: 100%;
		.rem(height,260);
	}	
	.product-wrap{
		display: flex;
		flex-direction: column;
		background-color: #f1f1f1;
		.rem(padding,0,10);
		.product-floor{
			margin-bottom: 10px;
			.floor-title{
				text-align: center;
				.rem(line-height,30);
				.rem(font-size,24);
			}
			.product-list{
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				.product-item{
					box-sizing: border-box;
					background-color: #fff;
					text-align:center;
					margin-top: 10px;
					.rem(padding,10);
					.product-image{
						.rem(width,180);
					}
					.product-content{
						.rem(width,285);
						.product-name{
							.rem(font-size,8);
							.rem(height,60);
							.rem(line-height,30);
							overflow: hidden;
							color:#111;
							text-align: left;
						}
						.product-price{
							.rem(line-height,20);
							.rem(font-size,18);
							color:#f67;
							text-align: left;
						}
						.btn-buy{
							display: block;
							.rem(width,60);
							.rem(line-height,20);
							.rem(padding,5);
							.rem(font-size,16);
							color: #fff;
							background-color: #f21;
							border-radius: 5px;
							margin-top: 10px;
						}
					}
				}
			}
		}
	}
</style>