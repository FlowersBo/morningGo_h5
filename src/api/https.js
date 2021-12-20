// promise封装 https://www.npmjs.com/package/axios
import Axios from 'axios'
import router from '@/router'
import { Notify,Dialog,Toast } from 'vant';
 
let baseUrl = '';
let fileUrl = ''; // 文件服务器地址
if (process.env.NODE_ENV === "development" || 
  window.location.href.includes('loclhost') || 
  window.location.href.includes('192.168')  ||
  window.location.href.includes('xxx')  
) {
  baseUrl = 'http://xxx:8181/';   //开发环境  || 测试环境 
}else {
  baseUrl = 'http://xxx'; //线上环境 
}     
localStorage.setItem('fileUrl', fileUrl)                                         
Axios.defaults.baseURL = baseUrl // 设置默认请求的url
 
Axios.defaults.timeout = 12000
Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
 
// 添加请求拦截器
Axios.interceptors.request.use(function (config) {
  // 根据method对数据进行整合，post请求时根据conten-type做数据格装换
  if (/^post$/i.test(config.method)) {
    // 后台接收的JSON格式的字符串 基本都是post
    config.params && (config.data = config.params)
    delete config.params
    let newContentType = config.headers['Content-Type']
    // 这里是个大坑，因为这里判断出了问题，请求一直跨域，同时上传参数为空
    if ((!newContentType || newContentType.indexOf('application/json') !== -1) && config.url.indexOf('upload/picture') === -1) {
      // 数据类型为'application/json'时，需要对数据进行转换
      config.data = JSON.stringify(config.data)
      // console.log(config.data)
    }
    // 图片上传需要变成 multipart/form-data 格式
    if (config.url.indexOf('upload/picture') !== -1) {
      // config.headers.post['Content-Type'] = 'application/json;charset=utf-8'
      config.headers.post["Content-Type"] = "multipart/form-data"
    }
  } else {
    config.data && (config.params = config.data)
    delete config.data
  }
  config.headers["Access-Control-Allow-Origin"] = "*"
  // 在请求中动态设置headers
  let url = config.url;
  return config
}, function (error) {
  // 请求错误返回
  console.log(error)
  return Promise.reject(error)
})
 
Axios.interceptors.response.use((response) => {
  return response;
}, function (error) {
  console.log('请求状态码错误')
  return Promise.reject(error);
});
 
export default (reqObj, successCallback, errorCallback, failCallback) => {
  let LoadingToast;
  let defaultOpts = {
    method: 'GET',
    showLoading: true
  }
  if(defaultOpts.showLoading){
    // 爱的魔力转圈圈
    LoadingToast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
    });
  }
  Object.assign(defaultOpts, reqObj)
  Axios(defaultOpts).then((response) => {
    // alert("response.data.code:"+response.data.code)
    LoadingToast.clear()
    // 登录超时 
    if (parseInt(response.data.code) === 500) {
      Dialog.alert({
        message: '登录超时',
        confirmButtonText: '确定'
      }).then(() => {
        // on close
        localStorage.clear()
        router.push("/")
      });
    } else if (parseInt(response.data.code) === 0 || parseInt(response.data.code) === 3) {
      // queryDefaultLoanDay 
      typeof successCallback === 'function' && successCallback(response.data)
    } else {
      let errorMsgData = response.data.msg ? response.data.msg : response.data.msg ? response.data.msg : ''
      // 检测是否包含中文
      let errorMsg = new RegExp("[\\u4E00-\\u9FFF]+","g").test(errorMsgData)
      if(errorMsg){
        errorMsgData = '你的请求有误' // 你的请求有误
      }
      Notify({ type: 'primary', message: errorMsgData });
      typeof errorCallback === 'function' && errorCallback(response.data)
    }
  }).catch((response) => {
    // console.log(response)
    LoadingToast.clear()
    if (typeof failCallback === 'function') {
      failCallback(response.data)
    } else if (JSON.stringify(response) === '{}') {
      failCallback(response.data)
    } else {
      // alert('请求发生错误的接口：', JSON.stringify(response.url), JSON.stringify(response.data))
      Notify({ type: 'primary', message: '服务器发生错误，请稍后重试' });
      // Notify({ type: 'primary', message: '服务器发生错误，请稍后重试'+JSON.stringify(response.data) });
    }
  })
}
 
/**
 * @param   {url:'/xxxx',method:'post',data:{}} reqObj
 *          reqObj特殊参数说明：
 *          url:              请求的地址，字符串
 *          method:           请求的方法，post或者get
 *          data:             请求的参数，对象
 *          loadingOptions    请求时加载特效的位置，target为id和class
 *          其余参数设置参考axios文档
 * @param  {function} successCallback    请求成功的回调函数
 * @param  {function} errorCallback      请求失败的回调函数
 * @param  {function} failCallback       请求错误的回调函数
 */