<template>
	<div class="goods-list">

		<div class="goods-item" v-for="item in goodsList" :key="item.id" @click="goGoodsInfo(item.id)">
			<img :src="item.img_url">
			<h1 class="title">{{ item.title }}</h1>
			<div class="info">
				<p class="price">
					<span class="now">￥{{ item.sell_price }}</span>
					<span class="old">￥{{ item.market_price }}</span>
				</p>
				<div class="sell">
					<span>热卖中</span>
					<span>剩余{{ item.stock_quantity }}件</span>
				</div>
			</div>	
		</div>

		<mt-button type="danger" size="large" plain @click="getMore">加载更多</mt-button>					
	</div>
</template>
<script type="text/javascript">
	import { request } from '../../util/index.js';
	import { Toast } from 'mint-ui';
	export default {
		name:"photoInfo",
		components:{
		},
		data() {
			return {
				pageindex:1,
				goodsList:[]
			}
		},
		created(){
			this.getGoodsList();
		},
		mounted(){
		},
		methods:{
			getGoodsList(){
				request({
					url:"http://www.liulongbin.top:3005/api/getgoods?pageindex=" + this.pageindex
				})
				.then(data=>{
					if(data.status == 0){
						this.goodsList = this.goodsList.concat(data.message);						
					}

				})
				.catch(err=>{
					Toast('获取商品列表失败')
				})
			},
			getMore(){
				this.pageindex++;
				this.getGoodsList();
			},
			goGoodsInfo(id){
				//编程式的导航
				this.$router.push({ name: 'goodsInfo', params: { id }})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.goods-list{
		display: flex; 
		flex-wrap: wrap;
		justify-content:space-between;
		padding: 0 7px;
		.goods-item{
	        display: flex;
	        flex-direction: column;
	        justify-content: space-between;
	        // min-height: 293px;
			width:49%;
			margin-top:6px;
			border: 1px solid #eee; 
			box-shadow: 0 0 5px #cecece;
			border-radius: 5px;
			img{
				width:100%;
			}
			.title{
				font-size: 14px;
				color:#666;
			}
			.info{
				background-color: #eee;
				.price{
					margin: 0;
					.now{
						color:#f40;
						font-size: 16px;
					}
					.old{
						text-decoration:line-through; 
						font-size: 12px;
						margin-left: 15px;
					}
				}
				.sell{
					display: flex;
					justify-content: space-between;
					font-size: 12px;
				}
			}

		}

	}		


</style>