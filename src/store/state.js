
const state = {
  userInfo: {}, // 用户信息
  inpartCount: 0, // 待入库数量
  outpartCount: 0, // 待出库数量
  inpartFormParam: [], // 待入库表单
  outpartFormParam: [], // 待出库表单
  repairItemCount: 0, // 维修订单
  editItem: {}, // 编辑对象
  client: {}, // 开单用户信息
  repairItems: [], // 维修项目列表
  repairItemIds: [], // 维修项目id
  inventoryItems: [], // 领料列表
  inventoryItemIds: [], // 领料库存id
};
export default state