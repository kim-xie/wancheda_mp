import * as types from './mutation-type.js';

export default {
  // 更新用户信息
  [types.SET_USERINFO](state, userInfo) {
    state.userInfo = userInfo
  },
  // 更新待入库数量
  [types.SET_INPARTCOUNT](state, newInpartCount) {
    state.inpartCount = newInpartCount
  },
  // 更新待出库数量
  [types.SET_OUTPARTCOUNT](state, newOutpartCount) {
    state.outpartCount = newOutpartCount
  },
  // 更新待入库表单
  [types.SET_INPARTFORM](state, newInpartFormParam) {
    let inpartFormLen = state.inpartFormParam.length
    let _this = this
    for (var i = 0; i < state.inpartFormParam.length; i++) {
      if (newInpartFormParam.partId == state.inpartFormParam[i].partId) {
        alert('该配件已存在在待入库中，请前往待入库进行操作！')
        /* this.$alert('该配件已存在在待入库中，请前往待入库进行操作！', '温馨提示', {
            confirmButtonText: '确定',
          });*/
        return false
      }
    }
    state.inpartCount = inpartFormLen + 1
    state.inpartFormParam.push(newInpartFormParam)
  },
  // 更新待出库表单
  [types.SET_OUTPARTFORM](state, newOutpartFormParam) {
    let outpartFormLen = state.outpartFormParam.length
    for (var i = 0; i < state.outpartFormParam.length; i++) {
      if (newOutpartFormParam.partId == state.outpartFormParam[i].partId) {
        alert('该配件已存在在待出库中，请前往待出库进行操作！')
        /* this.$alert('该配件已存在在待入库中，请前往待入库进行操作！', '温馨提示', {
            confirmButtonText: '确定',
          });*/
        return false
      }
    }
    state.outpartCount = outpartFormLen + 1
    state.outpartFormParam.push(newOutpartFormParam)
  },

  // 更新维修订单
  // updateRepairItemCount(state, newRepairItemCount) {
  //   state.repairItemCount = newRepairItemCount
  // }

  // 保存编辑对象
  [types.SET_EDITITEM](state, editItem) {
    state.editItem = editItem
  },

  // 添加维修项目
  [types.SET_REPAIRITEM](state, repairItem) {
    if (repairItem.add){
      state.repairItems.push(repairItem)
      state.repairItemIds.push(repairItem.id)
    } else if (repairItem.delete){
      state.repairItems.splice(repairItem.index,1)
      state.repairItemIds.splice(repairItem.index,1)
    }else{
      state.repairItems[repairItem.index] = repairItem
      state.repairItemIds[repairItem.index] = repairItem.id
    }
  },

  // 添加维修领料
  [types.SET_INVENTORYITEM](state, inventoryItem) {
    if (inventoryItem.add) {
      state.inventoryItems.push(inventoryItem)
      state.inventoryItemIds.push(inventoryItem.id)
    } else if (inventoryItem.delete) {
      state.inventoryItems.splice(inventoryItem.index, 1)
      state.inventoryItemIds.splice(inventoryItem.index, 1)
    } else {
      state.inventoryItems[inventoryItem.index] = inventoryItem
      state.inventoryItemIds[inventoryItem.index] = inventoryItem.id
    }
  },

  // 保存开单客户信息
  [types.SET_CLIENT](state, client) {
    state.client = client
  }

}
