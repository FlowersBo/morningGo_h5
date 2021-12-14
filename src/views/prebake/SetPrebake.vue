<template>
  <div id="">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <van-tabs v-model="active" sticky offset-top="45" title-active-color="#F15A24" @click="onClickNav">
      <van-tab title="预烤设置">
        <div class="preheat">
          <div class="facility">
            <div>设备编号：{{deviceno}}</div>
            <div>点位名称：{{pointname}}</div>
          </div>
          <div class="operation">
            <div class="operationTime">
              <div class="setTimer">
                <div>运营开始时间：</div>
                <div class="onSetTimer" @click="setStartTime('s')">{{tactics.startOpen}}</div>
              </div>
              <div class="setTimer">
                <div>运营结束时间：</div>
                <div class="onSetTimer" @click="setStartTime('e')">{{tactics.endOpen}}</div>
              </div>
            </div>
            <button class="operationBtn" @click="onSetTimerChange">保存</button>
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
                <td>{{item.startTime}}-{{item.endTime}}</td>
                <td>
                  <van-stepper :value="item.aNum" :name="index" min="0" max="9" button-size="20" disable-input
                    @change="onStartChange" />
                </td>
                <td>
                  <van-stepper :value="item.bNum" :name="index" min="0" max="9" button-size="20" disable-input
                    @change="onEndChange" />
                </td>
                <td>
                  <button class="btn" @click="bindSaveFn(index)">保存</button>
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
        <div class="ovenware">
          <van-grid :column-num="3">
            <van-grid-item v-for="(item,index) in hotplate" :key="index">
              <div class="ovenware-content">
                这是烤盘信息{{item.startRoastTime}}
              </div>
            </van-grid-item>
          </van-grid>
        </div>
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
        tactics: '',
        currentTime: '07:00',
        show: false,
        bakeTime: [],
        hotplate: []
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
      readimelistFn(factoryno) { //预烤设置
        this.$api.SelectTactics({
          factoryno
        }).then(res => {
          console.log('烤制策略', res);
          this.tactics = res.data.data.tactics;
          this.bakeTime = res.data.data.tactics.tactic;

        }).catch((err) => {
          console.log(err)
        })
      },
      readOvenwareFn(factoryno) { //烤盘信息
        this.$api.Hotplate({
          factoryno
        }).then(res => {
          console.log('烤盘信息', res);
          this.hotplate = res.data.data.hotplate;
          this.hotplate.forEach(element => {
            if (element.addressType == '1') {
              element.addressType = "加热区";
            } else {
              element.addressType = "保温区";
            }
          });
        }).catch((err) => {
          console.log(err)
        })
      },
      onClickNav() { //切换nav
        console.log('当前选中标签', this.active);
        if (this.active == 0) {
          this.readimelistFn(this.factoryno);
        } else {
          this.readOvenwareFn(this.factoryno);
        }
      },

      setStartTime(v) { //时间选择
        this.show = true;
        this.timeStart = v;
      },
      confirmTimeFn(val) { //时间选择器确认按钮
        this.show = false;
        if (this.timeStart == 's') {
          this.tactics.startOpen = val;
        } else {
          this.tactics.endOpen = val;
        }
      },
      cancelFn() { //时间选择器取消按钮
        this.show = false
      },

      onSetTimerChange() { //保存运营时间

      },

      onStartChange(startV, name) { //A区数量
        console.log('startV', startV)
        this.bakeTime.forEach((element, item) => {
          if (item == name.name) {
            element.aNum = startV
          }
        });
      },
      onEndChange(endV, name) { //B区数量
        console.log('endV', endV)
        this.bakeTime.forEach((element, item) => {
          if (item == name.name) {
            element.bNum = endV
          }
        });
        console.log(this.bakeTime);
      },

      bindSaveFn(index) { //保存烤制策略
        this.bakeTime.forEach((element, item) => {
          if (index == item) {
            console.log('当前', element);
            this.$api.SaveOneTactics({
              factoryno
            }).then(res => {}).catch(err => {

            })
          }
        });
      }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.pointname = this.$route.query.pointname;
      this.deviceno = this.$route.query.deviceno;
      this.factoryno = this.$route.query.factoryno;
      this.readimelistFn(this.$route.query.factoryno);
      // this.readOvenwareFn(this.$route.query.factoryno);
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

  /* th,
  td:first-child {
    width: 100px;
  } */

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

  /* 烤盘信息 */
  .van-grid {
    border-left: 1px solid #aaa;
    border-bottom: 1px solid #aaa;
    margin-top: 10px;
  }

  .van-grid-item {
    border-right: 1px solid #aaa;
    border-top: 1px solid #aaa;
  }
</style>
<style lang="less">
  .van-stepper__input {
    background-color: #fff;
    border-radius: 4px;
  }
</style>