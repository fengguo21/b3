<template>
	<div class="material-article-list"
			v-infinite-scroll="loadMore"
	  	:infinite-scroll-disabled="loading"
	  	:infinite-scroll-distance='size'>
		<artical-list-item
			v-for='(item, index) in articalList'
			:detail='item'
			:key='index'
			@handle-click='goArtical(item)'
		></artical-list-item>
	</div>
</template>
<script>
import articalListItem from '@/components/artical-list-item';
import { getArticleList } from '@/api/api';
import { Toast } from 'mint-ui';

export default {
	name: 'material-arlist-index',
	components: { articalListItem },
	methods: {
		// 前往学习方法详情
		goArtical(data) {
			this.$router.push({
				name: 'materialArdetail',
				query: {
					type: this.type,
					detail: JSON.stringify(data),
				},
			});
			// console.log(data);
		},
		getArticleList(group, arrName){
			getArticleList({
				page: this.page,
				size: this.size,
				group: group,
			}).then(res => {
				if(res.code) {
					Toast(res.message);
					return;
				}
				let arr = [];
				this.total = res.data.total;
				// console.log(arrName, res)
				res.data.list.forEach(item => {
					const detail = item.basic;
					arr.push({
						feedId: item.feedId,
						url: detail.avatar,
						title: detail.title,
						desc: detail.desc,
						content: detail.content,
					})
				})
				if(res.data.page == 1) {
					this[arrName] = arr;
				} else {
					this[arrName] = this[arrName].concat(arr);
				}
			})
		},
		loadMore() {
		  this.loading = true;
		  if(this.page * this.size > this.total) {
		  	this.loading = false;
		  } else {
		  	this.page += 1;
		  	this.getArticleList(this.typedb, 'articalList')
		  	this.loading = false;
		  }
		},
	},
	created() {
		const type = this.$route.query.type;
		this.type = type;
		let title = '';
		if(type == 2) {
			title = '英文学习方法';
			this.typedb = 2;
		} else {
			title = '育儿方法';
			this.typedb = 1;
		}
		this.getArticleList(this.typedb, 'articalList')
		document.title = title;
	},
	data() {
		return {
			type: '',
			articalList: [],
			page: 1,
			size: 6,
			loading: false,
			typedb: '',
			total: 0,
		};
	},
};
</script>
<style scoped>
.material-article-list {
	box-sizing: border-box;
	background: #fff;
	padding: .2rem .3rem 0;
	margin-bottom: .3rem;
}
</style>