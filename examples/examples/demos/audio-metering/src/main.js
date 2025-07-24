import Vue from 'vue';
import App from './App.vue';
import '@mdi/font/css/materialdesignicons.css';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const vuetifyOptions = {
    theme: {
        themes: {
            light: {
                primary: '#E4454A',
                secondary: '#9E9E9E',
                accent: '#E3E05B',
                error: '#961E22',
                info: '#2DA0E3',
                success: '#44E36E'
            }
        }
    }
};

new Vue({
    vuetify: new Vuetify(vuetifyOptions),
    el: '#app',
    render: h => h(App)
});
