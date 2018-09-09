const APP_ID = '5a2e3d78f8b1042a557cda05';


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