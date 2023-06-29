<template>
  <div class="home">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <div class="inputWrap">
      <van-field placeholder="请输入点位名称" style="width: 100%;height: 40px;background: #f5f5f5;border-radius: 20px;box-sizing: border-box;padding: 0 20px;line-height: 40px;" v-model="factoryNo" />
      <div class="inpSearch" @click="bindSearch">搜索</div>
    </div>
    <van-tabs v-model="active" sticky offset-top="45" title-active-color="#F15A24" @click="onClickNav">
      <van-tab v-for="index in navTab" :key="index.index" :title="index.nav" :badge="index.totalCount">
        <van-pull-refresh class="alarmWrap" v-model="refreshing" @refresh="onRefresh">
          <van-list v-model="loading" :error.sync="error" error-text="请求失败，点击重新加载" :finished="finished"
            finished-text="没有更多了" :immediate-check="false" @load="onLoad">
            <van-cell v-for="item in deviceList" :key="item.alarmId">
              <div class="alarm" @click="gotoEquipmentDetail(item)">
                <div class="alarm-left">
                  <div class="content-item">
                    <div class="itemKey">设备编号：</div>
                    <div class="itemValue">{{item.factoryno}}</div>
                  </div>
                  <div class="content-item">
                    <div class="itemKey">点位名称：</div>
                    <div class="itemValue">{{item.pointname}}</div>
                  </div>
                </div>
                <div class="alarm-right">
                  <van-icon class="iconfont icon" v-if="item.isonline==1" color="#00CC00" class-prefix='icon'
                    name='xinhao' />
                  <van-icon class="iconfont icon" v-if="item.isonline!=1" color="#FF0000" class-prefix='icon'
                    name='xinhao' />
                  <!-- <van-icon class="iconfont icon" v-if="item.openScreen==0" color="#00CC00" class-prefix='icon'
                    name='kaiqipingmu' />
                  <van-icon class="iconfont icon" v-if="item.openScreen==1" color="#FF0000" class-prefix='icon'
                    name='guanbipingmu' /> -->
                  <van-icon class="iconfont icon" v-if="item.isoutofstock==0" color="#00CC00" class-prefix='icon'
                    name='shouye' />
                  <van-icon class="iconfont icon" v-if="item.isoutofstock==1" color="#FF0000" class-prefix='icon'
                    name='gouwuchetianjia' />
                  <van-icon class="iconfont icon" v-if="item.isbad==0" color="#00CC00" class-prefix='icon'
                    name='weixiu' />
                  <van-icon class="iconfont icon" v-if="item.isbad==1" color="#FF0000" class-prefix='icon'
                    name='weixiujibie-' />
                  <van-icon class="iconfont icon" v-if="item.stopSell==0" color="#00CC00" class-prefix='icon'
                    name='tongzhi' />
                  <van-icon class="iconfont icon" v-if="item.stopSell==1" color="#FF0000" class-prefix='icon'
                    name='tongzhi' />
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>

      </van-tab>
    </van-tabs>

    <Footer :active="footerActive" />
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

  export default {
    data() {
      return {
        pageindex: 1,
        pagesize: 1000,
        searchType: '',
        imgUrl: '',
        titleDec: "设备",
        textDec: "",
        footerActive: 2,
        active: 0,
        total: 0,
        navTab: [{
          nav: '全部'
        }, {
          nav: '正常'
        }, {
          nav: '告警'
        }, {
          nav: '停售'
        }],
        deviceList: [],
        // 刷新加载
        loading: false,
        finished: false, //是否已加载完成，加载完成后不再触发load事件
        refreshing: false, //刷新成功为false
        error: false, //是否加载失败，加载失败后点击错误提示可以重新触发load事件
        isShow: false, //切换nav禁止加载
        factoryNo: ''
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
      DevicelistFn() { //设备列表
        let data = {
          searchType: this.searchType,
          pageindex: this.pageindex,
          pagesize: this.pagesize,
          factoryNo: this.factoryNo
        }
        this.$api.DeviceList(data).then(res => {
          console.log('返回', res);
          this.isShow = false;
          if (this.refreshing) {
            this.refreshing = false; //刷新成功
          }
          // 加载状态结束
          this.loading = false;
          if (this.active === 0) {
            this.total = res.data.data.allCount;
          } else if (this.active === 1) {
            this.total = res.data.data.oneCount;
          } else if (this.active === 2) {
            this.total = res.data.data.twoCount;
          } else {
            this.total = res.data.data.threeCount;
          }
          let totalList = [{
            totalCount: res.data.data.allCount
          }, {
            totalCount: res.data.data.oneCount
          }, {
            totalCount: res.data.data.twoCount
          }, {
            totalCount: res.data.data.threeCount
          }];
          this.navTab = this.navTab.map((item, index) => {
            return {
              ...item,
              ...totalList[index]
            };
          });
          this.deviceList.push(...res.data.data.list);
        }).catch((err) => {
          console.log(err)
        })
      },
      onLoad() { // 数据加载
        console.log('调用')
        if (this.isShow || this.deviceList.length >= this.total) {
          this.finished = true;
          return true;
        }
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

      bindSearch(){
        this.finished = false;
        this.pageindex = 1;
        this.deviceList = [];
        this.isShow = true;
        this.DevicelistFn();
        this.factoryNo = '';
      },

      gotoEquipmentDetail(equipmentData) {
        this.$router.push({
          path: '/EquipmentDetail',
          query: {
            equipmentData: JSON.stringify(equipmentData)
          }
        })
      }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.deviceList = [];
      this.DevicelistFn();
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
    padding: 10px;
    display: flex;
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
  .inputWrap{
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 20px;
    position: relative;
  }
  .inpSearch{
    position: absolute;
    right: 20px;
    width: 80px;
    height: 40px;
    background: #F15A24;
    color: #fff;
    text-align: center;
    line-height: 40px;
    border-radius: 0 20px 20px 0;
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