<template>
  <div class="equipmentDetail">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <div class="ovenware">
      <van-grid :column-num="3">
        <van-grid-item v-for="(item,index) in hotplate" :key="index" :class="{'bgc':item.bgc}">
          <div class="ovenware-content" :class="{'bgc':item.bgc}">
            <div>{{item.address}}({{item.addressType}})</div>
            <div>{{item.temperIsReach}} <span v-if="item.temperIsReach!='空'">肠</span> <span
                v-if="item.temperIsReach!='空'"
                :class="{'roastStatus':item.roastStatus=='烤制完成'}">({{item.roastStatus}})</span> </div>
            <div>{{item.showTime}}</div>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
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
        titleDec: '',
        textDec: "",
        imgUrl: require('@/img/back.png'),
        hotplate: []
      }
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
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
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.factoryno = this.$route.query.factoryno;
      this.pointname = this.$route.query.pointname;
      this.deviceno = this.$route.query.deviceno;
      this.titleDec = `烤盘信息(${this.pointname})`;
      this.readOvenwareFn(this.$route.query.factoryno);
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
  .equipmentDetail {
    margin: 0 auto;
  }

  .ovenware {
    margin-top: 50px;
  }

  .ovenware-content {
    width: 100%;
    height: 90px;
    /* padding: 16px 0; */
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

  .van-grid {
    flex-direction: row-reverse;
  }

  .van-grid-item__content {
    padding: 0;
  }
</style>