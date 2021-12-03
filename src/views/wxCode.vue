//getCode.vue
<template>
  <div></div>
</template>
<script>
  import {
    mapActions
  } from 'vuex'
  import {
    weixinCode,
    WeixinReturnBlock,
    WeixinCloseWindow
  } from '../utils/util.js'
  export default {
    methods: {
      // ...mapActions('head', ['setAppObjFn']),
      //判断环境
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
        api.getOpenId(obj).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            this.setAppObjFn(data);
            this.$router.push('/home')
          } else {
            //获取异常，关闭当前窗口
            setTimeout(() => {
              WeixinCloseWindow()
            }, 2000)
          }
        })
      }
    },
    mounted() {
      // 不是微信环境。直接去404页。
      if (!this.getIsWxClient()) {
        this.$router.push('/404')
        return
      };

      let code = this.$route.query.code;

      if (!code) {
        //没有code，去重定向
        weixinCode()
      } else {
        //添加返回拦截
        WeixinReturnBlock.addEvent();
        //根据code，获取信息
        this.getOpenId(code)
      }
    },
    destroyed() {
      //消除拦截
      WeixinReturnBlock.removeEvent();
    }
  }
</script>