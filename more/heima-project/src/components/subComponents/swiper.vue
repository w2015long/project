<template>
	<div class="swiper">
		<mt-swipe :auto="4000">
		  <mt-swipe-item v-for="(item,index) in carousel" :key="index">
		  	<img :src="item.img" :class="{ 'full':isFull }"/>
		  </mt-swipe-item>
		</mt-swipe>	
	</div>
</template>
<script type="text/javascript">
	import { Toast } from 'mint-ui';
	export default {
		name:"Swiper",
		data() {
			return {
			}
		},
		props:{
			carousel:Array,
			isFull:Boolean
		},
		created(){
		},
		methods:{

		}
	}
</script>
<style lang="scss" scoped>
	.swiper{
		.mint-swipe{
			height: 190px;
			text-align: center;
			.mint-swipe-items-wrap{
				
				background-color: #cece;
				height: 190px;
				img{
					height:100%;
				}
			}
		}		
	}
	.full{
		width: 100%;
	}
</style>