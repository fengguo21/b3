// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import App from './App';
import router from './router';
import store from 'store';
import VueTouch from 'vue-touch';
import VueScrollTo from 'vue-scrollto';
import Scrollactive from 'vue-scrollactive';
import { init } from './common/initConfig';

Vue.use(MintUI)
Vue.use(VueTouch, {name: 'v-touch'})
Vue.use(Scrollactive)
Vue.use(VueScrollTo)

Vue.config.productionTip = false
Vue.prototype.store = store

init();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
