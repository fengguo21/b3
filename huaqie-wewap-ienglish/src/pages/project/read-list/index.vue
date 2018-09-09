<template>
	<div class="layout">
		<div class='fix-header'>
			<div class="layout-banner">
				<img :src="avatar" />
			</div>

			<msg-tip v-if='!isFirst'>
				<img class='tip-icon' src="../../../assets/image/flower.png">
				<span class='small-font'>你已阅读
					<span class='important'>{{courseTimes}}</span>
				课时，棒棒哒，每天一读，继续加油哦！</span>
			</msg-tip>
			<msg-tip v-else bgColor='#FFFFCC'>
				<span class='small-font'>Welcome aboard，您已开启爱英语一年精读之旅，您的阅读时间为一年，{{startTime}}至{{endTime}}，祝您旅途愉快！</span>
			</msg-tip>
		</div>
		<mt-loadmore class='course-list' :top-method="loadTop" ref="loadmore" @top-status-change="handleTopChange">
			<div
				v-infinite-scroll="loadMore"
				:infinite-scroll-disabled="loading"
				:infinite-scroll-distance="size"
			>
				<course-list-item v-for='(item, index) in courseList' :id='"#f" + index' :key='index' :val='item' @handle-click='goRead(item, index)'></course-list-item>
			</div>

			<div slot="top" class="mint-loadmore-top">
	      <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
	      <span v-show="topStatus === 'loading'">Loading...</span>
	    </div>
		</mt-loadmore>
		<bottom-fix @handle-click='goStudy'>
			<template slot='title'>点击进入学习</template>
		</bottom-fix>
	</div>
</template>
<script>
import bottomFix from '@/components/bottom-fix';
import courseListItem from '@/components/course-list-item';
import msgTip from '@/components/msg-tip';
import moment from 'moment';
import { deepClone } from '@/common/tool';
import { getCourseById } from '@/api/api';

export default {
	name: 'project-list-index',
	components: {
		bottomFix,
		courseListItem,
		msgTip,
	},
	data() {
		return {
			courseList: [],
			totalList: [],
			courseTimes: 0,
			proType: '',
			productId: '',
			avatar: '',
			startTime: '',
			endTime: '',
			isFirst: false,
			page: 1,
			topPage: 1,
			loading: false,
			size: 15,
			topStatus: '',
			boxHeight: 0,
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
			document.title = title;
		},
		// 点击进入学习；
		goStudy() {
			let stepTwo = [];
			let stepThree = [];
			let noStudyList = [];
			this.courseList.forEach(item => {
				if(item.step == 2 || item.step == 3) {
					if(item.step == 2) {
						stepTwo.push(item);
					} else {
						stepThree.push(item);
					}
				}
			})
			noStudyList = deepClone(stepThree, stepTwo);
			if(stepTwo.length > 1) {
				this.$router.push({
					name: 'projectDetail',
					query: {
						type: this.proType,
						msg: JSON.stringify(stepTwo[0]),
					},
				});
				return;
			}
			this.$router.push({
				name: 'projectDetail',
				query: {
					type: this.proType,
					msg: JSON.stringify(noStudyList[noStudyList.length - 1]),
				},
			});
		},
		// 学习指定章节
		goRead(item, index) {
			if(index != 0) {
				const prevStep = this.courseList[index - 1].step;
				if(prevStep == 2 && item.step == 2) {
					this.$messagebox.alert(`您还有未完成课时<br />请按顺序阅读`, '提示');
					return;
				}
			}
			this.$router.push({
				name: 'projectDetail',
				query: {
					type: this.proType,
					msg: JSON.stringify(item),
				},
			});
		},
		getDetail() {
			getCourseById({
				productId: this.productId,
			}).then(res => {
				if(res.code) {
					this.$toast(res.message);
					return;
				}
				const isFirst = this.store.get('isFirstBuy' + this.proType);
				this.isFirst = isFirst;
				if(isFirst) {
					const time = moment(res.data.created);
					this.store.set('isFirstBuy' + this.proType, false);
					this.startTime = time.format('YYYY年MM月DD日');
					this.endTime = time.add(365, 'days').format('YYYY年MM月DD日');
				}
				// console.log(res.data.created);
				const steps = res.data.basic.states;
				const product = res.data.product.basic;
				let courseCount = 0;
				let courseList = product.list;
				this.avatar = product.avatar;
				steps.forEach((item2, key2) => {
					if(item2.step == 3) {
						courseCount += 1;
					}
				})
				courseList.forEach((item1, key1) => {
					item1.step = 1;
					item1.feedId = res.data.feedId;
					item1.productId = this.productId;
					steps.forEach((item2, key2) => {
						if(key1 == item2.index) {
							item1.step = item2.step;
							item1.index = key1;
							item1.created = res.data.created;
						}
					})
				});
				this.totalList = courseList;
				// steps[steps.length - 1].index
				let page = 1;
				if (steps.length > 0) {
					const loadmore = this.$refs.loadmore.$el.children[0];
					const nowItemIndex = steps[steps.length - 1].index;
					page = Math.ceil(nowItemIndex / this.size) || 1;
					const topHeight = - ((nowItemIndex % this.size) * this.boxHeight);
					loadmore.style.transform = `translate3d(0, ${topHeight}px,0)`;
					loadmore.style.webkitTransform = `translate3d(0, ${topHeight}px,0)`;
				}

				// console.log(this.boxHeight);
				this.page = page;
				this.topPage = page;
				this.spliceList();
				this.courseTimes = courseCount;
				 // console.log('courseList', this.totalList);
			})
		},
		spliceList() {
			// console.log(this.totalList);
			let slList = deepClone(this.totalList).slice((this.page - 1) * this.size, this.page * this.size);
			if(this.page == 1) {
				this.courseList = slList;
			} else {
				this.courseList = this.courseList.concat(slList);
			}
		},
		loadMore() {
			this.loading = true;
			if(this.page * this.size > this.totalList.length) {
				// console.log('run1');
				this.loading = false;
			} else {
				// console.log('run 2');
				this.page += 1;
				this.spliceList();
				this.loading = false;
			}
		},
		loadTop() {
			if (this.topPage !== 1) {
				let slList = deepClone(this.totalList).slice((this.topPage - 2) * this.size, (this.topPage - 1) * this.size);
				this.courseList = slList.concat(this.courseList);
				this.topPage -= 1;
			}
			this.$refs.loadmore.onTopLoaded();
		},
		handleTopChange(status) {
      this.topStatus = status;
    },
	},
	beforeCreate() {
		const proType = this.$route.query.type;
		// this.filterTitle()
		this.$nextTick(() => {
			this.filterTitle(proType)
		})
	},
	created() {
		this.proType = this.$route.query.type;
		this.productId = this.$route.query.productId;
		this.getDetail();
		const font = document.querySelector('html').style.fontSize;
		const fontSize = font.match(/\d+(.?)+\d+/g)[0];
		const boxHeight = 1.4 * fontSize;
		this.boxHeight = boxHeight;
	},
};
</script>
<style lang='scss' scoped>
.layout {
	display: flex;
	height: 100vh;
	overflow: hidden;
	box-sizing: border-box;
	flex-direction: column;

	.course-list {
		flex: 1;
		overflow: auto;
	}
}
.layout-banner {
	width: 100%;
	overflow: hidden;

	img {
		width: 100%;
	}
}
</style>