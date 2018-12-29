const api = {
  login: '/user/login',
  company_list: '/company/page',
  company_delete: '/company/removeById',
  company_edit: '/company/edit',
  company_add: '/company/new',
  account_list: '/user/page',
  account_delete: '/user/removeById',
  account_edit: '/user/edit',
  account_add: '/user/register',
  client_list: '/client/page',
  lookupdf_list: '/lookup_definition/page',
  lookup_list: '/lookup/pageByDefineCode?lookupDefineCode=',
  repair_list: '/repairItem/page',
  repair_delete: '/repairItem/removeById',
  repair_add: '/repairItem/new',
  repair_edit: '/repairItem/edit',
  product_list: '/part/page',
  getLookupByCode: '/lookup/pageByDefineCode?lookupDefineCode=',
  inventory_list: '/inventory/listInventory',
  inpartInfo_list: '/inPartInfo/extendPage',
  outpartInfo_list: '/outPartInfo/extendPage',
  getLookupById: '/lookup/getById'
}

export default api