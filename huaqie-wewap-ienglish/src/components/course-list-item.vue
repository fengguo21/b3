<template>
	<div class="course-list-item" @click='goDetail(val)'>
		<div class="item-statu">
			<img class='position-center' :src="statuImg">
		</div>
		<div class="item-msg">
			<p 
				class='position-y-center' 
				:class='{
					"mode-one": val.step == 3,
					"mode-two": val.step == 2,
				}'
			>{{val.title}}</p>
		</div>
	</div>
</template>
<script>
import { Toast } from 'mint-ui';

export default {
	name: 'course-list-item',
	props: {
		val: {
			type: Object,
			default: null
		},
	},
	data() {
		return {
			// statuImg: require('@/assets/image/course-close.png'),
		}
	},
	computed: {
		statuImg() {
			let img = ''
			if(this.val.step == 1) {
				img = require('@/assets/image/course-close.png');
			} else if(this.val.step == 2) {
				img = require('@/assets/image/course-open.png');
			} else if(this.val.step == 3) {
				img = require('@/assets/image/course-complate.png');
			} else {
				img = require('@/assets/image/course-close.png');
			}
			return img;
		},
		id() {
			return '#f' + this.index;
		},
	},
	methods: {
		showStatuImg(step = 1) {
			let img = ''
			if(step == 1) {
				img = require('@/assets/image/course-close.png');
			} else if(step == 2) {
				img = require('@/assets/image/course-open.png');
			} else if(step == 3) {
				img = require('@/assets/image/course-complate.png');
			}
			this.statuImg = img;
		},
		goDetail(val) {
			// 点击事件
			if(val.step != 1) {
				this.$emit('handle-click');
			} else {
				Toast({
					message: '课程还未解锁！',
					position: 'bottom',
				})
			}
		}
	},
}
</script>
<style lang='scss' scoped>
@mixin lines-hidden($lines: 2) {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: $lines;
	overflow: hidden;
}
.course-list-item {
	width: 100%;
	height: 1.2rem;
	background: #fff;
	margin-bottom: .2rem;
	border-radius: .1rem;
	display: flex;

	.item-statu {
		width: .94rem;
		position: relative;

		img {
			width: .5rem;
		}
	}

	.item-msg {
		flex: 1;
		position: relative;

		p {
			font-size: 12.5px;
			width: 100%;
			word-break: break-all;
			box-sizing: border-box;
			padding-right: .16rem;
			line-height: 1.5;
			@include lines-hidden;

			&.mode-one {
				color: #333;
			}

			&.mode-two {
				color: #33AC60;
			}
		}
	}
}	
</style>