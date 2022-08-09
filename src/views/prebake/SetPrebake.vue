<template>
  <div id="setPrebake">
    <HeaderTitle
      :imgSrc="imgUrl"
      :title="titleDec"
      :text="textDec"
    ></HeaderTitle>
    <van-tabs
      v-model="active"
      sticky
      offset-top="45"
      title-active-color="#F15A24"
      @click="onClickNav"
    >
      <van-tab title="预烤设置">
        <div class="preheat">
          <div class="facility">
            <div>设备编号：{{ device.factoryno }}</div>
            <div>点位名称：{{ device.pointname }}</div>
          </div>
          <div class="operation">
            <div class="operationTime">
              <div class="setTimerWrap">
                <van-radio-group v-model="checked" @change="changeRad">
                  <div class="setTimer">
                    <van-radio
                      name="1"
                      label-disabled
                      checked-color="#FF9900"
                    ></van-radio>
                    <div class="onSetTimer" @click="setStartTime('s')">
                      {{
                        tactics.startOpen ? tactics.startOpen : "运营开始时间"
                      }}
                    </div>
                    <span style="margin-right: 6px">~</span>
                    <div class="onSetTimer" @click="setStartTime('e')">
                      {{ tactics.endOpen ? tactics.endOpen : "运营结束时间" }}
                    </div>
                  </div>
                  <van-radio name="2" checked-color="#FF9900" label-disabled
                    >24小时营业</van-radio
                  >
                </van-radio-group>
              </div>
            </div>
            <!-- 时间选择器 -->
            <van-popup v-model="show" round position="bottom">
              <van-datetime-picker
                v-model="currentTime"
                type="time"
                title="选择时间"
                @cancel="show = false"
                @confirm="confirmTimeFn"
              />
            </van-popup>
            <button class="operationBtn" @click="onSetTimerChange">保存</button>
          </div>

          <!-- 日期选择 -->
          <div class="calendarWrap">
            <div v-if="selectDate !== undefined && selectDate.length > 0">
              当前选择共计{{ selectDate.length }}天
            </div>
            <div v-else class="calendarSelsct">
              <div class="timerBtn" @click="cutTimeFn(0)">
                <van-icon name="arrow-left" />
              </div>
              <van-cell
                class="calendar"
                :value="currentDate"
                @click="isShowBirth = true"
              />
              <van-popup v-model="isShowBirth" position="bottom" round>
                <!-- 日期选择控件 -->
                <van-datetime-picker
                  type="date"
                  v-model="dateStr"
                  title="选择日期"
                  :show-toolbar="true"
                  @cancel="isShowBirth = false"
                  @confirm="confirmFn"
                />
              </van-popup>
              <div class="timerBtn" @click="cutTimeFn(1)">
                <van-icon name="arrow" />
              </div>
            </div>
            <button
              class="today gotocalendar timerBtn"
              v-if="selectDate !== undefined && selectDate.length > 0"
              @click="selectDate = []"
            >
              今日
            </button>
            <button class="gotocalendar timerBtn" @click="gotocalendarFn">
              日历
            </button>
          </div>

          <!-- 预烤时间段设置 -->
          <van-grid class="van-grids" :column-num="6">
            <van-grid-item
              class="gridItem"
              v-for="(item, index) in bakeTime"
              :key="index"
            >
              <div class="timerWrap">
                <div class="timer">{{ 0 + index }}时-{{ 1 + index }}时</div>
                <div class="timerInp">
                  A:
                  <van-field
                    v-model="item.aNum"
                    :name="index.toString()"
                    type="digit"
                    @blur="onStartChange"
                  />
                </div>
                <div style="width: 60%; height: 1px; background: #aaa"></div>
                <div class="timerInp">
                  B:
                  <van-field
                    v-model="item.bNum"
                    :name="index.toString()"
                    type="digit"
                    @blur="onEndChange"
                  />
                </div>
              </div>
            </van-grid-item>
          </van-grid>
          <div class="saveWrap">
            <button class="save" @click="saveFormFn">保存预烤设置</button>
          </div>

          <!-- <table>
            <thead>
              <tr>
                <th>时间段</th>
                <th>A区</th>
                <th>B区</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in bakeTime" :key="index">
                <td>{{ item.startTime }}-{{ item.endTime }}</td>
                <td>
                  <van-stepper
                    :value="item.aNum"
                    :name="index"
                    min="0"
                    max="18"
                    button-size="20"
                    disable-input
                    @change="onStartChange"
                  />
                </td>
                <td>
                  <van-stepper
                    :value="item.bNum"
                    :name="index"
                    min="0"
                    max="18"
                    button-size="20"
                    disable-input
                    @change="onEndChange"
                  />
                </td>
                <td>
                  <button class="btn" @click="bindSaveFn(index)">保存</button>
                </td>
              </tr>
            </tbody>
          </table> -->
        </div>
      </van-tab>
      <van-tab title="烤盘信息">
        <div class="ovenware">
          <van-grid :column-num="3">
            <van-grid-item
              v-for="(item, index) in hotplate"
              :key="index"
              :class="{ bgc: item.bgc }"
            >
              <div class="ovenware-content" :class="{ bgc: item.bgc }">
                <div>{{ item.address }}({{ item.addressType }})</div>
                <div>
                  {{ item.temperIsReach
                  }}<span v-if="item.temperIsReach != '空'">肠</span
                  ><span
                    v-if="item.temperIsReach != '空'"
                    :class="{ roastStatus: item.roastStatus == '烤制完成' }"
                    >({{ item.roastStatus }})</span
                  >
                </div>
                <div>{{ item.showTime }}</div>
              </div>
            </van-grid-item>
          </van-grid>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import HeaderTitle from "../../components/HeaderTitle.vue";
import { Dialog } from "vant";
export default {
  name: "setPrebake",
  data() {
    return {
      imgUrl: require("@/img/back.png"),
      titleDec: "预烤设置",
      textDec: "",
      active: 0,
      tactics: {},
      currentTime: "07:00",
      show: false,
      device: "",
      bakeTime: [],
      hotplate: [],
      checked: "1",
      digit: 10,
      currentDate: this.$moment(new Date()).format("YYYY-MM-DD"),
      dateStr: new Date(),
      isShowBirth: false,
      selectDate: [],
      isAllDay: false,
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
    changeRad(e) {
      //监听选项radio
      console.log("当前选项", e);
      if (e === "1") {
        this.isAllDay = false;
      } else {
        this.isAllDay = true;
      }
    },
    saveFormFn() {
      //保存预烤设置
      Dialog.confirm({
        title: "提示",
        message: "确定保存该策略",
      })
        .then(() => {
          let dates;
          if (this.selectDate && this.selectDate.length > 0) {
            dates = this.selectDate;
          } else {
            dates = this.selectDate.concat(this.currentDate);
          }
          console.log(dates,this.bakeTime)
          this.$api
            .SaveAll({
              deviceId: "1353880641422229504",
              dates,
              roasts: this.bakeTime,
            })
            .then((res) => {
              if (res.data.code == "200") {
                this.$toast("保存成功");
              } else {
                this.$toast(res.data.message);
              }
            })
            .catch((err) => {
              this.$toast("保存失败");
            });
        })
        .catch(() => {});
    },
    readimelistFn() {
      //预烤
      this.$api
        .GetDate({
          deviceId: "1353880641422229504",
          searchDate: this.currentDate,
        })
        .then((res) => {
          console.log("返回的烤制策略", res);
          if (res.data.code === 200) {
            this.tactics = res.data.data.tactics;
            this.bakeTime = res.data.data.tactics.tactic;
            this.device = res.data.data.device;
            this.isAllDay = res.data.data.tactics.isAllDay;
            if (res.data.data.tactics.isAllDay) {
              this.checked = "2";
            } else {
              this.checked = "1";
            }
          } else {
            this.$toast(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    readOvenwareFn(factoryno) {
      //烤盘信息
      this.$api
        .Hotplate({
          factoryno,
        })
        .then((res) => {
          console.log("烤盘信息", res);
          if (res.data.code == 200) {
            this.hotplate = res.data.data.hotplate;
            this.hotplate.forEach((element) => {
              if (element.addressType == "1") {
                element.addressType = "加热区";
                element.bgc = true;
              } else {
                element.addressType = "保温区";
                element.bgc = false;
              }
              let nowTime = new Date().getTime();
              let d, h, m, s, m2, s2;
              let showTime = "-";
              let temperIsReach = "空";
              if (element.haveSausage) {
                let roastStatus = "";
                //如果当前时间大于烤制结束时间
                if (nowTime > element.endRoastTime) {
                  //烤制完成
                  let warmTime = new Date().getTime() - element.endRoastTime;
                  if (warmTime >= 0) {
                    d = Math.floor(warmTime / 1000 / 60 / 60 / 24);
                    h = Math.floor((warmTime / 1000 / 60 / 60) % 24);
                    m2 = Math.floor((warmTime / 1000 / 60) % 60);
                    s2 = Math.floor((warmTime / 1000) % 60);
                  }
                  roastStatus = "烤制完成";
                  element.showTime = h + "时" + m2 + "分" + s2 + "秒";
                } else {
                  //烤制中
                  let roastTime = new Date().getTime() - element.startRoastTime;
                  if (roastTime >= 0) {
                    m = Math.floor((roastTime / 1000 / 60) % 60);
                    s = Math.floor((roastTime / 1000) % 60);
                  }
                  roastStatus = "烤制中";
                  element.showTime = m + "分" + s + "秒";
                }
                element.temperIsReach = element.stock;
                element.roastStatus = roastStatus;
              } else {
                element.temperIsReach = temperIsReach;
                element.showTime = "-";
              }
            });
          } else {
            this.$toast(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onClickNav() {
      //切换nav
      console.log("当前选中标签", this.active);
      if (this.active == 0) {
        this.readimelistFn(this.factoryno);
      } else {
        this.readOvenwareFn(this.factoryno);
      }
    },
    setStartTime(v) {
      //时间选择
      this.show = true;
      this.timeStart = v;
      console.log(this.tactics);
    },
    confirmTimeFn(val) {
      //时间选择器确认按钮
      this.show = false;
      if (this.timeStart == "s") {
        this.tactics.startOpen = val;
      } else {
        this.tactics.endOpen = val;
      }
    },

    // 日期选择
    cutTimeFn(id) {
      if (id === 0) {
        this.currentDate = this.$moment(this.currentDate)
          .subtract(1, "days")
          .format("YYYY-MM-DD");
      } else {
        this.currentDate = this.$moment(this.currentDate)
          .add(1, "days")
          .format("YYYY-MM-DD");
      }
      this.readimelistFn();
    },
    // 下拉选择日期
    async confirmFn(e) {
      //确认日期选项
      console.log(e);
      const dateStr = this.$moment(e).format("YYYY-MM-DD");
      console.log("时间格式转换", dateStr);
      this.isShowBirth = false;
      this.currentDate = dateStr;
      this.readimelistFn();
    },

    gotocalendarFn() {
      //跳转日历
      this.$router.push({
        name: "Calendar",
        query: {},
      });
    },

    onSetTimerChange() {
      Dialog.confirm({
        title: "提示",
        message: "确定保存营业时间",
      })
        .then(() => {
          let dates;
          if (this.selectDate && this.selectDate.length > 0) {
            dates = this.selectDate;
          } else {
            dates = this.selectDate.concat(this.currentDate);
          }
          console.log('营业开始时间',this.tactics.startOpen)
          this.$api
            .Business({
              deviceId: "1353880641422229504",
              dates,
              startOpen: this.tactics.startOpen,
              endOpen: this.tactics.endOpen,
              isAllDay: this.isAllDay,
            })
            .then((res) => {
              console.log(res);
              if (res.data.code == "200") {
                this.$toast("保存成功");
              } else {
                this.$toast(res.data.message);
              }
            })
            .catch(() => {
              this.$toast("保存失败");
            });
        })
        .catch(() => {});
    },

    onStartChange(startV) {
      //A区数量
      this.bakeTime.forEach((element, item) => {
        if (item == startV.target.name) {
          element.aNum = startV.target.value;
        }
      });
      this.bindSaveFn(startV.target.name);
    },
    onEndChange(endV) {
      //B区数量
      this.bakeTime.forEach((element, item) => {
        if (item == endV.target.name) {
          element.bNum = endV.target.value;
        }
      });
      this.bindSaveFn(endV.target.name);
    },

    bindSaveFn(index) {
      //判断A+B数量<18
      console.log("当前下标", index);
      this.bakeTime.forEach((element, item) => {
        if (index == item) {
          console.log("当前", element);
          if (
            Number(element.aNum) > 18 ||
            Number(element.bNum) > 18 ||
            Number(element.aNum) + Number(element.bNum) > 18
          ) {
            this.$toast(
              `${0 + Number(index)}时-${
                1 + Number(index)
              }时设置总数超出烤盘范围`
            );
            return;
          } else {
          }
        }
      });
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // this.pointname = this.$route.query.pointname;
    // this.deviceno = this.$route.query.deviceno;
    // this.factoryno = this.$route.query.factoryno;
    this.readimelistFn(this.$route.query.factoryno);
    // this.readOvenwareFn(this.$route.query.factoryno);
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.$route.params.selectDate) {
      this.selectDate = this.$route.params.selectDate;
      console.log("多选后", this.selectDate);
    }
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
  activated() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#setPrebake {
  font-size: 14px;
  color: #333;
  margin: 45px auto 0;
}

.preheat {
  width: 100%;
  margin-top: 6px;
}

.facility {
  background-color: #f1f1f1;
  margin-bottom: 10px;
  box-sizing: border-box;
  padding: 10px;
}

.facility div:last-child {
  margin-top: 10px;
}

.operation {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: #f1f1f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.operationTime {
  width: 60%;
}

.setTimerWrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.setTimer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.onSetTimer {
  width: 100px;
  height: 30px;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 0 5px;
  font-size: 14px;
}

.onSetTimer:nth-child(2) {
  margin: 0 8px;
}

.operationBtn {
  width: 70px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #ff9900;
  color: #fff;
  border-radius: 10px;
  border: none;
  font-size: 14px;
}

table {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
}

tr {
  height: 40px;
}

th,
td {
  text-align: center;
  border-bottom: 1px solid #ddd;
  background-color: #f1f1f1;
}

/* th,
  td:first-child {
    width: 100px;
  } */

th,
td:last-child {
  width: 60px;
}

.btn {
  width: 46px;
  height: 26px;
  border: none;
  border-radius: 6px;
  background: #ff9900;
  color: #fff;
  font-size: 10px;
}

/**新修改页面 */
.gridItem {
  height: 104px;
  background: #ccc;
}
.timerWrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #d5d5d5;
  font-size: 12px;
}
.timer {
  width: 100%;
  height: 20px;
  text-align: center;
  line-height: 20px;
  background: #ff9900;
}
.timerInp {
  width: 100%;
  height: 39.5%;
  background: #d5d5d5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding-left: 10px;
}

.van-cell,
.van-field {
  width: 25px;
  padding: 0;
  height: 25px;
  line-height: 25px;
  text-align: center;
  background: #d5d5d5;
  margin-left: 2px;
}
.saveWrap {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 10px 0 30px;
}
.save {
  width: 120px;
  height: 35px;
  text-align: center;
  line-height: 35px;
  background: #ff9900;
  color: #fff;
  border: none;
  border-radius: 4px;
}

// 日期选择
.calendarWrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 10px;
}
.calendarSelsct {
  display: flex;
  align-items: center;
  justify-content: center;
}
.calendar {
  width: 100px;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  padding-left: 12px;
  background: #fff;
}
.timerBtn {
  width: 24px;
  height: 24px;
  background: #ff9900;
  color: #fff;
  text-align: center;
  line-height: 24px;
  border-radius: 4px;
  padding-top: 2px;
}
.gotocalendar {
  width: 60px;
  border: none;
  position: absolute;
  right: 10px;
  top: 50%;
  margin-top: -12px;
  font-size: 12px;
}
.today {
  left: 10px;
  background: #f15a24;
}
/* 烤盘信息 */
.van-grid {
  border-left: 1px solid #aaa;
  border-bottom: 1px solid #aaa;
  margin-top: 10px;
}

.van-grid-item {
  border-right: 1px solid #aaa;
  border-top: 1px solid #aaa;
}

.ovenware-content {
  width: 100%;
  height: 90px;
  /* padding: 16px 0; */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ovenware-content div {
  padding: 2px 0;
}

.bgc {
  background: #ff9900;
  color: #fff;
}

.roastStatus {
  color: blueviolet;
}
.van-grids {
  flex-direction: row;
}
</style>
<style lang="less">
.van-stepper__input {
  background-color: #fff;
  border-radius: 4px;
}

.van-grid {
  flex-direction: row-reverse;
}

.van-grid-item__content {
  padding: 0;
}

.van-sticky--fixed {
  position: fixed;
  top: 0;
  right: 0 !important;
  left: 0 !important;
}
</style>