import axios from 'axios'
import router from '../router/index' 
let qs = require('querystring')
import helper from './helper'
let root = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//  REQUEST 请求异常拦截
axios.interceptors.request.use(config => {
	const token = localStorage.getItem('token'); //取
	// localStorage.setItem('app-refresh-token',JSON.stringify(A)); //存

	// 将Token添加到请求头里面
	// config.headers['app-refresh-token'] = 'A';
	token && (config.headers.Token = token);
	return config;
}, err => {
	// 错误处理
	// Message.error({
	// 	message: '请求超时!'
	// });
	return Promise.resolve(err);
});

//  RESPONSE 响应异常拦截
axios.interceptors.response.use(result => {
	const that = this;
	console.log(result);
	if (result.data.code && result.data.code != 200) {
		switch (result.data.code) {
			case 401:
				break;
			case 402:
				break;
			case 403: //请求禁止,跳转到登录页面
			console.log('跳页面')
			router.push({
				name: 'Login'
			})
				break;
			default:
		}
		// 非法进入时直接跳到登录页
		window.kk = '/';
		return;
	};
	return result;
}, err => {
	if (err && err.response) {
		switch (err.response.status) {
			case 401:
				err.message = '请求方式错误!';
				break;
			case 402:
				err.message = '请求参数错误!';
				break;
			case 403: //请求禁止,跳转到登录页面
				err.message = '请求停止!';
				break;
			default:
				err.message = `登录凭证过期,请重新登录!`;
		}
	} else {
		err.message = '连接服务器失败!'
	}
	return Promise.resolve(err);
	// return Promise.reject(err);
})

function apiAxios(method, url, params, token) {
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
			Authorization: `Bearer ${token}`
		}, //jwt
		withCredentials: false
	})
}

// 返回在vue模板中的调用接口
export default {
	get: function (url, params, token) {
		return apiAxios('GET', url, params, token)
	},
	post: function (url, params, token) {
		return apiAxios('POST', url, params, token)
	},
	put: function (url, params, token) {
		return apiAxios('PUT', url, params, token)
	},
	delete: function (url, params, token) {
		return apiAxios('DELETE', url, params, token)
	},
}