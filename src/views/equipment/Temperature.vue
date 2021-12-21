<template>
  <div class="alarmWrap">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <div class="alarm">
      <div class="alarm-left">
        <div class="content-item">
          <div class="itemKey">设备编号：</div>
          <div class="itemValue">{{deviceno}}(出厂编号)</div>
        </div>
        <div class="content-item">
          <div class="itemKey">点位名称：</div>
          <div class="itemValue">{{pointname}}</div>
        </div>
      </div>
      <div class="alarm-right">
        <van-icon class="iconfont icon" v-if="isonline==1" color="#00CC00" class-prefix='icon' name='xinhao' />
        <van-icon class="iconfont icon" v-if="isonline!=1" color="#FF0000" class-prefix='icon' name='xinhao' />
        <van-icon class="iconfont icon" v-if="stopSell==0" color="#00CC00" class-prefix='icon' name='tongzhi' />
        <van-icon class="iconfont icon" v-if="stopSell==1" color="#FF0000" class-prefix='icon' name='tongzhi' />
      </div>
    </div>
    <div class="T">
      <div class="title">当前温度(℃)</div>
      <div class="Tdetail">
        <div>储存箱温度</div>
        <div class="Tdetail-item">{{temperatureT[2].curTemperature}}</div>
      </div>
      <div class="Tdetail">
        <div>上部机箱环境</div>
        <div class="Tdetail-item">{{temperatureT[1].curTemperature}}</div>
      </div>
      <div class="Tdetail">
        <div>下部机箱环境</div>
        <div class="Tdetail-item">{{temperatureT[0].curTemperature}}</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>当前温度(℃)</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <div v-for="(item,index) in temperature">
          <tr>
            <td>加热管{{index+1}}</td>
            <td>{{item.curTemperature}}</td>
            <td>{{item.openStatus==0?'打开':'关闭'}}</td>
          </tr>
        </div>
      </tbody>
    </table>
  </div>
</template>

<script>
  import HeaderTitle from '../../components/HeaderTitle.vue';
  export default {
    components: {
      HeaderTitle
    },
    props: {},
    data() {
      //这里存放数据
      return {
        titleDec: "温度信息",
        textDec: "",
        imgUrl: require('@/img/back.png'),
        temperature: [],
        temperatureT: [],
      }
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      temperatureFn(factoryno) {
        this.$api.Gettemperature({
            factoryno
          })
          .then(res => {
            console.log('温度显示', res);
            let temperatureList = res.data.data.temperature.list;
            this.temperature = temperatureList.slice(0, 7);
            this.temperatureT = temperatureList.slice(7, 10);
            console.log(this.temperature);
            console.log(this.temperatureT);
          })
          .catch(err => {

          })
      }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.factoryno = this.$route.query.factoryno;
      this.pointname = this.$route.query.pointname;
      this.deviceno = this.$route.query.deviceno;
      this.isonline = this.$route.query.isonline;
      this.stopSell = this.$route.query.stopSell;
      this.temperatureFn(this.$route.query.factoryno);
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
  .alarmWrap {
    width: 360px;
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
    width: 250px;
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

  .T {
    background-color: #eee;
    margin-top: 10px;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 10px;
    margin-top: 10px;
  }

  .title {
    text-align: center;
    color: #ff9900;
  }

  .Tdetail {
    display: flex;
    height: 30px;
    line-height: 30px;
    justify-content: space-between;
    box-sizing: border-box;
    padding-right: 40%;
    color: #aaa;
  }

  .Tdetail-item {
    width: 60px;
    text-align: center;
  }

  table {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 20px;
    border-radius: 10px;
  }

  tr {
    height: 40px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    background-color: #f1f1f1;
    align-items: center;
    box-sizing: border-box;
    padding: 0 4px;
  }

  th,
  td {
    flex: 1;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  td{
    color: #aaa;
  }
</style>