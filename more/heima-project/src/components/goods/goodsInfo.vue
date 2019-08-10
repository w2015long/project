<template>
	<div class="goods-info">
		<transition
			v-on:before-enter="beforeEnter"
			v-on:enter="enter"
			v-on:after-enter="afterEnter"
		>
			<!-- 购物车xiaoqiu -->
			<div class="ball" v-show="flagBall" ref="ball"></div>			
		</transition>			
		<!-- 商品图 -->
		<div class="mui-card">
			<div class="mui-card-content">
				<swiper :carousel="carousel" :isFull="false" />
			</div>
		</div>	
		<!-- 商品购买 -->
		<div class="mui-card">
			<div class="mui-card-header">{{ goodsinfo.title }}</div>
			<div class="mui-card-content">
				<div class="mui-card-content-inner">

					<p class="price">
						市场价:<del>￥{{goodsinfo.market_price}}</del>&nbsp;&nbsp;销售价<span class="now-price">￥{{goodsinfo.sell_price}}</span>	
					</p>
					<p>购买数量：<numbox @getCount="getSelectedCount" :max="goodsinfo.stock_quantity" /></p>
					<p>
                		<mt-button type="primary" size="small">立即购买</mt-button>
                		<mt-button type="danger" size="small" @click="addToShopCar">
		                    <span class="mui-icon-extra mui-icon-extra-cart">
		                    </span>
		                    加入购物车
		                </mt-button>        			
					</p>
				</div>
			</div>
		</div>		
		<!-- 商品参数 -->
		<div class="mui-card">
			<div class="mui-card-header"></div>
			<div class="mui-card-content">
				<div class="mui-card-content-inner">
			        <p>商品货号：{{goodsinfo.goods_no}}</p>
			        <p>库存情况：{{goodsinfo.stock_quantity}}</p>
			        <p>上架时间：{{goodsinfo.add_time | dateFormat}}</p>		
				</div>
			</div>
			<div class="mui-card-footer">
          		<mt-button type="primary" size="large" plain @click="goDese(id)">图文介绍</mt-button>
		        <mt-button type="danger" size="large" plain @click="goComment(id)">商品评论</mt-button>
			</div>
		</div>		
	</div>
</template>
<script type="text/javascript">
	import { request } from '../../util/index.js';
	import { Toast } from 'mint-ui';
	import Swiper from '../subComponents/swiper.vue';
	import NumBox from '../subComponents/goodsInfo_numBox.vue';
	export default {
		name:"goodsInfo",
		components:{
			swiper:Swiper,
			numbox:NumBox
		},
		data() {
			return {
				id:this.$route.params.id,
				carousel:[],
				goodsinfo:{},//获取到的商品信息
				flagBall:false,
				selectedCount:1,//子组件numBox 数量
			}
		},
		created(){
			this.getGoodsBanner();
			this.getGoodsInfo(this.id);
		},
		mounted(){
		},
		methods:{
			getGoodsBanner(){
				request({
					url:"http://www.liulongbin.top:3005/api/getthumimages/" + this.id
				})
				.then(data=>{
					if(data.status == 0){
						data.message.forEach(item=>{
							item.img = item.src;
						});
						this.carousel = data.message;						
					}

				})
				.catch(err=>{
					Toast('获取商品详情图片失败')
				})
			},
			getGoodsInfo(id){
				request({
					url:"http://www.liulongbin.top:3005/api/goods/getinfo/" + id
				})
				.then(data=>{
					if(data.status == 0){
						this.goodsinfo = data.message[0];						
					}

				})
				.catch(err=>{
					Toast('获取商品详情失败')
				})				
			},
			goDese(id){
				this.$router.push({name:"goodsDesc",params:{ id }});
			},
			goComment(id){
				this.$router.push({name:"goodsComment",params:{ id }});
			},
			addToShopCar () {//加入购物车
				this.flagBall = !this.flagBall;
				var goodsInfo = {
					id:this.id,
					count:this.selectedCount,
					price:this.goodsinfo.sell_price,
					selected:true
				}
				this.$store.dispatch('addCar',goodsInfo);
			},
			beforeEnter (el) {
				el.style.transform = 'translate(0,0)';
			},
			enter (el, done) {
				el.offsetWidth;
				const BallPosition = el.getBoundingClientRect();

				const carBoxPosition = document.getElementById('carBox').getBoundingClientRect();
				const disX = carBoxPosition.left - BallPosition.left;
				const disY = carBoxPosition.top - BallPosition.top;				
				el.style.transform = `translate(${disX}px,${disY}px)`
				el.style.transition = 'all 0.5s cubic-bezier(.4,-0.3,1,.68)';
				done()
			},
			afterEnter (el) {
				this.flagBall = !this.flagBall;
			},
			getSelectedCount (count) {
				this.selectedCount = count;
			}			
		}
	}
</script>
<style lang="scss" scoped>
	.goods-info{
		background-color: #eee;
		overflow: hidden;
		.now-price{
			font-size: 14px;
			color:#f40;
			font-weight: bold;
		}
	    .mui-card-footer{
	        display: block;
	        button{
	            margin:15px 0;
	        }
	    }
	    .mui-card-content{
	    	.mui-card-content-inner{	    		
		        p{
		            margin-left:15px;
		        }	    		
	    	}

	        
	    }

	    .mui-icon-extra{
	        font-size: 17px;
	    }
	    .ball{
	        width: 15px;
	        height: 15px;
	        border-radius:50%;
	        background-color: red;
	        position: absolute;
	        top: 370px;
	        left: 163px;
	        z-index: 99;
	    }	    		
	}		


</style>