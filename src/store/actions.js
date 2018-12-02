import * as types from './mutation-type.js'

export default {
  setUserInfo({commit}, data) {
    console.log(data)
    commit(types.SET_USERINFO, data)
  }
}
