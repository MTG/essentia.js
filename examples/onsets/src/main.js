import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import App from './App.vue';
// import EventBus from './core/event-bus';
import DSP from './core/processing';

const centralProcessing = new DSP();

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(VueCompositionAPI);
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(BootstrapVueIcons);

new Vue({
  el: '#vue-root',
  render: h => h(App)
})
