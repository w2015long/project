<template>
	<div class="goods-comment">
		<h2>goods comment</h2>				
	</div>
</template>
<script type="text/javascript">
	import { request } from '../../util/index.js';
	import { Toast } from 'mint-ui';
	export default {
		name:"goodsComment",
		components:{
		},
		data() {
			return {

			}
		},
		created(){
			// this.getGoodsList();
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

		}
	}
</script>
<style lang="scss" scoped>
	.goods-comment{

	}		


</style>