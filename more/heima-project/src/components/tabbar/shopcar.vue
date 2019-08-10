<template>
	<div class="shopping">
		<div class="goods-list" v-for="(item,index) in goodsCarList" :key=""item.id>
			<div class="mui-card">
				<div class="mui-card-content">
					<div class="mui-card-content-inner">
						<mt-switch
								v-model="getGoodsCarSelected[item.id]"
								@change="updateSelected(item.id,getGoodsCarSelected[item.id])"
						></mt-switch>
						<img :src="item.thumb_path" alt="item.title">
						<div class="goods-info">
							<h1 class="title">{{ item.title }}</h1>
							<p class="operation">
								<span class="price">￥{{ item.sell_price }}</span>
								<numbox :count="getGoodsCarCount[item.id]" :goodsId="item.id"></numbox>
								<a href="javascript:;" @click.prevent="delCar(index,item.id)">删除</a>
							</p>

						</div>
					</div>
				</div>
			</div>
		</div>
		<!--订单结算-->
		<div class="mui-card">
			<div class="mui-card-content">
				<div class="mui-card-content-inner order">
					<div class="left">
						<p>总计(不含运费)</p>
						<p>已勾选商品 <span class="red">{{ getSelectedCountAndAmount.selectedCount }}</span> 件,总价 ￥  <span class="red">{{ getSelectedCountAndAmount.selectedAmount }}</span> </p>
					</div>
					<mt-button type="danger" @click="toast">去结算</mt-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Numbox from '../subComponents/shopcar_numBox.vue';
	import _g from '../../util';
	import { mapGetters } from 'vuex'
	export default {
		name:"Numbox",
		data(){
			return{
				ids:'',
				goodsCarList:[],
			}
		},
		components:{
			numbox:Numbox
		},
		created(){
			this.getGoodsCarList()
		},
		computed:{
			...mapGetters([
				'getGoodsCarCount',
				'getGoodsCarSelected',
				'getSelectedCountAndAmount'
			])
		},
		methods:{
			getGoodsCarList(){
				this.ids = this.$store.state.car.map(elem=>elem.id).join(',');
				if(!this.ids) return;
				_g.request({
					url:"http://www.liulongbin.top:3005/api/goods/getshopcarlist/" + this.ids
				})
						.then(data=>{
							if(data.status == 0){
								this.goodsCarList = data.message;
							}

						})
						.catch(err=>{
							Toast('获取商品详情失败')
						})
			},
			delCar(index,id){
				this.goodsCarList.splice(index,1);
				this.$store.dispatch('delCar',id);
			},
			updateSelected (id,val) {
				this.$store.dispatch('updateSelected',{id:id,selected:val});
			}

		}


	}
</script>
<style lang="scss" scoped>
	.shopping{
		background-color: #eee;
		overflow: hidden;
		.goods-list{
			.mui-card-content-inner{
				display:flex;
				align-items: center;
				img{
					width: 60px;
					height: 60px;
				}
				.goods-info{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.title{
						font-size: 14px;
					}
					.operation{
						margin: 0;
						display:flex;
						justify-content: space-between;
						.price{
							color:red;
							font-weight: bold;
						}
					}

				}

			}

		}
		.order{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.red{
				color:red;
				font-weight: bold;
				font-size: 16px;
			}
		}
	}
</style>