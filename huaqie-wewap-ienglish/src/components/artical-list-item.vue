<template>
	<div class="artical-list-item border-b" @click='goDetail'>
		<div class="artical-avatar" v-if='detail.url'>
			<img :src="detail&&detail.url"/>
		</div>
		<div class="artical-msg">
			<p class='artical-title'>{{detail&&detail.title}}</p>
			<p class='artical-content'>{{detail&&detail.desc}}</p>
		</div>
		<div class="artical-icon">
			<img class='position-center' src="../assets/image/right.png" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'artical-list-item',
	props: {
		detail: {
			type: Object,
		},
	},
	methods: {
		goDetail() {
			this.$emit('handle-click');
		},
	},
};
</script>

<style lang='scss' scoped>
.artical-list-item.border-b::after {
	border-color: #F2F2F2;
}

.artical-list-item {
	padding: .2rem 0;
	display: flex;
}

.artical-msg {
	flex: 1;

	.artical-title, .artical-content {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		color: #333;
	}

	.artical-title {
		font-size: .3rem;
		margin-bottom: .2rem;
	}

	.artical-content {
		font-size: .24rem;
	}
}

.artical-avatar {
	width: 2.4rem;
	height: 1.8rem;
	margin-right: .2rem;
	overflow: hidden;
	position: relative;

	img {
		width: 100%;
	}
}

.artical-icon {
	width: .7rem;
	position: relative;

	img {
		width: 60%;
	}
}
</style>
