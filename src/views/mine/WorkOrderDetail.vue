<template>
  <div class="home">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <div class="detailWrap">
      <div class="detail-item">工单编号：{{orderInfo.orderNo}}</div>
      <div class="detail-item">状态：{{orderInfo.statusStr}}</div>
    </div>
    <div class="detail-item">处理人：{{orderInfo.workName}}</div>
    <div class="detail-item">创建时间：{{orderInfo.createTime}}</div>
    <div class="detail-item" v-if="orderInfo.finishTime">完结时间：{{orderInfo.finishTime}}</div>
    <div class="detail-item" v-if="orderInfo.solvePlan">完结状态：{{orderInfo.solvePlan}}</div>
    <div class="detail-item">协作人：{{orderInfo.cooperationName?orderInfo.cooperationName:'无'}}</div>
    <div class="detail-item">报警概况：</div>
    <div class="box">{{orderInfo.alarmDetail}}</div>
    <div class="detail-item">操作记录：</div>
    <van-steps direction="vertical" :active="5" inactive-icon="more" active-color="#ddd">
      <van-step style="font-size:16px;" v-for="(item,index) in orderLog" :key="item.id">
        <p>{{item.createTime}}</p>
        <h3>{{item.orderStatus}} {{index==1?'处理人为：'+item.operateUser:item.memo}}</h3>
      </van-step>
    </van-steps>
    <div class="btnWrap">
      <template v-if="status == 3">
        <div @click="changeOrder(isMsk = true,isMskId='1')">重新指派</div>
        <div @click="changeOrder(isMsk = true,isMskId='2')">挂起</div>
      </template>
      <div v-if="status == 1 || status == 3" @click="changeOrder(isMsk = true,isMskId='3')">完结</div>
    </div>

    <van-popup v-model="isMsk">
      <div class="maskWrap">
        <div class="title">{{isMskId==1?'重新指派':(isMskId==2?'挂起':'完结')}}</div>
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <div class="content" v-if="isMskId!=1">
              <span class="content-title">{{isMskId==2?'挂起原因':'处理结果'}}：</span>
              <van-field style="width: 100%;height: 100px;border: 1px solid #aaa;box-sizing: border-box;padding: 4px;"
                name="inputbox1" v-model="inputbox1" maxlength="150" placeholder="请输入内容" />
            </div>
            <div class="cooperation" v-if="isMskId!=2">
              <div class="cooperation-title">{{isMskId==1?'指派人':'协作人(选填)'}}：</div>
              <van-field v-model="resultValue" is-link readonly name="picker" placeholder="请选择"
                @click="showPicker = true" style="
                  border: 1px solid #aaa;
                  box-sizing: border-box;
                  padding: 0 10px;
                " />
            </div>
            <div class="content">
              <span class="content-title">{{isMskId==2?'后续处理计划':'备注'}}：</span>
              <van-field style="width: 100%;height: 100px;border: 1px solid #aaa;box-sizing: border-box;padding: 4px;"
                name="inputbox2" v-model="inputbox2" maxlength="150" placeholder="请输入内容" />
            </div>
          </van-cell-group>
          <van-button style="width: 100px;height: 40px;margin-left: auto;margin-top: 10px;border-radius: 6px;" block
            color="#F15A24" native-type="submit">
            {{isMskId==1?'重新指派':(isMskId==2?'挂起':'完结')}}
          </van-button>
        </van-form>
      </div>
    </van-popup>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker show-toolbar :columns="columns" value-key="name" @confirm="onConfirm" @cancel="showPicker = false" />
    </van-popup>

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
        orderInfo: '',
        orderLog: '',
        value: "",
        isMsk: false,
        isMskId: 0,
        inputbox1: "",
        inputbox2: "",
        columns: [],
        showPicker: false,
        resultValue: "",
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
            this.orderInfo = res.data.data.orderInfo;
            this.orderLog = res.data.data.orderLog;
            this.status = res.data.data.orderInfo.status;
          })
          .catch((err) => {
            console.log(err);
          });
      },

      changeOrder () {
        this.$api.GetWorker({ orderId: this.orderId })
          .then(res => {
            console.log('协作人列表', res)
            this.columns = res.data.data
          })
      },
      onConfirm (value) {
        console.log("选取", value);
        this.resultValue = value.name;
        this.workId = value.id;
        this.showPicker = false;
      },
      onSubmit (event) {
        console.log("提交", event);
        let isMskId = this.isMskId;
        let data = {}, url = '';
        if (isMskId == 1) {
          if (!event.picker) {
            this.$toast("请选择指派人");
            return
          }
          data = {
            orderId: this.orderId,
            workId: this.workId,
            memo: event.inputbox2
          }
          url = this.$api.Assign
        } else if (isMskId == 2) {
          if (!event.inputbox1) {
            this.$toast("请填写挂起原因");
            return
          } else if (!event.inputbox2) {
            this.$toast("请填写后续处理计划");
            return
          }
          data = {
            orderId: this.orderId,
            reason: event.inputbox1,
            plan: event.inputbox2
          }
          url = this.$api.Suspend
        } else {
          if (!event.inputbox1) {
            this.$toast("请填写处理结果");
            return
          }
          data = {
            orderId: this.orderId,
            solvePlan: event.inputbox1,
            cooperationId: "",
            operateMemo: event.inputbox2
          }
          url = this.$api.Finish
        }
        url(data)
          .then(res => {
            console.log('成功', res)
            this.isMsk = false;
            this.resultValue = '';
            this.orderDetailFn();
          })
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created () {
      this.orderId = this.$route.query.orderId;
      console.log(this.$route.query.orderId)
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
    margin-top: 100px;
  }

  .btnWrap div {
    margin-left: 10px;
    box-sizing: border-box;
    padding: 4px 16px;
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

  .van-popup {
    background: none;
  }

  .maskWrap {
    width: 350px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 20px;
    background: #fff;
    border-radius: 20px;
  }

  .title {
    font-size: 16px;
    border-bottom: 1px solid #999;
    padding-bottom: 10px;
  }

  .cooperation {
    display: flex;
    align-items: center;
    margin: 20px 0;
  }

  .cooperation-title {
    width: 300px;
  }

  .van-cell .van-cell--clickable .van-field {
    border: 1px solid #555 !important;
  }

  .content-title {
    display: inline-block;
    margin: 10px 0;
  }

  .van-cell-group--inset {
    margin: 0;
    padding-bottom: 10px;
  }
</style>
<style>
  .van-step--vertical .van-step__circle-container {
    font-size: 20px !important;
  }
</style>