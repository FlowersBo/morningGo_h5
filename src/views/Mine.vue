<template>
  <div id="mine">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <div class="mineWrap">
      <div class="title">
        <div class="imgWrap">
          <van-image class="img" width="90" height="46" :src="require('@/img/logo.png')" />
        </div>
        <div class="infoPhone">登录账号：{{phoneNumber}}</div>
      </div>
      <div class="info">
        <van-cell title="所在小组:" />
        <van-cell title="订单列表" is-link />
        <van-cell title="扫一扫" is-link @click="qrCode" />
        <van-cell title="修改密码" is-link />
      </div>
      <div class="btnWrap">
        <van-button round color="linear-gradient(to right, #F15A24, #877974)" @click="logOut">
          退出登录
        </van-button>
      </div>
    </div>
    <Footer :active="active" />
  </div>
</template>

<script>
  import HeaderTitle from '../components/HeaderTitle.vue';
  import Footer from '@/components/footer.vue';
  import {
    Dialog
  } from 'vant';
  export default {
    name: "mine",
    components: {
      HeaderTitle,
      Footer
    },
    props: {},
    data() {
      //这里存放数据
      return {
        imgUrl: '',
        titleDec: "我的",
        textDec: "",
        active: 4,
        phoneNumber: ''
      }
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      wechatLogin() {
        console.log(location.href.split("#")[0])
        let url = location.href.split("#")[0];
        this.$api.Wechatjsapi({
          url
        }).then(res => {
          console.log(res)
          let ticket = res.data.data.ticket;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: ticket.appid, // 必填， 公众号的唯一标识
            timestamp: ticket.timestamp, // 必填，生成签名的时间戳
            nonceStr: ticket.nonceStr, // 必填，生成签名的随机串
            signature: ticket.signature, // 必填，签名，见附录1
            jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function (res) {
            console.log("wx.ready", res);
          });
          wx.error(function (res) {
            console.log("调用微信jsapi返回的状态:" + res.errMsg);
          });
        }).catch(err => {})
      },
      qrCode() {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          //desc: 'scanQRCode desc',
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            let result = res.resultStr; 
            console.log(result);
            // let reqData = {
            //   username: loginname,
            //   factoryno: result
            // };
            // this.$api.Qrcodelogin({})
            // .then(res=>{

            // }).catch(err=>{

            // })
          },
          error: function (res) {
            if (res.errMsg.indexOf('function_not_exist') > 0) {
             this.$toast('版本过低请升级')
            }
          },
          fail: function (json) {
            //this.$toast("fail");
          },
          complete: function (json) {
            //this.$toast("complete");
          }
        });
      },



      logOut() {
        console.log('退出登录')
        Dialog.confirm({
            title: '提示',
            message: '确认退出登录',
          })
          .then(() => {
            this.$router.push({
              path: '/'
            })
          }).catch(err => {

          })
        // window.localStorage.clear(); //清除所有key
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.phoneNumber = JSON.parse(localStorage.getItem('phoneNumber'));
      this.wechatLogin();
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
      // document.body.style.backgroundColor = "#f1f1f1";
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
  #mine {
    background-color: #f1f1f1;
    width: 100%;
    height: 100%;
    position: fixed;
  }

  .mineWrap {
    width: 360px;
    margin: 0 auto;
  }

  .title {
    width: 100%;
    height: 120px;
    background: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 10px;
    margin-top: 5px;
    box-sizing: border-box;
    padding-right: 30px;
  }

  .imgWrap {
    width: 100px;
    height: 100px;
    border: 1px solid #bbb;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .img {
    margin-top: -10px;
  }

  .info {
    width: 100%;
    margin-top: 10px;
  }

  .info .van-cell {
    margin: 10px 0;
    border-radius: 4px;
  }

  .btnWrap {
    width: 100%;
    margin-top: 100px;
    display: flex;
    justify-content: center;
  }

  .van-button {
    width: 340px;
    font-size: 16px;
  }
</style>