<template>
  <div class="home">
    <!-- <Login msg="报表" /> -->
    <!-- <router-link to="/Mine">Mine</router-link> -->
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <van-tabs v-model="active" sticky offset-top="45" title-active-color="#F15A24" @click="onClickNav">
      <van-tab v-for="index in navTab" :key="index.index" :title="index.nav" :badge="index.totalCount">
        <van-pull-refresh class="alarmWrap" v-model="refreshing" @refresh="onRefresh">
          <van-list v-model="loading" :error.sync="error" error-text="请求失败，点击重新加载" :finished="finished"
            finished-text="没有更多了" :immediate-check="false" @load="onLoad">
            <van-cell v-for="item in deviceList" :key="item.alarmId">
              <div class="alarm">
                <div class="alarm-title">
                  <div class="title-left">
                    <div class="title-state">{{item.alarmconent}}</div>
                    <van-icon class="iconfont icon" color="#F15A24" class-prefix='icon' name='weixiu' />
                    <!-- <van-icon v-else class="iconfont icon" color="#F15A24" class-prefix='icon' name='gouwuchetianjia' /> -->
                  </div>
                  <div class="title-right">
                    <van-icon class="iconfont icon" color="#C4D0FF" class-prefix='icon' name='gaoqingshexiang'
                      @click="gotoVideo(item.alarmId,item.factoryno)" />
                    <div class="titleBtn" @click="clickCancelFn(item.alarmId)">消除</div>
                  </div>
                </div>
                <div class="alarm-content">
                  <div class="content-item">
                    <div class="itemKey">告警时间：</div>
                    <div class="itemValue">{{item.alarmtime}}</div>
                  </div>
                  <div class="content-item">
                    <div class="itemKey">告警级别：</div>
                    <div class="itemValue">{{item.alarmlevel}}</div>
                  </div>
                  <div class="content-item">
                    <div class="itemKey">点位名称：</div>
                    <div class="itemValue">{{item.pointname}}</div>
                  </div>
                </div>
                <div class="alarm-detail" @click="gotoAlarmFn(item.alarmcode)">
                  <div class="detailText">
                    <div class="itemKey">告警内容：</div>
                    <div>{{item.codeDetail}}</div>
                  </div>
                  <img class="detailImg" src="../img/right-arrows.png" alt="">
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
  import HeaderTitle from '../components/HeaderTitle.vue';
  import Footer from '@/components/footer.vue';
  import {
    Dialog
  } from 'vant';
  // 引入封装好的接口
  import {
    getRequest
  } from "@/api/http.js";
  import {
    Login
  } from "@/api/api.js";
  import preventBack from 'vue-prevent-browser-back'
  export default {
    mixins: [preventBack], //禁止返回
    data() {
      return {
        pageindex: 1,
        pagesize: 30,
        searchType: '',
        imgUrl: '',
        titleDec: "告警",
        textDec: "",
        footerActive: 0,
        badgeNumber: null,
        active: 0,
        total: 0,
        navTab: [{
          nav: '全部'
        }, {
          nav: '一级告警'
        }, {
          nav: '二级告警'
        }],
        deviceList: [],
        // 刷新加载
        loading: false,
        finished: true, //是否已加载完成，加载完成后不再触发load事件
        refreshing: false, //刷新成功为false
        error: false, //是否加载失败，加载失败后点击错误提示可以重新触发load事件
        isShow: true
      }
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
      DevicelistFn() {
        let data = {
          searchType: this.searchType,
          pageindex: this.pageindex,
          pagesize: this.pagesize
        }
        this.$api.Alarmlist(data)
          .then(res => {
            console.log('告警列表返回', res);
            this.isShow = false;
            this.finished = false;
            console.log('加载重置',this.isShow);
            if (this.refreshing) {
              this.refreshing = false; //刷新成功
            }
            // 加载状态结束
            this.loading = false;
            if (this.active === 0) {
              this.total = res.data.data.allCount;
            } else if (this.active === 1) {
              this.total = res.data.data.oneCount;
            } else {
              this.total = res.data.data.twoCount;
            }
            let totalList = [{
              totalCount: res.data.data.allCount
            }, {
              totalCount: res.data.data.oneCount
            }, {
              totalCount: res.data.data.twoCount
            }];
            this.badgeNumber = res.data.data.allCount;
            sessionStorage.setItem('badgeNumber', JSON.stringify(res.data.data.allCount));
            this.navTab = this.navTab.map((item, index) => {
              return {
                ...item,
                ...totalList[index]
              };
            });
            this.deviceList.push(...res.data.data.alarmlist);
          }).catch((err) => {
            console.log(err)
          })
      },

      onLoad() {
        // 数据全部加载完成
        if (this.isShow || this.deviceList.length >= this.total) {
          console.log('加载完成')
          this.finished = true;
          return true;
        }
        console.log('加载未完成')
        this.pageindex++;
        this.DevicelistFn();
      },

      onRefresh() {
        // 清空列表数据
        this.finished = false;
        this.pageindex = 1;
        this.deviceList = [];
        this.refreshing = true;
        this.DevicelistFn();
      },

      clickCancelFn(alarmId) { //清除报警
        Dialog.confirm({
            title: '提示',
            message: '确认要消除此告警',
          })
          .then(() => {
            let data = {
              alarmId
            }
            this.$api.CancelAlarm(data).then(res => {
                this.$toast('清除告警成功');
                this.finished = false;
                this.pageindex = 1;
                this.deviceList = [];
                this.DevicelistFn();
              })
              .catch(err => {
                console.log(err)
                this.$toast('清除告警失败');
              })
          })
          .catch(() => {

          });
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
        this.deviceList = [];
        this.isShow = true;
        this.DevicelistFn();
      },

      gotoVideo(alarmId, factoryno) { //跳转视频
        this.$router.push({
          path: '/Player',
          query: {
            alarmId,
            factoryno,
            url: 'Getvideo'
          }
        })
      },

      gotoAlarmFn(alarmcode) { //跳转富文本
        this.$router.push({
          path: '/Alarm',
          query: {
            alarmcode
          }
        })
      },
      refreshToken() {
        this.$api.RefreshToken({}).then(res => {
          console.log('token是否过期', res)
          if (res.data.code == 200) {
            this.DevicelistFn();
          }
        }).catch(err => {

        })
      }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.refreshToken();
      console.log(location.href.split("#")[0])
      // parent.location.href = location.href+'Login'
      // 下边禁止返回
      // history.pushState(null, null, document.URL);
      // window.addEventListener("popstate", function () {
      //   history.pushState(null, null, document.URL);
      // });
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
      localStorage.removeItem('assessToken');
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

  .itemKey{
    min-width: 75px;
  }

  .alarm-detail {
    /* height: 30px; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #FF9A03;
    padding: 5px 0;
  }

  .detailText {
    display: flex;
  }

  .detailImg {
    width: 16px;
    height: 16px;
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
</style>