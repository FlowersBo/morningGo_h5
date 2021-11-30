<template>
  <div class="home">
    <!-- <Login msg="报表" /> -->
    <!-- <router-link to="/Mine">Mine</router-link> -->
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <van-pull-refresh class="alarmWrap" v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="item in list" :key="item.id">
          <div class="alarm">
            <div class="alarm-title">
              <div class="title-left">
                <div class="title-state">故障告警</div>
                <van-icon class="iconfont icon" color="#F15A24" class-prefix='icon' name='weixiu' />
                <!-- <van-icon class="iconfont icon" color="#F15A24" class-prefix='icon' name='gouwuchetianjia' /> -->
              </div>
              <div class="title-right">
                <van-icon class="iconfont icon" color="#C4D0FF" class-prefix='icon' name='gaoqingshexiang' />
                <div class="titleBtn" @click="">消除</div>
              </div>
            </div>
            <div class="alarm-content">
              <div class="content-item">
                <div class="itemKey">告警时间：</div>
                <div class="itemValue">{{item.time}}</div>
              </div>
              <div class="content-item">
                <div class="itemKey">告警级别：</div>
                <div class="itemValue">{{item.rank}}</div>
              </div>
              <div class="content-item">
                <div class="itemKey">点位名称：</div>
                <div class="itemValue">{{item.pt}}</div>
              </div>
            </div>
            <div class="alarm-detail">
              <div class="detailText">
                <div class="itemKey">告警内容：</div>
                <div>出货口卡肠</div>
              </div>
              <img class="detailImg" src="../img/right-arrows.png" alt="">
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>


    <Footer :active="active" />
  </div>
</template>

<script>
  import HeaderTitle from '../components/HeaderTitle.vue';
  import Footer from '@/components/footer.vue';
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
        imgUrl: require('@/img/back.png'),
        titleDec: "告警",
        textDec: "",
        active: 0,
        list: [{
            id: 0,
            time: '2021-12-01 14:14:14',
            rank: '一级(停止售卖)',
            pt: '朝阳公园01'
          },
          {
            id: 1,
            time: '2021-12-01 14:14:14',
            rank: '一级(停止售卖)',
            pt: '朝阳公园01'
          },
          {
            id: 2,
            time: '2021-12-01 14:14:14',
            rank: '一级(停止售卖)',
            pt: '朝阳公园01'
          },
          {
            id: 3,
            time: '2021-12-01 14:14:14',
            rank: '一级(停止售卖)',
            pt: '朝阳公园01'
          },
          {
            id: 4,
            time: '2021-12-01 14:14:14',
            rank: '一级(停止售卖)',
            pt: '朝阳公园01'
          }
        ],
        loading: false,
        finished: false,
        refreshing: false,
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
    methods: { // 调用时使用
      Uploads() {
        // let data = {
        //   code: '021pjwll2CXJa84ZSvol28wr0k4pjwlN',
        //   state: 123
        // }
        // console.log(Login);
        // getRequest(Login, data).then(res => {
        //   console.log(res)
        // })
      },
      onLoad() {
        console.log('调用')
        setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list[0]);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);

        if (this.refreshing) {
          console.log('刷新成功')
          this.refreshing = false;
        }
      },
      onRefresh() {
        // 清空列表数据
        this.finished = false;

        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.loading = true;
        this.onLoad();
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.Uploads();
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
      console.log(this.$route.params.phoneNumber);
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
    padding-bottom: 50px;
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

  .alarm-detail {
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #FF9A03;
  }

  .detailText {
    display: flex;
  }

  .detailImg {
    width: 16px;
    height: 16px;
  }
</style>