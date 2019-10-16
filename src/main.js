import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  axios
}).$mount('#app')
