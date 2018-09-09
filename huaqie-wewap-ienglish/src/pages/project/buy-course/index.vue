<template>
	<div class='buy-course'>
		<div class="form-wrap">
			<div class="form-item border-b">
				<span class='label'>计划名称</span>
				<span class='value'>{{name}}</span>
			</div>
			<div class="form-item border-b">
				<span class='label'>有效时间</span>
				<span class='value'>{{startDay}}至{{endDay}}</span>
			</div>
			<div class="form-item border-b">
				<span class='label'>价格</span>
				<span class='value'>{{price}}元</span>
			</div>
			<div class="form-item">
				<span class='label'>手机号</span>
				<span class='value'>
					<input type="number" v-model='phone' placeholder="请填写，用于老师联络您" />
				</span>
			</div>
		</div>

		<div class="form-btn__wrap" @click='buy'>
			<div class="form-btn">
				确认购买
			</div>
		</div>
	</div>
</template>
<script>
import moment from 'moment';
import { isPhone } from '@/common/tool';
import { Toast } from 'mint-ui';
import { buyCourse } from '@/api/api';

export default {
	name: 'project-buy-index',
	data() {
		return {
			feedId: '',
			productId: '',
			price: '',
			name: '',
			startDay: '',
			endDay: '',
			phone: '',
			type: '',
			avatar: '',
			courseList: [],
		};
	},
	methods: {
		// 用于改变标题，以适应微信头部
		filterTitle(type) {
			const typeStr = String(type);
			let title = '';
			switch (typeStr) {
				case '1': title = '0-6岁'; break;
				case '2': title = '6-12岁'; break;
				case '3': title = '12-18岁'; break;
				case '4': title = '成人'; break;
			}
			title += '一年精读计划';
			return title;
		},
		buy() {
			// 微信支付待接入
			if(!this.phone) {
				Toast('请填写手机号以方便老师联络您');
				return;
			}
			if(!isPhone(this.phone)) {
				Toast('请填写11位的大陆手机号');
				return;
			}
			buyCourse({
				channel: 'wepay.wap',
				productId: this.productId,
				feedId: this.feedId,
				phone: this.phone,
			}).then(res => {
				if(res.code) {
					Toast(res.message);
					return;
				}
				// console.log(res);
				this.callpay(res.data);
			})
			// console.log(this.productId, this.phone);

		},
		callpay(param){
		    if (typeof WeixinJSBridge == "undefined"){
		        if( document.addEventListener ){
		            document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
		        }else if (document.attachEvent){
		            document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);
		            document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
		        }
		    }else{
		        this.jsApiCall(param);
		    }
		},
		jsApiCall(param){
		    WeixinJSBridge.invoke(
		      'getBrandWCPayRequest',
		      param,
		      (res) => {
		          	if(!res.err_code && res.err_msg == 'get_brand_wcpay_request:ok'){
		              // actions.clearShoppingCart(this.$store)
		              // actions.setCoupon(this.$store, {});
		              	this.store.set('isFirstBuy' + this.type, true);
		              	this.$router.push({
		              		name: 'projectList',
		              		query: {
		              			type: this.type,
		              			productId: this.productId,
		              		},
		              	});
		          	}
		          	else if(res && res.err_msg == 'get_brand_wcpay_request:cancel')
		              	Toast('取消支付')
		          	else
		              	Toast('支付失败')
		      }
		    )
		},
	},
	beforeCreate() {
		document.title = '确认购买'
	},
	created() {
		const query = this.$route.query;
		const time = moment();
		this.startDay = time.format('YYYY年MM月DD日');
		this.endDay = time.add(365, 'days').format('YYYY年MM月DD日');
		this.price = query.price;
		this.type = query.type;
		this.productId = query.productId;
		this.feedId = query.feedId;
		this.name = this.filterTitle(query.type);
	},
};
</script>
<style lang='scss' scoped>
</style>