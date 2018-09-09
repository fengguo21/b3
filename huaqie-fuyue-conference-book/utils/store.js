import { APP_ID } from './configs/authConfig.js';

export const appId = APP_ID;

export const get = key => wx.getStorageSync(`${APP_ID}-${key}`);

export const set = (key, value) => {
  wx.setStorageSync(`${APP_ID}-${key}`, value);
};

export const remove = (key) => {
  wx.removeStorageSync(`${APP_ID}-${key}`);
};

export const clear = () => {
  wx.clearStorageSync();
};