<!--1.页面-->
<template>
  <div class="App" id='app'>
    <router-view></router-view>
    <TabBar />
  </div>
</template>
<!--2.逻辑-->
<script>
  //2.1 引入组件
  import TabBar from './components/TabBar.vue'
  export default {
    name:'App',
    //2.2 注册组件
    components:{
      TabBar
    },
    methods:{

    }
  }
</script>
<style lang="less">
  #app{

  }
</style>