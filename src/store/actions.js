import * as types from './mutation-type.js'

export default {
  // 更新用户信息
  setUserInfo({commit}, data) {
    // console.log(data)
    commit(types.SET_USERINFO, data)
  },
  // 更新入库数量
  updateInPartCount({ commit }, data) {
    // console.log(data)
    commit(types.SET_INPARTCOUNT, data)
  },
  // 更新出库数量
  updateOutPartCount({
    commit
  }, data) {
    // console.log(data)
    commit(types.SET_OUTPARTCOUNT, data)
  },
  // 更新入库表单
  updateInpartFormParam({
    commit
  }, data) {
    //console.log(data)
    commit(types.SET_INPARTFORM, data)
  },
  // 更新出库表单
  updateOutpartFormParam({
    commit
  }, data) {
    // console.log(data)
    commit(types.SET_OUTPARTFORM, data)
  }
}
