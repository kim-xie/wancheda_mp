const api = {
  login: '/user/login',
  company_list: '/company/page',
  account_list: '/user/page',
  client_list: '/client/page',
  lookupdf_list: '/lookup_definition/page',
  lookup_list: '/lookup/pageByDefineCode?lookupDefineCode=',
  repair_list: '/repairItem/page',
  product_list: '/part/page',
  getLookupByCode: '/lookup/pageByDefineCode?lookupDefineCode=',
  inventory_list: '/inventory/listInventory',
  inpartInfo_list: '/inPartInfo/extendPage',
  outpartInfo_list: '/outPartInfo/extendPage',
  getLookupById: '/lookup/getById'
}

export default api