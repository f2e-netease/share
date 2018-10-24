import 'Css/base.css';
import '../css/index.css';
import  'Js/config.share';//分享
import  'Js/config.filter';//配置axios
import Vue from 'vue';

import store from './store';
import App from './App';
new Vue({
    el:"#app",
    template: '<App/>',
    store,
    components:{
        App
    }
});