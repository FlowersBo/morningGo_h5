<template>
  <div id="login">
    <HeaderTitle :imgSrc="imgUrl"
                 :title="titleDec"
                 :text="textDec"></HeaderTitle>
    <div class="loginWrap">
      <div class="img">
        <img src="../img/logo.png"
             alt="">
      </div>
      <div class="inpWrap">
        <div class="inp">
          <van-icon class="iconfont icon"
                    class-prefix='icon'
                    name='shoujihao' />
          <input type="number"
                 v-model='phoneNumber'
                 placeholder="手机号"
                 oninput="if(value.length > 11)value = value.slice(0, 11)"
                 placeholder-class="input-placeholder">
        </div>
        <div class="inp"
             v-if='isShow'>
          <van-icon class="iconfont icon"
                    class-prefix='icon'
                    name='mima' />
          <input type="password"
                 v-model="inputPassword"
                 placeholder="密码"
                 placeholder-class="input-placeholder" />
        </div>
        <div class="inp"
             v-else>
          <van-icon class="iconfont icon"
                    class-prefix='icon'
                    name='yanzhengyanzhengma' />
          <input type="number"
                 v-model="verificationCode"
                 placeholder="验证码"
                 placeholder-class="input-placeholder" />
          <div class="verificationCode"
               @click="verificationCodeFn">{{verificationCodeText}}</div>
        </div>
      </div>
      <button class="btn"
              @click="gotoHome">登录</button>
      <div class="codeLogin"
           @click="switchoverCodeFn">{{isShow?'验证码登录':'密码登录'}}</div>
    </div>
  </div>
</template>


<script>
import HeaderTitle from '../components/HeaderTitle.vue';
let qs = require('querystring');
import {
  mapMutations
} from "vuex"

import {
  WeixinCode,
  WeixinReturnBlock,
  WeixinCloseWindow
} from '../utils/util.js'
import preventBack from 'vue-prevent-browser-back'
export default {
  mixins: [preventBack], //禁止返回
  name: "login",
  components: {
    HeaderTitle,
  },
  props: {

  },
  data () {
    return {
      imgUrl: '',
      titleDec: "登录",
      textDec: "",
      phoneNumber: '',
      inputPassword: '',
      verificationCode: '', //验证码
      verificationCodeText: '获取验证码',
      isRepeatClick: false,
      logintype: 1,
      isShow: true,
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中数据变化
  watch: {},
  //方法集合
  methods: { // 调用时使用
    ...mapMutations(['changeisLoading']),
    getIsWxClient () {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      }
      return false;
    },

    // 切换验证码登录
    switchoverCodeFn () {
      this.isShow = !this.isShow;
      if (this.isShow) {
        this.logintype = 1
      } else {
        this.logintype = 2
      }
    },
    gotoHome () { //15001081717
      if (this.phoneNumber.length < 11) {
        this.$toast('手机号输入错误');
        return;
      } else if (!(/^1[3456789]\d{9}$/.test(this.phoneNumber))) {
        this.$toast('手机号输入有误');
        return;
      }
      if (this.logintype === 1) {
        if (this.inputPassword.length <= 0) {
          this.$toast('密码不能为空');
          return;
        }
      } else {
        if (this.verificationCode.length <= 0) {
          this.$toast('验证码不能为空');
          return;
        }
      }
      console.log(this.phoneNumber, this.inputPassword, this.logintype);
      this.$api.Login({
        username: this.phoneNumber,
        password: this.inputPassword,
        type: this.logintype,
        code: JSON.parse(localStorage.getItem('code'))
      }).then(res => {
        console.log('返回', res.data.data.token);
        if (res.data.code == 200) {
          let token = res.data.data.token;
          localStorage.setItem('userInfoLocal', JSON.stringify(res.data.data.user));
          localStorage.setItem('token', JSON.stringify(token));
          this.$store.state.token = res.data.data.token;
          // window.location.href = location.href.split('#')[0];
          this.$router.push({
            // name: 'Home',
            path: '/',
            params: {
              phoneNumber: this.phoneNumber
            }
          })
        } else {
          this.$toast(res.data.message);
        }
      }).catch((err) => {
        this.changeisLoading(true);
        console.log(err)
      })
    },

    //获取验证码
    verificationCodeFn () {
      if (this.isRepeatClick) {
        return;
      }
      if (this.phoneNumber.length < 11) {
        this.$toast('手机号输入错误');
        return;
      } else if (!(/^1[3456789]\d{9}$/.test(this.phoneNumber))) {
        this.$toast('手机号输入有误');
        return;
      }
      let reqData = {
        username: this.phoneNumber
      };
      this.verificationCodeText = 60;
      this.$api.Getsmscode(reqData).then(res => {
        console.log('返回', res);
        this.codeFn();
      }).catch((err) => {
        console.log(err)
      })
    },

    codeFn () {
      this.isRepeatClick = true;
      let timer = setTimeout(() => {
        if (this.verificationCodeText === 0) {
          this.verificationCodeText = '重新获取'
          this.isRepeatClick = false;
          clearTimeout(timer);
          return
        } else {
          this.verificationCodeText--;
          this.codeFn();
        }
      }, 1000)
    },
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created () {
    // let code = localStorage.getItem('code');
    // if (code) {
    //   console.log('有code', code)
    //   return
    // } else {
    let code = WeixinCode();
    console.log(code);
    if (code) {
      localStorage.setItem('code', JSON.stringify(code));
    }
    // }
  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted () { },
  //生命周期-创建之前
  beforeCreated () { },
  //生命周期-挂载之前
  beforeMount () { },
  //生命周期-更新之前
  beforUpdate () { },
  //生命周期-更新之后
  updated () { },
  //生命周期-销毁之前
  beforeDestory () { },
  //生命周期-销毁完成
  destoryed () { },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated () { }
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

.verificationCode {
  width: 100px;
  font-size: 12px;
  color: #10aeff;
}

.icon {
  width: 40px;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 22px;
  border-right: 1px solid #ff9900;
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
  background-color: #ff9900;
  border: none;
  text-align: center;
  line-height: 46px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-top: 50px;
}

.codeLogin {
  color: #c4d0ff;
  padding: 10px 4px 10px 20px;
  margin-left: auto;
  margin-top: 20px;
}
</style>