import Vue from 'vue'
import App from './App.vue'
import create from "./utils/create";
import Notice from "./components/kform/notice";
import store from './store'

Vue.config.productionTip = false;
Vue.prototype.$notice = function(props) {
  return create(Notice, props);
};

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
