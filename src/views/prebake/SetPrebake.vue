<template>
  <div class="view">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <van-tabs v-model="active" sticky offset-top="45" title-active-color="#F15A24" @click="onClickNav">
      <van-tab v-for="index in navTab" :key="index.index" :title="index.nav">
        <div class="content"></div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import HeaderTitle from '../../components/HeaderTitle.vue';
  import {
    Dialog
  } from 'vant';
  export default {
    data() {
      return {
        imgUrl: require('@/img/back.png'),
        titleDec: "预烤设置",
        textDec: "",
        navTab: [{
          nav: '预烤设置'
        }, {
          nav: '烤盘信息'
        }],
        active: 0
      }
    },
    components: {
      HeaderTitle
    },
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      SetTimelistFn() {
        this.$api.Devicelist().then(res => {
          
        }).catch((err) => {
          console.log(err)
        })
      },
      onClickNav() { //切换nav
        console.log('当前选中标签', this.active);
      },

      
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.SetTimelistFn();
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
      // console.log(this.$route.params.phoneNumber);//获取上一页路由传参
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
  @import url(../../styles/view.css);
  .van-tabs {
    width: 350px;
  }
</style>