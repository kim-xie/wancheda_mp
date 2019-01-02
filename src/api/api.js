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
  client_add: '/client/new',
  client_edit: '/client/edit',
  client_delete: '/client/removeById',
  coupon_list: '/clientCoupon/page',
  coupon_add: '/clientCoupon/addCoupon',
  coupon_delete: '/clientCoupon/reduceCoupon',
  lookupdf_list: '/lookup_definition/page',
  lookupdf_add: '/lookup_definition/new',
  lookupdf_edit: '/lookup_definition/edit',
  lookupdf_delete: '/lookup_definition/removeById',
  lookup_list: '/lookup/pageByDefineCode?lookupDefineCode=',
  lookup_add: '/lookup/new',
  lookup_edit: '/lookup/edit',
  lookup_delete: '/lookup/removeById',
  repair_list: '/repairItem/page',
  repair_delete: '/repairItem/removeById',
  repair_add: '/repairItem/new',
  repair_edit: '/repairItem/edit',
  product_list: '/part/page',
  product_add: '/part/new',
  product_edit: '/part/edit',
  product_delete: '/part/removeById',
  getLookupByCode: '/lookup/pageByDefineCode?lookupDefineCode=',
  inventory_list: '/inventory/listInventory',
  inpartInfo_list: '/inPartInfo/extendPage',
  inpart_add: '/inPart/newInPart',
  outpartInfo_list: '/outPartInfo/extendPage',
  outPart_add: '/outPart/newOutPart',
  repairWorkorder: '/repairWorkorder/page',
  getLookupById: '/lookup/getById'
}

export default api