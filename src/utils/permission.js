// import Vue from 'vue'

// /**权限指令**/
// const has = Vue.directive('has', {
//   bind: function (el, binding, vnode) {
//     console.log(binding.value)
//     // 获取页面按钮权限
//     let userPermission = vnode.context.$store.state.userInfo.date.role.code
//     console.log(userPermission)
//     if (!Vue.prototype.$_has(userPermission ? userPermission : binding.value)) {
//       el.parentNode.removeChild(el)
//     }
//   }
// })
// // 权限检查方法
// Vue.prototype.$_has = function (value) {
//   let isExist = false
//   if (value.indexOf('super_admin') > -1) {
//     isExist = true
//   }
//   return isExist
// }

// 校验角色
function checkPermission(){
  const role = this.$store.getters.userInfo.date.role.code
  if (role === 'super_admin') {
    return true
  } else {
    return false
  }
}

export default checkPermission