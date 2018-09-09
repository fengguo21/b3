<template>
	<div class="record" :class='{ open: show }'>
		<div class="record-wrap">
			<div class="record-btn__wrap">
				<span class='record-time' v-show='startRecord'>{{recordTime}}</span>
				<span class='position-center record-btn' @click='changeRecord'>
					<template v-if='!startRecord'>
						<img class='record-icon' src="../assets/image/mike.png">
					</template>
					<template v-else>
						<img class='stop-icon' src="../assets/image/mike-stop.png">
					</template>
					<span>{{text}}</span>
				</span>
			</div>
			<div class="record-list">
				<ul class="record-list__wrap">
					<li class="record-list__item"
						v-for='(item, index) in totalVoice'
						v-infinite-scroll="loadMore"
						:infinite-scroll-disabled="loading"
						:infinite-scroll-distance="size"
					>
						<img
							class='record-delete'
							src="../assets/image/delete.png"
							v-if='item.isLocal'
							@click='deleteVoice(item.time)'
						/>
						<div class="msg-box">
							<span class="msg-duration">{{item|filterTime}}</span>
							<div class="msg-item"
								:style='{width: (1 + 2 / 60 * item.duration) + "rem"}'
								@click='runVoice(item, index)'
							>
								<img v-show='item.isRun' :src="voiceRun" />
								<img v-show='!item.isRun' :src="voice" />
							</div>
							<span class='triangle'></span>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<bottom-fix @handle-click='comments' v-show='show'>
			<template slot='title'>{{btntext}}</template>
		</bottom-fix>
	</div>
</template>

<script>
import bottomFix from '@/components/bottom-fix';
import { convertTimeHHMMSS, deepClone } from '@/common/tool';
import { getAudios, uploadWechatFile } from '@/api/api';
import moment from 'moment';
import * as store from '@/common/localStore';
import wx from 'weixin-js-sdk';
import bus from '@/bus';

const voice = require('@/assets/image/voice.png');
const voiceRun = require('@/assets/image/voice.gif');

// const initTime = convertTimeHHMMSS(0);

export default {
	name: 'record',
	components: { bottomFix, },
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		btntext: {
			type: [String, Number],
		},
		feedId: {
			type: String,
		},
		index: {
			type: [String, Number],
		},
	},
	filters: {
		filterTime(data) {
			return convertTimeHHMMSS(data.duration);
		},
	},
	data() {
		return {
			startRecord: false,
			startTime: 0,
			recordTime: '00:00',
			timer: null,
			voice,
			voiceRun,
			totalServer: [],
			serverVoice: [],
			localVoice: [],
			readyToPut: [],
			page: 1,
			size: 15,
			total: 0,
			loading: false,
			// {
			// 	time: 12312312,
			// 	duration: 60,
			// 	isRun: false,
			// 	isLocal: true,
			// },
			// {
			// 	time: 2123123,
			// 	duration: 40,
			// 	isRun: false,
			// 	isLocal: true,
			// }
		};
	},
	watch: {
		show() {
			this.endRecord();
		},
	},
	computed: {
		text() {
			return this.startRecord?
				   '停止'
				   :
				   '录音';
		},
		totalVoice() {
			return deepClone(this.serverVoice, this.localVoice);
		},
	},
	methods: {
		loadMore() {
			this.loading = true;
			if(this.page * this.size > this.total) {
				this.loading = false;
			} else {
				this.page += 1;
				this.spliceList();
				this.loading = false;
			}
		},
		getAudios() {
			getAudios({
				feedId: this.feedId,
				index: this.index,
				page: 1,
				size: 1,
			}).then(res => {
				// console.log(res);
				if(res.code) {
					this.$tosat(res.message);
					return;
				}
				const list = res.data.list;
				// console.log(res.data);
				if(list.length > 0) {
					this.total = list[0].basic.audios.length;
					const audios = list[0].basic.audios;
					audios.forEach(item => {
						this.totalServer.push({
							audio: item.audio,
							time: item.time,
							duration: item.duration,
							isRun: false,
							isLocal: false,
							audioCon: null,
							timer: null,
						});
					});
					this.spliceList();
				} else {
					this.totalServer = [];
				}
			})
		},
		spliceList() {
			let slList = deepClone(this.totalServer).splice((this.page - 1) * this.size, this.page * this.size)
			if(this.page == 1) {
				this.serverVoice = slList;
			} else {
				this.serverVoice = this.serverVoice.concat(slList);
			}
		},
		comments() {
			this.$emit('handle-click');
			this.$emit('get-audio', {
				localAudio: this.readyToPut,
				localSave: this.localVoice,
			});
			this.endRecord();
			// console.log('comments')
		},
		// 记录时间
		startRecordTime() {
			clearInterval(this.timer);
			wx.startRecord();
			this.startRecord = true;
			this.startTime = 0;
			this.recordTime = convertTimeHHMMSS(0);
			this.timer = setInterval(() => {
				if(this.startTime >= 60) {
					clearInterval(this.timer);
					this.startRecord = false;
					this.endRecord();
					return;
				}
				this.startTime += 1;
				this.recordTime = convertTimeHHMMSS(this.startTime);
			}, 1000)
		},
		// 停止录音
		endRecord() {
			wx.stopRecord({
			    success: res => {
			    	// if(this.startTime <= 1) {
			    	// 	this.$toast('操作失败，录音时间过短');
			    	// 	return;
			    	// }
			    	// console.log('current do:: =============== ::');
		        const localId = res.localId;
		        if (localId) {
		        	// console.log('current id:: =============== ::', localId);
		        	this.recorded(localId);
		        }
			    }
			});
		},
		recorded(localId) {
			const nowTime = moment().valueOf();
			// this.localVoice.push({
			// 	audio: localId,
			// 	time: nowTime,
			// 	duration: this.startTime,
			// 	isRun: false,
			// 	isLocal: true,
			// });
			// alert('localVoice=======' + JSON.stringify(this.localVoice));
			if(this.timer) {
				clearInterval(this.timer);
				this.timer = null;
				this.recordTime = convertTimeHHMMSS(0);
				this.startRecord = false;
			};
			this.$indicator.open({
			  text: '请稍后...',
			  spinnerType: 'fading-circle'
			});
			wx.uploadVoice({
			    localId: localId,
			    isShowProgressTips: 0,
			    success: res => {
			        const serverId = res.serverId; // 返回音频的服务器端ID
			        uploadWechatFile({
			        	mediaId: serverId,
			        	typehood: 'audio',
			        }).then(res => {
			        	this.$indicator.close();
			        	if(res.code) {
			        		Toast(res.message);
			        		return;
			        	}
			        	this.localVoice.push({
			        		audio: res.data,
			        		localId: localId,
			        		time: nowTime,
			        		duration: this.startTime,
			        		isRun: false,
			        		isLocal: true,
			        	});
			        	this.readyToPut.push({
			        		localId: localId,
			        		serverId: serverId,
			        		audio: res.data,
			        	});
			        })
			    },
			    fail: res => {
			    	this.$indicator.close();
			    	this.$toast('uploadVoice failed 网络出错，请稍后重试');
			    }
			});
		},
		// 改变录音状态
		changeRecord() {
			const nowTime = moment().valueOf();
			const oldTime = store.get('recordCode');
			if (!oldTime) {
				store.set('recordCode', nowTime);
			} else {
				const diff = nowTime - oldTime;
				if (diff <= 1000 ) {
					this.$toast('操作失败，录音时间过短');
					return;
				}
				store.set('recordCode', nowTime);
			}
			this.startRecord = !this.startRecord;
			if(this.startRecord) {
				this.startRecordTime();
			} else {
				this.endRecord();
			}
		},
		// 删除现存语音
		deleteVoice(time) {
			let newArr = deepClone(this.localVoice);
			this.localVoice.forEach((item, index) => {
				if(item.time == time) {
					console.log(index);
					newArr.splice(index, 1);
				}
			})
			this.localVoice = deepClone(newArr);
		},
		// 遍历听信息
		changeVoiceStatu(arr, target) {
			arr.forEach((item, index) => {
				if(!item.audioCon) {
					item.audioCon = new Audio();
				}
				item.audioCon.volume = 1;
				if(item.time == target.time) {
					item.isRun = !item.isRun;
					if(item.isRun) {
						clearInterval(item.timer);
						item.audioCon.src = item.audio;
						item.audioCon.play();
						const start = moment().valueOf();
						item.timer = setInterval(() => {
							const nowTime = moment().valueOf();
							const currentTime = moment.duration(nowTime - start).seconds() - 1;
							if(currentTime >= item.duration) {
								clearInterval(item.timer);
								item.audioCon.pause();
								item.audioCon.currentTime = 0;
								item.isRun = false;
							}
						}, 1000);
					} else {
						item.isRun = false;
						clearInterval(item.timer);
						item.audioCon.pause();
						item.audioCon.currentTime = 0;
					}
				} else {
					item.isRun = false;
					clearInterval(item.timer);
					item.audioCon.pause();
					item.audioCon.currentTime = 0;
				}
			})
		},
		// 听信息
		runVoice(data, index) {
			this.changeVoiceStatu(this.localVoice, data);
			this.changeVoiceStatu(this.serverVoice, data);
		},
	},
	beforeDestroy() {
		this.endRecord();
	},
	mounted() {
		bus.$on('refresh', () => {
			this.getAudios();
		})
		if(!store.get('logined')) {
			return;
		}
		this.getAudios();
	},
};
</script>

<style lang='scss' scoped>
.record {
	height: 0;
	border-top: 3px solid #999;
	overflow: hidden;
	background: #fff;

	&.open {
		height: 3.6rem;
	}

	.record-wrap {
		height: calc(100% - .94rem);
		width: 100%;
		overflow: hidden;
		display: flex;

		.record-list {
			flex: 1;
			overflow: hidden;

			.record-list__wrap {
				box-sizing: border-box;
				width: 100%;
				height: 100%;
				padding-bottom: .1rem;
				overflow: auto;

				.record-list__item {
					width: 100%;
					height: 1rem;
					margin: .2rem 0;
					display: flex;
					align-items: center;
					overflow: hidden;

					.record-delete {
						width: .38rem;
						margin-right: .5rem;
					}
				}
			}
		}


		.msg-box {
			flex: 1;
			font-size: .24rem;
			display: flex;
			align-items: center;
			justify-content: flex-end;

			.msg-duration {
				display: block;
				margin-right: .15rem;
				color: #999;
			}

			.msg-item {
				min-width: 1rem!important;
				max-width: 3rem!important;
				height: .8rem;
				border-radius: .1rem;
				background: #00CC00;
				display: flex;
				justify-content: flex-end;
				align-items: center;

				img {
					display: inline-block;
					width: .3rem;
					margin-right: .15rem;
				}
			}

			.triangle::after {
				display: block;
				content: '';
				width: 0;
				height: 0;
				border-top: .15rem solid transparent;
				border-bottom: .15rem solid transparent;
				border-left: .2rem solid #00CC00;
			}
		}

		.record-btn__wrap {
			width: 2.5rem;
			height: 100%;
			overflow: hidden;
			position: relative;

			.record-time {
				display: block;
				text-align: center;
				font-size: .28rem;
				color: #ff6666;
				margin-top: .4rem;
			}

			.record-btn {
				width: 2.2rem;
				height: 1rem;
				border-radius: .1rem;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #ff6666;
				color: #fff;

				.record-icon {
					width: .6rem;
					height: .6rem;
				}

				.stop-icon {
					width: .45rem;
					margin-right: .15rem;
				}
			}
		}
	}
}
</style>