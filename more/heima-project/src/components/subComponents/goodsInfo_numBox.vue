<template>
	<div class="mui-numbox" data-numbox-min='1' :data-numbox-max='max'>
		<button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
		<input id="test" class="mui-input-numbox" type="number"  value="1" @change="sendCount" ref="numBox"/>
		<button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
	</div>	
</template>
<script type="text/javascript">
	import mui from '../../lib/mui/js/mui.min.js';
	export default{
		name:"numBox",
		data(){
			return{
				// count:1
			}
		},
		props:['max'],
	    mounted(){
	        //初始化数字选择框
	        mui('.mui-numbox').numbox();
	    },	
	    methods:{
	    	sendCount(){
	    		this.$emit('getCount',parseInt(this.$refs.numBox.value));
	    	}
	    },
	    computed:{

	    },
	    watch: {
	    	max: function (newVal) {
	    		mui('.mui-numbox').numbox()
	    		.setOption('max',newVal);
	    	}
	    }	
	}
</script>
<style lang="scss" scoped>
	
</style>