<template>
	<div class="star-works">
		<div class="star-works__group">
			<slot name='group'>{{group}}</slot>
		</div>
		<div class="star-works__member">
			<div class='member-avatar__wrap'>
				<img :src="val&&val.basic.avatar" />
			</div>
			<span>{{val&&val.basic.name}}</span>
		</div>
		<div class="star-works__msg" @click='goDetail(val)'>
			<img :src="val&&val.extra.avatar" />
			<p>
				爱英语一年精读计划{{val && val.basic.name}}第{{val && val.extra.time}}天作品《{{val && val.extra.article}}》
			</p>
		</div>
	</div>
</template>
<script>
export default {
	name: 'star-works',
	data() {
		return {
		}
	},
	props: {
		group: {},
		val: {
			type: Object,
			default: null
		}
	},
	methods: {
		goDetail(data) {
			console.log(data);
		}
	}
}
</script>
<style lang='scss' scoped>
$avatar-width: 1rem;
@mixin lines-hidden($lines: 2) {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: $lines;
	overflow: hidden;
}

.star-works__group {
	text-align: center;
	margin: .3rem 0;
}

.star-works__member {
	text-align: center;

	.member-avatar__wrap {
		width: $avatar-width;
		height: $avatar-width;
		overflow: hidden;
		margin: 0 auto;
		border-radius: 50%;
		border: 2px solid #D4D4D4;

		img {
			width: 100%;
		}

	}

	span {
		display: inline-block;
		font-size: 10px;
		color: #336699;
		margin: .14rem 0
	}
}

.star-works__msg {
	overflow: hidden;
	background: #f2f2f2;
	padding: .2rem .18rem;
	position: relative;

	img {
		float: left;
		width: .9rem;
	}

	p {
		@include lines-hidden;
		position: absolute;
		width: calc(100% - 1.2rem);
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		font-size: 12px;
		line-height: 1.5
	}
}
</style>