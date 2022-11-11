<template>
  <div class="home">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <div class="detailWrap">
      <div class="detail-item">工单编号：W4646464645</div>
      <div class="detail-item">状态：已完结</div>
    </div>
    <div class="detailWrap">
      <div class="detail-item">处理人：Flowers</div>
      <div class="detail-item">联系电话：13333333333</div>
    </div>
    <div class="detail-item">创建时间：2022-11-11 10:20</div>
    <div class="detail-item">完结时间：2022-11-11 10:20</div>
    <div class="detail-item">完结状态：正常完结</div>
    <div class="detail-item">协作人：无</div>
    <div class="detail-item">报警概况：</div>
    <div class="box">A肠盒故障</div>
    <div class="detail-item">操作记录：</div>
    <van-steps direction="vertical" :active="0">
      <van-step style="font-size:16px;">
        <p>2022-11-11 12:40</p>
        <h3>创建订单</h3>
      </van-step>
      <van-step style="font-size:16px;">
        <p>2022-11-11 13:00</p>
        <h3>接单 <span>处理人为：博爵</span></h3>
      </van-step>
      <van-step style="font-size:16px;">
        <p>2022-11-12 09:30</p>
        <h3>完结 <span>处理结果：更换</span></h3>
      </van-step>
    </van-steps>

    <div class="btnWrap">
      <template v-if="status == 4">
        <div @click="changeOrder((isMsk = true), (isStatus = status))">
          重新指派
        </div>
        <div @click="changeOrder((isMsk = true), (isStatus = status))">
          挂起
        </div>
      </template>
      <div v-if="status == 1 || status == 4" @click="changeOrder((isMsk = true), (isStatus = status))">
        完结
      </div>
    </div>
  </div>
</template>

<script>
  import HeaderTitle from "@/components/HeaderTitle.vue";
  import { Dialog } from "vant";
  export default {
    data () {
      return {
        imgUrl: require("@/img/back.png"),
        titleDec: "工单详情",
        textDec: "",
        status: 1,
      };
    },
    components: {
      HeaderTitle,
    },
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      orderDetailFn () {
        this.$api
          .WorkDetail({ orderId: this.orderId })
          .then((res) => {
            console.log("返回", res);
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created () {
      this.orderId = JSON.parse(this.$route.query.orderId);
      console.log(this.orderId)
      this.orderDetailFn();
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted () { },
    //生命周期-创建之前
    beforeCreated () { },
    //生命周期-挂载之前
    beforeMount () { },
    //生命周期-更新之前
    beforUpdate () { },
    //生命周期-更新之后
    updated () { },
    //生命周期-销毁之前
    beforeDestory () { },
    //生命周期-销毁完成
    destoryed () { },
    //如果页面有keep-alive缓存功能，这个函数会触发
    activated () { },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .home {
    width: 350px;
    margin: 45px auto 0;
    color: #333;
  }

  .btnWrap {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 6px 0;
  }

  .btnWrap div {
    margin-left: 10px;
    box-sizing: border-box;
    padding: 0 16px;
    border: 1px solid #333;
    border-radius: 4px;
  }

  .detailWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .detail-item {
    margin-top: 15px;
  }

  .box {
    margin-top: 10px;
    width: 100%;
    box-sizing: border-box;
    padding: 4px 10px;
    border: 1px solid #666;
    border-radius: 4px;
  }
</style>