//  let ApiRootUrl = 'https://w3.morninggo.cn'
import http from './http.js'
export default {
  RefreshToken(data, token) {
    return http.post("/userinfo/refresh_token", data, token)
  },
  Login(data, token) {
    return http.post("/userinfo/login", data, token)
  },

}