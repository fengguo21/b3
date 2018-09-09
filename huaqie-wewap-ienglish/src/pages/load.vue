<template>
	<div class="loading">
		<div class="loading-img">
			<img src="../assets/image/logo.jpg">
			<img src="../assets/image/logo-msg.png">
		</div>
		<div class="loading-tip">
			<p>让你终生受益的英语阅读习惯，
从爱英语一年精读计划开始！</p>
		</div>
	</div>
</template>

<script>
import * as store from '@/common/localStore';

export default {
	name: 'loading',
	data() {
		return {
			timer: null,
		};
	},
	methods: {
		setTime(router) {
			this.timer = setTimeout(() => {
				this.$router.push({
					path: router.path,
					query: router.query,
				});
			}, 3000)
		},
	},
	beforeCreate() {
		document.title = '爱英语'
	},
	created() {
		const newRouter = store.get('router');
		if(newRouter) {
			this.setTime(newRouter);
		} else {
			this.setTime({ path: '/material' });
		}
	},
	beforeDestroy() {
		if(this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	},
};
</script>

<style lang='scss' scoped>
.loading {
	width: 100%;
	height: 100vh;
	overflow: hidden;
	background: #fff;
	display: flex;
	flex-direction: column;

	.loading-img {
		flex: 1;
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		img {
			width: 90%;

			&:nth-child(1) {
				width: 75%;
				margin-bottom: .5rem;
			}

			&:nth-child(2) {
				margin-left: .8rem;
			}
		}
	}

	.loading-tip {
		padding: .8rem 0;

		p {
			width: 55%;
			margin: 0 auto;
			font-size: .24rem;
			text-align: center;
		}
	}
}	
</style>