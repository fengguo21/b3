<template>
	<div class="layout">
		<div class='fix-header'>
			<div class="layout-banner">
				<img :src="avatar" />
			</div>
		</div>

		<div class="course-list"
				v-infinite-scroll="loadMore"
		  	:infinite-scroll-disabled="loading"
		  	:infinite-scroll-distance='size'>
			<course-list-item v-for='(item, index) in courseList' :key='index' :val='item' @handle-click='goRead(item)'></course-list-item>
		</div>

	</div>
</template>
<script>
import courseListItem from '@/components/course-list-item';
import { getCourseById } from '@/api/api';
import { deepClone } from '@/common/tool';

export default {
	name: 'material-list-index',
	components: { courseListItem },
	methods: {
		goRead(data) {
			this.$router.push({
				name: 'materialRead',
				query: {
					type: this.proType,
					msg: JSON.stringify(data),
				},
			});
		},
		getCourse() {
			getCourseById({
				productId: this.productId,
			}).then(res => {
				if(res.code) {
					this.$toast(res.message);
					return;
				}
				let product = res.data.product.basic;
				let courseList = product.list;
				this.avatar = product.avatar;
				courseList.forEach((item, key) => {
					item.step = 2;
					item.index = key;
				})
				this.totalList = courseList;
				this.spliceList();
			})
		},
		spliceList() {
			let slList = deepClone(this.totalList).slice((this.page - 1) * this.size, this.page * this.size)
			if(this.page == 1) {
				this.courseList = slList;
			} else {
				this.courseList = this.courseList.concat(slList);
			}
			// console.log(document.querySelector('html').style.fontSize);
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
	created() {
		const param = JSON.parse(this.$route.query.param);
		this.proType = this.$route.query.type;
		this.productId = param.productId;
		this.getCourse();
		document.title = param.title;
	},
	data() {
		return {
			page: 1,
			size: 15,
			loading: false,
			topStatus: '',
			boxHeight: 0,
			topHeight: 0,
			avatar: '',
			productId: '',
			proType: '',
			totalList: [],
			courseList: [],
		};
	},
};
</script>
<style scoped lang='scss'>
.layout {
	display: flex;
	height: 100vh;
	overflow: hidden;
	padding: 0;
	box-sizing: border-box;
	flex-direction: column;

	.layout-banner {
		overflow: hidden;

		img {
			width: 100%;
		}
	}

	.course-list {
		flex: 1;
		overflow: auto;
	}
}
</style>