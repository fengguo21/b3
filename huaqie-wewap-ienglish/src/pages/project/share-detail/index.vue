<template>
	<div class="project-share">
		<audio-control :file='file'></audio-control>

		<read-swiper
			:imgUrl='imgUrl'
			:isRecord='true'
		></read-swiper>

		<readonly-record
			:show='true'
			:index = 'index'
			:feedId = 'feedId'
			btntext='我也要参加'
			@handle-click='join'
		></readonly-record>
	</div>
</template>
<script>
import audioControl from '@/components/audio-control';
import readSwiper from '@/components/read-swiper';
import readonlyRecord from '@/components/readonly-record';
import * as store from '@/common/localStore';
import { getCourseById, getAudios } from '@/api/api';
import { exgTitle } from '@/common/tool';
import bus from '@/bus';

const src = require('@/assets/image/text-page.png');

export default {
	name: 'project-share-index',
	components: {
		audioControl,
		readSwiper,
		readonlyRecord,
	},
	data() {
		return {
			feedId: '',
			index: '',
			productId: '',
			file: '',
			imgUrl: []
		}
	},
	methods: {
		join() {
			this.$router.push({
				name: 'introduce',
			});
		},
		getCourseById() {
			getCourseById({
				productId: this.productId,
			}).then(res => {
				if(res.code) {
					this.$toast(res.message);
					return;
				}
				const product = res.data.product.basic.list[this.index];
				const title = product.title;
				document.title = exgTitle(title);
				this.file = product.audio;
				this.imgUrl = product.images;
			});
		},
	},
	created() {
		const query = this.$route.query;
		// console.log(query);
		this.feedId = query.feedId;
		this.index = query.index;
		this.productId = query.productId;
		bus.$on('refresh', () => {
			this.getCourseById();
		})
		if(!store.get('logined')) {
			return;
		}
		this.getCourseById();
		// this.getAudios();
	},
}
</script>
<style lang='scss' scoped>
.project-share {
	width: 100%;
	height: 100vh;
	overflow: hidden;
}
</style>