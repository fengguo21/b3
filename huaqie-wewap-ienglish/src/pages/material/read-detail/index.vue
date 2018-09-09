<template>
	<div class="read-wrap">
		<audio-control :file='file'></audio-control>

		<read-swiper :imgUrl='imgUrl'></read-swiper>
	</div>
</template>
<script>
import audioControl from '@/components/audio-control';
import readSwiper from '@/components/read-swiper';
import { exgTitle } from '@/common/tool';

const src = require('@/assets/image/text-page.png');

export default {
	name: 'material-read-index',
	components: {
		audioControl,
		readSwiper,
	},
	data() {
		return {
			file: '',
			imgUrl: [],
		};
	},
	created() {
		const val = JSON.parse(this.$route.query.msg);
		console.log(val);
		this.imgUrl = val.images;
		const title = val.title;
		this.file = val.audio;
		document.title = exgTitle(title);
	},
};
</script>
<style scoped lang='scss'>
.read-wrap {
	width: 100%;
	height: 100vh;
	overflow: hidden;
	transform: translate3d(0, 0, 0);
}
</style>