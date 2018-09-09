<template>
	<div class="material-ardetail">
		<p class='artical-title'>{{title}}</p>
		<div class="artical-content" v-html='text'>
		</div>
	</div>
</template>
<script>
import { getArticleById } from '@/api/api';
import { Toast } from 'mint-ui';

export default {
	name: 'material-ardetail-index',
	methods: {
		getArticle() {
			// console.log(this.feedId);
			getArticleById({
				feedId: this.feedId
			}).then(res => {
				console.log(res);
				const article = res.data && res.data.basic;
				this.formatArticle(article);
				// console.log(res.data);
			})
		},
		formatArticle(article) {
			this.title = article
							? article.title
							: '这篇文章空空如也~';
			this.text = article
							? article.content
							: '';
		},
	},
	created() {
		const query = this.$route.query;
		const type = query.type;
		let title = '';
		this.detail = JSON.parse(query.detail);
		// this.text = this.detail.content;
		if (this.detail.feedId) {
			this.feedId = this.detail.feedId;
			this.getArticle();
		} else {
			this.formatArticle(this.detail);
		}

		if(type == 1) {
			title = '英文学习方法';
		} else if(type == 2) {
			title = '育儿方法';
		} else {
			title = '其他文章';
		}
		document.title = title;
	},
	data() {
		return {
			detail: null,
			text: '',
			feedId: '',
			title: '',
		};
	},
};
</script>
<style scoped lang='scss'>
.material-ardetail {
	background: #fff;
	width: 100%;
	min-height: 100vh;
	box-sizing: border-box;
	padding: .3rem .2rem;
	overflow: hidden;
}

.artical-title {
	color: #333;
	font-size: .32rem;
	text-align: center;
}

.artical-content {
	padding: .2rem .1rem;
	font-size: .24rem;

	p, img {
		margin-bottom: .2rem;
		width: 100%;
	}
}
</style>