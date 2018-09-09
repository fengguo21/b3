<template>
	<div class="mine-plan__wrap">
		<ul class="mine-plan">
			<span
				class='wanted'
				v-if='
					charts[0].data.length <= 0 &&
					charts[1].data.length <= 0 &&
					charts[2].data.length <= 0 &&
					charts[3].data.length <= 0
				'
			>
				我想参加的阅读计划
			</span>
			<span class='get-width' ref='plan'></span>
			<li class="plan-item" v-for='(item, index) in charts' >
				<div class="book-face" @click='goList(item, index)'>
					<img :src="item.avatar">
					<span v-if='!item.data || item.data.length > 0'>进入学习</span>
				</div>
				<template v-if='!item.data || item.data.length > 0'>
					<msg-tip>
						<img class='tip-icon' src="../../../assets/image/flower.png">
						<span class='small-font'>你已阅读
							<span class='important'>{{item.courseTimes}}</span>
						课时，累计{{item.costTime}}分钟，还剩{{item.lastTime}}课时，继续加油哦！</span>
					</msg-tip>
					<div class="canvas-wrap">
						<schart
							:canvasId="item.canvasId"
							:type="chartType"
							:width="chartWidth"
					    	:height="chartHeight"
					    	:data="item.data"
					    	:options="chartOptions"
				    	></schart>
						<span class='filter-wrap border-b border-l border-r border-t' @click='openPicker(index)'>
							<input type="text" v-model='item.filter' readonly>
						</span>
						<span class="x-name">课时</span>
						<span class="y-name">时长<span>（分钟）</span></span>
					</div>
					<div class="use-time">
						阅读有效期：{{item.userStart|filterTime}}至{{item.userEnd|filterTime}}
					</div>
				</template>
			</li>
		</ul>
		<div
			class="picker-mask"
			:class='{"picker-mask-up" : showPicker}'
			@click.stop='closePicker'
		>
			<div
				class="picker-wrap"
				:class='{"picker-wrap-up" : showPicker}'
			>
				<mt-picker
					:slots="timeSlot"
					@change="onTimeChange"
					:showToolbar='true'
				>
					<div class="picker-btns">
						<span @click='closePicker'>取消</span>
						<span @click='checkSelect'>确定</span>
					</div>
				</mt-picker>
			</div>
		</div>
	</div>
</template>
<script>
import Schart from 'vue-schart';
import msgTip from '@/components/msg-tip';
import moment from 'moment';
import * as store from '@/common/localStore';
import bus from '@/bus';
import { getCourseList } from '@/api/api'

export default {
	name: 'mine-plan-index',
	components: {
		Schart,
		msgTip,
	},
	filters: {
		filterTime(val) {
			return moment(val).format('YYYY年MM月DD日');
		},
	},
	methods: {
		openPicker(index) {
			this.showPicker = true;
			this.chooseIndex = index;
		},
		closePicker() {
			this.showPicker = false;
		},
		onTimeChange(picker, values) {
			const index = this.chooseIndex;
			const oldSelect = this.charts[index].filter;
			this.selectedEm = values[0] || oldSelect;
			// this.charts[index].filter = values[0];
		},
		getCourseList() {
			getCourseList({
				free: 2,
				page: 1,
				size: 10,
			}).then(res => {
				if(res.code) {
					Toast(res.message);
					return;
				}
				const newRes = Array.reverse(res.data.list);
				// console.log(newRes);
				newRes.forEach((item, index) => {
					this.charts[index].avatar = item.basic.avatar;
					this.charts[index].productId = item.productId;
					this.charts[index].type = index + 1;
				});
				// this.charts.forEach((item, index) => {
				// 	item.avatar = newRes[index].basic.avatar;
				// 	item.productId = newRes[index].productId;
				// 	item.type = index + 1;
				// });
			});
		},
		checkSelect() {
			const index = this.chooseIndex;
			this.charts[index].filter = this.selectedEm;
			this.closePicker();
		},
		goList(data, index) {
			const type = index + 1;
			this.$router.push({
				name: 'projectIntro',
				query: {
					type: type,
					productId: data.productId,
				},
			});
		},
	},
	beforeCreate() { // 转场待研究
		// console.log(document.title);
		document.title = '爱英语'; // 根据页面改变title
	},
	created() {
		bus.$on('refresh', () => {
			this.getCourseList();
		})
		if(!store.get('logined')) {
			return;
		}
		this.getCourseList();
		console.log(store.get('me'));
	},
	mounted() {
		let width = this.$refs.plan.offsetWidth;
		let height = width * 8 / 10;
		this.chartWidth = width;
		this.chartHeight = height;
		// console.log(width);
	},
	data() {
		return {
			chooseIndex: 0,
			selectedEm: '',
			showPicker: false,
			timeSlot: [
				{
		          flex: 1,
		          defaultIndex: 0,
		          values: ['1-7课时', '8-14课时', '15-21课时'],
		        }
	        ],
			chartOptions: {
				padding: 40,
                bgColor: '#FFFFFF',
                yEqual: 5,
                fillColor: '#999999',
                contentColor: '#EEEEEE',
                axisColor: '#787878',
			},
			chartWidth: '',
			chartHeight: '',
			chartType: 'bar',
			charts: [
				{
					canvasId: 'chart-1',
					filter: '1-7课时',
					avatar: '',
					courseTimes: 28,
					costTime: 250,
					lastTime: 337,
					userStart: moment().valueOf(),
					userEnd: moment().add(365, 'days').valueOf(),
					data: [
						{name: '1', value: 15},
            {name: '2', value: 6},
            {name: '3', value: 10},
            {name: '4', value: 0},
            {name: '5', value: 1},
            {name: '6', value: 2},
            {name: '7', value: 3},
					],
				},
				{
					canvasId: 'chart-2',
					filter: '1-7课时',
					avatar: '',
					courseTimes: 28,
					costTime: 250,
					lastTime: 337,
					userStart: moment().valueOf(),
					userEnd: moment().add(365, 'days').valueOf(),
					data: [
						{name: '1', value: 15},
            {name: '2', value: 6},
            {name: '3', value: 10},
            {name: '4', value: 0},
            {name: '5', value: 1},
            {name: '6', value: 2},
            {name: '7', value: 3},
					],
				},
				{
					canvasId: 'chart-3',
					filter: '1-7课时',
					avatar: '',
					courseTimes: 28,
					costTime: 250,
					lastTime: 337,
					data: [],
				},
				{
					canvasId: 'chart-4',
					filter: '1-7课时',
					avatar: '',
					courseTimes: 28,
					costTime: 250,
					lastTime: 337,
					data: [],
				}
			],
		};
	},
};
</script>
<style scoped lang='scss'>
@mixin fullScreen {
	width: 100vw;
	height: 100vh;
}
.mine-plan {
	width: 100%;
	box-sizing: border-box;
	padding: .3rem .2rem;
}

.get-width {
	display: block;
	width: 100%;
}

.book-face {
	width: 100%;
	height: 3.4rem;
	overflow: hidden;
	position: relative;

	img {
		width: 100%;
	}

	span {
		position: absolute;
		display: block;
		font-size: .3rem;
		padding: .1rem .8rem;
		background: #fff;
		left: 50%;
		bottom: .8rem;
		border: 1px solid #999;
		-webkit-transform-origin: 0 0;
	    -webkit-transform: scale(1);
	    pointer-events: none;
		transform: translateX(-50%);
		border-radius: 2rem;
	}
}

.use-time {
	padding: .1rem 0;
	font-size: .26rem;
}

.plan-item {
	margin-bottom: .3rem;

	.canvas-wrap {
		position: relative;

		.x-name, .y-name {
			position: absolute;
			font-size: .28rem;
			display: block;
			text-align: center;
		}
		.x-name {
			right: .2rem;
			bottom: .2rem;
		}
		.y-name {
			top: 0;
			left: 0;

			span {
				display: block;
			}
		}

		.filter-wrap {
			display: block;
			width: 2.4rem;
			position: absolute;
			top: .2rem;
			right: .3rem;

			&::before {
				content: '';
				position: absolute;
				top: 50%;
				right: .1rem;
				transform: translateY(-50%);
				display: block;
				width: 0;
				height: 0;
				border-top: .16rem solid #333;
				border-left: .08rem solid transparent;
				border-right: .08rem solid transparent;
			}

			input {
				box-sizing: border-box;
				width: 100%;
				padding: .1rem .2rem;
				font-size: .3rem;
			}
		}
	}
}

.mine-plan__wrap {
	@include fullScreen;
	overflow: auto;
	background: #f2f2f2;
}

.picker-mask {
	@include fullScreen;
	overflow: hidden;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0);
	z-index: -1;
	transform: translate3d(0, 0, 0);
	transition: all .3s ease;

	.picker-wrap {
		background: #fff;
		width: 100%;
		position: absolute;
		left: 0;
		bottom: -220px;
		overflow: hidden;
		transition: bottom .3s ease;

		&.picker-wrap-up {
			bottom: 0;
		}
	}
}
.picker-mask-up {
	z-index: 999;
	background: rgba(0, 0, 0, .6);
}
.picker-btns {
	display: flex;
	box-sizing: border-box;
	justify-content: space-between;
	background: #f2f2f2;

	span {
		display: block;
		padding: .2rem .3rem;
		color: #0066ff;
	}
}

.wanted {
	display: block;
	font-size: .28rem;
	padding-bottom: .1rem;
}
</style>

<style>
.picker-item{
	text-align: center;
}
</style>