<template>
	<div class='mine'> <!--  最外层尽量为当前页面名  -->
		<div class='mine-wrap'> <!--  二层为 [一层名]-[二层模块名]  -->
			<div class='mine-header__title'>
				<img @click='showMask' :src='avatar' class='avatar'/>
				<p class='name'>{{username}}</p>
			</div> <!--  三层为 [一层名]-[二层模块名]__[三层功能名]  -->
			<div class="nav">
				<router-link 
					v-for='(item, index) in menuList'
					tag='div' 
					:to='item.path'
					class='navbox border-b'
					:key='index'
				>
					{{item.title}}
					<img class='position-y-center' src="../../assets/image/right.png">
				</router-link>
			</div>
		</div>
<!-- input mask -->
		<div 
			class="pic-mask" 
			:class='{"pic-mask-up" : isShow}'
			@click.self='closeMask'
		>
			<div class="mask-btns__wrap position-x-center" :class='{"mask-btns__up" : isShow}'>
				<ul class="mask-btns">
					<li class='mask-btns__photo border-b' @click.stop='chooseCamera'>拍照</li>
					<li class='mask-btns__camera' @click.stop='choosePhoto'>图库</li>
					<li @click.stop='closeMask' class='mask-btns__cancel'>取消</li>
				</ul>
			</div>
		</div>

<!-- 图片裁剪 mask showCropper-->
		<div class="cropper-mask" :class='{"cropper-mask-up" : showCropper}'>
			<div class="cropper-box__wrap">
				<div class="cropper-box position-center" >
					<img :src="imgUrl" alt="Picture" ref='cropper' id='cropper' />
				</div>
			</div> 
			<div class='cropper-btn__wrap border-t'>
				<span class='border-r' @click='closeCropperMask'>放弃</span>  
				<span @click='crop'>上传</span>
			</div>
		</div>
	</div>
</template>
<script>
import * as store from '@/common/localStore';
import wx from 'weixin-js-sdk';
import { Toast } from 'mint-ui';
import Cropper from 'cropperjs'; 
import { updateUser, uploadWechatFile, uploadAvatar } from '@/api/api';
import bus from '@/bus';

const me = store.get('me');
const defaultAvatar = require('@/assets/image/default-avatar.png');
const getRoundedCanvas = sourceCanvas => {  	        
	let canvas = document.createElement('canvas');  
	let context = canvas.getContext('2d');  
	const width = sourceCanvas.width;  
	const height = sourceCanvas.height;  

	canvas.width = width;  
	canvas.height = height;  

	context.imageSmoothingEnabled = true;  
	context.drawImage(sourceCanvas, 0, 0, width, height);  
	context.globalCompositeOperation = 'destination-in';  
	context.beginPath();  
	context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);  
	context.fill();  

	return canvas;  
};  
const countImgSize = baseImg => {
	let img = baseImg;
	img = img.substring(22);
	let equalIndex = img.indexOf('=');
	if(img.indexOf('=') > 0) {
		img = img.substring(0, equalIndex);
	}
	const imgLength=img.length;
	const fileLength = parseInt(imgLength - (imgLength / 8) * 2);

	return parseFloat(fileLength / 1024).toFixed(2);
}
const convertBase64UrlToBlob = urlData => {  
      
    let bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  
      
    //处理异常,将ascii码小于0的转换为大于0  
    const ab = new ArrayBuffer(bytes.length);  
    let ia = new Uint8Array(ab);  
    for (var i = 0; i < bytes.length; i++) {  
        ia[i] = bytes.charCodeAt(i);  
    }  
  
    return new Blob( [ab] , {type : 'image/png'});  
}  

export default {
	name: 'mine-index',
	methods: {
		initCropper() {
			const cropper = this.$refs.cropper;
			this.cropper = new Cropper(cropper, {
				aspectRatio: 1,  
		        viewMode: 1, 
		        background:false,  
		        zoomable:false,  
		        ready: () => {  
			        this.croppable = true;  
			    }  
			})
		},
		showMask() { 
			this.isShow = true;
		},
		closeMask() {
			this.isShow = false;
		},
		showCropperMask() {
			this.showCropper = true;
			if(this.cropper){  
				this.cropper.replace(this.imgUrl);  
			}  
		}, 
		closeCropperMask() {
			this.showCropper = false;
			this.cropper.destroy();
		},
		crop() {
			if (!this.croppable) {  
	        	return;  
	        }  
	        const croppedCanvas = this.cropper.getCroppedCanvas();
	        const roundedCanvas = getRoundedCanvas(croppedCanvas);
	        const url = roundedCanvas.toDataURL();
	        const imgSize = countImgSize(url);
	        if(imgSize > 700) {
	        	this.$messagebox.alert(`当前截取大小为 ${ imgSize } K<br />请截取小于700K的范围`, '截取失败')
	        	return;
	        }
	        this.uploadAvatar(url);
		},  
		chooseCamera() {
			this.choosePic(2);
		},
		choosePhoto() {
			this.choosePic(1); 
		},
		choosePic(type) {
			const source = type == 1
							? 'album'
							: 'camera';
			wx.chooseImage({
			    count: 1, // 默认9
			    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			    sourceType: [source], // 可以指定来源是相册还是相机，默认二者都有
			    success: res => {
			        const imgUrl = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
			        this.closeMask();
			        this.$indicator.open({
			          text: '正在准备运行环境，请稍后...',
			          spinnerType: 'fading-circle'
			        });
			        wx.uploadImage({
			            localId: imgUrl, // 需要上传的图片的本地ID，由chooseImage接口获得
			            isShowProgressTips: 0, // 默认为1，显示进度提示
			            success: (res) => {
			                const serverId = res.serverId; // 返回图片的服务器端ID
			                uploadWechatFile({
			                	mediaId: serverId,
			                	typehood: 'image',
			                }).then(res => {
			                	this.$indicator.close();
			                	if(res.code) {
			                		Toast(res.message);
			                		return;
			                	}
			                	this.imgUrl = res.data;
			                	this.showCropperMask();
			                })
			            }
			        });
			    },
			    cancel: res => {
			    	this.closeCropperMask();
			    	this.closeMask();
			    	Toast('已取消选择');
			    },
			});
		},
		uploadAvatar(avatar) {
			const bavatar = convertBase64UrlToBlob(avatar);
			console.log('bavatar', bavatar);
			let formData = new FormData();
			formData.append("file", bavatar);			
			this.$indicator.open({
			  text: '正在上传...',
			  spinnerType: 'fading-circle'
			});
			uploadAvatar(formData).then(res => {
				if(res.code) {
					Toast({
			            message: res.message,
			        });
					return;
				}
				updateUser({
					peopleId: me.peopleId,
					avatar: res.data.url,
				}).then(res => {
					this.$indicator.close();
					if(res.code) {
						Toast({
				            message: res.message,
				        });
						return;
					}
					store.set('me', res.data);
					this.avatar = res.data.basic.avatar;
					this.closeCropperMask();
				})
			})	
		},
	},
	data() {
		return {
			isShow: false,
			showCropper: false,
			avatar: defaultAvatar,
			avatarDb: '',
			username: '请先登录',
			cropper: null,
			croppable: false,
			imgUrl: '',
			menuList: [
				{
					title: '我的精读计划',
					path: '/mine-plan',
				},
				{
					title: '我的资料',
					path: '/mine-message',
				},
				{
					title: '阅读有奖',
					path: '/mine-award',
				},
				{
					title: '明星作品',
					path: '/mine-star',
				},
			],
		};
	},
	beforeCreate() { 
		// console.log(document.title);
		document.title = '爱英语'; 
	},
	mounted() {
		this.initCropper();
		bus.$on('refresh', () => {
			const me = store.get('me');
			if(me) {
				this.username = me.basic.name;
				this.avatar = me.basic.avatar;
			}	
		})
		if(!store.get('logined')) {
			return;
		}
		const me = store.get('me');
		if(me) {
			this.username = me.basic.name;
			this.avatar = me.basic.avatar;
		}	
	},
};
</script>
<style scoped lang='scss'>
@import '../../assets/css/input-mask.scss';

.mine {
	background: #f2f2f2;
	min-height: 100vh;
}

.avatar{
	width: 1.8rem;
	height: 1.8rem;
	border-radius: 50%;
	margin:0.7rem auto .2rem;
}

.mine-header__title{
	width:100%;
	overflow: hidden;
}

.name{
	text-align: center;
	font-size: .32rem;
	color: black;
	line-height: 1;
	margin-bottom: .7rem;
}

.nav{
	background: white;
}

.navbox{
	padding: .38rem 0;
	margin:0 .2rem 0 .3rem;
	font-size: .3rem;
}

.navbox.border-b::after {
	border-width: 1px;
	border-color: #999;
}
.navbox:last-child.border-b::after {
	border-color: #fff;
}

.navbox img{
	width: .5rem;
	right: 0;
}


</style>