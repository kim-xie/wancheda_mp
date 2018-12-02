import Vue from 'vue'
import App from './App'
import Store from './store/store'
import Api from './api/index'

import './assets/style/common.scss'
import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store = Store
Vue.prototype.$http = Api

const app = new Vue(App)
app.$mount()
