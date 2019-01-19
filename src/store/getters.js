export const userInfo = (state) => {
  //console.log(state.userInfo)
  return state.userInfo
}

export const inpartCount = (state) => {
  //console.log(state.inpartCount)
  return state.inpartCount
}

export const outpartCount = (state) => {
  //console.log(state.outpartCount)
  return state.outpartCount
}

export const repairItemCount = (state) => {
  //console.log(state.repairItemCount)
  return state.repairItemCount
}

export const editItem = (state) => {
  //console.log(state.editItem)
  return state.editItem
}

export const client = (state) => {
  //console.log('client',state.client)
  return state.client
}

export const repairItems = (state) => {
  //console.log('repairItems', state.repairItems)
  return state.repairItems
}

export const repairItemIds = (state) => {
  //console.log('repairItemIds', state.repairItemIds)
  return state.repairItemIds.join(',')
}

export const inventoryItems = (state) => {
  //console.log('inventoryItems', state.inventoryItems)
  return state.inventoryItems
}

export const inventoryItemIds = (state) => {
  //console.log('inventoryItemIds', state.inventoryItemIds)
  return state.inventoryItemIds.join(',')
}