<template>
	<div class="mui-numbox" data-numbox-min='1' data-numbox-max='9' style="height: 24px;">
		<button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
		<input id="test" class="mui-input-numbox" type="number" readonly :value="count" @change="countChanged" ref="numBox"/>
		<button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
	</div>	
</template>
<script type="text/javascript">
	import mui from '../../lib/mui/js/mui.min.js';
	export default{
		name:"numBox",
		data(){
			return{
			}
		},
		props:['count','goodsId'],
	    mounted(){
	        //初始化数字选择框
	        mui('.mui-numbox').numbox();
	    },	
	    methods:{
	    	countChanged(){
				this.$store.dispatch('uploadCar',{count:this.$refs.numBox.value,id:this.goodsId})
	    	}
	    },
	    computed:{

	    }
	}
</script>
<style lang="scss" scoped>
	
</style>