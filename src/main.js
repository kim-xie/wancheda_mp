import Vue from 'vue'
import App from './App'
import Store from './store/store'
import Api from './api/index'

import './assets/style/common.scss'
import '../static/iconfont/iconfont.css'

//import has from './utils/permission'

Vue.directive('has', {
    bind: function (el, binding, vnode) {
        console.log(binding.value)
        // 获取页面按钮权限
        let userPermission = vnode.context.$store.state.userInfo.date.role.code
        //console.log(userPermission)
        if (!Vue.prototype.$_has(userPermission ? userPermission : binding.value)) {
        el.parentNode.removeChild(el)
        }
    },
    update: function (newValue, oldValue) {
        //console.log(newValue)
        //console.log(oldValue)
    }
})
// 权限检查方法
Vue.prototype.$_has = function (value) {
    let isExist = false
    if (value.indexOf('super_admin') > -1) {
        isExist = true
    }
    return isExist
}

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store = Store
Vue.prototype.$http = Api

const app = new Vue(App)
app.$mount()
