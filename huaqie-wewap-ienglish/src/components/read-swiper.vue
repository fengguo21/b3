<template>
	<div class="read-swiper" :class='{ "record-mode": isRecord }'>
		<!-- 轮播主体（仅支持图片轮播） -->
		<div class="swiper-box" id="swiper">
			<v-touch tag='div'
				@panend='touchNext'
				class="swiper-wrap"
				:style="{ width: imgUrl.length * 7.5 + 'rem', transform: transform, 'transition-duration': speed / 1000 + 's', }"
			>
				<div class="swiper-item"
					:ref='"item" + index'
					v-for='(item, index) in imgUrl'
				>
			  	<div class="swiper-item-wrap">
			  		<img v-lazy.swiper="item.url">
			  	</div>
				</div>
			</v-touch>
		</div>

		<!-- 页码指示器 -->
		<div v-if='showIndicators' class='indicators'>{{pageIndex + 1}} / {{imgUrl.length}}</div>

		<!--  -->
		<div
			class="controller"
			:class='{ start: isStarted }'
			v-if='showController&&pageIndex >= imgUrl.length - 1'
			@click='startRecord'
		>
			<template v-if='!isStarted'>
				<span class='start-record'>开始录音</span>
			</template>
			<template v-else>
				<img class='return-icon' src="../assets/image/return-read.png">
				<span class='return-read'>恢复浏览</span>
			</template>
		</div>

		<!-- 左右按钮 -->
		<div
			v-if='showOption'
			class="left-option position-y-center"
			:class='{ disabled :  pageIndex <= 0 }'
			@click='prev'
		>
			<img class='position-center' src="../assets/image/left.png">
		</div>
		<div
			v-if='showOption'
			class="right-option position-y-center"
			:class='{ disabled :  pageIndex >= (imgUrl.length - 1) }'
			@click='next'
		>
			<img class='position-center' src="../assets/image/left.png">
		</div>
	</div>
</template>

<script>
export default {
	name: 'read-swiper',
	props: {
		imgUrl: { // 图片数组
			type: Array,
			required: true,
		},
		speed: { // 切换速度
			type: Number,
			default: 500,
		},
		showController: { // 是否显示开始录音的按钮
			type: Boolean,
			default: false,
		},
		isRecord: { // 是否录音
			type: Boolean,
			default: false,
		},
		showOption: { // 是否显示左右切换按钮
			type: Boolean,
			default: true,
		},
		showIndicators: { // 是否显示页码指示器
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			pageIndex: 0,
			transform: 'translate(0, 0)',
			relSpeed: 0,
			isStarted: false,
		};
	},
	methods: {
		// 上一页
		prev() {
			let translateX = 0;
			const step = this.$refs.item0[0].offsetWidth;
			if(this.pageIndex <= 0) {
				this.pageIndex = 0;
			} else {
				this.pageIndex -= 1;
			}
			translateX = this.pageIndex * step;
			this.transform = `translate(-${translateX}px, 0)`;
		},
		// 下一页
		next() {
			let translateX = 0;
			const step = this.$refs.item0[0].offsetWidth;
			if(this.pageIndex >= this.imgUrl.length - 1) {
				this.pageIndex = this.imgUrl.length - 1;
			} else {
				this.pageIndex += 1;
			}
			translateX = this.pageIndex * step;
			this.transform = `translate(-${translateX}px, 0)`;
		},
		touchNext(e) {
			if(e.deltaX > 0) {
				this.prev();
			} else {
				this.next();
			}
		},
		// 切换录音状态录音
		startRecord() {
			this.isStarted = !this.isStarted;
			if(this.isStarted) {
				this.$emit('show');
			} else {
				this.$emit('hide');
			}
		},
	},
};
</script>

<style lang='scss' scoped>
.read-swiper {
	height: calc(100vh - 1.2rem);
	position: relative;
	background: #fff;
	transition: height .5s ease;

	&.record-mode {
		height: calc(100vh - 4.8rem);
	}

	.swiper-box {
		width: 100%;
		height: 100%;
		position: relative;
	    overflow: hidden;
	    transform: translate3d(0, 0, 0);

	    .swiper-wrap {
	    	height: 100%;
	    	overflow: hidden;
	    	position: absolute;
	    	left: 0;
	    	top: 0;
	    	transition-property: transform;
	    	transition-timing-function: ease-in-out;
	    }

	    .swiper-item {
	    	width: 7.5rem;
	    	height: 100%;
	    	float: left;
	    	position: relative;


	    	.swiper-item-wrap {
	    		display: flex;
	    		justify-content: center;
	    		width: 100%;
	    		height: 100%;
	    		overflow: hidden;
	    	}

	    	img {
	    		height: 100%;
	    		width: 100%;
	    		margin: 0 auto;
	    	}
	    }
	}

	.my-swiper img {
		height: 100%;

	}

	.left-option, .right-option {
		width: 1rem;
		height: 1.4rem;
		background: #000;
		opacity: 0.35;
		transition: opacity .3s ease-in-out;

		img {
			width: 65%;
		}

		&.disabled {
			opacity: 0.15;
		}
	}

	.left-option {
		left: 0;
	}

	.right-option {
		right: 0;

		img {
			transform: rotateZ(180deg) translate(50%, 50%);
		}
	}

	.indicators {
		position: absolute;
		z-index: 999;
		left: .3rem;
		bottom: .4rem;
		background: rgba(255, 255, 255, .6);
		height: .4rem;
		font-size: .28rem;
		line-height: .4rem;
		border-radius: .5rem;
		padding: 0 .2rem;
		color: #333;
	}

	.controller {
		position: absolute;
		z-index: 999;
		right: 0;
		bottom: .4rem;
		width: 2rem;
		height: .8rem;
		border-top-left-radius: .4rem;
		border-bottom-left-radius: .4rem;
		background: #FF6666;
		display: flex;
		overflow: hidden;
		justify-content: center;
		align-items: center;
		font-size: .28rem;
		box-shadow: 0px 4px 8px 0px #444;

		&.start {
			background: #fff;
		}

		.start-record {
			color: #fff;
		}

		.return-read {
			color: #333;
		}

		.return-icon {
			width: .4rem;
			margin: 0 .12rem;
		}
	}
}
</style>