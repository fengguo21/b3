<template>
	<div class="buy-tip" :style='{background: bgColor}'>
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'msg-tip',
	props: {
		bgColor: {
			default: '#fff',
		},
	},
	data() {
		return {};
	},
};
</script>

<style lang='scss' scoped>
.buy-tip {
	padding: .2rem;
	display: flex;
	align-items: center;
	justify-content: center;

	.tip-icon {
		width: .5rem;
		margin-right: .1rem;
	}

	.primary-font {
		font-size: .28rem;
	}

	.small-font {
		font-size: .26rem;
	}

	.important {
		color: #f00;
		font-size: .36rem;
		font-weight: 700;
	}
}	
</style>