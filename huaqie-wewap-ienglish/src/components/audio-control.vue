<template>
	<div class="audio-wrap border-b" id='audio'>
		<span class='current-time'>{{currentTime}}</span>
		<div class='audio-line'>
			<div class="audio-progress" @click='clickProgress' ref='total'></div>
			<div class="audio-dot" @click='clickProgress' ref='progress' :style='{ width: progress }'>
				<v-touch tag='span' @panmove='setProgress' @panend="setProgress"></v-touch>
			</div>
		</div>
		<span class='remain-time'>{{remainTime}}</span>
		<span class='controler'>
			<i class='ad-control start-ad' :class='{ "stop-ad" : isPlay }' @click='changeAudioStatus'></i>
		</span>
		<audio ref='audio'></audio>
	</div>
</template>

<script>
// 格式化播放时间
const convertTimeHHMMSS = (val) => {
	let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
	return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss;
}

export default {
	name: 'audio-control',
	props: {
		file: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			audioDom: '',
			remainTime: '00:00',
			currentTime: '00:00',
			duration: 0,
			isPlay: false,
			progress: '0%',
		};
	},
	watch: {
		file(val, oldVal) {
			if(val && !oldVal) {
				this.init();
			}
			// console.log('val'+val, 'oldVal'+oldVal);
		},
	},
	methods: {
		// 改变空间样式 
		changeAudioStatus() {
			this.isPlay = !this.isPlay;
			if(this.isPlay) {
				this.audioDom.play();
			} else {
				this.audioDom.pause();
			}
		},
		// 判断音频文件是否加载成功
		isLoaded() {
			if (this.audioDom.readyState >= 2) {
	          	this.duration = parseInt(this.audioDom.duration);
	          	this.remainTime = convertTimeHHMMSS(this.duration);
	        } else {
	          	throw new Error('Failed to load sound file')
	        }
		},
		// 自动进度条
		running() {
			const currTime = parseInt(this.audioDom.currentTime);
	        const percentage = parseInt((currTime / this.duration) * 100);
	        this.progress = `${percentage}%`;
	        this.currentTime = convertTimeHHMMSS(currTime);
	        this.remainTime = convertTimeHHMMSS(this.duration - currTime);
		},
		// 手动拖动进度条
		setProgress(e) {
			let tag = e.target;
			const total = this.$refs.total;
			const progress = this.$refs.progress;
			const progressWidth = progress.offsetWidth;
			const width = total.offsetWidth;
	        const pos = tag.getBoundingClientRect();
	        const seekPos = ((progressWidth + e.center.x) - pos.left) / width;
	        this.audioDom.currentTime = parseInt(this.audioDom.duration * seekPos)
		},
		// 点击进度条
		clickProgress(e) {
			let tag = e.target
			if (e.target.tagName === 'SPAN') {
				tag = e.target.parentElement
			}
			const pos = tag.getBoundingClientRect()
			const seekPos = (e.clientX - pos.left) / pos.width
			this.audioDom.currentTime = parseInt(this.audioDom.duration * seekPos)
		},
		// 暂停
		pause() {
			const duration = this.duration;
			const currentTime = this.audioDom.currentTime;
			if(duration <= currentTime) {
	        	this.isPlay = false;
			}
		},
		// 播放
		play() {
			const duration = this.duration;
			const currentTime = this.audioDom.currentTime;
			if(duration <= currentTime && !this.isPlay) {
	        	this.isPlay = true;
	        	this.audioDom.currentTime = 0;
			}
		},
		// 初始化监听
		init() {
			this.audioDom = this.$refs.audio;
			let ad = this.audioDom;
			ad.src = this.file;
			ad.volume = 0.75;
			this.audioDom.addEventListener('loadeddata', this.isLoaded);
	        this.audioDom.addEventListener('timeupdate', this.running);
	        this.audioDom.addEventListener('pause', this.pause);
	        this.audioDom.addEventListener('play', this.play);
		},
	},
	mounted() {
		// 初始化监听
		this.init();
	},
	beforeDestroy() {
		// console.log('beforeDestroy');
		// 销毁移除监听
		this.audioDom.removeEventListener('loadeddata', this.isLoaded);
		this.audioDom.removeEventListener('timeupdate', this.running);
		this.audioDom.removeEventListener('pause', this.pause);
		this.audioDom.removeEventListener('play', this.play);
	},
};
</script>

<style lang='scss' scoped>
.audio-wrap {
	background: #fff;
	width: 100%;
	height: 1.2rem;
	overflow: hidden;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;

	audio {
		display: none;
	}
	
	.audio-line {
		flex: 1;
		display: flex;
		align-items: center;
		position: relative;
		box-sizing: border-box;
		margin: 0 .1rem;

		.audio-progress {
			width: 100%;
			height: .05rem;
			background: #ccc;
		}

		.audio-dot {
			height: .05rem;
			top: 0;
			left: 0;
			position: absolute;
			background: #36AB60;

			span {
				position: absolute;
				top: 50%;
				right: -.12rem;
				transform: translateY(-50%);
				width: .24rem;
				height: .24rem;
				border-radius: 50%;
				background: #36AB60;
			}
		}
	}

	span {
		display: block;
		width: 1.2rem;
		font-size: .28rem;
		text-align: center;

		&.current-time {
			color: #36AB60;
		}

		&.remain-time {
			color: #999;
		}

		&.controler {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			.start-ad {
				display: block;
				width: .6rem;
				height: .6rem;
				background: url('../assets/image/stop-ad.png') no-repeat center;
				background-size: 100%;
				transition: background-image .3s ease-in-out;
			}

			.stop-ad {
				background-image: url('../assets/image/start-ad.png');
			}
		}
	}

}
</style>