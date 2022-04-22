<template>
  <div id="mine">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <div class="mineWrap">
      <div class="title">
        <div class="imgWrap">
          <van-image class="img" width="90" height="46" :src="require('@/img/logo.png')" />
        </div>
        <div class="infoPhone">登录账号：{{userInfoLocal.username}}</div>
      </div>
      <div class="info">
        <van-cell title="所在小组：">{{userInfoLocal.groupname}}</van-cell>
        <van-cell title="订单列表" is-link to="OrderList" />
        <van-cell title="扫一扫" is-link @click="qrCode" />
        <van-cell title="修改密码" is-link @click="showPopup" />
      </div>
      <div class="btnWrap">
        <van-button round color="linear-gradient(to right, #F15A24, #877974)" @click="logOut">
          退出登录
        </van-button>
      </div>
      <van-popup v-model="isShow">
        <form class="subminWrap" report-submit @submit.prevent="submitFn">
          <input class="inp" type="number" placeholder="旧密码" name="password" />
          <input class="inp" type="number" placeholder="新密码" name="newpassword" />
          <input class="inp" type="number" placeholder="确认密码" name="pwdRepeat" />
          <div class="subBtn">
            <button class="submitBtn" formType="submitFn">确认</button>
            <button class="submitBtn" type="button" @click="showPopup">取消</button>
          </div>
        </form>
      </van-popup>
    </div>
    <Footer :active="active" />
  </div>
</template>

<script>
  import HeaderTitle from '../components/HeaderTitle.vue';
  import Footer from '@/components/footer.vue';
  import wx from "weixin-jsapi";
  // import wx from "weixin-js-sdk";
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
        isShow: false
      }
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      wechatLogin() {
        // console.log(parent.location.href)
        console.log('域名', window.location.href.split("#")[0])
        // let url = location.href.split("#")[0];
        let url = window.location.href.split("#")[0];
        this.$api.Wechatjsapi({
          url
        }).then(res => {
          console.log('签名返回：', res)
          let ticket = res.data.data.ticket;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: ticket.appId, // 必填， 公众号的唯一标识
            timestamp: ticket.timestamp, // 必填，生成签名的时间戳
            nonceStr: ticket.nonceStr, // 必填，生成签名的随机串
            signature: ticket.signature, // 必填，签名，见附录1
            jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.error(function (res) {
            console.log("调用微信jsapi返回的状态:" + res.errMsg);
          });
        }).catch(err => {})
      },
      qrCode() {
        let that = this;
        wx.ready(function () {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              let result = res.resultStr;
              // result = result.split('/', 1)[0];
              that.qrLogin(result);
            },
            fail: (err => {
              console.log('扫码错误返回', err);
              if (res.errMsg.indexOf('function_not_exist') > 0) {
                this.$toast('版本过低请升级')
              }
            })
          })
        });
      },
      qrLogin: function (result) {
        console.log('当前factryNo', result);
        this.$api.Qrcodelogin({
            username: this.userInfoLocal.username,
            factoryno: result
          }).then(res => {
            console.log('扫码登陆', res);
            if (res.data.code !== 200) {
              Dialog.confirm({
                title: '提示',
                message: res.data.message,
              })
            } else {
              Dialog.confirm({
                title: '提示',
                message: '登录失败',
              })
            }
          }).catch(err => {
            console.log('扫码登陆失败', err);
            Dialog.confirm({
              title: '提示',
              message: '登陆失败',
            })
          })
      },

      logOut() {
        console.log('退出登录')
        Dialog.confirm({
            title: '提示',
            message: '确认退出登录',
          })
          .then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfoLocal');
            localStorage.removeItem('code');
            this.$router.push({
              path: '/Login'
            })
          }).catch(err => {

          })
        // window.localStorage.clear(); //清除所有key
      },

      showPopup() { //修改密码
        this.isShow = !this.isShow;
      },
      submitFn(e) { //提交
        console.log("password", e.target.password.value);
        let password = e.target.password.value;
        let newpassword = e.target.newpassword.value;
        let pwdRepeat = e.target.pwdRepeat.value;
        if (password.length < 6) {
          this.$toast("旧密码至少六位");
          return;
        }
        if (newpassword.length < 6) {
          this.$toast("新密码至少六位");
          return;
        }
        if (newpassword != pwdRepeat) {
          this.$toast("新密码不一致");
          return;
        }
        Dialog.confirm({
            title: '提示',
            message: '确认修改当前密码',
          })
          .then(() => {
            this.$api.Changepw({
              username: this.userInfoLocal.username,
              password: e.target.password.value,
              newpassword: e.target.newpassword.value
            }).then(res => {
              console.log('修改密码', res)
              if (res.data.code == '200') {
                this.$toast(res.data.message)
              } else {
                e.target.password.value = '';
                e.target.newpassword.value = '';
                e.target.pwdRepeat.value = '';
                this.$toast(res.data.message)
              }
            }).catch(err => {
              this.$toast(err.message);
              e.target.password.value = '';
              e.target.newpassword.value = '';
              e.target.pwdRepeat.value = '';
            })
            this.showPopup();
          }).catch(err => {

          })
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.userInfoLocal = JSON.parse(localStorage.getItem('userInfoLocal'));
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
    padding-right: 40px;
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
    width: 360px;
    margin: 10px 0;
    border-radius: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    padding: 16px;
  }

  .btnWrap {
    width: 100%;
    margin-top: 60px;
    display: flex;
    justify-content: center;
  }

  .van-button {
    width: 100%;
    height: 50px;
    font-size: 16px;
  }

  .van-popup,
  .van-popup--center {
    width: 340px;
    border-radius: 10px;
    background: #f1f1f1;
  }

  .subminWrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 10px;
  }

  .inp {
    width: 300px;
    height: 40px;
    border: none;
    margin: 10px 0;
    border-radius: 10px;
    box-sizing: border-box;
    padding-left: 10px;
  }

  .subBtn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 50px;
    margin: 30px 0 10px;
  }

  .submitBtn {
    width: 80px;
    height: 36px;
    line-height: 36px;
    border: none;
    border-radius: 10px;
    background: #ff9900;
    color: #fff;
  }
</style>