import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import vuetify from './plugins/vuetify';

axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  vuetify,
  axios
}).$mount('#app')
