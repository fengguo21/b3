<template>
	<div class='bottom-fix__wrap'>
		<div class="bottom-fix">
			<div class='bottom-fix__title' @click.stop='showMask'>
				<slot name='title'>{{title}}</slot>	
			</div>
			<ul class="bottom-fix__mask" :class='{hide: !isShow}' v-if='list'>
				<li v-for='item in list' @click.stop='goPages(item)'>
					<i>
						<img :src="item.icon" />
					</i>
					<span>{{item.title}}</span>
				</li>
			</ul>
		</div>
		<div class="bottom-fix__bd" v-show='isShow' @click.stop='showMask'></div>
	</div>
</template>
<script>
export default {
	name: 'bottom-fix',
	data() {
		return {
		}
	},
	props: {
		title: {},
		list: {
			type: Array,
			default: null
		},
		isShow: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		showMask() {
			if(this.list) {
				// console.log('click show');
				this.$emit('show')
			} else {
				// console.log('no list do something');
				this.$emit('handle-click');
			}
		},
		goPages(param) {
			this.$emit('study', param);
		}
	}
}
</script>
<style lang='scss' scoped>
@mixin ver-middle {
	vertical-align: middle;
}
@mixin open-mode {
	backface-visibility: hidden;
	perspective: 1000;
	transform: translate3d(0, 0, 0);
}

.bottom-fix__wrap {
	position: relative;
	height: auto
}

.bottom-fix__bd {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1;
	width: 100%;
	height: 100vh
}

.bottom-fix {
	position: fixed;
	z-index: 2;
	bottom: 0;
	left: 0;
	width: 100%;
	height: .94rem;

	.bottom-fix__title {
		position: relative;
		z-index: 3;
		width: 100%;
		height: 100%;
		color: #fff;
		text-align: center;
		line-height: .94rem;
		background: #FF6666;

		span {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: .3rem;
			vertical-align: middle;
			box-sizing: border-box;
			background: #fff;
			color: #FF6666;
			display: block;
			padding: .1rem .08rem;
			border-radius: 3px;
			height: .47rem;
			line-height: .32rem;
			font-size: 14px;
		}
	}

	.bottom-fix__mask {
		@include open-mode;
		width: 100%;
		box-sizing: border-box;
		padding: .52rem .85rem;
		background: rgba(0, 0, 0, .6);
		position: absolute;
		top: -4.48rem;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		z-index: 2;
		transition: all .3s ease-in-out;

		&.hide {
			top: 0;
		}

		li {
			width: 2.8rem;
			height: 1.5rem;
			background: #fff;
			border-radius: .1rem;
			margin-top: .235rem;
			line-height: 1.5rem;
			text-align: center;
			
			i {
				display: inline-block;
				font-size: 0;
				width: .6rem;
				margin-right: .15rem;
				@include ver-middle;
			}

			img {
				@extend i
			}
			
			span {
				@include ver-middle;
			}
		}
	}
}
</style>