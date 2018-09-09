import axios from 'axios';
import { Message } from 'element-ui';
import * as store from './sdk/store';
import router from '../router';

export const get = (cmd, params) => {
  const newParams = { ...params };
  if (store.get('sessionId')) {
    newParams.token = store.get('sessionId');
  }
  newParams.appId = store.appId;
  return axios.get(cmd, {
    params: newParams,
  }).then((res) => {
    // console.log(typeof res.data.code);
    if (res.data.code === '20004') {
      Message.error('您的账号已在其他地方登陆');
      router.push('/login');
      return false;
    }
    if (res.data.code) {
      Message.error(res.data.message);
      return false;
    }
    return res.data.data;
  });
};
export const post = (cmd, params) => {
  const newParams = { ...params };
  if (store.get('sessionId')) {
    newParams.token = store.get('sessionId');
  }
  newParams.appId = store.appId;
  return axios.post(cmd, newParams).then((res) => {
    if (res.data.code === '20004') {
      Message.error('您的账号已在其他地方登陆');
      router.push('/login');
      return false;
    }
    if (res.data.code) {
      Message.error(res.data.message);
      return false;
    }
    return res.data.data;
  });
};
