<template>
  <div id="mine">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <div>我的</div>
    <Footer :active="active" />
  </div>
</template>

<script>
  import HeaderTitle from '../components/HeaderTitle.vue';
  import Footer from '@/components/footer.vue';
  //这里可以导入其它文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
  //例如：import 《组件名称》from ‘《组件路径》';
  export default {
    name: "mine",
    //import引入的组件需要注入到对象中才能使用
    components: {HeaderTitle,Footer},
    props: {},
    data() {
      //这里存放数据
      return {
        imgUrl: '',
        titleDec: "我的",
        textDec: "",
        active: 4
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