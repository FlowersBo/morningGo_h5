 let ApiRootUrl = 'https://w3.morninggo.cn'
 import http from './http.js'
 export default {
   RefreshToken(data, token) {
     return http.post("/userinfo/refresh_token", data, token)
   },
   Login(data) {
     return http.post("/userinfo/login", data)
   },
   Getsmscode(data) { //获取验证码
     return http.post("/userinfo/getsmscode", data)
   },
   Alarmlist(data) { //告警列表
     return http.get("/nav/alarmlist", data)
   },
   CancelAlarm(data) { //清除报警
     return http.get("/command/cancelAlarm", data)
   },
   Getvideo(data) { //告警视频
     return http.get("/workOrder/getVideo", data)
   },
   GetSuggest(data) { //告警内容
     return http.get("/deviceinfo/getSuggest", data)
   },
   StoreList(data) { //库存列表
     return http.get("/nav/storeList", data)
   },
   RoastList(data) { //预烤列表
     return http.get("/nav/roastList", data)
   },
   Getstock(data) { //读取设备库存
     return http.get("/deviceinfo/getstock", data)
   },
   Changestock(data) { //设备库存设置
     return http.post("/deviceinfo/changestock", data)
   },

   SelectTactics(data) { //获取烤制策略
     return http.get("/deviceinfo/selectTactics", data)
   },
   SaveOneTactics(data) { //保存烤制策略
     return http.post("/deviceinfo/saveOneTactics", data)
   },
   SaveBusinessTime(data) { //保存烤制时间段
     return http.post("/deviceinfo/saveBusinessTime", data)
   },
   Hotplate(data) { //获取烤盘数据
     return http.get("/deviceinfo/hotplate", data)
   },
   DeviceList(data) { //设备列表
     return http.get("/nav/deviceList", data)
   },
   SelectWaste(data) { //获取废弃信息
     return http.get("/deviceinfo/v2/selectWaste", data)
   },
   WasteSave(data) { //上报废弃信息formData
     return http.post("/deviceinfo/wasteSave", data)
   },
   SuppleList(data) { //补货记录
     return http.get("/nav/suppleList", data)
   },
   Gettemperature(data) { //温度信息
     return http.get("/deviceinfo/gettemperature", data)
   },
   Getalarmlist(data) { //单个设备报警列表
     return http.get("/deviceinfo/getalarmlist", data)
   },
   Getdeviceinfo(data) { //设备信息
     return http.get("/deviceinfo/getdeviceinfo", data)
   },
   Pubcmd(data) { //MQTT命令下发
     return http.post("/command/pubcmd", data)
   },
   OrderList(data) { //订单列表
     return http.get("/deviceinfo/orderList", data)
   },
   GetOrderVideo(data) { //获取订单列表故障视频
     return http.get("/command/getOrderVideo", data)
   },
   Qrcodelogin(data) { //通过扫一扫登录
     return http.post("/userinfo/qrcodelogin", data)
   },
   Wechatjsapi(data) { //获取微信公众号jsapi的签名信息
     return http.post("/userinfo/wechatjsapi", data)
   },
   Changepw(data) { //修改密码
     return http.post("/userinfo/changepw", data)
   },
   GetReserveEnable(data) { //查询预烤设置
     return http.get("/deviceinfo/getReserveEnable", data)
   },
   SaveReserveEnable(data) { //保存预烤设置
     return http.get("/deviceinfo/saveReserveEnable", data)
   },

   //  新修改
   GetCalander(data) { //日历复现日期
     return http.get("/tactics/calander", data)
   },
   GetDate(data) { //获取指定日期的烤制策略
     return http.get("/tactics/date", data)
   },
   Business(data) { //保存营业时间
     return http.post("/tactics/business", data)
   },
   SaveAll(data) { //保存烤制策略
     return http.post("/tactics/save", data)
   },
   Cities(data) { //查询城市列表
     return http.post("/tactics/cities", data)
   },
   Points(data) { //查询复制策略时的可选择点位 
     return http.get("/tactics/points", data)
   },
   CopyStrategy(data) { //复制一台设备某些天的策略 到 其它选择的设备 
     return http.post("/tactics/copy", data)
   },
   Using(data) { //设置烤管 启用/禁用 
     return http.post("/deviceinfo/using", data)
   },
   PoolList(data) { //工单池
     return http.post("/workOrder/poolList", data)
   },
   WorkOrderList(data) { //我的工单
     return http.post("/workOrder/orderList", data)
   },
   GetWorker(data) { //工单指派人列表
     return http.get("/workOrder/getWorker", data)
   },
   Init(data) { //角标
    return http.get("/workOrder/init", data)
  },
  Suspend(data) { //挂起
    return http.post("/workOrder/suspend", data)
  },
  Finish(data) { //完结
    return http.post("/workOrder/finish", data)
  },
  Assign(data) { //重新指派
    return http.post("/workOrder/assign", data)
  },
  WorkDetail(data) { //工单详情
    return http.get("/workOrder/detail", data)
  },
  Ensure(data) { //接单
    return http.get("/workOrder/ensure", data)
  },
  AlarmReason(data) { //报警原因
    return http.get("/workOrder/alarmReason", data)
  },
  GetSuggest(data) { //解决方案
    return http.get("/workOrder/getSuggest", data)
  },
  Spare(data) { //配件列表
    return http.get("/workOrder/spare", data)
  },
 }