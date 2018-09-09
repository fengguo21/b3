<template>
	<div class="record" :class='{ open: show }'>
		<div class="record-wrap">
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
							<span class='triangle'></span>
							<div class="msg-item" 
								:style='{width: (1 + 2 / 60 * item.duration) + "rem"}'
								@click='runVoice(item, index)'
							>	
								<img v-show='item.isRun' :src="voiceRun" /> 
								<img v-show='!item.isRun' :src="voice" />
							</div>
							<span class="msg-duration">{{item|filterTime}}</span>
						</div>
					</li>
				</ul>
			</div>

			<div class="record-btn__wrap"></div>

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
import * as store from '@/common/localStore';
import moment from 'moment';
import wx from 'weixin-js-sdk';
import bus from '@/bus';

const voice = require('@/assets/image/voice.png');
const voiceRun = require('@/assets/image/voice.gif');

// const initTime = convertTimeHHMMSS(0);

export default {
	name: 'readonly-record',
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
			voice,
			voiceRun,
			totalServer: [],
			serverVoice: [],
			page: 1,
			size: 15,
			total: 0,
			loading: false,
		};
	},
	computed: {
		totalVoice() {
			return deepClone(this.serverVoice);
		},
	},
	methods: {
		comments() {
			this.$emit('handle-click');
			// console.log('comments')
		},
		// 遍历听信息
		changeVoiceStatu(arr, target) {
			arr.forEach((item, index) => {
				if(!item.audioCon) {
					item.audioCon = new Audio();
				}
				item.audioCon.volume = 1;
				console.log(item.audioCon.volume);
				if(item.time == target.time) {
					item.isRun = !item.isRun;
					if(item.isRun){
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
						// console.log('run stop2');
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
					this.$toast(res.message);
					return;
				}
				// console.log(res);
				const list = res.data.list;
				if(list.length > 0) {
					this.total = list[0].basic.audios.length;
					const audios = list[0].basic.audios;
					audios.forEach(item => {
						// console.log(item);
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
		// 听信息
		runVoice(data, index) {
			this.changeVoiceStatu(this.serverVoice, data);
		},
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
			justify-content: flex-start;

			.msg-duration {
				display: block;
				margin-left: .15rem;
				color: #999;
			}

			.msg-item {
				min-width: 1rem!important;
				max-width: 3rem!important;
				height: .8rem;
				border-radius: .1rem;
				background: #00CC00;
				display: flex;
				justify-content: flex-start;
				align-items: center;

				img {
					transform: rotateZ(-180deg);
					display: inline-block;
					width: .3rem;
					margin-left: .15rem;
				}
			}

			.triangle::after {
				display: block;
				content: '';
				width: 0;
				height: 0;
				border-top: .15rem solid transparent;
				border-bottom: .15rem solid transparent;
				border-right: .2rem solid #00CC00;
			}
		}
	}
}
</style>