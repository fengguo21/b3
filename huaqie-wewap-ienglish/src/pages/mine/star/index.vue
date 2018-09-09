<template>
	<div class="mine-star">
		<span class="title">本周老师推荐的明星作品</span>	
		<ul class='mine-star-list'>
			<li class='mine-star-item margin-top__30' v-for='(item, index) in starList'>
				<star-works  :key='index' :val='item'>
					<template slot='group'>{{item.basic.group}}</template>
				</star-works>
			</li>
		</ul> 	
	</div>
</template>
<script>
import starWorks from '@/components/star-works';
import { getRecommendList } from '@/api/api';
import * as store from '@/common/localStore';
import bus from '@/bus';

export default {	
	name: 'mine-star-index',
	components: { 
		starWorks,
	},
	methods: {
		getStarWorks() {
			getRecommendList({
				page: 1, 
				size: 4,
			}).then(res => {
				console.log(res);
			});
		},
	},
	beforeCreate() { 
        document.title = '明星作品';
    },
    created() {
    	bus.$on('refresh', () => {
    		this.getStarWorks();
    	})
    	if(!store.get('logined')) {
			return;
		}
    	this.getStarWorks();
    },
	data() {
		return {
			starList: [
				{
					basic: {
						group: '0-6岁组',
						avatar: require('@/assets/image/icon12-18.png'),
						name: '小蒜头'
					},
					extra: {
						avatar: require('@/assets/image/icon12-18.png'),
						time: '110',
						article: 'The Magic Porridge Pot'
					}
				},
				{
					basic: {
						group: '12-18岁组',
						avatar: require('@/assets/image/icon12-18.png'),
						name: 'Lindaodugsey'
					},
					extra: {
						avatar: require('@/assets/image/icon12-18.png'),
						time: '110',
						article: 'The Magic Porridge Pot'
					}
				}
			],
		};
	},
}
</script>
<style scoped>
.title{
	text-align: left;
	display: block;
	margin-top: 0.2rem;
	margin-left: 0.3rem;
	vertical-align: middle;
	height: 100%;
	font-size: 0.7em;
}

.margin-top__30 {
	margin-top: .28rem;
}

.mine-star-item {
	background: #fff;
	box-sizing: border-box;
	padding: .34rem .22rem;
}
</style>