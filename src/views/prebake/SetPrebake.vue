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
            <van-grid-item v-for="(item,index) in hotplate" :key="index" :class="{'bgc':item.bgc}">
              <div class="ovenware-content" :class="{'bgc':item.bgc}">
                <div>{{item.address}}({{item.addressType}})</div>
                <div>{{item.temperIsReach}}<span v-if="item.temperIsReach!='空'">肠</span><span
                    v-if="item.temperIsReach!='空'"
                    :class="{'roastStatus':item.roastStatus=='烤制完成'}">({{item.roastStatus}})</span> </div>
                <div>{{item.showTime}}</div>
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
              element.bgc = true;
            } else {
              element.addressType = "保温区";
              element.bgc = false;
            }
            let nowTime = new Date().getTime();
            let d, h, m, s, m2, s2;
            let showTime = "-";
            let temperIsReach = "空";
            if (element.haveSausage) {
              let roastStatus = "";
              //如果当前时间大于烤制结束时间
              if (nowTime > element.endRoastTime) {
                //烤制完成
                let warmTime = new Date().getTime() - element.endRoastTime;
                if (warmTime >= 0) {
                  d = Math.floor(warmTime / 1000 / 60 / 60 / 24);
                  h = Math.floor(warmTime / 1000 / 60 / 60 % 24);
                  m2 = Math.floor(warmTime / 1000 / 60 % 60);
                  s2 = Math.floor(warmTime / 1000 % 60);
                }
                roastStatus = "烤制完成";
                element.showTime = h + "时" + m2 + "分" + s2 + "秒";

              } else {
                //烤制中
                let roastTime = new Date().getTime() - element.startRoastTime;
                if (roastTime >= 0) {
                  m = Math.floor(roastTime / 1000 / 60 % 60);
                  s = Math.floor(roastTime / 1000 % 60);
                }
                roastStatus = "烤制中";
                element.showTime = m + "分" + s + "秒";
              }
              element.temperIsReach = element.stock;
              element.roastStatus = roastStatus;
            } else {
              element.temperIsReach = temperIsReach;
              element.showTime = '-'
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
        Dialog.confirm({
            title: '提示',
            message: '确定保存营业时间',
          })
          .then(() => {
            this.$api.SaveBusinessTime({
              id: this.tactics.id,
              deviceId: this.tactics.deviceId,
              startTime: this.tactics.startOpen,
              endTime: this.tactics.endOpen
            }).then(res => {
              console.log(res);
              if (res.data.code == '200') {
                this.$toast('保存成功');
              } else {
                this.$toast(res.data.message);
              }
            }).catch(() => {
              this.$toast('保存失败');
            })

          }).catch(() => {

          })
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
            Dialog.confirm({
                title: '提示',
                message: '确定保存该策略',
              })
              .then(() => {
                this.$api.SaveOneTactics({
                  id: element.id,
                  deviceId: element.deviceId,
                  counta: element.aNum,
                  countb: element.bNum
                }).then(res => {
                  if (res.data.code == '200') {
                    this.$toast('保存成功');
                  } else {
                    this.$toast(res.data.message);
                  }
                }).catch(err => {
                  this.$toast('保存失败');
                })
              }).catch(() => {

              })
          }
        });
      },
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

  .ovenware-content {
    width: 100%;
    height: 100%;
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .ovenware-content div {
    padding: 2px 0;
  }

  .bgc {
    background: #FF9900;
    color: #fff;
  }

  .roastStatus {
    color: blueviolet;
  }
</style>
<style lang="less">
  .van-stepper__input {
    background-color: #fff;
    border-radius: 4px;
  }

  .van-grid-item__content {
    padding: 0;
  }
</style>