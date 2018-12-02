import * as types from './mutation-type.js';

export default {
  [types.SET_USERINFO](state, userInfo) {
    console.log(userInfo)
    state.userInfo = userInfo
  }
}
