import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials=true;
axios.interceptors.request.use(config => {
    if (config.method === 'post') {
        config.data = qs.stringify(config.data, {arrayFormat: 'brackets'});
    }
    return config;
});
Vue.prototype.$http = axios;
export default axios;