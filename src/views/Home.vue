<template>
  <div class="home">
    <!-- <Login msg="报表" /> -->
    <!-- <router-link to="/Mine">Mine</router-link> -->
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <Footer :active="active" />
  </div>
</template>

<script>
  import HeaderTitle from '../components/HeaderTitle.vue';
  import Footer from '@/components/footer.vue';
   // 引入封装好的接口
   import {
    Login
  } from "@/api/http.js";
  import {
    getRequest
  } from "@/api/api.js";

  export default {
    data() {
      return {
        imgUrl: require('@/img/back.png'),
        titleDec: "告警",
        textDec: "",
        active: 0,
      }
    },
    components: {
      HeaderTitle,
      Footer
    },
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: { // 调用时使用
      Uploads() {
        // let data = {
        //   code: '021pjwll2CXJa84ZSvol28wr0k4pjwlN',
        //   state: 123
        // }
        // console.log(Login);
        // getRequest(Login, data).then(res => {
        //   console.log(res)
        // })
      }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.Uploads();
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
      console.log(this.$route.params.phoneNumber);
    },
    //生命周期-创建之前
    beforeCreated() {},
    //生命周期-挂载之前
    beforeMount() {},
    //生命周期-更新之前
    beforUpdate() {},
    //生命周期-更新之后
    updated() {},
    //生命周期-销毁之前
    beforeDestory() {},
    //生命周期-销毁完成
    destoryed() {},
    //如果页面有keep-alive缓存功能，这个函数会触发
    activated() {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .home{
    width: 345px;
    margin: 45px auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #333;
    font-size: 14px;
  }
</style>