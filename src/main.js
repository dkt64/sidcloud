import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';

if (process.env.NODE_ENV == "development") {
  axios.defaults.baseURL = "http://localhost:8080";
  // axios.defaults.baseURL = "http://sidcloud.net"
}

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  axios
}).$mount('#app')
