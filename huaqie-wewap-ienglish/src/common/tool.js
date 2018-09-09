// 格式化播放时间
export const convertTimeHHMMSS = (val) => {
	let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
	return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss;
}
// 深复制数组
export const deepClone = (arr1, arr2) => {
	let deepNewArr = null;
	let DEEP_ARR_1 = JSON.parse(JSON.stringify(arr1));
	let DEEP_ARR_2 = JSON.parse(JSON.stringify(arr2||[]));
	if(typeof DEEP_ARR_1 == 'object' && typeof DEEP_ARR_2 == 'object') {
		if(DEEP_ARR_1 instanceof Array && DEEP_ARR_2 instanceof Array) {
			deepNewArr = DEEP_ARR_1.concat(DEEP_ARR_2);
		} else {
			throw new Error('parameter must be Array!');
		}
		return deepNewArr;
	} else {
		throw new Error('parameter must be Object!');
	}
}
// 正则过滤文章标题
export const exgTitle = (title) => {
	return title.match(/(《)((\w+)\s\w)+(》)/g) 
			? title
			   .match(/(《)((\w+)\s\w)+(》)/g)[0]
			   .match(/\w+/g).join(' ')
			: title;
}

// 正则判断是否为正确的手机号
export const isPhone = (phone) => {
	const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[3678])[0-9]{8}$/;
	return reg.test(phone) ? true : false;
}