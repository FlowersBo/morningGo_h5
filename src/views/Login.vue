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
          <input type="password" v-model="inputPassword" placeholder="密码" placeholder-class="input-placeholder"></input>
        </div>
        <div class="inp" v-else>
          <van-icon class="iconfont icon" class-prefix='icon' name='yanzhengyanzhengma' />
          <input type="number" placeholder="验证码" placeholder-class="input-placeholder"></input>
        </div>
      </div>
      <button class="btn" @click="gotoHome">登录</button>
      <div class="codeLogin" @click="switchoverCodeFn">{{isShow?'验证码登录':'密码登录'}}</div>
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
        phoneNumber: '15001081717',
        inputPassword: '',
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

      getIsWxClient() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          return true;
        }
        return false;
      },

      getOpenId(code) {
        let obj = {
          code,
          platformId: '808',
          url: location.href.split('#')[0]
        }
        // api.getOpenId(obj).then((res) => { //调接口
        //   if (res.code == 1) {
        //     let data = res.data || {};
        //     this.$router.push('/Login')
        //   } else {
        //     //获取异常，关闭当前窗口
        //     console.log('获取异常')
        //     // setTimeout(() => {
        //     //   WeixinCloseWindow()
        //     // }, 2000)
        //   }
        // })
      },


      // 切换验证码登录
      switchoverCodeFn() {
        this.isShow = !this.isShow;
      },
      gotoHome() {
        console.log(this.phoneNumber,this.inputPassword,this.logintype);
        let reqData = {
          username: this.phoneNumber,
          password: this.inputPassword,
          type: this.logintype,
          code: '061pihRo0rQm0k1LpWSo0AktRo0pihR5'
        };
        this.$api.Login(reqData).then(res => {
          console.log('返回', res)
          //   this.$router.push({
          //   name: 'Home',
          //   params: {
          //     phoneNumber: this.phoneNumber
          //   }
          // })
        }).catch((err) => {
          this.changeisLoading(true);
          console.log(err)
        })





        //  this.$router.push({path: '/Home'});
      },
      Uploads() {
        // if (window.location.href.indexOf("state") !== -1) {
        //   this.code = qs.parse(
        //     window.location.href.split("#")[0].split("?")[1]
        //   ).code;
        // }
        // console.log(this.code);

        let data = {
          code: '021pjwll2CXJa84ZSvol28wr0k4pjwlN',
          state: 123
        }
        //   this.$api.Login(data).then(res => {
        //     console.log('返回',res)
        //   }).catch((err) => {
        //     console.log(err)
        //   })
        // }
        let postData = {
          refreshtoken: 'refreshtoken'
        }
        this.$api.RefreshToken(postData).then(res => {
          console.log('返回', res)
        }).catch((err) => {
          this.changeisLoading(true);
          console.log(err)
        })
      },
      // async refreshToken() {
      //   let sliders = await (this.$api.RefreshToken());
      //   console.log(sliders)
      // }
    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.Uploads();
      // this.getWxJssdkConf();
      // this.refreshToken()
    },

    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
      // if (!this.getIsWxClient()) {
      //   this.$router.push('/404')
      //   return
      // };

      let code = this.$route.query.code;
      if (!code) {
        //没有code，去重定向
        WeixinCode()
        console.log('获取code', WeixinCode())
      } else {
        //添加返回拦截
        WeixinReturnBlock.addEvent();
        //根据code，获取信息
        this.getOpenId(code)
      }
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
    destoryed() {
      WeixinReturnBlock.removeEvent();
    },
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