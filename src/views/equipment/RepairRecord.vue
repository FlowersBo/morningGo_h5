<template>
  <div>
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>

  </div>
</template>

<script>
import HeaderTitle from '../../components/HeaderTitle.vue';
  export default {
    components: {HeaderTitle},
    props: {},
    data() {
      //这里存放数据
      return {
        titleDec: "补货记录",
        textDec: "",
        imgUrl: require('@/img/back.png'),
        pageindex: 1,
        pagesize: 100,
      }
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      suppleList(deviceid) { //预烤设置
        this.$api.SuppleList({
          pageindex: this.pageindex,
          pagesize: this.pagesize,
          deviceid
        }).then(res => {
          if (res.data.code == '200') {
            console.log('获取补货记录', res);
            
          } else {
            this.$toast(res.message);
          }

        }).catch((err) => {
          console.log(err)
        })
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.deviceid = this.$route.query.deviceid;
      this.suppleList(this.$route.query.deviceid);
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