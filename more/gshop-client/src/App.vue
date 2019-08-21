<template>
    <div id="app">
        <router-view></router-view>
        <FooterGuide />
    </div>
</template>

<script>
    import FooterGuide from './components/FooterGuide/FooterGuide.vue'
    import { mapActions } from 'vuex'
    export default {
        name: 'app',
        components: {
            FooterGuide
        },
        mounted() {
            this.getAddress();//向后台获取数据
            this.getUserInfo();//获取用户信息
        },
        methods: {
            ...mapActions(['getAddress','getUserInfo'])
        }
    }
</script>

<style lang="stylus" scoped>

</style>
