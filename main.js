import Vue from 'vue'
import App from './App'

import InitRequest from './common/common.js'
Vue.prototype._$InitRequest = InitRequest.InitRequest;


Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
