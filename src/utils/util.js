//util.js
let WeixinCode = () => {
    // let local  = window.location.href.split('#')[0],
    let local = 'http://w3.morninggo.cn/h5/login.html',
    // let local = 'http://w3.morninggo.cn/h5/Login.html',
      //公众号的appid
      appid = 'wxc1f1418da5ca4ff6';
      local = encodeURIComponent(local);

    //转义，防止参数过多，微信截掉
    // local = decodeURIComponent(local);
    // local = encodeURIComponent(local);
    //微信获取code码
    // location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${local}&response_type=code&scope=snsapi_base&state=123`;
  },
  //退出微信公众号
  WeixinCloseWindow = () => {
    //这个可以关闭安卓系统的手机
    document.addEventListener("WeixinJSBridgeReady", () => {
      WeixinJSBridge.call("closeWindow")
    }, false);
    //这个可以关闭ios系统的手机
    WeixinJSBridge.call("closeWindow");
  },
  //返回阻止功能
  WeixinReturnBlock = {
    addEvent: (type, fun) => {
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', type == '2' ? fun : WeixinCloseWindow, false);
      }
    },
    removeEvent: (type, fun) => {
      window.removeEventListener('popstate', type == '2' ? fun : WeixinCloseWindow, false);
    }
  }

export {
  WeixinCode,
  WeixinCloseWindow,
  WeixinReturnBlock
};