<template>
  <div class="equipmentDetail">
    <HeaderTitle
      :imgSrc="imgUrl"
      :title="titleDec"
      :text="textDec"
    ></HeaderTitle>
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
        <van-icon
          class="iconfont icon"
          v-if="device.isonline == 1"
          color="#00CC00"
          class-prefix="icon"
          name="xinhao"
        />
        <van-icon
          class="iconfont icon"
          v-if="device.isonline != 1"
          color="#FF0000"
          class-prefix="icon"
          name="xinhao"
        />
        <!-- <van-icon class="iconfont icon" v-if="device.openScreen==0" color="#00CC00" class-prefix='icon'
          name='kaiqipingmu' />
        <van-icon class="iconfont icon" v-if="device.openScreen==1" color="#FF0000" class-prefix='icon'
          name='guanbipingmu' /> -->
        <van-icon
          class="iconfont icon"
          v-if="device.isoutofstock == 0"
          color="#00CC00"
          class-prefix="icon"
          name="shouye"
        />
        <van-icon
          class="iconfont icon"
          v-if="device.isoutofstock == 1"
          color="#FF0000"
          class-prefix="icon"
          name="gouwuchetianjia"
        />
        <van-icon
          class="iconfont icon"
          v-if="device.isbad == 0"
          color="#00CC00"
          class-prefix="icon"
          name="weixiu"
        />
        <van-icon
          class="iconfont icon"
          v-if="device.isbad == 1"
          color="#FF0000"
          class-prefix="icon"
          name="weixiujibie-"
        />
        <van-icon
          class="iconfont icon"
          v-if="device.stopSell == 0"
          color="#00CC00"
          class-prefix="icon"
          name="tongzhi"
        />
        <van-icon
          class="iconfont icon"
          v-if="device.stopSell == 1"
          color="#FF0000"
          class-prefix="icon"
          name="tongzhi"
        />
      </div>
    </div>
    <div class="btnWrap">
      <div class="btn" v-for="(value, index) in btnText" :key="index">
        <div @click="bindBtn(index)">{{ value }}</div>
      </div>
    </div>

    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="onLoadDetail"
    >
      <van-cell v-for="item in deviceListDetail" :key="item.alarmId">
        <div class="item">
          <div class="item-title">
            <div class="title-left">
              <div class="title-state">{{ item.alarmconent }}</div>
              <van-icon
                class="iconfont iten-icon"
                color="#F15A24"
                class-prefix="icon"
                name="weixiu"
              />
              <!-- <van-icon v-else class="iconfont icon" color="#F15A24" class-prefix='icon' name='gouwuchetianjia' /> -->
            </div>
            <div class="title-right">
              <van-icon
                class="iconfont iten-icon"
                color="#C4D0FF"
                class-prefix="icon"
                name="gaoqingshexiang"
                @click="gotoVideo(item.alarmId, item.factoryno)"
              />
              <div class="titleBtn" @click="clickCancelFn(item.alarmId)">
                消除
              </div>
            </div>
          </div>
          <div class="item-content">
            <div class="content-item">
              <div class="itemKey">告警时间：</div>
              <div class="itemValue">{{ item.alarmtime }}</div>
            </div>
            <div class="content-item">
              <div class="itemKey">告警级别：</div>
              <div class="itemValue">{{ item.alarmlevel }}</div>
            </div>
            <div class="content-item">
              <div class="itemKey">点位名称：</div>
              <div class="itemValue">{{ item.pointname }}</div>
            </div>
          </div>
          <div class="item-detail" @click="gotoAlarmFn(item.alarmcode)">
            <div class="detailText">
              <div class="itemKey">告警内容：</div>
              <div>{{ item.codeDetail }}</div>
            </div>
            <img class="detailImg" src="../../img/right-arrows.png" alt="" />
          </div>
        </div>
      </van-cell>
    </van-list>
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
  data() {
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
        "预定开关",
        "预烤设置(新)",
      ],
      deviceListDetail: [],
      pageindex: 1,
      pagesize: 30,
      loading: false,
      finished: false, //是否已加载完成，加载完成后不再触发load事件
      error: false, //是否加载失败，加载失败后点击错误提示可以重新触发load事件
      isShow: true,
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中数据变化
  watch: {},
  //方法集合
  methods: {
    DevicelistFn() {
      let data = {
        pageindex: this.pageindex,
        pagesize: this.pagesize,
        deviceid: this.device.deviceid,
      };
      this.$api
        .Getalarmlist(data)
        .then((res) => {
          console.log("单个设备报警返回", res);
          this.isShow = false;
          if (this.refreshing) {
            this.refreshing = false; //刷新成功
          }
          // 加载状态结束
          this.loading = false;
          this.total = res.data.data.total;
          this.deviceListDetail.push(...res.data.data.alarmlist);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    onLoadDetail() {
      // 数据全部加载完成
      if (this.isShow || this.deviceListDetail.length >= this.total) {
        console.log("加载完成");
        this.finished = true;
        return true;
      } else {
        console.log("加载未完成");
        this.pageindex++;
        this.DevicelistFn();
      }
    },
    gotoVideo(alarmId, factoryno) {
      //跳转视频
      this.$router.push({
        path: "/Player",
        query: {
          alarmId,
          factoryno,
          url: "Getvideo",
        },
      });
    },
    clickCancelFn(alarmId) {
      //清除报警
      Dialog.confirm({
        title: "提示",
        message: "确认要消除此告警",
      })
        .then(() => {
          let data = {
            alarmId,
          };
          this.$api
            .CancelAlarm(data)
            .then((res) => {
              this.$toast("清除告警成功");
              this.finished = false;
              this.pageindex = 1;
              this.deviceListDetail = [];
              this.DevicelistFn();
            })
            .catch((err) => {
              console.log(err);
              this.$toast("清除告警失败");
            });
        })
        .catch(() => {});
    },

    gotoAlarmFn(alarmcode) {
      //跳转富文本
      this.$router.push({
        path: "/Alarm",
        query: {
          alarmcode,
        },
      });
    },

    bindBtn(index) {
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
          path: "/SetPrebake",
          query: {
            factoryno: this.device.factoryno,
            pointname: this.device.pointname,
            deviceno: this.device.deviceno,
          },
        });
      } else if (index == 2) {
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
      } else if (index == 15) {
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
                    this.deviceListDetail = [];
                    this.DevicelistFn();
                  }
                } else {
                  this.$toast(res.data.message);
                }
              })
              .catch((err) => {});
          })
          .catch((err) => {});
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.deviceListDetail = [];
    this.device = JSON.parse(this.$route.query.equipmentData);
    this.DevicelistFn();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
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
  activated() {},
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

.item {
  width: 100%;
  background-color: #eee;
  margin-top: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0 10px;
}

.item-title {
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

.iten-icon {
  width: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 22px;
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

.item-content {
  width: 100%;
  border-bottom: 1px solid #fff;
}

.content-item {
  width: 100%;
  display: flex;
  margin: 10px 0;
}

.item-detail {
  min-height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ff9a03;
}

.detailText {
  display: flex;
}

.detailImg {
  width: 16px;
  height: 16px;
}
</style>