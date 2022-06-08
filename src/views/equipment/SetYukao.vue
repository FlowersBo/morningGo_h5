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
    <div class="switchWrap">
      <div class="switch">工作日：&nbsp;&nbsp;
        <van-switch :value="workday" @input="onUpdateValue('work',workday,holiday)" />
      </div>
      <div class="switch">节假日：&nbsp;&nbsp;
        <van-switch active-color="#ee0a24" :value="holiday" @input="onUpdateValue('holi',workday,holiday)" />
      </div>
    </div>
  </div>
</template>

<script>
  import HeaderTitle from '../../components/HeaderTitle.vue';
  import {
    Dialog
  } from 'vant';
  export default {
    components: {
      HeaderTitle
    },
    props: {},
    data() {
      return {
        titleDec: "预定开关",
        textDec: "",
        imgUrl: require('@/img/back.png'),
        deviceinfo: '',
        holiday: false,
        workday: false
      }
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      getYukaoFn(deviceId) {
        this.$api.GetReserveEnable({
            deviceId
          })
          .then(res => {
            console.log('预订开关信息', res);
            if (res.data.code == 200) {
              this.holiday = res.data.data.holiday;
              this.workday = res.data.data.workday;
            } else {
              this.$toast(res.data.message);
            }
          })
          .catch(err => {

          })
      },
      onUpdateValue(work, workday, holiday) {
        Dialog.confirm({
          title: '提醒',
          message: '是否切换开关？',
        }).then(() => {
          if (work === 'work') {
            this.workday = !workday;
          } else {
            this.holiday = !holiday;
          }
          console.log(this.workday, this.holiday);
          this.$api.SaveReserveEnable({
              deviceId: this.deviceid,
              workday: this.workday,
              holiday: this.holiday,
            })
            .then(res => {
              console.log('预订开关设置', res);
              if (res.data.code == 200) {

              } else {
                this.$toast(res.data.message);
              }
            })
            .catch(err => {

            })
        });
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.factoryno = this.$route.query.factoryno;
      this.pointname = this.$route.query.pointname;
      this.deviceno = this.$route.query.deviceno;
      this.isonline = this.$route.query.isonline;
      this.stopSell = this.$route.query.stopSell;
      this.deviceid = this.$route.query.deviceid;
      this.getYukaoFn(this.$route.query.deviceid);
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

  .switchWrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .switch {
    margin: 20px 0;
    height: 40rpx;
    display: flex;
    align-items: center;
  }
</style>