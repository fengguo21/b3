<template>
<div class='project' ref='project'>
	<div class="project-radio" ref='floor'>
		<mt-swipe>
			  <mt-swipe-item
			  	v-for='(item, index) in bannerList'
			  	:key='index'
			  	@click.native='handleBanner(item)'
			  >
				<img v-lazy.container="item.url"/>
			</mt-swipe-item>
			</mt-swipe>
	</div>
	<div class="nav-wrap">
		<scrollactive
			ref="scrollactive"
			class="my-nav"
			active-class="active"
			:class='{active : isFixed}'
			:offset="5"
		>
			<a
				v-for='item in floorList'
				:href="item.link"
				class='scrollactive-item'
			>{{item.title}}</a>
		</scrollactive>
		<div class="has-border" v-show="!isFixed"></div>
	</div>

	<div id='f1' ref='f1' class="margin-top__30 project-articles">
		<mode-header>发起理由</mode-header>
		<div class="article-box">
			<p>读什么样的书成为什么样的人。学好英语让你走到更远的地方，去看更大的世界。</p>
		</div>

		<div class="article-box">
			<h4>1.爱英语一年精读计划是什么？</h4>
			<p>爱英语一年精读计划的目标：①帮助学员养成受益终身的阅读习惯！②帮助学员循序渐进提高英文水平！
所谓精读，跟传统的绘本阅读有本质的区别。阅读只是我们精读计划的其中一个步骤，爱英语精读计划以一周为一本书为阅读时间长度，在一周里阅读者需完成七个阅读步骤：<span>①自主阅读；②听录音跟读；③不看文字听录音跟读；④中翻英练习；⑤看图说话练习；⑥写作练习；⑦阅读测试。</span>在一周内，通过不同步骤、难度系数不断提高的反复练习，辅以老师的及时点评和反馈，提高阅读者对阅读内容的吸收效果，使之将阅读内容内化为自己的知识存储。大量有效的输入保证了足够的输出，即英语交流“说”的资本。“精”保证了阅读的质量，“一年”的时间长度保证了阅读的数量，爱英语精读计划从质量和数量两个维度保证阅读者的进步和提高。</p>
			<p>只要参与其中，并每日坚持，爱英语精读计划一定会让你终身受益！我们致力于将之打造成全中国最优质的英语阅读项目！</p>
		</div>

		<div class="article-box">
			<h4>2.实证有效</h4>
			<p>一年精读计划我们在线下实践了三年时间，参与其中的学员无一例外全都得到了提高！只要坚持到两三个月，就可以非常明显地看到进步。习惯的养成是最大的惊喜，一个好习惯的养成可真不是一件易事！还有英语能力各方面的提升：口音的纠正、词汇的积累、自信心的提高……不一而足。</p>
			<p> 越来越觉得这是一件非常有意义的事情，遂想到复制到线上，让不止于上海的更多学员受惠！只要你坚持，我们就信心让你提高！</p>
		</div>
		<div class="article-box">
			<h4>3. 老师及时反馈</h4>
			<p>最有效的英语学习，不是参加一周一两次的培训课，不是三天打鱼两天晒网的绘本阅读，不是浅尝则止的泛读，不是漫无目在网上看视频，而是持续的语境接触、开口练习，并且必须持续得到老师的及时反馈！老师一周两次的点评和反馈，包括鼓励、纠音和建议，可以更好地激励学员坚持阅读，养成好的习惯！</p>
			<p> 重复持续的阅读&老师的及时反馈，是保证学习效果的两大法宝，两者必不可少！</p>
		</div>
	</div>
	<div id='f2' ref='f2' class="margin-top__30 project-articles">
		<mode-header>阅读素材</mode-header>
		<div class="article-box">
			<p>《牛津阅读树》是一套针对以英语为母语的孩子培养阅读兴趣的寓教于乐的阅读教材，由牛津大学出版。在英国是家喻户晓的英语母语学习材料，在全球亦有一百多个国家用它作为外语学习教材。中国的很多国际学校也使用此教材，且受到大量家长的推崇，口碑卓著！</p>
			<p>《牛津阅读树》具有非常强的可读性，不但数量庞大，全套极为完整，且由浅入深，文中的冒险故事趣味十足，小孩子更感兴趣。</p>
			<p>孩子阅读《牛津阅读树》，像爬树一样拾级而上，学习到大量地道的生字、文法和不同国家的文化，建立起学习英语的信心，享受到阅读的乐趣。</p>
			<p>书里所有的英文小故事都是英国孩子们正在阅读并耳熟能详的，和以英语为母语的孩子们一起阅读这些英文读本，可以帮助中国孩子们更加快速的掌握地道、流利的原声态的英语。</p>
		</div>
		<div class="article-box">
			<p>中国版的《牛津阅读树》名为《典范英语》（Good English），前6部（共12册）适合小学和初中，后4部皆为名家改写的名著，语言纯正地道，适合高中和成人阅读。</p>
		</div>
		<div class="article-box">
			<img src="../../assets/image/art1.png">
		</div>
	</div>
	<div id='f3' ref='f3' class="margin-top__30 project-articles">
		<mode-header>如何阅读</mode-header>
		<div class="article-box sp">
			<p>1.阅读时间：建议每天15分钟左右，不少于10分钟。</p>
		</div>
		<div class="article-box sp">
			<p>2.阅读步骤：常规阅读步骤一共有七步，即①自主阅读；②听录音跟读；③不看文字听录音跟读；④中翻英练习；⑤看图说话练习；⑥写作练习；⑦阅读测试。一周一书，一周里每天只需依次作一个步骤的练习即可。0-6岁小朋友的阅读步骤有变动，详见对应的课程首页。</p>
		</div>
		<div class="article-box sp">
			<p>3.如何开始阅读：</p>
			<p>1）如何免费试读：点击相应的课程免费试读→录音后分享到朋友圈→加老师微信→发朋友圈截图给老师，老师拉你进阅读群→老师第二天免费点评</p>
			<p>2）如何继续阅读：购买课程→每天阅读练习并录音后分享到朋友圈，解锁第二天课程，老师一周内点评两次学员的阅读作品，分别是开始阅读后的每一周第1天和第7天点评，即D1、D7、D8、D14、D15、D21、D22、D29、D30、D36……以此类推，请在以上阅读天数时将阅读作品发到阅读群，老师会在第二天统一进行点评。其他天数不需将阅读作品发至阅读群。</p>
		</div>
	</div>
	<div id='f4' ref='f4' class="margin-top__30 project-articles">
		<mode-header>明星作品</mode-header>
		<star-works v-for='(item, index) in starList' :key='index' :val='item'>
			<template slot='group'>{{item.basic.group}}</template>
		</star-works>
	</div>
	<bottom-fix
		:list='btnList'
		:isShow='showMask'
		@show='handleBottomFix'
		@study='goPages'
	>
		<template slot='title'>立刻免费试读！</template>
	</bottom-fix>
</div>
</template>
<script>
import modeHeader from '@/components/mode-header'
import bottomFix from '@/components/bottom-fix'
import starWorks from '@/components/star-works'
import * as store from '@/common/localStore'
import { Toast } from 'mint-ui'
import { getCourseList, getRecommendList } from '@/api/api'

const floorList = ['f1', 'f2', 'f3', 'f4'];

export default {
	name: 'project-index',
	components: {
		modeHeader,
		bottomFix,
		starWorks
	},
	data() {
		return {
			scrollWrap: '',
			fixHeight: 0,
			isFixed: false,
			showMask: false,
			bannerList:[
				{
					url:require('../../assets/image/banner1.jpg')
				},{
					url:require('../../assets/image/banner2.jpg')
				},{
					url:require('../../assets/image/banner3.jpg')
				},{
					url:require('../../assets/image/banner4.jpg')
				},{
					url:require('../../assets/image/banner5.jpg')
				}
			],
			floorList: [
				{
					link: '#f1',
					tab: 'tab1',
					title: '发起理由',
				},
				{
					link: '#f2',
					tab: 'tab2',
					title: '阅读素材',
				},
				{
					link: '#f3',
					tab: 'tab3',
					title: '如何阅读',
				},
				{
					link: '#f4',
					tab: 'tab4',
					title: '明星作品',
				},
			],
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
				}
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
			]
		}
	},
	methods: {
		handleBottomFix() {
			this.showMask = !this.showMask
		},
		goPages(item) {
			const isBuy = this.store.get('isFirstBuy' + item.param);
			// console.log(item);
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
		listenScroll() {
			const wScrollY = window.scrollY;
			if(wScrollY >= this.fixHeight) {
				this.isFixed = true;
			} else {
				this.isFixed = false;
			}
		},
		getCourseList() {
			getCourseList({
				free: 2,
				page: 1,
				size: 10,
			}).then(res => {
				if(res.code) {
					Toast(res.message);
					return;
				}
				this.btnList.map(item1 => {
					res.data.list.find(item2 => {
						if(item2.basic.title.match(item1.title)) {
							item1.productId = item2.productId;
						}
					})
				})
				// console.log(res);
			})
		},
		getRecommendList() {
			getRecommendList({
				page: 1,
				size: 4,
			}).then(res => {
				if(res.code) {
					Toast(res.message);
					return;
				}
				console.log(res);
			});
		},
	},
	beforeCreate() {
		let title = document.title;
		if(title != '爱英语') {
			document.title = '爱英语'
		}
	},
	mounted() {
		const floor = this.$refs.floor;
		const fixHeight = floor.offsetHeight;
		this.scrollWrap = floor;
		this.fixHeight = fixHeight;
		document.addEventListener('scroll', this.listenScroll);
		if(!store.get('sessionId')) {
			return;
		}
		this.getCourseList();
		this.getRecommendList();
	},
	beforeDestroy() {
		document.removeEventListener('scroll', this.listenScroll)
	},
}
</script>
<style scoped lang='scss'>
@import '../../assets/css/nav.scss';
$wrap-margin: .28rem;
@mixin break-text {
	word-break: break-all;
	color: #333;
	line-height: 1.4
}

.margin-top__30 {
	margin-top: $wrap-margin
}

.project {
	overflow-x: hidden;
}
.project-articles {
	background: #fff;
	box-sizing: border-box;
	padding: .34rem .22rem;
}

.project {
	box-sizing: border-box;
	background: #f2f2f2;
	min-height: 100vh;
	padding-bottom: 1.25rem;
}
.project-radio {
	width: 100%;
	height: 4rem;
	background: #D7D7D7;
}
.project-radio img{
	height: 4rem;
	width: 100%;
}

.article-box {
	@include break-text;
	margin-bottom: .3rem;

	img {
		width: 100%;
	}

	h4 {
		font-weight: normal;
		font-size: .32rem;
	}

	p {
		@include break-text;
		font-size: .30rem;
		text-indent: .52rem;

		span {
			color: #f00
		}
	}

	&.sp {
		p {
			text-indent: 0;
		}
	}
}
</style>