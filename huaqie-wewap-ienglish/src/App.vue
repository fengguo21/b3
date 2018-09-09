<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import './common/rem.js';

export default {
  name: 'app',
}
</script>

<style lang='scss'>
@import './assets/css/reset.css';
@import './assets/css/position.css';
@import './assets/css/border.css';
@import './assets/css/course-list.scss';
@import './assets/css/form.scss';
@import './assets/css/cropper.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  min-height: 100%;
}

/* navbar 样式 */
.mint-navbar {
	border-bottom: 1px solid #ccc;

	.mint-tab-item {
		color: #666;
		padding: .35rem 0;

		&.is-selected {
			border-bottom: 2px solid #999;
			color: #333;
			margin-bottom: 0
		}

		.mint-tab-item-label {
			text-align: center;
		}
	}
}

.dash-border {
	display: block;
	width: 100%;
	border-bottom: 1px dotted #999;
	padding-top: .1rem;
	-webkit-transform-origin: 0 0;
	-webkit-transform: scale(1);
	pointer-events: none;
}

.share-qrcode {
	overflow: hidden;
	margin-bottom: .2rem;

	p {
		text-align: center;
		font-size: .38rem;
		line-height: 1.5;
		margin-top: .05rem;
	}

	.qrcode-img {
		display: block;
		width: 2.8rem;
		height: 2.8rem;
		margin: .1rem auto 0;
	}
}

img[lazy=loading] {
    width: 1.6rem!important;
    height: 1.6rem!important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
