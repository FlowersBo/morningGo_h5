<template>
  <div class="home">
    <HeaderTitle
      :imgSrc="imgUrl"
      :title="titleDec"
      :text="textDec"
    ></HeaderTitle>
    <!-- 搜索 -->
    <van-search v-model="value" placeholder="点位查询" @search="onSearch" />
    <van-tabs
      v-model="active"
      type="card"
      sticky
      offset-top="45"
      title-active-color="#fff"
      @click="onClickNav"
    >
      <van-tab
        title-style="padding-top:8px;box-sizing: border-box;"
        v-for="item in navTab"
        :key="item.index"
        :title="item.nav"
        :badge="item.totalCount"
      >
        <van-pull-refresh
          class="alarmWrap"
          v-model="refreshing"
          @refresh="onRefresh"
        >
          <van-list
            v-model="loading"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            :finished="finished"
            finished-text="没有更多了"
            :immediate-check="false"
            @load="onLoad"
          >
            <van-cell v-for="item in orderList" :key="item.alarmId">
              <div class="alarm">
                <div class="alarm-title">
                  <div class="title-left">
                    <div
                      class="title-state"
                      style="display: flex; align-items: center"
                    >
                      <van-icon
                        class="iconfont icon"
                        color="#555"
                        class-prefix="icon"
                        name="gongdanguanli"
                      />
                      单号：{{ item.orderNo }}
                    </div>
                  </div>
                  <div class="title-right">
                    {{ item.statusStr }}
                    <!-- <van-icon
                      class="iconfont icon"
                      color="#C4D0FF"
                      class-prefix="icon"
                      name="gaoqingshexiang"
                      @click="gotoVideo(item.id)"
                    /> -->
                  </div>
                </div>
                <div class="alarm-content">
                  <div class="content-item">
                    <div class="itemKey">点位：{{ item.pointName }}</div>
                    <div v-if="item.status == 1">
                      剩余：{{ item.differenceTime }}
                    </div>
                  </div>
                  <div class="content-item">
                    <div class="itemKey">报警内容：</div>
                    <div class="itemValue">{{ item.alarmDetail }}</div>
                  </div>
                  <div class="content-item">
                    <div class="itemKey">时间：</div>
                    <div class="itemValue">{{ item.createTime }}</div>
                  </div>
                  <div v-if="item.status == 4">
                    <div class="content-item">
                      <div class="itemKey">处理结果：</div>
                      <div class="itemValue">{{ item.solvePlan }}</div>
                    </div>
                    <div class="content-item">
                      <div class="itemKey">完结时间：</div>
                      <div class="itemValue">{{ item.finishTime }}</div>
                    </div>
                  </div>
                </div>
                <div class="btnWrap">
                  <template v-if="item.status == 4">
                    <div @click="changeOrder((isMsk = true))">重新指派</div>
                    <div @click="changeOrder((isMsk = true))">挂起</div>
                  </template>
                  <div
                    v-if="item.status == 1 || item.status == 4"
                    @click="changeOrder((isMsk = true))"
                  >
                    完结
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <van-popup v-model="isMsk">
      <div class="maskWrap">
        <div class="title">完结</div>
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="resultValue"
              is-link
              readonly
              name="picker"
              label="协作人"
              placeholder="无"
              @click="showPicker = true"
            />

            <van-field
              name="inputbox"
              v-model="inputbox"
              rows="2"
              autosize
              type="textarea"
              maxlength="50"
              placeholder="请输入内容"
              show-word-limit
            />
          </van-cell-group>

          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
              提交
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import HeaderTitle from "@/components/HeaderTitle.vue";
import { Dialog } from "vant";
export default {
  data() {
    return {
      value: "",
      isMsk: true,
      inputbox: "",
      columns: ["杭州", "宁波", "温州", "嘉兴", "湖州"],
      showPicker: false,
      resultValue: "",
      pageindex: 1,
      pagesize: 30,
      searchType: "",
      imgUrl: require("@/img/back.png"),
      titleDec: "我的工单",
      textDec: "",
      active: 0,
      total: 0,
      navTab: [
        {
          nav: "全部",
        },
        {
          nav: "处理中",
          totalCount: 0,
        },
        {
          nav: "已完结",
        },
        {
          nav: "挂起",
          totalCount: 0,
        },
      ],
      orderList: [],
      // 刷新加载
      loading: false,
      finished: false, //是否已加载完成，加载完成后不再触发load事件
      refreshing: false, //刷新成功为false
      error: false, //是否加载失败，加载失败后点击错误提示可以重新触发load事件
      isShow: false,
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
    orderListFn() {
      let data = {
        status: this.searchType,
        pageNum: this.pageindex,
        pageSize: this.pagesize,
        deviceId: this.deviceId,
        pointName: this.value,
      };
      this.$api
        .WorkOrderList(data)
        .then((res) => {
          console.log("返回", res);
          this.isShow = false;
          this.finished = false;
          if (this.refreshing) {
            this.refreshing = false; //刷新成功
          }
          // 加载状态结束
          this.loading = false;
          this.$api.Init(data).then((res) => {
            console.log("初始化角标", res);
            this.navTab[1].totalCount = res.data.data.handle;
            this.navTab[3].totalCount = res.data.data.suspend;
            // this.navTab = this.navTab.map((item, index) => {
            //   return {
            //     ...item,
            //     ...totalList[index],
            //   };
            // });
          });
          let list = res.data.data.list;
          list.map((item) => {
            if (item.status == 1) {
              let day = this.$moment(item.expireTime).diff(
                this.$moment(item.createTime),
                "days"
              );
              let date = this.$moment(item.expireTime).diff(
                this.$moment(item.createTime),
                "minutes"
              );
              let h = Math.floor(date / 60);
              let d = h % 24;
              item.differenceTime = day + "天" + d.toFixed(0) + "小时";
            }
          });
          this.orderList.push(...list);
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    onLoad() {
      // 数据全部加载完成
      if (this.isShow || this.orderList.length >= this.total) {
        console.log("加载完成");
        this.finished = true;
        return true;
      }
      console.log("加载未完成");
      this.pageindex++;
      this.orderListFn();
    },

    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.pageindex = 1;
      this.orderList = [];
      this.refreshing = true;
      this.orderListFn();
    },

    onClickNav() {
      //切换nav
      console.log("当前选中标签", this.active);
      if (this.active == 0) {
        this.searchType = "";
      } else if (this.active == 1) {
        this.searchType = 3;
      } else if (this.active == 2) {
        this.searchType = 4;
      } else if (this.active == 3) {
        this.searchType = 1;
      }
      this.finished = false;
      this.pageindex = 1;
      this.orderList = [];
      this.isShow = true;
      this.orderListFn();
    },

    gotoVideo(orderId) {
      //跳转视频
      this.$router.push({
        path: "/Player",
        query: {
          orderId,
          url: "GetOrderVideo",
        },
      });
    },
    onSearch(ev) {
      console.log("搜索传参", ev);
      this.finished = false;
      this.pageindex = 1;
      this.orderList = [];
      this.refreshing = true;
      this.orderListFn();
    },
    onConfirm: (value) => {
      this.resultValue = value;
      this.showPicker = false;
    },
    onSubmit(event) {
      console.log("提交", event);
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    localStorage.setItem(
      "token",
      JSON.stringify(
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2Njk4NjM2MDAyNjgsInBheWxvYWQiOiJ7XCJ3b3Jrcm9sZVwiOlwiMVwiLFwib3BlbmlkXCI6XCJvWjROUDZjYk1ud1QwdlJUR2hDbV9xRUpqT2VBXCIsXCJuYW1lXCI6XCLniZvpob9cIixcImlkXCI6NDQsXCJncm91cG5hbWVcIjpcIua4qeamhuays-eDpOiCoOi_kOe7tCzmmIbms7Doh6rokKXov5Dnu7Qs5rmW5YyX5aSq5a2Q5bGx6aOO5pmv5Yy6XCIsXCJ1c2VybmFtZVwiOlwiMTUwMDEwODE3MTdcIn0ifQ._ErZ1Ku5pvp20AVrz3zy0-uYk51ublCK2mxOMwSGGOc"
      )
    );
    this.orderListFn();
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
  activated() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.home {
  width: 350px;
  margin: 45px auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333;
  font-size: 14px;
}

.van-tabs {
  width: 350px;
  margin-top: 6px;
}
.alarm {
  width: 100%;
  background-color: #eee;
  margin-top: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0 10px;
}

/* .alarm:last-child{
    margin-bottom: 20px;
  } */

.alarm-title {
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

.icon {
  margin-right: 5px;
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

.alarm-content {
  width: 100%;
  border-bottom: 1px solid #fff;
}

.content-item {
  width: 100%;
  display: flex;
  margin: 10px 0;
}
.alarm-content .content-item:first-child {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.alarm-content .content-item:last-child {
  color: #ff9a03;
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
.van-popup{
  background: none;
}
.maskWrap{
  width: 350px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 20px;
  background: #fff;
  border-radius: 20px;
}
.title{
  font-size: 16px;
  border-bottom: 1px solid #999;
  padding-bottom: 10px;
}
</style>
<style lang="less">
.van-sticky--fixed {
  position: fixed;
  top: 0;
  right: 12px;
  left: 12px;
  z-index: 99;
}
.van-cell {
  width: 350px;
  padding: 0;
}
.van-tabs__nav,
.van-tabs__nav--card {
  margin: 0;
  border-radius: 14px;
}
.van-tab:first-child {
  border-radius: 14px 0 0 14px;
}
.van-tab:last-child {
  border-radius: 0 14px 14px 0;
}
.van-info {
  background: #fff;
  border: 1px solid #f15a24;
  color: #f15a24;
  z-index: 999;
}
</style>