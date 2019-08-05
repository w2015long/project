<template>
	<div class="goods-desc">
        <h3>{{info.title}}</h3>
        <hr>
        <div class="content" v-html="info.content"></div>			
	</div>
</template>
<script type="text/javascript">
	import { request } from '../../util/index.js';
	import { Toast } from 'mint-ui';
	export default {
		name:"goodsDesc",
		components:{
		},
		data() {
			return {
				id:this.$route.params.id,
				info:{}
			}
		},
		created(){
			this.getGoodsDesc();
		},
		mounted(){
		},
		methods:{
			getGoodsDesc(){
				request({
					url:"http://www.liulongbin.top:3005/api/goods/getdesc/" + this.id
				})
				.then(data=>{
					if(data.status == 0){
						this.info = data.message[0];						
					}

				})
				.catch(err=>{
					Toast('获取商品详情失败')
				});
			},

		}
	}
</script>
<style lang="scss">
	.goods-desc{
	    padding: 4px;
	    h3{
	        font-size: 16px;
	        color:#226aff;
	        text-align: center;
	        margin: 10px 0;
	    }
	    .content{
	        img{
	            width: 100%;
	        }
	    }
	}		


</style>