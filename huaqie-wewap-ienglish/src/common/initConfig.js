import * as store from './localStore';
import wx from 'weixin-js-sdk';
import { MessageBox, Toast } from 'mint-ui';
import { getSessionId, getWechatConfig, getAuthUrl, getPeople, signIn } from '../api/api'
import queryString from 'query-string'
import bus from '../bus'

let local = window.location.href;
const url = local.match(/\?/g)
			?
			(local.split('?')[0].match(/#/g)
			?
			local.split('?')[0].split('#')[0]
			:
			local.split('?')[0])
			:
			local.split('#')[0];

const modeList = ['chooseImage', 'uploadImage', 'startRecord', 'stopRecord', 'playVoice', 'stopRecord', 'onVoicePlayEnd', 'uploadVoice', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems', 'showMenuItems'];

const initConfig = (res) => {
	console.log(res);
	const options = {
		debug: false,
	    appId: res.data.appId, // 必填，公众号的唯一标识
	    timestamp: res.data.timestamp, // 必填，生成签名的时间戳
	    nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
	    signature: res.data.signature, // 必填，签名，见附录1
	    jsApiList: modeList,
	}
	// console.log(`options=====`, options);
	wx.config(options);
	// ready
	wx.ready((res) => {

	})
	// error
	wx.error((res) => {

	})
}

const getSession = (code, cb) => {
	return getSessionId({}).then(res => {
		// console.log('get sessionId', res.data);
		store.set('sessionId', res.data);
		// console.log('cb', cb);
		if(cb) {
			cb(res, code || '');
		}
		return new Promise((resolve) => {
			resolve(res.data);
		});
	})
}

const getConfig = (cb) => {
	console.log(url,'====ren')
	getWechatConfig({
		url: url,
	}).then(res => {
		// console.log(res);
		if(cb) {
			cb(res);
		}
	})
}

const getApp = (data, code) => {
	if(data.code === 0) {
	  	store.set('sessionId', data.data);
	  	signIn({
	  		sessionId: data.data,
      	code: code,
	  	}).then(res => {
	  		if(res.code === 0) {
	  			store.set('lastCode', code);
	  			store.set('logined', 1);
	  			store.set('me', res.data.people);
	  			store.set('sessionId', res.data.sessionId);
	  			bus.$emit('refresh');
	  			// 重定向本地路径，去除code，用于配置weixin-jssdk
	  			const reLocal = window.location.href;
	  			const reLocalArr = reLocal.split('?');
	  			console.log(reLocalArr.length);
	  			if (reLocalArr.length >= 2 && reLocalArr[1].match(/#/g)) {
	  			  const hashRoute = reLocalArr[1].split('#')[1];
	  			  const queryRoute = reLocalArr[2] ? `?${reLocalArr[2]}` : '';
	  			  console.log('new href========', `${reLocalArr[0]}#${hashRoute}${queryRoute}`);
	  			  window.location.href = `${reLocalArr[0]}#${hashRoute}${queryRoute}`;
	  			  MessageBox('提示', '登录成功');
	  			}
	  		} else {
	  			MessageBox('提示', '登录失败')
	  		}
	  	})
	} else {
		Toast(data.message);
	}
}

export const init = () => {
	if(!store.get('sessionId')) {
		getSession().then(() => {
			// console.log('get session success');
			getConfig( res => initConfig(res) );
		});
	} else {
		getConfig( res => initConfig(res) );
	}
}

export const wxLogin = () => {
	const code = queryString.parse(location.search).code;
	if(!code && !store.get('logined')) {
		getAuthUrl({}).then(res => {
	      // console.log(res);
    	if(res.code === 0) {
      	window.location.href = res.data;
    	} else {
      	MessageBox('提示', '认证出错');
    	}
    })
	}else if(code && code !== store.get('lastCode')) {
		getSession(code, (res, code) => getApp(res, code))
	}
}


