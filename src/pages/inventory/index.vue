<template>
  <div class="container">
    <div class="product">
      <div class="product_header">
        <span class="search">
          <input type="text" placeholder="按名称或编号搜索">
          <i class="iconfont icon-search"></i>
        </span>
        <span class="add_button float-left mr10">公司</span>
      </div>
      <div class="product_item" v-for="(item,index) in listData" :key="index">
        <div class="item_header">
          <p class="item_name">
            <span class="name">{{extendInfo.partId[item.partId].name}}</span>
            <span class="code float-right">{{extendInfo.partId[item.partId].code}}</span>
          </p>
        </div>
        <div class="item_detail">
          <p class="detail">
            <p class="">
              <span class="label">批发价:</span>
              <span class="value">{{extendInfo.partId[item.partId].wholeSale}}</span>
            </p>
            <p class="">
              <span class="label">销售价:</span>
              <span class="value">{{extendInfo.partId[item.partId].sale}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">库存量:</span>
              <span class="value">{{item.count}}</span>
            </p>
            <p class="">
              <span class="label">单位:</span>
              <span class="value">{{extendInfo.unitLK[extendInfo.partId[item.partId].unitLK].value}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">适用车型:</span>
              <span class="value">{{extendInfo.partId[item.partId].carModel}}</span>
            </p>
            <p class="">
              <span class="label">产地:</span>
              <span class="value">{{extendInfo.partId[item.partId].produceArea}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">库位号:</span>
              <span class="value">{{extendInfo.repCodeLK[item.repCodeLK].value}}</span>
            </p>
          </p>
        </div>
        <div class="item_footer">
          <p class="item_edit">
            <span class="button" @tap="inpart(item.id)">入库</span>
            <span class="button" @tap="outpart(item.id)">出库</span>
          </p>
        </div>
      </div>
      <!-- 页底加载 -->
      <i-load-more v-if="totalData>pageSize" :tip="tipmessage" :loading="loading" />
    </div>
  </div>
</template>

<script>
  import api from '../../api/api'
  export default {
    data () {
      return {
        tipmessage: '我也是有底线的',
        loading: false,
        listData: [],
        extendInfo: {},
        totalData: 0,
        pageNo: 1,
        pageSize: 8,
        form: {}
      }
    },
    mounted() {
      this.getList(this.pageNo, this.pageSize)
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
      // 获取列表数据
      getList(pageNo, pageSize, callback){
        const params = {
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.$http.get(api.inventory_list, params).then( res => {
          console.log(res)
          if(res.success){
            this.listData = res.data.entitys
            this.totalData = res.data.entitys.length
            this.extendInfo = res.extendInfo
            console.log(this.listData)
            console.log(this.extendInfo)
            if(callback && typeof callback == 'function'){
              callback()
            }
          }
        })
      },
      // 入库
      inpart(id){
        wx.navigateTo({
          url: '/pages/inventoryDetail/main?type=inpart&id='+id
        })
      },
      // 出库
      outpart(id){
        wx.navigateTo({
          url: '/pages/inventoryDetail/main?type=outpart&id='+id
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
    height: 140rpx;
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
