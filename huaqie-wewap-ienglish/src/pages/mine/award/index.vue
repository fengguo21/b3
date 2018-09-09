<template>
    <div class="page-name">
        
    </div>
</template>
<script>
import * as store from '@/common/localStore';
import bus from '@/bus';

export default {
	name: 'mine-award-index',
    beforeCreate() { 
        document.title = '阅读有奖';
    },
    created() {
        bus.$on('refresh', () => {
            // this.getCourseById();
        })
        if(!store.get('logined')) {
            return;
        }
    },
}
</script>
<style scoped lang='scss'>
</style>