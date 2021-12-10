<template>
  <div id="app">
    <router-view />
    <loading v-show="isLoading"></loading>
  </div>
</template>
<script>
  import {
    mapState
  } from "vuex";
  import loading from "./components/loading";
  export default {
    name: "app",
    components: {
      loading
    },
    props: {

    },
    data() {
      return {

      };
    },
    //计算属性 类似于data概念
    computed: {
      ...mapState(["isLoading"])
    },
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
      console.log(this.isLoading)
    },
    //生命周期-创建之前
    beforeCreated() {},
    //生命周期-挂载之前
    beforeMount() {},
  }
  // document.body.addEventListener('touchmove', function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  // }, {
  //   passive: false
  // })
</script>
<style lang="less">
  body {
    width: 100%;
    /* touch-action: none; */
    /*将该属性写在根元素上即可之后就不会报错*/
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333;
    font-size: 14px;
    margin-top: 45px;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style>