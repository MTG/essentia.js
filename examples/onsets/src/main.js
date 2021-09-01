import Vue from 'vue';
import App from './App.vue';

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(BootstrapVueIcons);

new Vue({
  el: '#app',
  render: h => h(App)
})
