<template>
	<div class="introduce layout">

		<div class="introduce-wrap">
			
			<p>长按下方二维码，参加爱英语一年精读计划</p>

			<div class="share-qrcode">
				<span class='qrcode-img'>
					<img src="../assets/image/webapp-qrcode.jpg" />
				</span>
				<p>爱英语微信公众号</p>	
			</div>	
			<i class='dash-border'></i>
			<p>长按下方二维码，加老师微信号咨询</p>

			<div class="share-qrcode">
				<span class='qrcode-img'>
					<img src="../assets/image/teacher-qrcode.png" />
				</span>
				<p>钟老师</p>	
			</div>	

			<a 
				:href='"tel:" + phone' 
				class="introduce-btn"
			>
				电话：{{phone}}
			</a>
		</div>

		<bottom-fix
			:title='title'
			@handle-click='goIntroduce'
		></bottom-fix>
	</div>
</template>

<script>
import bottomFix from '@/components/bottom-fix';

export default {
	name: 'introduce',
	components: { bottomFix },
	data() {
		return {
			title: '了解精读计划',
			phone: 13671918820,
		};
	},
	methods: {
		goIntroduce() {
			this.$router.push({
				name: 'projectIndex',
			});
		},
	},
};
</script>

<style lang='scss' scope>
.introduce {
	min-height: 100vh;
	box-sizing: border-box;
	background: #fff;

	.introduce-wrap {
		box-sizing: border-box;
		padding: .3rem;
		overflow: hidden;

		p {
			text-align: center;
			color: #333;
			margin: .2rem 0;
		}
	}

	.dash-border {
		padding: 0;
	}

	.introduce-btn {
		display: block;
		width: 80%;
		margin: 0 auto;
		border: 1px solid #ff6666;
		border-radius: .1rem;
		text-align: center;
		color: #ff6666;
		padding: .22rem;
		background: #fff;

		&:focus {
			outline: none;
		}
	}
}
.qrcode-img img {
	width: 100%;
}
</style>