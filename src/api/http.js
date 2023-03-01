import axios from 'axios'
import store from '../store/index'
import router from '../router/index'
// let qs = require('querystring')
import qs from 'qs'
import helper from './helper'
import {
	Toast
} from 'vant';

// let baseUrl = '';
// let routerMode = 'history';
// let DEBUG = false;
// if (process.env.NODE_ENV == 'testing') {
// 	// baseUrl = "http://devops.morninggo.cn/";
// 	// baseUrl = "http://w3.waneyes.com";
// 	baseUrl = "http://192.168.110.97:8080/app-http/";
// 	DEBUG = false;
// } else if (process.env.NODE_ENV == 'production') {
// 	// baseUrl = "http://devops.morninggo.cn/";
// 	// baseUrl = "http://w3.waneyes.com";
// 	baseUrl = "http://192.168.110.97:8080/app-http/";
// 	DEBUG = false;
// }else{
// 	baseUrl = "http://w3.morninggo.cn/";
// }

// let root = baseUrl;
let root = '/apis';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//  REQUEST 请求异常拦截
axios.interceptors.request.use(config => {
	console.log(config.url);
	if (config.url == '/deviceinfo/wasteSave') {
		config.headers.post["Content-Type"] = "multipart/form-data"
	}else{
		config.headers.post["Content-Type"] = "application/json"
	}
	// 将Token添加到请求头里面
	// config.headers['app-refresh-token'] = 'A';
	// token && (config.headers.Token = token);
	return config;
}, err => {
	// 错误处理
	Toast('请求超时!');
	return Promise.resolve(err);
	// return Promise.error(err);
});

//  RESPONSE 响应异常拦截
axios.interceptors.response.use(result => {
	const that = this;
	console.log("请求成功");
	if (result.status === 200) {
		store.state.isLoading = false;
		switch (result.data.code) {
      case 0:
        Toast(result.data.msg);
				break;
			case 401:
				localStorage.removeItem('token');
				localStorage.removeItem('userInfoLocal');
				console.log("请求成功401");
				router.push({
					name: 'Login'
				})
				break;
			case 403: //请求禁止,跳转到登录页面
				console.log("请求成功403");
				router.push({
					name: 'Login'
				})
				break;
		}
	}
	return result;
}, err => {
	store.state.isLoading = false;
	Toast('请求失败');
	if (err && err.response) {
		switch (err.response.status) {
			case 401:
				break;
			case 402:
				err.message = '请求参数错误!';
				break;
			case 403: //请求禁止,跳转到登录页面
				console.log('跳页面')
				// router.push({
				// 	name: 'Login'
				// })
				err.message = '请求停止!';
				break;
			default:
				err.message = `登录凭证过期,请重新登录!`;
				// router.push({
				// 	name: 'Login'
				// })
				store.state.isLoading = false;
				Toast('请求失败');
		}
		// 非法进入时直接跳到登录页
		window.kk = '/';
		return;
	} else {
		err.message = '连接服务器失败!'
	}
	// return Promise.resolve(err);
	return Promise.reject(err);
})

function apiAxios(method, url, params, token) {
	store.state.isLoading = true;
	if (url === '/deviceinfo/wasteSave') {
		let formData = params.formData;
		return axios({
			method: method,
			//拼接参数
			url,
			data: formData,
			baseURL: root,
			timeout: 20000,
			headers: {
				"mg-access-token": JSON.parse(localStorage.getItem('token')),
				"Content-Type": 'multipart/form-data',
			}, //jwt
			withCredentials: false
		})
	}else if(url === '/tactics/business'||url === '/tactics/save'||url==='/tactics/cities'||
	url==='/tactics/copy'||url==='/workOrder/poolList'||url==='/workOrder/orderList'||url==='/workOrder/getWorker'||
	url==='/workOrder/suspend'||url==='/workOrder/finish'||url==='/workOrder/assign'){
		if (params) {
			params = helper.filterNull(params)
		}
		return axios({
			method: method,
			//拼接参数
			url: method === 'GET' || method === 'DELETE' ? helper.queryString(url, params) : url,
			data: method === 'POST' || method === 'PUT' ? params : null,
			baseURL: root,
			timeout: 10000,
			headers: {
				"mg-access-token": JSON.parse(localStorage.getItem('token')),
				"Content-Type": 'application/json',
			}, //jwt
			withCredentials: false
		})
	} else {
		if (params) {
			params = helper.filterNull(params)
		}
		return axios({
			method: method,
			//拼接参数
			url: method === 'GET' || method === 'DELETE' ? helper.queryString(url, params) : url,
			data: method === 'POST' || method === 'PUT' ? qs.stringify(params) : null,
			baseURL: root,
			timeout: 10000,
			headers: {
				// Authorization: `Bearer ${token}`
				"mg-access-token": JSON.parse(localStorage.getItem('token')),
				"Content-Type": 'application/x-www-form-urlencoded',
			}, //jwt
			withCredentials: false
		})
	}
}

// 返回在vue模板中的调用接口
export default {
	get: function (url, params) {
		return apiAxios('GET', url, params)
	},
	post: function (url, params) {
		return apiAxios('POST', url, params)
	},
	put: function (url, params, token) {
		return apiAxios('PUT', url, params, token)
	},
	delete: function (url, params, token) {
		return apiAxios('DELETE', url, params, token)
	},
}