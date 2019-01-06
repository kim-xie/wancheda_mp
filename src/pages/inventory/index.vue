<template>
  <div class="container">
    <div class="product">
      <div class="product_header">
        <span class="search">
          <input type="text" v-model="searchVal" @blur="goSearch" placeholder="按名称或编号搜索">
          <i v-if="searchVal === ''" class="iconfont icon-search"></i>
          <i v-if="searchVal !== ''" class="iconfont icon-delete" style="color:red" @tap="clear"></i>
        </span>
        <!-- <span class="add_button float-left mr10">公司</span> -->
      </div>
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>
      <div class="product_item" v-for="(item,index) in listData" :key="index">
        <div class="item_header">
          <p class="item_name">
            <span class="name">{{item.name}}</span>
            <span class="code float-right">{{item.code}}</span>
          </p>
        </div>
        <div class="item_detail">
          <p class="detail">
            <p class="">
              <span class="label">批发价:</span>
              <span class="value">{{item.wholeSale}}</span>
            </p>
            <p class="">
              <span class="label">销售价:</span>
              <span class="value">{{item.sale}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">库存量:</span>
              <span class="value">{{item.count}}</span>
            </p>
            <p class="">
              <span class="label">单位:</span>
              <span class="value">{{item.unitLKVal}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">适用车型:</span>
              <span class="value">{{item.carModel}}</span>
            </p>
            <p class="">
              <span class="label">产地:</span>
              <span class="value">{{item.produceArea}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">库位号:</span>
              <span class="value">{{item.repCodeLKVal}}</span>
            </p>
          </p>
        </div>
        <div class="item_footer">
          <p class="item_edit">
            <span v-if="select" class="button" @tap="handleSelect(item)">选择</span>
            <span v-if="select===''" class="button" @tap="inpart(item)">入库</span>
            <span v-if="select===''" class="button" @tap="outpart(item)">出库</span>
          </p>
        </div>
      </div>
      <!-- 暂无数据 -->
      <i-divider v-if="totalData===0 && searchVal !== ''" color="#2d8cf0" lineColor="#2d8cf0">抱歉，暂无数据</i-divider>

      <!-- 页底加载 -->
      <i-load-more v-if="totalData>pageSize" :tip="tipmessage" :loading="loading" />
    </div>
  </div>
</template>

<script>
  import globe from '../../utils/globe'
  import api from '../../api/api'
  import * as utils from '../../assets/js/utils'
  export default {
    data () {
      return {
        select: '',
        spinShow: true,
        tipmessage: '我也是有底线的',
        loading: false,
        listData: [],
        extendInfo: {},
        totalData: 0,
        pageNo: 1,
        pageSize: 8,
        form: {},
        search: {
          partName: '',
          partCode: ''
        },
        searchVal: ''
      }
    },
    onLoad() {
      this.select = ''
      this.spinShow = false
      this.getList(this.pageNo, this.pageSize)
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        const types = urlParams.split('?')[1]
        this.select = types.split('=')[1]
        console.log(this.select)
      }
    },
    // 下拉刷新
    onPullDownRefresh() {
      console.log('下拉刷新')
      console.log(this.pageNo)
      if(this.pageNo > 1){
        this.pageNo = this.pageNo-1
        this.getList(this.pageNo, this.pageSize, function(){
          wx.stopPullDownRefresh()
        })
      }
    },
    // 上拉加载，拉到底部触发
    onReachBottom() {
      // 到这底部在这里需要做什么事情
      console.log('上拉加载')
      const that = this
      if(this.pageNo < this.totalData/this.pageSize){
        this.loading = true
        this.tipmessage = '玩命加载中'
        this.pageNo = this.pageNo+1
        this.getList(this.pageNo, this.pageSize, function(){
          that.loading = false
          that.tipmessage = '我也是有底线的'
        })
      }
    },
    methods: {
      // 搜索
      goSearch(){
        console.log(this.searchVal)
        const searchVal = this.searchVal
        this.search.partName = ''
        this.search.partCode = ''
        if(utils.isChinese(searchVal)){
          this.search.partName = searchVal
        }else{
          this.search.partCode = searchVal
        }
        this.getList(this.pageNo, this.pageSize)
      },
      clear(){
        this.searchVal = ''
        this.search.partCode = ''
        this.search.partName = ''
        this.getList(this.pageNo, this.pageSize)
      },
      // 获取列表数据
      getList(pageNo, pageSize, callback){
        const params = {
          'partCode': this.search.partCode,
          'partName': this.search.partName,
          'search.isDeleted_eq': false,
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.spinShow = true
        this.$http.get(api.inventory_list, params).then( res => {
          console.log(res)
          if(res.success){
            this.listData = res.data.entitys
            this.totalData = res.data.entitys.length
            this.extendInfo = res.extendInfo
            this.getInventoryList(this.listData,this.extendInfo)
            console.log(this.listData)
            console.log(this.extendInfo)
            this.spinShow = false
            if(callback && typeof callback == 'function'){
              callback()
            }
          }else{
            this.spinShow = false
          }
        })
      },
      getInventoryList(tableData,extendInfo){
        for(var i=0; i<tableData.length;i++){
          tableData[i].repCodeLKVal = extendInfo.repCodeLK[tableData[i].repCodeLK].value
          tableData[i].name = extendInfo.partId[tableData[i].partId].name
          tableData[i].code = extendInfo.partId[tableData[i].partId].code
          tableData[i].unitLK = extendInfo.partId[tableData[i].partId].unitLK
          tableData[i].sale = extendInfo.partId[tableData[i].partId].sale
          tableData[i].wholeSale = extendInfo.partId[tableData[i].partId].wholeSale
          tableData[i].produceArea = extendInfo.partId[tableData[i].partId].produceArea
          tableData[i].carModel = extendInfo.partId[tableData[i].partId].carModel
          tableData[i].createTime = extendInfo.partId[tableData[i].partId].createTime
          tableData[i].updateTime = extendInfo.partId[tableData[i].partId].updateTime
          tableData[i].isDisable = extendInfo.partId[tableData[i].partId].isDisable
          tableData[i].unitLKVal = extendInfo.unitLK[tableData[i].unitLK].value
        }
      },
      // 入库
      inpart(item){
        const inpartForm = {
          partId: item.partId,
          supplierLK: item.supplierLK,
          count: item.count,
          repCodeLK: item.repCodeLK,
          cost: item.cost,
          company: item.company,
          code: item.code,
          name: item.name,
          carModel: item.carModel,
          wholeSale: item.wholeSale,
          sale: item.sale,
          produceArea: item.produceArea,
          unitLK: item.unitLK,
          unitLKVal: item.unitLKVal,
          repCodeLKVal: item.repCodeLKVal
        }
        this.$store.dispatch('saveEditItem', inpartForm).then(() => {
          wx.navigateTo({
            url: '/pages/inventoryDetail/main?type=inpart&id='+item.id
          })
        })
      },
      // 出库
      outpart(item){
        const outpartForm = {
          inventoryId: item.id,
          supplierLK: item.supplierLK,
          count: item.count,
          repCodeLK: item.repCodeLK,
          company: item.company,
          code: item.code,
          name: item.name,
          carModel: item.carModel,
          wholeSale: item.wholeSale,
          sale: item.sale,
          produceArea: item.produceArea,
          unitLK: item.unitLK,
          unitLKVal: item.unitLKVal,
          repCodeLKVal: item.repCodeLKVal
        }
        this.$store.dispatch('saveEditItem', outpartForm).then(() => {
          wx.navigateTo({
            url: '/pages/inventoryDetail/main?type=outpart&id='+item.id
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.product{
  width: 100%;
  .product_header{
    width: 90%;
    padding: 6px;
    background-color: #f2f4fb;
    height: 80rpx;
    margin: 0 auto;
    .add_button{
      padding: 3px 10px;
      border: 1px solid $--color-info;
      border-radius: 4px;
      margin-top:4px;
    }
    .search{
      display: block;
      position: relative;
      input{
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 3rpx 80rpx 6rpx 12rpx;
      }
      .iconfont{
        position: absolute;
        right: 12rpx;
        top: 8rpx;
        font-size: 22px;

      }
    }
  }
  .product_item{
    width: 90%;
    background-color: #f2f4fb;
    margin: 20px auto;
    border: 1px solid #f2f4fb;
    border-radius: 6px;
    padding: 6px;
    .item_header{
      border-bottom: 1px solid $--color-info;
      padding: 0 0 4px 0;
      .code{
        color: $--color-info;
      }
    }
    .item_detail{
      padding: 6px 0;
      .label{
        display: inline-block;
        width: 200rpx;
        color: $--color-text-regular;
      }
    }
    .item_footer{
      border-top: 1px solid $--color-info;
      text-align: center;
      padding-top: 6px;
      .button{
        display: inline-block;
        padding: 2px 10px;
        border: 1px solid $--color-info;
        border-radius: 4px;
        margin: 0 8px;
        color: $--color-text-regular;
      }
    }
  }
}
</style>
