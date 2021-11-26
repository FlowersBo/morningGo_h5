<template>
  <div id="login">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <div class="loginWrap">
      <div class="img">
        <img src="../img/logo.png" alt="">
      </div>
      <div class="inpWrap">
        <div class="inp">
          <van-icon class="iconfont icon" class-prefix='icon' name='shoujihao' />
          <input type="number" v-model='phoneNumber' placeholder="手机号"
            oninput="if(value.length > 11)value = value.slice(0, 11)" placeholder-class="input-placeholder">
        </div>
        <div class="inp" v-if='isShow'>
          <van-icon class="iconfont icon" class-prefix='icon' name='mima' />
          <input type="password" placeholder="密码" placeholder-class="input-placeholder"></input>
        </div>
        <div class="inp" v-else>
          <van-icon class="iconfont icon" class-prefix='icon' name='yanzhengyanzhengma' />
          <input type="number" placeholder="验证码" placeholder-class="input-placeholder"></input>
        </div>
      </div>
      <button class="btn" @click="gotoHome">登录</button>
      <div class="codeLogin" @click="switchoverCodeFn">验证码登录</div>
    </div>
    <van-loading v-show="isLoding" type="spinner" vertical size="24px">加载中...</van-loading>
  </div>
</template>


<script>
  // 引入封装好的接口
  // import {
  //   getRequest
  // } from "@/api/http.js";
  // import {
  //   Login
  // } from "@/api/api.js";

  import HeaderTitle from '../components/HeaderTitle.vue';
  let qs = require('querystring')
  export default {
    name: "login",
    components: {
      HeaderTitle,
    },
    props: {

    },
    data() {
      return {
        imgUrl: '',
        titleDec: "登录",
        textDec: "忘记密码",
        phoneNumber: '',
        inputPassword: '',
        isShow: true,
        isLoding: true
      };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: { // 调用时使用
      // sdk方法
      async getWxJssdkConf() {
        console.log(window.location.href.split("#")[0])
        const res = await this.$api.getSdkConfig({
          url: window.location.href.split("#")[0],
        });
        if (res.success) {
          this.wxsdk.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: String(res.data.timestamp), // 必填，生成签名的时间戳
            nonceStr: String(res.data.nonceStr), // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录1
            jsApiList: [
              "getNetworkType",
              "getLocation",
            ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          this.wxsdk.ready(() => {
            this.wxsdk.checkJsApi({
              jsApiList: ["getNetworkType", "getLocation"], // 需要检测的JS接口列表，所有JS接口列表见附录2,
              success: function (res) {
                console.log("checkJsApi", res);
              },
            });
          });
          this.wxsdk.error((res) => {
            console.log("wx.error", res);
          });
        }
      },

      switchoverCodeFn() {
        this.isShow = !this.isShow;
      },
      gotoHome() {
        console.log(this.phoneNumber);
        // this.$router.push({
        //   name: 'Home',
        //   params: {
        //     phoneNumber: this.phoneNumber
        //   }
        // })
        //  this.$router.push({path: '/Home'});
      },
      Uploads() {
        if (window.location.href.indexOf("state") !== -1) {
        this.code = qs.parse(
          window.location.href.split("#")[0].split("?")[1]
        ).code;
        } 
        console.log(this.code);

        let data = {
          code: '021pjwll2CXJa84ZSvol28wr0k4pjwlN',
          state: 123
        }
        this.$api.RefreshToken().then(res => {
          console.log('返回', res)
        }).catch((err) => {
          console.log(err)
        })

        //   this.$api.Login(data).then(res => {
        //     console.log('返回',res)
        //   }).catch((err) => {
        //     console.log(err)
        //   })
        // }
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.Uploads();
      // this.getWxJssdkConf();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .loginWrap {
    width: 345px;
    margin: 45px auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #333;
    font-size: 14px;
  }

  .img {
    margin: 80px 0 60px;
  }

  .img img {
    width: 260px;
  }

  .inpWrap {
    width: 100%;
  }

  .inp {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #eee;
    border-radius: 10px;
    margin: 10px 0;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  .icon {
    width: 40px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 22px;
    border-right: 1px solid #FF9900;
  }

  .inpWrap input {
    flex: 1;
    height: 100%;
    border: none;
    background-color: #eee;
    box-sizing: border-box;
    padding: 0 10px;
    border-radius: 10px;
  }

  .btn {
    width: 100%;
    height: 46px;
    border-radius: 14px;
    background-color: #FF9900;
    border: none;
    text-align: center;
    line-height: 46px;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    margin-top: 50px;
  }

  .codeLogin {
    color: #C4D0FF;
    padding: 10px 4px 10px 20px;
    margin-left: auto;
    margin-top: 20px;
  }
</style>