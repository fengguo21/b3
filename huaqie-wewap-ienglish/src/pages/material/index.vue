<template>
	<div class="material">
		<span id='#ff'></span>
		<div class="material-banner" ref='floor' id='container'>
			<mt-swipe>
			  <mt-swipe-item
			  	v-for='(item, index) in bannerList'
			  	:key='index'
			  	@click.native='handleBanner(item)'
			  >
				<img v-lazy.container="item.basic.image"/>
			</mt-swipe-item>
			</mt-swipe>
		</div>

		<div class="nav-wrap">
				<scrollactive
					ref="scrollactive"
					class="my-nav"
					active-class="active"
					:class='{active : isFixed}'
					:offset="10"
				>
					<a
						v-for='item in floorList'
						:href="item.link"
						class='scrollactive-item'
					>{{item.title}}</a>
				</scrollactive>
				<div class="has-border" v-show="!isFixed"></div>
			</div>

		<div id='f1' class="margin-top__30 material-items">
			<mode-header>免费读绘本</mode-header>
			<div class="material-items__step" v-for='item in stepList' @click='goStepDetail(item)'>
				<span class='position-y-center'>{{item.title}}</span>
				<img class='position-y-center' src="../../assets/image/right.png" />
			</div>
		</div>

		<div id='f2' class="margin-top__30 material-items">
			<mode-header>自然拼读</mode-header>
			<p>一段自然拼读视频素材介绍</p>
			<p>视频索取方法：在公众号主页面回复“自然拼读”即可获得百度网盘链接和密码</p>
		</div>

		<div id='f3' class="margin-top__30 material-items">
			<mode-header>唱歌学英文</mode-header>
			<p>一段话说明唱歌练英文口语的重要性</p>
			<p>歌曲索取方法：在公众号主页面回复“歌曲”即可获得百度网盘链接和密码</p>
		</div>

		<div id='f4' class="margin-top__30 material-items">
			<mode-header>英文学习方法</mode-header>
			<artical-list-item
				v-for='(item, index) in studyMethods'
				:detail='item'
				:key='index'
				@handle-click='goStudyMethod(item)'
			></artical-list-item>
			<div class="read-more" @click='readMore(1)'>浏览更多</div>
		</div>

		<div id='f5' class="margin-top__30 material-items">
			<mode-header>育儿方法</mode-header>
			<artical-list-item
				v-for='(item, index) in teachMethods'
				:detail='item'
				:key='index'
				@handle-click='goTeachMethod(item)'
			></artical-list-item>
			<div class="read-more" @click='readMore(2)'>浏览更多</div>
		</div>

		<bottom-fix
			:list='btnList'
			:isShow='showMask'
			@show='handleBottomFix'
			@study='goPages'
		>
			<template slot='title'>免费试读精读计划</template>
		</bottom-fix>
	</div>
</template>
<script>
import bottomFix from '@/components/bottom-fix';
import modeHeader from '@/components/mode-header';
import articalListItem from '@/components/artical-list-item';
import { getCourseList, getBanner, getArticleList } from '@/api/api';
import { Toast } from 'mint-ui';
import * as store from '@/common/localStore';

export default {
	name: 'material-index',
	components: {
		bottomFix,
		modeHeader,
		articalListItem,
	},
	methods: {
		handleBottomFix() {
			this.showMask = !this.showMask;
		},
		goPages(item) {
			const isBuy = this.store.get('isFirstBuy' + item.param);
			// console.log(isBuy === undefined);
			if(isBuy === undefined) {
				this.$router.push({
					name: 'projectIntro',
					query: {
						type: item.param,
						productId: item.productId,
					}
				})
			} else {
				this.$router.push({
					name: 'projectList',
					query: {
						type: item.param,
						productId: item.productId,
					}
				})
			}
		},
		handleBanner(data) {
			const detail = {
				title: data.basic.title,
				content: data.basic.text,
			}
			this.$router.push({
				name: 'materialArdetail',
				query: {
					detail: JSON.stringify(detail),
				},
			});
		},
		// 前往免费绘本详情
		goStepDetail(data) {
			if(!data.productId) {
				this.$toast('网络出错，请稍后再试');
				return;
			}
			// console.log(data);
			this.$router.push({
				name: 'materialCourse',
				query: {
					type: data.param,
					param: JSON.stringify(data),
				},
			});
		},
		// 前往学习方法详情
		goStudyMethod(data) {
			if(!data.feedId) {
				this.$toast('网络出错，请稍后再试');
				return;
			}
			this.$router.push({
				name: 'materialArdetail',
				query: {
					type: 1,
					detail: JSON.stringify(data),
				},
			});
		},
		// 前往育儿方法详情
		goTeachMethod(data) {
			if(!data.feedId) {
				this.$toast('网络出错，请稍后再试');
				return;
			}
			this.$router.push({
				name: 'materialArdetail',
				query: {
					type: 2,
					detail: JSON.stringify(data),
				},
			});
		},
		// 前往所有列表
		readMore(type) {
			// console.log(type);
			this.$router.push({
				name: 'materialArlist',
				query: {
					type: type,
				},
			});
		},
		listenScroll() {
			const wScrollY = window.scrollY;
			if(wScrollY >= this.fixHeight) {
				this.isFixed = true;
			} else {
				this.isFixed = false;
			}
		},
		getArticleList(group, arrName){
			getArticleList({
				page: 1,
				size: 4,
				group: group,
			}).then(res => {
				if(res.code) {
					Toast(res.message);
					return;
				}
				let arr = [];
				// console.log(arrName, res)
				res.data.list.forEach(item => {
					const detail = item.basic;
					arr.push({
						feedId: item.feedId,
						url: detail.avatar,
						title: detail.title,
						desc: detail.desc,
						content: detail.content,
					})
				})
				this[arrName] = arr;
			})
		},
		getCourseList(type, arr) {
			getCourseList({
				free: type,
				page: 1,
				size: 10,
			}).then(res => {
				if(res.code) {
					Toast(res.message);
					return;
				}
				// console.log('arrRES'+ arr +'====', res)
				this[arr].map(item1 => {
					res.data.list.find(item2 => {
						if(item2.basic.title.match(item1.title)) {
							item1.productId = item2.productId;
						}
					})
				})
				// console.log(arr, this[arr]);
			})
		},
		getBanner() {
			getBanner({
				page: 1,
				size: 20,
			}).then(res => {
				if(res.code) {
					Toast(res.message);
					return;
				}
				this.bannerList = res.data.list;
				// console.log(res);
			})
		},
	},
	beforeCreate() {
		document.title = '免费资源';

	},
	mounted() {
		const screenWidth = document.body.offsetWidth;
		const scrollOffset = -55 / 375 * screenWidth;
		const query = this.$route.query;
		const scrollDom = query && query.index
							? '#f' + query.index
							: '#ff';
		this.$scrollTo(scrollDom, 500, { offset: scrollOffset });
		const floor = this.$refs.floor;
		const fixHeight = floor.offsetHeight;
		this.scrollWrap = floor;
		this.fixHeight = fixHeight;
		document.addEventListener('scroll', this.listenScroll);
		if(!store.get('sessionId')) {
			return;
		}
		this.getCourseList(2, 'btnList');
		this.getCourseList(1, 'stepList');
		this.getArticleList(2, 'teachMethods');
		this.getArticleList(1, 'studyMethods');
		this.getBanner();
	},

	beforeDestroy() {
		document.removeEventListener('scroll', this.listenScroll)
	},
	data() {
		return {
			scrollWrap: '',
			fixHeight: 0,
			showMask: false,
			isFixed: false,
			floorList: [
				{
					link: '#f1',
					tab: 'tab1',
					title: '免费绘本',
				},
				{
					link: '#f2',
					tab: 'tab2',
					title: '自然拼读',
				},
				{
					link: '#f3',
					tab: 'tab3',
					title: '英语歌曲',
				},
				{
					link: '#f4',
					tab: 'tab4',
					title: '学习方法',
				},
				{
					link: '#f5',
					tab: 'tab5',
					title: '育儿知识',
				},
			],
			btnList: [
				{
					icon: require('@/assets/image/icon0-6.png'),
					title: '0-6岁',
					param: '1'
				},
				{
					icon: require('@/assets/image/icon6-12.png'),
					title: '6-12岁',
					param: '2'
				},
				{
					icon: require('@/assets/image/icon12-18.png'),
					title: '12-18岁',
					param: '3'
				},
				{
					icon: require('@/assets/image/icon18-s.png'),
					title: '成人',
					param: '4'
				}
			],
			stepList: [
				{
					title: '培生儿童英语分级阅读第一级别',
					param: '1',
				},
				{
					title: '培生儿童英语分级阅读第二级别',
					param: '2',
				},
				{
					title: '培生儿童英语分级阅读第三级别',
					param: '3',
				},
				{
					title: '培生儿童英语分级阅读第四级别',
					param: '4',
				},
			],
			studyMethods: [],
			teachMethods: [],
			bannerList: [],
		};
	},
};
</script>
<style lang='scss' scoped>
@import '../../assets/css/nav.scss';

$wrap-margin: .28rem;

.nav-wrap .has-border {
	width: 20%;
}

.material {
	box-sizing: border-box;
	background: #f2f2f2;
	min-height: 100vh;
	padding-bottom: 1.25rem;
}

.material-banner {
	width: 100%;
	height: 4rem;
	overflow: hidden;
	background: #D7D7D7;

	img {
		width: 100%;
	}
}

.material-items {
	background: #fff;
	box-sizing: border-box;
	padding: .34rem .22rem;

	> p {
		color: #333;
		margin-bottom: .3rem;
		font-size: .32rem;
	}

	.material-items__step {
		width: 100%;
		height: 1.3rem;
		text-align: center;
		margin-bottom: .2rem;
		font-size: .32rem;
		position: relative;
		background: #F2F2F2;

		span {
			display: block;
			width: 100%;
			text-align: center;
			font-size: .28rem;
		}

		img {
			width: .45rem;
			right: .3rem;
		}
	}

	.read-more {
		font-size: .3rem;
		text-align: center;
		color: #527EFF;
		padding-top: .34rem;
	}
}

.margin-top__30 {
	margin-top: $wrap-margin;
}
</style>