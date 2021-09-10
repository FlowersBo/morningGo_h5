import Mock from 'mockjs';
import permissionApi from './permission'
// 设置延时
Mock.setup({
    timeout: '200-1000'
})
// 接口
Mock.mock(/\/permission\/getMenu/, 'post', permissionApi.getMenu)
