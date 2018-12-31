import * as types from './mutation-type.js'

export default {
  // 更新用户信息
  setUserInfo({commit}, data) {
    // console.log(data)
    return new Promise((resolve, reject) => {
      commit(types.SET_USERINFO, data)
      resolve()
    })
  },
  // 更新入库数量
  updateInPartCount({ commit }, data) {
    // console.log(data)
    return new Promise((resolve, reject) => {
      commit(types.SET_INPARTCOUNT, data)
      resolve()
    })
  },
  // 更新出库数量
  updateOutPartCount({
    commit
  }, data) {
    // console.log(data)
    return new Promise((resolve, reject) => {
      commit(types.SET_OUTPARTCOUNT, data)
      resolve()
    })
  },
  // 更新入库表单
  updateInpartFormParam({
    commit
  }, data) {
    //console.log(data)
    return new Promise((resolve, reject) => {
      commit(types.SET_INPARTFORM, data)
      resolve()
    })
  },
  // 更新出库表单
  updateOutpartFormParam({
    commit
  }, data) {
    // console.log(data)
    return new Promise((resolve, reject) => {
      commit(types.SET_OUTPARTFORM, data)
      resolve()
    })
  },
  // 保存更新对象
  saveEditItem({
    commit
  }, data) {
    return new Promise((resolve, reject) => {
      commit(types.SET_EDITITEM, '')
      commit(types.SET_EDITITEM, data)
      resolve()
    })
  }
}
