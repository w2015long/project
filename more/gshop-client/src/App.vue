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
        },
        methods: {
            ...mapActions(['getAddress'])
        }
    }
</script>

<style lang="stylus" scoped>

</style>
