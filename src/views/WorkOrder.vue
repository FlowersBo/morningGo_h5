<template>
  <div class="home">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <van-tabs v-model="active" type="card" sticky offset-top="44" title-active-color="#fff" @click="onClickNav">
      <van-tab v-for="item in navTab" :key="item.index" :title="item.nav" style="background: #fff;">
        <van-pull-refresh class="alarmWrap" v-model="refreshing" @refresh="onRefresh">
          <van-list v-model="loading" :error.sync="error" error-text="请求失败，点击重新加载" :finished="finished"
            finished-text="没有更多了" :immediate-check="false" @load="onLoad">
            <van-cell v-for="item in orderList" :key="item.alarmId" @click="gotoDetail(item.id)">
              <div class="alarm">
                <div class="alarm-title">
                  <div class="title-left">
                    <div class="title-state" style="display: flex; align-items: center">
                      <van-icon class="iconfont icon" color="#555" class-prefix="icon" name="gongdanguanli" />
                      单号：{{ item.orderNo }}
                    </div>
                  </div>
                  <div class="title-right">
                    {{ item.statusStr }}
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
                  <div v-if="item.status == 3" class="content-item">
                    <div class="itemKey">处理人：</div>
                    <div class="itemValue">{{ item.workerName }}</div>
                  </div>
                  <div class="content-item">
                    <div class="itemKey">时间：</div>
                    <div class="itemValue">{{ item.createTime }}</div>
                  </div>
                </div>
                <div class="btnWrap">
                  <div v-if="item.status == 2" @click.stop="changeOrder(item.id)">接单</div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <Footer :active="footerActive" :badgeNumber="badgeNumber" />
  </div>
</template>

<script>
  import HeaderTitle from "@/components/HeaderTitle.vue";
  import { Dialog } from "vant";
  import Footer from "@/components/footer.vue";
  export default {
    data () {
      return {
        pageindex: 1,
        pagesize: 30,
        searchType: 2,
        imgUrl: "",
        titleDec: "工单池",
        textDec: "",
        footerActive: 0,
        badgeNumber: null,
        active: 0,
        total: 0,
        navTab: [
          {
            nav: "待接单",
          },
          {
            nav: "已接单",
          }
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
      Footer
    },
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      orderListFn () {
        let data = {
          status: this.searchType,
          pageNum: this.pageindex,
          pageSize: this.pagesize
        };
        this.$api.PoolList(data)
          .then((res) => {
            console.log("返回", res);
            this.isShow = false;
            this.finished = false;
            if (this.refreshing) {
              this.refreshing = false; //刷新成功
            }
            // 加载状态结束
            this.loading = false;
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
      changeOrder (orderId) {
        Dialog.confirm({
          title: "提示",
          message: "确认接单吗？",
        })
          .then(() => {
            this.$api.Ensure({ orderId })
              .then(res => {
                console.log('接单', res)
                this.pageindex = 1;
                this.orderList = [];
                this.isShow = true;
                this.orderListFn();
              })
          })

      },
      onLoad () {
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

      onRefresh () {
        // 清空列表数据
        this.finished = false;
        this.pageindex = 1;
        this.orderList = [];
        this.refreshing = true;
        this.orderListFn();
      },

      onClickNav () {
        //切换nav
        console.log("当前选中标签", this.active);
        if (this.active == 0) {
          this.searchType = 2;
        } else {
          this.searchType = 3;
        }
        this.finished = false;
        this.pageindex = 1;
        this.orderList = [];
        this.isShow = true;
        this.orderListFn();
      },

      gotoVideo (orderId) {
        //跳转视频
        this.$router.push({
          path: "/Player",
          query: {
            orderId,
            url: "GetOrderVideo",
          },
        });
      },

      gotoDetail (orderId) {
        if (this.searchType == 2) return;
        this.$router.push({
          path: "/WorkOrderDetail",
          query: {
            orderId
          },
        })
      },

      refreshToken () {
        this.$api
          .RefreshToken({})
          .then((res) => {
            console.log("token是否过期", res);
            if (res.data.code == 200) {
              this.orderListFn();
            }
          })
          .catch((err) => { });
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created () {
      this.refreshToken();
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
      // console.log(this.$route.params.phoneNumber);//获取上一页路由传参
    },
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
    width: 360px;
    margin: 45px auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #333;
    font-size: 14px;
  }

  .van-tabs {
    width: 360px;
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
    width: 360px;
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
</style>