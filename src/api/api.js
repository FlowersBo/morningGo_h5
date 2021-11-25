import axios from 'axios'
// import {
// 	Message
// } from 'element-ui'

// 域名地址
axios.defaults.baseURL = 'https://w3.morninggo.cn';
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
	if (result.data.code && result.data.code != 200) {
		// Message.error({
		// 	message: result.data.msg
		// });
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
			default:
				err.message = `登录凭证过期,请重新登录!`;
		}
	} else {
		err.message = '连接服务器失败!'
	}

	// Message.error({
	// 	message: err.message
	// })
	return Promise.resolve(err);
})

// 接口域名
export const url = axios.defaults.baseURL;

// POST 方法封装 (处理参数与文件上传)
export const postRequest = (url, params) => {
	return axios({
		method: 'post',
		url: url,
		data: params
	});
}

//  GET 方法封装
export const getRequest = (url, params) => {
	return axios({
		method: 'get',
		url: url,
		params: params
	});
}

//  PUT 方法封装
export const putRequest = (url, params) => {
	return axios({
		method: 'put',
		url: url,
		data: params
	});
}

//  DELETE 方法封装
export const deleteRequest = (url, params) => {
	return axios({
		method: 'delete',
		url: url,
		data: params
	});
}