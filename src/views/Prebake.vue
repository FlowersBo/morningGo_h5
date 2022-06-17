<template>
  <div id="prebake">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <van-pull-refresh class="alarmWrap" v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :error.sync="error" error-text="请求失败，点击重新加载" :finished="finished"
        finished-text="没有更多了" :immediate-check="false" @load="onLoad" offset="0">
        <van-cell v-for="item in repertoryList" :key="item.deviceid">
          <div class="alarm" @click="gotoSetRepertory(item.factoryno,item.pointname,item.deviceno)">
            <div class="alarm-content">
              <div class="content-item">
                <div class="itemKey">设备编号：</div>
                <div class="itemValue">{{item.factoryno}}</div>
              </div>
              <div class="content-item">
                <div class="itemKey">点位名称：</div>
                <div class="itemValue">{{item.pointname}}</div>
              </div>
              <div class="content-item">
                <div class="itemKey">当前库存：A：{{item.aStore}} B：{{item.bStore}}</div>
              </div>
              <div class="content-item">
                <div class="itemKey">
                  烤盘信息：
                  <div>
                    <span>A区：烤制中{{item.aing}} 已完成{{item.aed}}</span>
                    <span>B区：烤制中{{item.bing}} 已完成{{item.bing}}</span>
                  </div>
                </div>
              </div>
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
  //这里可以导入其它文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
  //例如：import 《组件名称》from ‘《组件路径》';
  export default {
    name: "prebake",
    //import引入的组件需要注入到对象中才能使用
    components: {
      HeaderTitle,
      Footer
    },
    props: {},
    data() {
      //这里存放数据
      return {
        imgUrl: '',
        titleDec: "预烤",
        textDec: "",
        active: 2,
        pageindex: 1,
        pagesize: 5,
        repertoryList: [],
        // 刷新加载
        loading: false,
        finished: true, //是否已加载完成，加载完成后不再触发load事件
        refreshing: false, //刷新成功为false
        error: false, //是否加载失败，加载失败后点击错误提示可以重新触发load事件
      }
    },
    //计算属性 类似于data概念
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      repertoryFn() {
        this.$api.RoastList({
            pageindex: this.pageindex,
            pagesize: this.pagesize
          }).then(res => {
            console.log(res);
            this.total = res.data.data.total;
            this.repertoryList.push(...res.data.data.data);
            this.finished = false;
            this.refreshing = false;
            this.loading = false;
          })
          .catch(err => {
            console.log(err)
            this.loading = false;
          })
      },
      onLoad() {
        console.log('调用')
        this.loading = true;
        // 数据全部加载完成
        if (this.repertoryList.length >= this.total) {
          this.finished = true;
          this.loading = false;
          return;
        }
        this.pageindex++;
        this.repertoryFn();
      },

      onRefresh() {
        console.log('刷新')
        // 清空列表数据
        this.pageindex = 1;
        this.repertoryList = [];
        this.refreshing = true;
        this.repertoryFn();
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        // this.loading = true;
      },

      gotoSetRepertory(factoryno, pointname, deviceno) { //跳转设置
        this.$router.push({
          path: '/SetPrebake',
          query: {
            factoryno,
            pointname,
            deviceno
          }
        })
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.repertoryFn();
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

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
<style scoped>
  /* @import url(); 引入css类 */
  #prebake {
    width: 350px;
    margin: 45px auto 0;
    font-size: 14px;
    color: #333;
  }

  .alarm {
    width: 100%;
    background-color: #eee;
    margin-top: 10px;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 10px;
  }

  .van-cell {
    width: 350px;
    padding: 0;
  }

  .alarm-content {
    width: 100%;
  }

  .content-item {
    width: 100%;
    display: flex;
    margin: 8px 0;
  }

  .itemKey {
    display: flex;
  }

  .content-item:last-child span {
    display: block;
  }
</style>