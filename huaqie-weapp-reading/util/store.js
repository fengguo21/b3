const APP_ID = '5a0aac4bf8b1042a557cd9d9';

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