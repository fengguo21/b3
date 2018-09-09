<template>
	<div class='buy-course'>
		<div class="form-wrap">
			<div class="form-item border-b">
				<span class='label'>昵称</span>
				<span class='label' v-if='!edit'>{{showData.name || '待填写'}}</span>
				<span class='value' v-else>
					<input type="text" v-model='editData.name' @input='formChange' placeholder="推荐取一个英文名" />
				</span>
			</div>
			<div class="form-item border-b">
				<span class='label'>年龄</span>
				<span class='label' v-if='!edit'>{{showData.age || '待填写'}}</span>
				<span class='value' v-else>
					<input type="number" v-model='editData.age' @input='formChange' placeholder="如果是孩子在学，请填孩子的年龄"   />
				</span>
			</div>
			<div class="form-item border-b">
				<span class='label'>手机号</span>
				<span class='label' v-if='!edit'>{{showData.phone || '待填写'}}</span>
				<span class='value' v-else>
					<input type="number" v-model='editData.phone' @input='formChange' placeholder="请填写，用于老师联络您" />
				</span>
			</div>
			<div class="form-item">
				<span class='label'>城市</span>
				<span class='label' v-if='!edit'>{{showData.icity || '待填写'}}</span>
				<span class='value' v-else>
					<input type="text" v-model='editData.icity' @input='formChange' placeholder="便于老师了解当地英语教材" />
				</span>
			</div>
		</div>

		<div class="form-btn__wrap" @click='editMessage'>
			<div class="form-btn"  :class='{editing : isEmpty && edit}'>
				{{editBtn}}
			</div>
		</div>
	</div>
</template>
<script>
import { Toast } from 'mint-ui';
import * as store from '@/common/localStore';
import { updateUser, getPeople } from '@/api/api';
import bus from '@/bus';

const defaultAvatar = require('@/assets/image/default-avatar.png');
const me = store.get('me');

export default {
	name: 'mine-message-index',
	data() {
		return {
			edit: false,
			isEmpty: true,
			btnClass:'',
			editBtn:'填写/修改 资料',
			editData: {
				name: '',
				age:'',
				icity:'',
				phone: '',
			},
			showData: {
				name: '',
				age:'',
				icity:'',
				phone: '',
			},	
		};
	},
	watch: {
		edit() {
			this.validForm();
		},
	},
	beforeCreate() {
		document.title = '我的资料'
	},
	methods: {
		initData() {
			this.editData = {
				name: '',
				age:'',
				icity:'',
				phone: '',
			}
		},
		editMessage(){
			if(this.editBtn !== '保存') {
				this.edit = true;
				this.editBtn = '保存';
				this.initData();
				this.editData = JSON.parse(JSON.stringify(this.showData))
			} else {
				if(!this.isEmpty) {
					const params = Object.assign(this.editData, {
						peopleId: me.peopleId,
					})
					// console.log(params);
					updateUser(params).then(res => {
						if(res.code) {
							Toast({
					            message: res.message,
					        });
							return;
						}
						store.set('me', res.data);
						this.showData = JSON.parse(JSON.stringify(this.editData));
						this.edit = false;
						this.editBtn = '填写/修改 资料';
					})
				} else {
					Toast('所有信息都不能为空！');
				}
			}
		},
		validForm() {
			const data = this.editData;
			if(data.name && data.phone && data.icity && data.age){
				this.isEmpty = false;
			} else {
				this.isEmpty = true;
			}
		},
		formChange() {
			this.validForm();
		},
		init() {
			let show = this.showData;
			const storeMe = store.get('me');
			if(storeMe) {
				show.name = storeMe.basic.name;
				show.age = storeMe.basic.age;
				show.icity = storeMe.basic.icity;
				show.phone = storeMe.basic.phone;
			} else {
				getPeople({}).then(res => {
					if(res.code) {
						Toast(res.message);
						return;
					}
					store.set('me', res.data);
					show.name = res.data.basic.name;
					show.age = res.data.basic.age;
					show.icity = res.data.basic.icity;
					show.phone = res.data.basic.phone;
				})
			}
		},
	},
	created() {
		bus.$on('refresh', () => {
			this.init();
		})
		if(!store.get('logined')) {
			return;
		}
		this.init();
	},
}
</script>
<style scoped>
	.buy-course {
		min-height: 100vh;
	}
	input{
		width:100%;
	}
	.editing{
		background: #f8acac
	}
</style>