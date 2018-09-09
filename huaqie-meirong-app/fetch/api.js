(function(window) {
	var u = {};
	// var appId = store.get('app')?store.get('app').appId:"";
	// api 通用路径
	var base = 'https://g2.huaqie.com/cloud';
	// 图片上传路径
	var avatarUrl = "https://g2.huaqie.com/cloud/app/upload";

	var get = function(cmd, params, cb) {
		params.sessionId = store.get('sessionId');
		params.appId = store.get('app') ? store.get('app').appId : "";
		return axios.get(base+cmd, { params: params })
		.then(function (res) {
			if(res.data.code){
                api.toast({
				    msg: res.data.message
				});
                return;
            }
            cb(res.data);
		})
		// .catch(function (error) {
		//     api.toast({
		// 		    msg: '网络出错，请稍后重试'
		// 		});
		// });
	}
	var post = function(cmd, params, cb) {
		params.sessionId = store.get('sessionId');
		params.appId = store.get('app') ? store.get('app').appId : "";
		return axios.post(base+cmd, params).then(function (res) {
			if(res.data.code){
                api.toast({
				    msg: res.data.message
				});
                return;
            }
            cb(res.data);
		})
		// .catch(function (error) {
		//     api.toast({
		// 	      msg: '网络出错，请稍后重试'
		// 	 	});
		// });
	}
	u.getSessionId = function(params, cb) { return get('/account/sessionId', params, cb) }
	u.uploadAvatar = function(params, cb) { return post('/app/upload', params, cb) }
	u.signIn = function(params, cb) { return post('/account/signInByPhone', params, cb) }
/****************************************** 服务相关 *****************************************/
	// 服务的增删改
	u.createService = function(params, cb) { return post('/hyb/createService', params, cb) }
	u.updateService = function(params, cb) { return post('/hyb/updateService', params, cb) }
	u.removeService = function(params, cb) { return post('/hyb/removeService', params, cb) }

	// 获取服务列表
	u.getServiceList = function(params, cb) { return get('/hyb/findServiceByState', params, cb) }

/****************************************** 会员卡相关 *****************************************/
	// 会员卡增删改
	u.createCard = function(params, cb) { return post('/hyb/createCard', params, cb) }
	u.updateCard = function(params, cb) { return post('/hyb/updateCard', params, cb) }
	u.removeCard = function(params, cb) { return post('/hyb/removeCard', params, cb) }

	// 获取会员卡模板列表
	u.getCardList = function(params, cb) { return get('/hyb/findCardByState', params, cb) }
	// 通过ID获取会员卡模板列表
	u.getCardById = function(params, cb) { return get('/hyb/findCardById', params, cb) }
	// 通过ID获取会员卡
	u.getMemberById = function(params, cb) { return get('/hyb/findMemberById', params, cb) }
	// 会员开卡
	u.updateMemberCard = function(params, cb) { return post('/hyb/updateMember', params, cb) }

/****************************************** 通知相关 *****************************************/
	// 获取所有通知
	u.getNotifyList = function(params, cb) { return get('/notify/findByState', params, cb) }
	// 根据ID获取通知
	u.getNotifyById = function(params, cb) { return get('/notify/findById', params, cb) }
	// 根据ID删除通知
	u.removeNotify = function(params, cb) { return post('/notify/remove', params, cb) }
	//清零未读数
	u.clearUnread = function(params, cb) { return post('/notify/clearUnread', params, cb) }
	// 获取未读消息数量
	u.getUnreadNotify = function(params, cb) { return get('/notify/findUnreadByPeopleId', params, cb) }
	// 阅读消息
	u.readNotify = function(params, cb) { return post('/notify/read', params, cb) }

/****************************************** 员工相关 *****************************************/
	// 获取员工
	u.getMemberList = function(params, cb) { return get('/hyb/findRoleByState', params, cb) }
	//获取业绩详情
	u.getMemberItem = function(params, cb) { return get('/hyb/findEventByState', params, cb) }
	// 新增员工
	u.addMember = function(params, cb) { return post('/people/createRole', params, cb) }
	// 编辑员工
	u.updateMember = function(params, cb) { return post('/people/updateRole', params, cb) }
	// 删除员工
	u.removeMember = function(params, cb) { return post('/people/cancelRole', params, cb) }

/****************************************** 用户相关 *****************************************/
	// 更新个人信息
	u.updateUser = function(params, cb) { return post('/people/update', params, cb) }
	// 重置密码
	u.updatePassword = function(params, cb) { return post('/account/updatePassword', params, cb) }

/****************************************** 记账相关 ************************************/
	//获取账单报告
	u.getDietList = function(params, cb) { return get('/hyb/findBillReportByState', params, cb)}
	u.getDietItem = function(params, cb) { return get('/hyb/findBillByState', params, cb)}

	u.markAccount = function(params, cb) { return post('/hyb/createBill', params, cb)}
/****************************************** 会员相关 ************************************/
	// 获取会员列表
	u.getVipList = function(params, cb) { return get('/hyb/findPeopleByState', params, cb)}
	u.getVipInfo = function(params, cb) { return get('/people/findById', params, cb)}
	u.getVipConsume = function(params, cb) { return get('/hyb/findEventByState', params, cb)}
	u.getVipCard = function(params, cb) { return get('/hyb/findMemberByState', params, cb)}
	u.getCardConsumeList = function(params, cb) { return get('/hyb/findEventByState', params, cb)}
	u.prebook = function(params, cb) { return post('/hyb/prebook', params, cb)}

/****************************************** code相关 ************************************/
	// 获取开卡码
	u.getOpenCode = function(params, cb) {return get('/hyb/findCreateCardWeappQrCodeById', params, cb)}
	// 获取服务码
	u.getServerCode = function(params, cb) {return get('/hyb/findChooseCardWeappQrCodeById', params, cb)}

/****************************************** 预约相关 ************************************/
	// 获取预约数量
	u.getPrebookCount = function(params, cb) { return get('/hyb/findPrebookCountByPeopleId', params, cb)}
	// 获取某天预约
	u.getPrebookList = function(params, cb) { return get('/hyb/findPrebookByState', params, cb)}

/****************************************** 美容师相关 ************************************/
	u.getServerPeople = function(params, cb) { return get('/people/findById', params, cb)}

/****************************************** 报表相关 ************************************/
// 会员报表
/**
*参数：sessionId, appId, channel(service:项目，consume：到店率), total:(1,所有，选填)，year：（‘YYYY’,选填），month（‘YYYY-MM’,选填）,dates(['YYYY-MM-DD', 'YYYY-MM-DD'], 日期区间，选填)
*/
	u.getPeopleReport = function(params, cb) { return get('/hyb/findPeopleReport', params, cb) }
// 员工报表
/**
*参数：sessionId, appId, channel(card:开卡，consume：服务), total:(1,所有，选填)，year：（‘YYYY’,选填），month（‘YYYY-MM’,选填）,dates(['YYYY-MM-DD', 'YYYY-MM-DD'], 日期区间，选填)
*/
	u.getRoleReport = function(params, cb) { return get('/hyb/findRoleReport', params, cb) }
// 今日报表
/**
*参数：sessionId, appId, date('YYYY-MM-DD')
*/
	u.getReport = function(params, cb) { return get('/hyb/findReport', params, cb) }
/****************************************** 工作表相关 ************************************/
// 某月工作时段
	u.getMonthWorkTime = function(params, cb) { return get('/hyb/findWorkTimeByMonth', params, cb) }
	// 设置工作时间
	u.setWorkTime = function(params, cb) { return post('/hyb/setupWorkTime', params, cb) }
/****************************************** 服务日志相关 ***********************************/
	// 填写服务日志
	u.updateProfile = function(params, cb) { return post('/hyb/updateProfile', params, cb) }
	// 获取服务日志
	u.getProfile = function(params, cb) { return get('/hyb/findEventByState', params, cb) }
/****************************************** 商城相关 ***********************************/
	//新增商品
	u.createProduct = function(params, cb) { return post('/product/create', params, cb) }
	//获取商品列表
	u.getShopList = function(params, cb) { return get('/product/findByState', params, cb) }
	//删除商品
	u.deleteProduct = function(params, cb) { return post('/product/remove', params, cb) }
	//修改商品
	u.updateProduct = function(params, cb) { return post('/product/update', params, cb) }
	//获取单个商品
	u.getProduct = function(params, cb) { return get('/product/findById', params, cb) }
/****************************************** 订单相关 ***********************************/
	u.createServiceOrder = function(params, cb) { return post('/order/createService', params, cb) }
	u.paymentWechatMicroPay = function(params, cb) { return post('/payment/wechatMicroPay', params, cb) }
	u.paymentAlipayMicroPay = function(params, cb) { return post('/payment/alipayMicroPay', params, cb) }
	u.getOrders = function(params, cb) { return get('/order/findByState', params, cb) }
/****************************************** 应用相关 ***********************************/
	u.getApp = function(params, cb) { return get('/app/findById', params, cb) }
	u.updatePromotePeriod = function(params, cb) { return post('/hyb/updatePromotePeriod', params, cb) }

// export
	window.ajax = u ;
})(window);