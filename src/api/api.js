//  let ApiRootUrl = 'https://w3.morninggo.cn'
import http from './http.js'
export default {
  RefreshToken(data, token) {
    return http.post("/userinfo/refresh_token", data, token)
  },
  Login(data) {
    return http.post("/userinfo/login", data)
  },
  Getsmscode(data) {  //获取验证码
    return http.post("/userinfo/getsmscode", data)
  },
  Devicelist(data) {  //告警列表
    return http.get("/nav/alarmlist", data)
  },
  CancelAlarm(data) {  //清除报警
    return http.get("/command/cancelAlarm", data)
  },
  Getvideo(data) {  //告警视频
    return http.get("/command/getvideo", data)
  },
  GetSuggest(data) {  //告警内容
    return http.get("/deviceinfo/getSuggest", data)
  },
  StoreList(data) {  //库存列表
    return http.get("/nav/storeList", data)
  },
  Getstock(data) {  //库存设置展示
    return http.get("/deviceinfo/getstock", data)
  },
  Changestock(data) {  //库存设置
    return http.get("/deviceinfo/changestock", data)
  },
  DeviceList(data) {  //设备列表
    return http.get("/nav/deviceList", data)
  },
}