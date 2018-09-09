<template>
	<div class="read">
		<audio-control :file='file'></audio-control>
		<read-swiper
			:imgUrl='imgUrl'
			:showController='showController'
			:isRecord='isShowRecord'
			@show='showRecord'
			@hide='hideRecord'
		></read-swiper>
		<record
			:btntext = 'btnText'
			:show = 'isShowRecord'
			:index = 'detail.index'
			:feedId = 'detail.feedId'
			@get-audio = 'putAudios'
		></record>

		<!-- @get-audio = 'putAudios' -->

		<div class="read-mask" v-show='showMask'>
			<div class="mask-msg__wrap position-center">
				<div class="mask-msg">
					<div class="mask-msg_text">
						<span class='msg-text__left'>
							恭喜你完成了今天的阅读👏，你本次共学习了
							<template v-if='studyHours'>
								<span>{{studyHours}}</span> 小时
							</template>
							<template v-if='studyMinutes'>
								<span>{{studyMinutes}}</span> 分钟
							</template>
							<template v-if='studySeconds'>
								<span>{{studySeconds}}</span> 秒
							</template>
							，戳戳右上角，立即分享到朋友圈，即可自动解锁下一课时~
						</span>
						<span class='msg-text__right'>
							<img class='position-center' src="../../../assets/image/buy-share-1.png" />
						</span>
					</div>

					<div class="mask-msg__img">
						<img src="../../../assets/image/buy-share-2.jpeg" />
					</div>
				</div>

				<div class="close-wrap">
					<img @click='closeMask' src="../../../assets/image/buy-share-3.png" />
				</div>
			</div>

		</div>
	</div>
</template>
<script>
import audioControl from '@/components/audio-control';
import readSwiper from '@/components/read-swiper';
import Record from '@/components/record';
import { commitAudios, updateCourse } from '@/api/api';
import moment from 'moment';
import * as store from '@/common/localStore';
import { exgTitle } from '@/common/tool';
import wx from 'weixin-js-sdk';

const src = require('@/assets/image/text-page.png');
const logo = require('@/assets/image/logo.jpg');
const me = store.get('me');

export default {
	name: 'project-detail-index',
	components: {
		audioControl,
		readSwiper,
		Record,
	},
	data() {
		return {
			type: '',
			startStudyTime: '',
			endStudyTime: '',
			studySeconds: 0,
			studyMinutes: 0,
			studyHours: 0,
			detail: null,
			file: '',
			isShowRecord: false,
			showController: true,
			btnText: '完成啦',
			imgUrl: [],
			showMask: false,
			postAudios: [],
		};
	},
	methods: {
		showRecord() {
			console.log('show record');
			this.isShowRecord = true;
		},
		hideRecord() {
			this.isShowRecord = false;
			console.log('hide record');
		},
		// 底部按钮事件
		comments() {
			if(this.btnText == '免费请老师点评') {
				this.freeEvent();
			} else {
				this.buyEvent();
			}
		},
		// 关闭蒙层
		closeMask() {
			this.showMask = false;
		},
		// 购买后的事件
		buyEvent() {
			// 点击后显示指定按钮
			wx.showMenuItems({
				menuList: [
					"menuItem:share:timeline",
					"menuItem:share:appMessage",
				]
			});
			this.endStudyTime = moment().valueOf();
			const timeDuration = moment.duration(this.endStudyTime - this.startStudyTime);
			this.studySeconds = timeDuration.seconds();
			this.studyMinutes = timeDuration.minutes();
			this.studyHours = timeDuration.hours();
			this.showMask = true;
		},
		// 免费事件
		freeEvent() {
			this.endStudyTime = moment().valueOf();
			const times = this.endStudyTime - this.startStudyTime;
			this.$router.push({
				name: 'share',
				query: {
					type: this.type,
					title: this.detail.title,
					audios: JSON.stringify(this.postAudios),
					productId: this.detail.productId,
					feedId: this.detail.feedId,
					imgUrl: this.imgUrl[0].url,
					times: times,
				},
			})
			// console.log('comments' + this.btnText);
		},
		putAudios(val) {
			this.postAudios = [];
			if(val.localSave.length <= 0) {
				this.$toast('您的本地录音为空！');
				return;
			}
			val.localSave.forEach(item1 => {
				val.localAudio.forEach(item2 => {
					if(item1.localId == item2.localId) {
						this.postAudios.push({
							duration: item1.duration,
							time: item1.time,
							audio: item2.audio,
						});
					}
				});
			})
			this.comments();
		},
		updataCourse(index, step = 3, upTime = true, cb) {
			const readTime = (this.endStudyTime - this.startStudyTime) / 1000;
			updateCourse({
				feedId: this.detail.feedId,
				index: index,
				step: step,
				time: upTime ? readTime : '',
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
		const isFree = this.$route.query.isFree;
		const type = this.$route.query.type;
		const val = JSON.parse(this.$route.query.msg);
		const title = val.title;
		document.title = exgTitle(title);
		// console.log(val);
		this.file = val.audio;
		this.imgUrl = val.images;
		this.detail = val;
		// console.log(val);
		this.startStudyTime = moment().valueOf();
		this.type = type;
		// console.log(this.startStudyTime);
		if(isFree) {
			this.btnText = '免费请老师点评';
		}
	},
	mounted() {
		const days = moment().diff(moment(this.detail.created), 'days') + 1;
		const title = `爱英语一年精读计划${ me ? me.basic.name : "" }第${ days }天作品《${ document.title }》`;
		const shareUrl = `https://m.huaqie.com/ienglish/#/project-share?type=${ this.type }&index=${ this.detail.index }&feedId=${ this.detail.feedId || '' }&appId=${ store.appId }&productId=${ this.detail.productId }`;
		// const shareUrl = `http://localhost:8080/#/project-share?type=${ this.type }&index=${ this.detail.index }&feedId=${ this.detail.feedId || '' }&appId=${ store.appId }&productId=${ this.detail.productId }`;
		const imgUrl = this.imgUrl[0].url;
		// console.log(shareUrl);
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
			    	const currentIndex = parseInt(this.detail.index);
			    	// 改变当前课时的状态
			    	this.updataCourse(currentIndex, undefined, undefined, () => {
			    		// 改变下一课时的状态
			    		this.updataCourse((currentIndex + 1), 2, false);
			    	});

			    	commitAudios({
			    		feedId: this.detail.feedId,
			    		index: this.detail.index,
			    		audios: this.postAudios,
			    	}).then(res => {
			    		if(res.code) {
			    			this.$toast(res.message);
			    			return ;
			    		}
			    		this.$router.go(-1);
			    		this.$toast('分享成功');
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
	        const currentIndex = parseInt(this.detail.index);
	        // 改变当前课时的状态
	        this.updataCourse(currentIndex, undefined, undefined, () => {
	        	// 改变下一课时的状态
	        	this.updataCourse((currentIndex + 1), 2, false);
	        });
	        commitAudios({
	        	feedId: this.detail.feedId,
	        	index: this.detail.index,
	        	audios: this.postAudios,
	        }).then(res => {
	        	if(res.code) {
	        		this.$toast(res.message);
	        		return ;
	        	}
	        	this.$router.go(-1);
	        	this.$toast('分享成功');
	        })
		    },
		    cancel: () => {
	        // 用户取消分享后执行的回调函数
	        this.$toast('您取消了分享');
		    }
			});

		})
	},
};
</script>
<style lang='scss' scoped>
.read {
	width: 100%;
	height: 100vh;
	overflow: hidden;
	transform: translate3d(0, 0, 0);
}

.read-mask {
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: rgba(0, 0, 0, .6);
	position: fixed;
	z-index: 999;
	top: 0;
	left: 0;
	box-sizing: border-box;
	padding: 0 .2rem;

	.mask-msg__wrap {
		width: calc(100% - .4rem);
	}

	.mask-msg {
		width: 100%;
		background: #fff;
		border-radius: .16rem;

		.mask-msg_text {
			padding: .4rem .2rem;
			font-size: .3rem;
			// line-height: 1.5;
			display: flex;

			.msg-text__left {
				flex: 1;

				span {
					color: #ff6666;
					font-size: .38rem;
				}
			}

			.msg-text__right {
				width: 1.2rem;
				overflow: hidden;
				position: relative;

				img {
					margin: 0 auto;
					width: 110%;
				}
			}
		}

		.mask-msg__img {
			overflow: hidden;
			padding: .1rem 0 .3rem;

			img {
				width: 100%;
			}
		}
	}

	.close-wrap {
		padding: .32rem 0;

		img {
			margin: 0 auto;
			width: 1.1rem;
		}
	}
}
</style>