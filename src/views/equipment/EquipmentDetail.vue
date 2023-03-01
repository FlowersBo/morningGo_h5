<template>
  <div class="equipmentDetail">
    <HeaderTitle :imgSrc="imgUrl"
                 :title="titleDec"
                 :text="textDec"></HeaderTitle>
    <div class="alarm">
      <div class="alarm-left">
        <div class="content-item">
          <div class="itemKey">设备编号：</div>
          <div class="itemValue">{{ device.deviceno }}</div>
        </div>
        <div class="content-item">
          <div class="itemKey">点位名称：</div>
          <div class="itemValue">{{ device.pointname }}</div>
        </div>
      </div>
      <div class="alarm-right">
        <van-icon class="iconfont icon"
                  v-if="device.isonline == 1"
                  color="#00CC00"
                  class-prefix="icon"
                  name="xinhao" />
        <van-icon class="iconfont icon"
                  v-if="device.isonline != 1"
                  color="#FF0000"
                  class-prefix="icon"
                  name="xinhao" />
        <!-- <van-icon class="iconfont icon" v-if="device.openScreen==0" color="#00CC00" class-prefix='icon'
          name='kaiqipingmu' />
        <van-icon class="iconfont icon" v-if="device.openScreen==1" color="#FF0000" class-prefix='icon'
          name='guanbipingmu' /> -->
        <van-icon class="iconfont icon"
                  v-if="device.isoutofstock == 0"
                  color="#00CC00"
                  class-prefix="icon"
                  name="shouye" />
        <van-icon class="iconfont icon"
                  v-if="device.isoutofstock == 1"
                  color="#FF0000"
                  class-prefix="icon"
                  name="gouwuchetianjia" />
        <van-icon class="iconfont icon"
                  v-if="device.isbad == 0"
                  color="#00CC00"
                  class-prefix="icon"
                  name="weixiu" />
        <van-icon class="iconfont icon"
                  v-if="device.isbad == 1"
                  color="#FF0000"
                  class-prefix="icon"
                  name="weixiujibie-" />
        <van-icon class="iconfont icon"
                  v-if="device.stopSell == 0"
                  color="#00CC00"
                  class-prefix="icon"
                  name="tongzhi" />
        <van-icon class="iconfont icon"
                  v-if="device.stopSell == 1"
                  color="#FF0000"
                  class-prefix="icon"
                  name="tongzhi" />
      </div>
    </div>
    <div class="btnWrap">
      <div class="btn"
           v-for="(value, index) in btnText"
           :key="index">
        <div @click="bindBtn(index)">{{ value }}</div>
      </div>
    </div>

    <van-list v-model="loading"
              :error.sync="error"
              error-text="请求失败，点击重新加载"
              :finished="finished"
              finished-text="没有更多了"
              :immediate-check="false"
              @load="onLoadDetail">
      <van-cell v-for="item in orderList"
                :key="item.alarmId"
                @click="gotoDetail(item.id)">
        <div class="order">
          <div class="order-title">
            <div class="title-left">
              <div class="title-state"
                   style="display: flex; align-items: center">
                <van-icon class="iconfont icon"
                          style=" margin-right: 5px;font-size: 22px;"
                          color="#555"
                          class-prefix="icon"
                          name="gongdanguanli" />
                单号：{{ item.orderNo }}
                <van-icon class="iconfont icon"
                          color="#C4D0FF"
                          class-prefix="icon"
                          name="gaoqingshexiang"
                          @click.stop="gotoVideo(item.id)" />
              </div>
            </div>
            <div class="title-right">
              {{ item.statusStr }}

            </div>
          </div>
          <div class="order-content">
            <div class="orderContent-item">
              <div>点位：{{ item.pointName }}</div>
              <div v-if="item.status !=4">
                剩余：{{ item.differenceTime }}
              </div>
            </div>
            <div class="content-item">
              <div class="itemKey">设备编号：</div>
              <div class="itemValue">{{ item.factoryNo }}</div>
            </div>
            <div class="orderContent-item">
              <div>报警内容：</div>
              <div class="itemValue">{{ item.alarmDetail }}</div>
            </div>
            <div class="orderContent-item">
              <div>时间：</div>
              <div class="itemValue">{{ item.createTime }}</div>
            </div>
            <template v-if="item.status == 4">
              <div class="orderContent-item">
                <div>处理结果：</div>
                <div class="itemValue">{{ item.solvePlan }}</div>
              </div>
              <div class="orderContent-item">
                <div>完结时间：</div>
                <div class="itemValue">{{ item.finishTime }}</div>
              </div>
            </template>
          </div>
          <div class="orderBtnWrap">
            <template v-if="item.status == 3">
              <div @click.stop="changeOrder(item.status,item.id,isMsk = true,isMskId='1')">重新指派</div>
              <div @click.stop="changeOrder(item.status,item.id,isMsk = true,isMskId='2')">挂起</div>
            </template>
            <div v-if="item.status == 1 || item.status == 3"
                 @click.stop="changeOrder(item.status,item.id,isMsk = true,isMskId='3')">
              完结
            </div>
          </div>
        </div>
      </van-cell>
    </van-list>

    <van-popup v-model="isMsk">
      <div class="maskWrap">
        <div class="title">{{isMskId==1?'重新指派':(isMskId==2?'挂起':'完结')}}</div>
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <div class="content"
                 v-if="isMskId!=1">
              <span class="content-title">{{isMskId==2?'挂起原因':'处理结果'}}：</span>
              <van-field style="width: 100%;height: 100px;border: 1px solid #aaa;box-sizing: border-box;padding: 4px;"
                         name="inputbox1"
                         v-model="inputbox1"
                         maxlength="150"
                         placeholder="请输入内容" />
            </div>
            <div class="cooperation"
                 v-if="isMskId!=2">
              <div class="cooperation-title">{{isMskId==1?'指派人':'协作人(选填)'}}：</div>
              <van-field v-model="resultValue"
                         is-link
                         readonly
                         name="picker"
                         placeholder="请选择"
                         @click="showPicker = true"
                         style="border: 1px solid #aaa; box-sizing: border-box;padding: 0 10px;" />
            </div>
            <div class="cooperation"
                 v-if="isMskId!=2">
              <div class="cooperation-title">报警原因(选填)：</div>
              <van-field v-model="alarmReason"
                         is-link
                         readonly
                         name="reason"
                         placeholder="请选择"
                         @click="showPicker1 = true"
                         style="border: 1px solid #aaa;
                  box-sizing: border-box;
                  padding: 0 10px;
                " />
            </div>
            <div class="content">
              <span class="content-title">{{isMskId==2?'后续处理计划':'备注'}}：</span>
              <van-field style="
                  width: 100%;
                  height: 100px;
                  border: 1px solid #aaa;
                  box-sizing: border-box;
                  padding: 4px;
                "
                         name="inputbox2"
                         v-model="inputbox2"
                         maxlength="150"
                         placeholder="请输入内容" />
            </div>
          </van-cell-group>
          <van-button style="
              width: 100px;
              height: 40px;
              margin-left: auto;
              margin-top: 10px;
              border-radius: 6px;
            "
                      block
                      color="#F15A24"
                      native-type="submit">
            {{isMskId==1?'重新指派':(isMskId==2?'挂起':'完结')}}
          </van-button>
        </van-form>
      </div>
    </van-popup>
    <van-popup v-model="showPicker"
               position="bottom">
      <van-picker show-toolbar
                  :columns="columns"
                  value-key="name"
                  @confirm="onConfirm"
                  @cancel="showPicker = false" />
    </van-popup>
    <van-popup v-model="showPicker1"
               position="bottom">
      <van-picker show-toolbar
                  :columns="reasonList"
                  value-key="content"
                  @confirm="onConfirm1"
                  @cancel="showPicker1 = false" />
    </van-popup>
  </div>
</template>

<script>
import HeaderTitle from "../../components/HeaderTitle.vue";
import { Dialog } from "vant";
export default {
  components: {
    HeaderTitle,
  },
  props: {},
  data () {
    //这里存放数据
    return {
      titleDec: "设备详情",
      textDec: "",
      imgUrl: require("@/img/back.png"),
      btnText: [
        "库存设置",
        "预烤设置",
        "烤盘信息",
        "上报废弃",
        "补货记录",
        "温度信息",
        "设备信息",
        "恢复A肠盒故障",
        "恢复B肠盒故障",
        "消除故障告警",
        "重启上位机",
        "重启下位机",
        "机械臂归位",
        "初始化设备",
        "预订开关",
      ],
      pageindex: 1,
      pagesize: 30,
      loading: false,
      finished: false, //是否已加载完成，加载完成后不再触发load事件
      error: false, //是否加载失败，加载失败后点击错误提示可以重新触发load事件
      isShow: true,
      // 新修改
      orderList: [],
      isMsk: false,
      isMskId: 0,
      inputbox1: "",
      inputbox2: "",
      columns: [],
      reasonList: [],
      showPicker: false,
      showPicker1: false,
      resultValue: "",
      alarmReason: '',
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中数据变化
  watch: {},
  //方法集合
  methods: {
    orderListFn () {
      let data = {
        deviceId: this.device.deviceid,
        status: "3",
        pageNum: this.pageindex,
        pageSize: this.pagesize,
      };
      this.$api
        .WorkOrderList(data)
        .then((res) => {
          console.log("返回", res);
          this.isShow = false;
          if (this.refreshing) {
            this.refreshing = false; //刷新成功
          }
          // 加载状态结束
          this.loading = false;
          let list = res.data.data.list;
          list.map((item) => {
            if (item.status != 4) {
              let day = this.$moment(item.expireTime).diff(
                this.$moment().format("YYYY-MM-DD HH:mm:ss"),
                "days"
              );

              let date = this.$moment(item.expireTime).diff(
                this.$moment().format("YYYY-MM-DD HH:mm:ss"),
                "minutes"
              );
              let m = date % 60;
              console.log(m)
              let h = Math.floor(date / 60);
              console.log(h)
              let d = h % 24;
              item.differenceTime = d.toFixed(0) + "小时" + m + "分钟";
              if (date <= 0) item.differenceTime = '已超时';
            }
          });
          this.orderList.push(...list);
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onLoadDetail () {
      // 数据全部加载完成
      if (this.isShow || this.orderList.length >= this.total) {
        console.log("加载完成");
        this.finished = true;
        return true;
      } else {
        console.log("加载未完成");
        this.pageindex++;
        this.orderListFn();
      }
    },
    gotoVideo (alarmId) {
      //跳转视频
      this.$router.push({
        path: "/Player",
        query: {
          alarmId,
          url: "Getvideo",
        },
      });
    },
    bindBtn (index) {
      if (index == 0) {
        this.$router.push({
          path: "/SetRepertory",
          query: {
            factoryno: this.device.factoryno,
            pointname: this.device.pointname,
            deviceid: this.device.deviceid,
          },
        });
      } else if (index == 1) {
        this.$router.push({
          path: "/NewSetPrebake",
          query: {
            factoryno: this.device.factoryno,
            pointname: this.device.pointname,
            deviceno: this.device.deviceno,
            deviceid: this.device.deviceid,
            isonline: this.device.isonline,
            stopSell: this.device.stopSell,
          },
        });
      }
      // else if (index == 1) {
      //   this.$router.push({
      //     path: "/SetPrebake",
      //     query: {
      //       factoryno: this.device.factoryno,
      //       pointname: this.device.pointname,
      //       deviceno: this.device.deviceno,
      //     },
      //   });
      // }
      else if (index == 2) {
        this.$router.push({
          path: "/Ovenware",
          query: {
            // device:JSON.stringify()
            factoryno: this.device.factoryno,
            pointname: this.device.pointname,
            deviceno: this.device.deviceno,
          },
        });
      } else if (index == 3) {
        this.$router.push({
          path: "/ReportAbandon",
          query: {
            factoryno: this.device.factoryno,
            pointname: this.device.pointname,
            deviceno: this.device.deviceno,
          },
        });
      } else if (index == 4) {
        this.$router.push({
          path: "/RepairRecord",
          query: {
            deviceid: this.device.deviceid,
          },
        });
      } else if (index == 5) {
        this.$router.push({
          path: "/Temperature",
          query: {
            factoryno: this.device.factoryno,
            pointname: this.device.pointname,
            deviceno: this.device.deviceno,
            isonline: this.device.isonline,
            stopSell: this.device.stopSell,
          },
        });
      } else if (index == 6) {
        this.$router.push({
          path: "/Facility",
          query: {
            factoryno: this.device.factoryno,
            pointname: this.device.pointname,
            deviceno: this.device.deviceno,
            isonline: this.device.isonline,
            stopSell: this.device.stopSell,
          },
        });
      } else if (index == 14) {
        this.$router.push({
          path: "/SetYukao",
          query: {
            factoryno: this.device.factoryno,
            pointname: this.device.pointname,
            deviceno: this.device.deviceno,
            isonline: this.device.isonline,
            stopSell: this.device.stopSell,
            deviceid: this.device.deviceid,
          },
        });
      } else if (index == 7 || 8 || 9 || 10 || 11 || 12 || 13) {
        let command = "",
          commandText = "";
        switch (index) {
          case 7:
            commandText = "恢复A肠盒故障";
            command = "recoverABox";
            break;
          case 8:
            commandText = "恢复B肠盒故障";
            command = "recoverBBox";
            break;
          case 9:
            commandText = "消除故障告警";
            command = "clearWarning";
            break;
          case 10:
            commandText = "重启上位机";
            command = "restartAndroid";
            break;
          case 11:
            commandText = "重启下位机";
            command = "restartMachine";
            break;
          case 12:
            commandText = "机械臂归位";
            command = "initArm";
            break;
          case 13:
            commandText = "初始化设备";
            command = "init";
            break;
        }
        Dialog.confirm({
          title: "提示",
          message: `确认要${commandText}`,
        })
          .then(() => {
            this.$api
              .Pubcmd({
                factoryno: this.device.factoryno,
                // pointname: this.device.pointname,
                deviceno: this.device.deviceno,
                deviceid: this.device.deviceid,
                command,
              })
              .then((res) => {
                console.log(commandText, res);
                if (res.data.code == 200) {
                  this.$toast(commandText + "成功");
                  if (command === "clearWarning") {
                    this.finished = false;
                    this.pageindex = 1;
                    this.orderList = [];
                    this.orderListFn();
                  }
                } else {
                  this.$toast(res.data.message);
                }
              })
              .catch((err) => { });
          })
          .catch((err) => { });
      }
    },
    changeOrder (isStatus, orderId) {
      this.isStatus = isStatus;
      this.orderId = orderId;
      this.$api.GetWorker({ orderId })
        .then(res => {
          console.log('协作人列表', res)
          this.columns = res.data.data
        })
      this.$api.AlarmReason({ orderId })
        .then(res => {
          console.log('报警原因列表', res)
          this.reasonList = res.data.data
        })
    },
    onConfirm (value) {
      console.log("选取", value);
      this.resultValue = value.name;
      this.workId = value.id;
      this.showPicker = false;
    },
    onConfirm1 (value) {
      console.log("选取报警", value);
      this.alarmReason = value.content;
      this.showPicker1 = false;
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
          operateMemo: event.inputbox2,
          alarmReason: event.reason
        }
        url = this.$api.Finish
      }
      url(data)
        .then(res => {
          console.log('成功', res)
          this.isMsk = false;
          this.resultValue = '';
          this.alarmReason = '';
          this.finished = false;
          this.pageindex = 1;
          this.orderList = [];
          this.isShow = true;
          this.orderListFn();
        })
    },
    gotoDetail (orderId) {
      this.$router.push({
        path: "/WorkOrderDetail",
        query: {
          orderId
        },
      })
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.orderList = [];
    this.device = JSON.parse(this.$route.query.equipmentData);
    this.orderListFn();
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
<style scoped>
.equipmentDetail {
  width: 350px;
  margin: 0 auto;
}

.alarm {
  width: 100%;
  background-color: #eee;
  margin-top: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  margin-top: 55px;
}

.alarm-left {
  width: 200px;
}

.content-item {
  width: 100%;
  display: flex;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.itemKey {
  min-width: 75px;
}

.itemValue {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.alarm-right {
  flex: 1;
  display: flex;
  margin: 10px 0;
  justify-content: flex-end;
}

.icon {
  width: 24px;
  font-size: 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 2px;
}

.btnWrap {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  justify-items: center;
  text-align: justify;
}

.btnWrap:after {
  content: "";
  width: 30%;
}

.btn {
  width: 100px;
  height: 38px;
  margin: 10px 0;
  text-align: center;
  line-height: 38px;
  border: none;
  border-radius: 6px;
  background: #ff9900;
  color: #fff;
}

/* 列表 */
.van-cell {
  width: 350px;
  padding: 0;
}

.order {
  width: 100%;
  background-color: #eee;
  margin-top: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0 10px;
}

.order-title {
  display: flex;
  height: 35px;
  justify-content: space-between;
  border-bottom: 1px solid #fff;
}

.title-left,
.title-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-right {
  text-align: right;
}

.titleBtn {
  width: 40px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  background-color: #f15a24;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
}

.order-content {
  width: 100%;
  border-bottom: 1px solid #fff;
}

.orderContent-item {
  width: 100%;
  display: flex;
  margin: 10px 0;
}

.order-content .orderContent-item:first-child {
  justify-content: space-between;
}

.order-content .orderContent-item:last-child {
  color: #ff9a03;
}

.orderBtnWrap {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 6px 0;
}

.orderBtnWrap div {
  margin-left: 10px;
  box-sizing: border-box;
  padding: 0 16px;
  border: 1px solid #333;
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