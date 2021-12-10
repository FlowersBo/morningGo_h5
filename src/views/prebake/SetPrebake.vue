<template>
  <div id="">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <van-tabs v-model="active" sticky offset-top="45" title-active-color="#F15A24" @click="onClickNav">
      <van-tab title="预烤设置">
        <div class="preheat">
          <div class="facility">
            <div>设备编号：010001</div>
            <div>点位名称：朝阳公园01</div>
          </div>
          <div class="operation">
            <div class="operationTime">
              <div class="setTimer">
                <div>运营开始时间：</div>
                <div class="onSetTimer" @click="setStartTime('s')">{{startTime}}</div>
              </div>
              <div class="setTimer">
                <div>运营结束时间：</div>
                <div class="onSetTimer" @click="setStartTime('e')">{{endTime}}</div>
              </div>
            </div>
            <button class="operationBtn">保存</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>时间段</th>
                <th>A区</th>
                <th>B区</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in bakeTime">
                <td>{{item.timer}}</td>
                <td>
                  <van-stepper v-model="value" min="0" max="9" button-size="20" disable-input />
                </td>
                <td>
                  <van-stepper v-model="value" min="0" max="9" button-size="20" disable-input />
                </td>
                <td>
                  <button class="btn" @click="saveFn(index)">保存</button>
                </td>
                <!-- <td><button @click="insert">insert</button></td> -->
              </tr>
              <tr>
              </tr>
            </tbody>
          </table>
        </div>
        <van-popup v-model="show" round position="bottom">
          <van-datetime-picker v-model="currentTime" type="time" title="选择时间" @cancel="cancelFn"
            @confirm="confirmTimeFn" />
        </van-popup>
      </van-tab>
      <van-tab title="烤盘信息">
        <div class="ovenware"></div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import HeaderTitle from '../../components/HeaderTitle.vue';
  import {
    Dialog
  } from 'vant';
  export default {
    name: 'setPrebake',
    data() {
      return {
        imgUrl: require('@/img/back.png'),
        titleDec: "预烤设置",
        textDec: "",
        active: 0,
        currentTime: '07:00',
        startTime: '',
        endTime: '',
        show: false,
        bakeTime: [{
          timer: '12:00-24:00'
        }]
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
      SetTimelistFn() {
        this.$api.Devicelist().then(res => {

        }).catch((err) => {
          console.log(err)
        })
      },
      onClickNav() { //切换nav
        console.log('当前选中标签', this.active);
      },

      setStartTime(v) { //时间选择
        this.show = true;
        this.timeStart = v;
      },
      confirmTimeFn(val) {
        this.show = false;
        if (this.timeStart == 's') {
          this.startTime = val;
        } else {
          this.endTime = val;
        }
      },
      cancelFn() {
        this.show = false
      }

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      // this.SetTimelistFn();
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
  #setPrebake {
    font-size: 14px;
    color: #333;
    margin: 45px auto 0;
  }

  .preheat {
    width: 100%;
    margin-top: 6px;
  }

  .facility {
    background-color: #f1f1f1;
    margin-bottom: 10px;
    box-sizing: border-box;
    padding: 10px;
  }

  .facility div:last-child {
    margin-top: 10px;
  }

  .operation {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    background-color: #f1f1f1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .operationTime {
    width: 60%;
  }

  .setTimer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
  }

  .onSetTimer {
    width: 90px;
    height: 30px;
    border-radius: 4px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #ccc;
    background-color: #fff;
  }

  .operationBtn {
    width: 80px;
    height: 36px;
    background: #FF9900;
    color: #fff;
    border-radius: 10px;
    border: none;
  }

  table {
    width: 100%;
    margin-top: 10px;
  }

  tr {
    height: 40px;
  }

  th,
  td {
    text-align: center;
    border-bottom: 1px solid #ddd;
    background-color: #f1f1f1;
  }

  th,
  td:first-child {
    width: 100px;
  }

  th,
  td:last-child {
    width: 60px;
  }

  .btn {
    width: 46px;
    height: 26px;
    border: none;
    border-radius: 6px;
    background: #FF9900;
    color: #fff;
    font-size: 10px;
  }
</style>
<style lang="less">
  .van-stepper__input {
    background-color: #fff;
    border-radius: 4px;
  }
</style>