<template>
  <div>
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>

  </div>
</template>

<script>
 import HeaderTitle from '../../components/HeaderTitle.vue';
  export default {
    components: {
      HeaderTitle
    },
    props: {},
    data() {
      //这里存放数据
      return {
        titleDec: "设备信息",
        textDec: "",
        imgUrl: require('@/img/back.png'),
      }
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {},
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.factoryno = this.$route.query.factoryno;
      this.pointname = this.$route.query.pointname;
      this.deviceno = this.$route.query.deviceno;
      // this.readOvenwareFn(this.$route.query.factoryno);
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

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
<style scoped>
  /* @import url(); 引入css类 */
</style>