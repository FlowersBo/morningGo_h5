<template>
  <div class="home">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <van-tabs v-model="active" sticky offset-top="45" title-active-color="#F15A24" @click="onClickNav">
      <van-tab v-for="index in navTab" :key="index.index" :title="index.nav">
        <van-pull-refresh class="alarmWrap" v-model="refreshing" @refresh="onRefresh">
          <van-list v-model="loading" :error.sync="error" error-text="请求失败，点击重新加载" :finished="finished"
            finished-text="没有更多了" :immediate-check="false" @load="onLoad">
            <van-cell v-for="item in orderList" :key="item.alarmId">
              <div class="alarm">
                <div class="alarm-title">
                  <div class="title-left">
                    <div class="title-state">{{item.orderDate}}</div>
                  </div>
                  <div class="title-right">
                    <van-icon class="iconfont icon" color="#C4D0FF" class-prefix='icon' name='gaoqingshexiang'
                      @click="gotoVideo(item.id)" />
                  </div>
                </div>
                <div class="alarm-content">
                  <div class="content-item">
                    <div class="itemKey">点位名称：</div>
                    <div class="itemValue">{{item.pointName}}</div>
                  </div>
                  <div class="content-item" v-for="itemChild in item.detailList">
                    <div class="itemKey">{{itemChild.productName}}：</div>
                    <div class="itemValue">{{itemChild.shipStatus==1?'已出货':'未出货'}}</div>
                  </div>
                  <div class="content-item">
                    <div class="itemKey">订单金额：</div>
                    <div class="itemValue">￥{{item.orderPrice}}</div>
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import HeaderTitle from '@/components/HeaderTitle.vue';
  import {
    Dialog
  } from 'vant';
  export default {
    data() {
      return {
        pageindex: 1,
        pagesize: 30,
        searchType: '',
        imgUrl: require('@/img/back.png'),
        titleDec: "订单",
        textDec: "",
        active: 0,
        total: 0,
        navTab: [{
          nav: '全部'
        }, {
          nav: '已出货'
        }, {
          nav: '未出货'
        }],
        orderList: [],
        // 刷新加载
        loading: false,
        finished: false, //是否已加载完成，加载完成后不再触发load事件
        refreshing: false, //刷新成功为false
        error: false, //是否加载失败，加载失败后点击错误提示可以重新触发load事件
        isShow: false
      }
    },
    components: {
      HeaderTitle
    },
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      orderListFn() {
        let data = {
          searchType: this.searchType,
          pageNum: this.pageindex,
          pageSize: this.pagesize
        }
        this.$api.OrderList(data).then(res => {
          console.log('返回', res);
          this.isShow = false;
          this.finished = false;
          if (this.refreshing) {
            this.refreshing = false; //刷新成功
          }
          // 加载状态结束
          this.loading = false;
          this.total = res.data.data.total;
          // if (this.active === 0) {
          //   this.total = res.data.data.total;
          // } else if (this.active === 1) {
          //   this.total = res.data.data.total;
          // } else {
          //   this.total = res.data.data.total;
          // }
          // let totalList = [{
          //   totalCount: res.data.data.allCount
          // }, {
          //   totalCount: res.data.data.oneCount
          // }, {
          //   totalCount: res.data.data.twoCount
          // }];
          // this.navTab = this.navTab.map((item, index) => {
          //   return {
          //     ...item,
          //     ...totalList[index]
          //   };
          // });
          this.orderList.push(...res.data.data.list);
        }).catch((err) => {
          console.log(err)
        })
      },

      onLoad() {
        // 数据全部加载完成
        if (this.isShow || this.orderList.length >= this.total) {
          console.log('加载完成')
          this.finished = true;
          return true;
        }
        console.log('加载未完成')
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

      onClickNav() { //切换nav
        console.log('当前选中标签', this.active);
        if (this.active == 0) {
          this.searchType = '';
        } else {
          this.searchType = this.active
        }
        this.finished = false;
        this.pageindex = 1;
        this.orderList = [];
        this.isShow = true;
        this.orderListFn();
      },

      gotoVideo(orderId) { //跳转视频
        this.$router.push({
          path: '/Player',
          query: {
            orderId,
            url: 'GetOrderVideo'
          }
        })
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
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
    activated() {}
  }
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
  }

  .van-cell {
    width: 350px;
    padding: 0;
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
    background-color: #F15A24;
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

  .alarm-content .content-item:last-child {
    color: #FF9A03;
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
</style>