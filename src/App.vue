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
</script>
<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
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