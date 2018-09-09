<template>
	<div class='mode-header'>
		<span class='mode-header__title'>
			<slot>
				{{title}}
			</slot>
		</span>
	</div>
</template>
<script>
export default {
	name: 'mode-header',
	props: [ 'title' ]
}
</script>
<style lang='scss' scoped>
@mixin line($redir) {
	content: '';
	display: block;
	position: absolute;
	width: 2.26rem;
	height: 0;
	transform: translateY(-50%);
	top: 50%;
	border-bottom: 1px solid #f2f2f2;
	-webkit-transform-origin: 0 0;
    -webkit-transform: scale(1);
	#{ $redir }: 0
}

.mode-header {
	position: relative;
	margin-bottom: .15rem;

	.mode-header__title {
		position: relative;
		text-align: center;
		display: block;
		line-height: 1.5;
		font-size: .32rem;

		&::after {
			@include line(right);
		}

		&::before {
			@include line(left);
		}
	}
}
</style>