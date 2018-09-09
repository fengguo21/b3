<template>
	<div class="share">
		<div class="share-wrap">
			<p>老师会在阅读群里点评你的阅读，请你：</p>
			<p class='important'>
				①长按二维码加老师微信
			</p>

			<div class="share-qrcode">
				<span class='qrcode-img'>
					<img src="../assets/image/teacher-qrcode.png" />
				</span>
				<p>钟老师</p>
			</div>

			<p class='important'>
				②分享作品到朋友圈后，截图发给老师，老师会拉你进阅读群
			</p>

			<div class="share-btn" @click='shareGroup'>
				<div class="share-btn__img">
					<img class='position-center' src="../assets/image/wechat-group.png" />
				</div>
				分享试读作品到朋友圈
			</div>

			<p class="important">
				③再将作品发到阅读群，老师第二天就会统一进行点评啦~！
			</p>
			<i class='dash-border'></i>

			<div class="share-bottom">
				<div class="share-bottom__tip">
					<span class="share-bottom__left">
						<img src="../assets/image/buy-share-1.png" />
					</span>
					<span class="share-bottom__right">
						点击此处购买课程，解锁阅读计划，老师持续点评，一起将阅读进行到底，成为生活的一部分！
					</span>
				</div>
				<div class="share-bottom__btn" @click='buyCourse'>
					￥{{amount}}购买一年精读计划
				</div>
			</div>
		</div>

		<div class="share-mask" v-show='showMask' @click='closeMask'>
			<div class="share-mask__top">
				<img src="../assets/image/notbuy-share-1.png" />
				<p>1. 点击这里</p>
			</div>
			<div class="share-mask__middle">
				<p>2. 分享到朋友圈</p>
				<img src="../assets/image/notbuy-share-2.png" />
				<img class='mask-middle__circle' src="../assets/image/notbuy-share-3.png" />
			</div>
			<div class="share-mask__bottom">
				<p>3. 将截图发给老师</p>
				<img src="../assets/image/notbuy-share-4.png" />
			</div>
		</div>
	</div>
</template>

<script>
import { exgTitle } from '@/common/tool';
import { getCourseById, commitAudios, updateCourse } from '@/api/api';
import wx from 'weixin-js-sdk';
import * as store from '@/common/localStore';

const me = store.get('me');

export default {
	name: 'share',
	data() {
		return {
			amount: 0,
			type: '',
			showMask: false,
			feedId: '',
			productId: '',
			audios: null,
			imgUrl: '',
			times: '',
		};
	},
	methods: {
		// 购买课程
		buyCourse() {
			this.$router.push({
				name: 'projectBuy',
				query: {
					type: this.type,
					price: this.amount,
					productId: this.productId,
					feedId: this.feedId,
				}
			})
		},
		// 分享到朋友圈
		shareGroup() {
			// 点击后显示指定按钮
			wx.showMenuItems({
				menuList: [
					"menuItem:share:timeline",
					"menuItem:share:appMessage",
				]
			});
			this.showMask = true;
			// console.log('分享到朋友圈');
		},
		closeMask() {
			this.showMask = false;
		},
		getCourseById() {
			getCourseById({
				productId: this.productId,
			}).then(res => {
				if(res.code) {
					this.$toast(res.message);
					return;
				}
				const course = res.data.product.basic;
				this.amount = course.price;
			});
		},
		updataCourse(index, step = 3, upTime = true, cb) {
			const readTime = this.times / 1000;
			updateCourse({
				feedId: this.feedId,
				index: index,
				step: step,
				time: readTime,
			}).then(res => {
				if(res.code) {
					this.$toast(res.message);
					return ;
				}
				if(cb) {
					cb();
				}
			})
		},
	},
	created() {
		const query = this.$route.query;
		const title = query.title;
		const type = query.type;
		this.type = type;
		this.productId = query.productId;
		this.feedId = query.feedId;
		this.audios = JSON.parse(query.audios);
		this.imgUrl = query.imgUrl;
		this.times = query.times;
		document.title = exgTitle(title);
		this.getCourseById();
		// console.log(title);
	},
	mounted() {
		const title = `爱英语一年精读计划${ me ? me.basic.name : "" }第1天作品《${ document.title }》`;
		const shareUrl = `https://m.huaqie.com/ienglish/#/project-share?type=${ this.type }&index=0&feedId=${ this.feedId || '' }&appId=${ store.appId }&productId=${ this.productId }`;
		const imgUrl = this.imgUrl;
		wx.ready(() => {
			// 隐藏分享
			wx.hideMenuItems({
				menuList: [
					"menuItem:share:appMessage",
					"menuItem:share:timeline",
					"menuItem:share:qq",
					"menuItem:share:QZone"
				]
			})

			wx.onMenuShareTimeline({
			    title: title, // 分享标题
			    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			    imgUrl: imgUrl, // 分享图标
			    success: () => {
			    	// 用户确认分享后执行的回调函数
			    	const currentIndex = 0;
			    	// // 改变当前课时的状态
			    	this.updataCourse(currentIndex);

			    	commitAudios({
			    		feedId: this.feedId,
			    		index: 0,
			    		audios: this.audios,
			    	}).then(res => {
			    		if(res.code) {
			    			this.$toast(res.message);
			    			return ;
			    		}
			    		this.$router.go(-1);
			    		this.$toast('分享成功');
			    		this.closeMask();
			    	})
			    },
			    cancel: () => {
			        this.$toast('您取消了分享');
			    },
			});
			wx.onMenuShareAppMessage({
		    title: '爱英语一年精读计划', // 分享标题
		    desc: title, // 分享描述
		    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: imgUrl, // 分享图标
		    success: () => {
	        // 用户确认分享后执行的回调函数
	        const currentIndex = 0;
		    	// 改变当前课时的状态
		    	this.updataCourse(currentIndex);

		    	commitAudios({
		    		feedId: this.feedId,
		    		index: 0,
		    		audios: this.audios,
		    	}).then(res => {
		    		if(res.code) {
		    			this.$toast(res.message);
		    			return ;
		    		}
		    		this.$router.go(-1);
		    		this.$toast('分享成功');
		    		this.closeMask();
		    	})
		    },
		    cancel: () => {
	        // 用户取消分享后执行的回调函数
	        this.$toast('您取消了分享');
		    }
			});

		})
	},
}
</script>

<style lang='scss' scoped>
@import '../assets/css/public-share.scss';

.qrcode-img img {
	width: 100%;
}
</style>