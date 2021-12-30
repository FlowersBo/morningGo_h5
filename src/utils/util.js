//util.js
let WeixinCode = () => {
    let local = location.href.split('#')[0],
      // let local = 'https://api.morninggo.cn',
      //公众号的appid
      appid = 'wxc1f1418da5ca4ff6';
    // local = encodeURIComponent(local);
    console.log('根目录', local);
    //转义，防止参数过多，微信截掉
    // local = decodeURIComponent(local);
    // local = encodeURIComponent(local);
    let code=getUrlParam('code');
    if(!code){
      location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${local}&response_type=code&scope=snsapi_base&state=123`;
    }
    //微信获取code码
   // location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${local}/login.html&response_type=code&scope=snsapi_base&state=123`;
    // location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc1f1418da5ca4ff6&redirect_uri=https%3A%2F%2Fapi.morninggo.cn%2Fh5%2Flogin.html&response_type=code&scope=snsapi_base&state=123';
    return code;
  },
  getUrlParam = function(name) { //name为要获取的参数名
    console.log('获取code');
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var rrr = decodeURIComponent(location.search);
    var r = rrr.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },

//退出微信公众号(不支持了)
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