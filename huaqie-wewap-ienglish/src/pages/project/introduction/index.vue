<template>
	<div class="layout"
		v-infinite-scroll="loadMore"
		:infinite-scroll-disabled="loading"
		:infinite-scroll-distance="size"
	>
		<div class="layout-banner">
			<img :src="avatar" />
		</div>
		<div class="buy-link">
			<div class="buy-link__msg position-y-center">
				<p class="buy-link__price">惊喜价：<span><i>{{price}}</i>元</span></p>
				<p>计划有效期：一年</p>
			</div>
			<div class="buy-link__btn position-y-center" @click.stop='goBuy'>购买</div>
		</div>
		<div class="course-intro">
			<p>{{text}}</p>
			<img :src="item.url" v-for='item in imageList' />
		</div>
		<div class="course-list">
			<course-list-item v-for='(item, index) in courseList' :key='index' :val='item' @handle-click='goRead(item, index)'></course-list-item>
		</div>
		<bottom-fix @handle-click='goStudy'>
			<template slot='title'>立刻免费试读！<span>赠送1次点评</span></template>
		</bottom-fix>
	</div>
</template>
<script>
import { Toast } from 'mint-ui';
import bottomFix from '@/components/bottom-fix';
import courseListItem from '@/components/course-list-item';
import { getCourseById, createCourse } from '@/api/api';
import { deepClone } from '@/common/tool';
import * as store from '@/common/localStore';
import bus from '@/bus.js';

export default {
	name: 'project-introduct-index',
	data() {
		return {
			feedId: '',
			productId: '',
			proType: '',
			avatar: '',
			price: 0,
			courseList: [],
			totalList: [],
			imageList: [],
			text: '',
			loading: false,
			size: 15,
			page: 1,
		};
	},
	components: {
		bottomFix,
		courseListItem,
	},
	computed: {
		isLoged() {
			const loged = store.get('logined');
			return loged;
		},
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
		// 跳转至购买页面
		goBuy() {
			if(!this.feedId) {
				Toast('您点击太快了，请稍后再试');
				return;
			}
			const type = this.$route.query.type;
			this.$router.push({
				name: 'projectBuy',
				query: {
					type: type,
					price: this.price,
					productId: this.productId,
					feedId: this.feedId,
				}
			})
			// console.log(type);
		},
		// 立即试读
		goStudy() {
			this.$router.push({
				name: 'projectDetail',
				query: {
					type: this.proType,
					msg: JSON.stringify(this.courseList[0]),
					isFree: true,
				},
			});
		},
		// 点击指定课程
		goRead(item, index) {
			if(index != 0) {
				Toast('该课程尚未解锁');
				return;
			}
			this.$router.push({
				name: 'projectDetail',
				query: {
					type: this.proType,
					msg: JSON.stringify(item),
					isFree: true,
				},
			});
		},
		getDetail() {
			getCourseById({
				productId: this.productId,
			}).then(res => {
				if(res.code) {
					Toast(res.message);
					return;
				}
				if(res.data.basic) {
					this.getDetailDb(res.data);
				} else {
					createCourse({
						productId: this.productId,
					}).then(ret => {
						this.getDetailDb(ret.data, res.data.product);
					})
				}
				// console.log('courseList', courseList);
			})
		},
		getDetailDb(data, pro) {
			this.feedId = data.feedId;
			const isBuy = this.store.get('isFirstBuy' + this.proType);
			if(isBuy || data.basic.step == 2) {
				this.$router.push({
					name: 'projectList',
					query: {
						type: this.proType,
						productId: this.productId,
					}
				})
				return;
			}
			const product = pro ? pro.basic : data.product.basic;
			const steps = data.basic.states;
			let courseList = product.list;
			this.avatar = product.avatar;
			this.price = product.price;
			this.text = product.text;
			this.imageList = product.images;
			courseList.forEach((item1, key1) => {
				item1.step = 1;
				item1.index = key1;
				item1.productId = this.productId;
				item1.feedId = data.feedId;
				steps.forEach((item2, key2) => {
					if(key1 == item2.index) {
						item1.step = item2.step;
					}
				})
			})
			this.totalList = courseList;
			this.spliceList();
		},
		spliceList() {
			let slList = deepClone(this.totalList).slice((this.page - 1) * this.size, this.page * this.size)
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
	},
	beforeCreate() {
		const proType = this.$route.query.type;
		// this.filterTitle()
		this.$nextTick(() => {
			this.filterTitle(proType);
			this.proType = proType;
		})
	},
	created() {
		this.productId = this.$route.query.productId;
		bus.$on('refresh', () => {
			// alert('on');
			this.getDetail();
		})
		// console.log(this.courseList);
		if(!store.get('logined')) {
			return;
		}
		this.getDetail();
	},
}
</script>
<style lang='scss' scoped>
.layout-banner {
	overflow: hidden;
}
.layout-banner img {
	width: 100%;
}
.course-intro {
	overflow: hidden;

	p {
		padding: .2rem .3rem;
	}

	img {
		width: 100%;
		margin-top: .2rem;
	}
}
</style>