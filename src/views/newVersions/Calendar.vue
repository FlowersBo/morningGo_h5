<template>
  <div class="Calendat">
    <HeaderTitle
      :imgSrc="imgUrl"
      :title="titleDec"
      :text="textDec"
    ></HeaderTitle>
    <div class="facility">
      <div>设备编号：{{ factoryNo }}</div>
      <div>点位名称：{{ pointName }}</div>
      <!-- <div>{{ fullNameSub }}</div>
      <button @click="onClick">点击</button> -->
    </div>
    <!-- 日历 -->
    <div class="selectMonth">
      <div class="timerBtn" @click="cutTimeFn(0)">
        <van-icon name="arrow-left" />
      </div>
      <div>{{ currentMonth }}</div>
      <div class="timerBtn" @click="cutTimeFn(1)">
        <van-icon name="arrow" />
      </div>
    </div>
    <van-calendar
      class="vanCalendar"
      title="日历"
      :show-subtitle="false"
      :poppable="false"
      :show-confirm="false"
      :show-title="false"
      :style="{ height: '450px' }"
      type="multiple"
      :default-date="defaultDate"
      :formatter="formatter"
      color="#FFBF00"
      :min-date="minDate"
      :max-date="maxDate"
      @select="onselectDate"
      @unselect="onunselectDate"
    />

    <div class="btnWrap">
      <button @click="gotoSetPrebake">设置策略</button>
      <button @click="gotoCopyEquipment">复制到其它设备</button>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "../../components/HeaderTitle.vue";
import { Dialog } from "vant";
export default {
  components: { HeaderTitle },
  props: {},
  data() {
    //这里存放数据
    return {
      imgUrl: require("@/img/back.png"),
      titleDec: "日历",
      textDec: "",
      factoryNo: "",
      pointName: "",
      defaultDate: [],
      selectDate: [],
      firstName: "张",
      lastName: "无忌",
      minDate: new Date("2022-08-01".replace(/\-/g, "/")),
      maxDate: new Date("2022-08-31".replace(/\-/g, "/")),
      currentMonth: this.$moment(new Date()).format("YYYY-MM"),
      formatter: function (day) {
        return day;
      },
    };
  },
  //计算属性 类似于data概念
  computed: {
    // formatter: {
    //   get: function () {
    //     return (day) => {
    //       return day;
    //     };
    //   },
    //   set: function (newValue) {
    //     console.log(newValue);
    //   },
    // },
  },
  //监控data中数据变化
  watch: {},
  //方法集合
  methods: {
    // 月份选择
    cutTimeFn(id) {
      if (id === 0) {
        this.currentMonth = this.$moment(this.currentMonth)
          .subtract(1, "month")
          .format("YYYY-MM");
      } else {
        this.currentMonth = this.$moment(this.currentMonth)
          .add(1, "month")
          .format("YYYY-MM");
      }
      this.minDate = new Date(
        this.$moment(this.currentMonth)
          .startOf("month")
          .format("YYYY-MM-DD")
          .replace(/\-/g, "/")
      );
      this.maxDate = new Date(
        this.$moment(this.currentMonth)
          .endOf("month")
          .format("YYYY-MM-DD")
          .replace(/\-/g, "/")
      );
      this.getCalander(this.currentMonth);
    },

    getCalander(currentMonth) {
      this.$api
        .GetCalander({
          deviceId: this.deviceId,
          searchMonth: currentMonth,
        })
        .then((res) => {
          console.log("返回", res);
          this.factoryNo = res.data.data.factoryNo;
          this.pointName = res.data.data.pointName;
          let tactics = res.data.data.tactics;
          this.tactics = tactics;
          this.formatter = function (day) {
            tactics.forEach((element) => {
              if (this.$moment(day.date).format("YYYY-MM-DD") === element.dat) {
                if (element.isAllDay === "0") {
                  day.bottomInfo = `${
                    element.startOpen ? element.startOpen + "-" : ""
                  }${element.endOpen ? element.endOpen : ""}`;
                } else {
                  day.bottomInfo = "24小时";
                }

                // day.className="selectDay";
                // day.type="selected"
              }
            });
            return day;
          };

          // tactics.forEach((element) => {
          //   if (element.startOpen) {
          //     this.selectDate.push(element.dat);
          //     this.defaultDate.push(new Date(element.dat.replace(/\-/g, "/")));
          //   }
          // });
        })
        .catch((err) => {});
    },

    onselectDate(value) {
      this.selectDate = JSON.parse(JSON.stringify(this.dateFn(value)));
      console.log(this.selectDate);
    },
    onunselectDate(value) {
      this.selectDate.forEach((element, key) => {
        if (this.$moment(value).format("YYYY-MM-DD") === element) {
          this.selectDate.splice(key, 1);
        }
      });
      console.log(this.selectDate);
    },

    dateFn(value) {
      let selectDateArr = [];
      value.map((item) => {
        selectDateArr.push(this.$moment(item).format("YYYY-MM-DD"));
      });
      return selectDateArr;
    },

    // 跳转烤制策略
    gotoSetPrebake() {
      if (this.selectDate.length <= 0) {
        this.$toast("请先选择日期");
        return;
      }
      this.$router.replace({
        name: "SetPrebake",
        params: {
          selectDate: this.selectDate,
          deviceId: this.deviceId,
          factoryno: this.factoryNo,
        },
      });
    },
    gotoCopyEquipment() {
      if (this.selectDate.length <= 0) {
        this.$toast("请先选择日期");
        return;
      }
      this.$router.push({
        name: "Replica",
        query: {
          selectDate: this.selectDate,
          factoryNo: this.factoryNo,
          pointName: this.pointName,
          deviceId: this.deviceId,
        },
      });
    },
    onClick(e) {
      this.fullNameSub = "ds";
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.deviceId = this.$route.query.deviceId;
    this.getCalander(this.currentMonth);
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
/* @import url(); 引入css类 */
.facility {
  background-color: #f1f1f1;
  box-sizing: border-box;
  padding: 10px;
}

.facility div:last-child {
  margin-top: 10px;
}
.vanCalendar {
  border-bottom: 1px solid #f1f1f1;
  box-shadow: #ddd 10px 2px 10px;
}
.btnWrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 20px;
  margin: 20px 0;
}
.btnWrap button {
  width: 130px;
  height: 38px;
  border-radius: 6px;
  border: none;
  text-align: center;
  line-height: 38px;
  background: #ffbf00;
  color: #fff;
}
.btnWrap button:first-child {
  background: #f15a24;
}

/* 月份选择 */
.selectMonth {
  width: 100%;
  height: 40px;
  /* line-height: 40px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.timerBtn {
  width: 28px;
  height: 28px;
  background: #ff9900;
  color: #fff;
  text-align: center;
  line-height: 28px;
  border-radius: 4px;
  padding-top: 2px;
  margin: 0 14px;
}
</style>
<style>
/* 日历 */
.van-calendar__day,
.van-calendar__selected-day {
  -webkit-align-items: stretch !important;
  align-items: stretch !important;
  box-sizing: border-box;
  padding-top: 10px;
}
.selectDay {
  background: #ffbf00;
  color: #fff;
}
</style>