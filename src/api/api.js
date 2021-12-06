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
  Devicelist(data) {  //报警列表
    return http.get("/nav/alarmlist", data)
  },

}