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
  },
  // 更新维修工单的维修项目列表
  updateRepairItem({commit},item){
    return new Promise((resolve,reject) => {
      commit(types.SET_REPAIRITEM, item)
      resolve()
    })
  },
  // 更新维修领料列表
  updateInventoryItem({
    commit
  }, item) {
    return new Promise((resolve, reject) => {
      commit(types.SET_INVENTORYITEM, item)
      resolve()
    })
  },
  // 保存开单客户信息
  saveClient({
    commit
  }, item) {
    return new Promise((resolve, reject) => {
      commit(types.SET_CLIENT, item)
      resolve()
    })
  }
}
