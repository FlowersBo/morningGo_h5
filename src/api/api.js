//  let ApiRootUrl = 'https://w3.morninggo.cn'

//  module.exports = {
//   Login: ApiRootUrl + '/userinfo/login', //登录授权
//  }
 import http from './http.js'
export default {
 Login(data, token){
  return http.get("/userinfo/login",data, token)
 },
 RefreshToken(data, token){
  return http.post("/userinfo/refresh_token",data, token)
 }
}
