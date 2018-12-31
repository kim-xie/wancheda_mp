<template>
  <div class="container">
    <div class="product">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <div class="product_header">
        <span class="search">
          <input type="text" v-model="searchVal" @blur="goSearch" placeholder="按名称或编号搜索">
          <i v-if="searchVal === ''" class="iconfont icon-search"></i>
          <i v-if="searchVal !== ''" class="iconfont icon-delete" style="color:red" @tap="clear"></i>
        </span>
        <span class="add_button float-right" @tap="handleAdd">新增</span>
      </div>
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
              <span class="label">单位:</span>
              <span class="value" v-if="item.date.unitLK">{{item.date.unitLK.value}}</span>
            </p>
            <p class="">
              <span class="label">产地:</span>
              <span class="value">{{item.produceArea}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">适用车型:</span>
              <span class="value">{{item.carModel}}</span>
            </p>
            <p class="">
              <span class="label">配件规格:</span>
              <span class="value" v-if="item.date.specificationLK">{{item.date.specificationLK.value}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">所属分类:</span>
              <span class="value" v-if="item.date.pCategoryLK">{{item.date.pCategoryLK.value}}</span>
            </p>
            <p class="">
              <span class="label">状态:</span>
              <span v-if="item.isDisable == false" class="value undisable">启用</span>
              <span v-if="item.isDisable == true" class="value disable">禁用</span>
            </p>
          </p>
          <p class="detail">
            <span class="label">备注:</span>
            <span class="value">{{item.description}}</span>
          </p>
        </div>
        <div class="item_footer">
          <p class="item_edit">
            <span v-if="item.isDisable == false" class="button disable" @tap="handleStatus(item)">禁用</span>
            <span v-if="item.isDisable == true" class="button undisable" @tap="handleStatus(item)">启用</span>
            <span v-if="item.isDisable == false" class="button edit" @tap="handleEdit(item)">编辑</span>
            <span v-if="item.isDisable == false" class="button" @tap="handleInpart(item)">入库</span>
            <span class="button delete" @tap="handleDelete(item.id)">删除</span>
          </p>
        </div>
      </div>

      <!-- 暂无数据 -->
      <i-divider v-if="totalData===0 && firstLoad" color="#2d8cf0" lineColor="#2d8cf0">抱歉，暂无数据</i-divider>

      <!-- 页底加载 -->
      <i-load-more v-if="totalData>pageSize" :tip="tipmessage" :loading="loading" />

      <i-modal title="删除确认" :visible="modalVisible" :actions="actions" @tap="handleClick($event)">
        <view>删除后数据将无法恢复哦</view>
      </i-modal>
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
        modalVisible: false,
        firstLoad: false,
        spinShow: true,
        tipmessage: '我也是有底线的',
        loading: false,
        listData: [],
        totalData: 0,
        pageNo: 1,
        pageSize: 8,
        form: {},
        search: {
          name: '',
          code: ''
        },
        searchVal: '',
        deleteId: '',
        actions: [
            {
                name: '取消'
            },
            {
                name: '删除',
                color: '#ed3f14',
            }
        ]
      }
    },
    onLoad() {
      this.firstLoad = false
      this.spinShow = false
      this.listData = []
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
      // 搜索
      goSearch(){
        console.log(this.searchVal)
        const searchVal = this.searchVal
        this.search.name = ''
        this.search.code = ''
        if(utils.isChinese(searchVal)){
          this.search.name = searchVal
        }else{
          this.search.code = searchVal
        }
        this.getList(this.pageNo, this.pageSize)
      },
      clear(){
        this.searchVal = ''
        this.search.name = ''
        this.search.code = ''
        this.getList(this.pageNo, this.pageSize)
      },
      // 获取列表数据
      getList(pageNo, pageSize, callback){
        const params = {
          'search_name_like': this.search.name,
          'search_code_like': this.search.code,
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.spinShow = true
        this.$http.get(api.product_list, params).then( res => {
          console.log(res)
          if(res.success){
            this.listData = res.data.page.content
            this.totalData = res.data.page.totalElements
            this.spinShow = false
            if(callback && typeof callback == 'function'){
              callback()
            }
          }else{
            this.spinShow = false
          }
        })
      },
      // 新增
      handleAdd(){
        wx.navigateTo({
          url: '/pages/productDetail/main'
        })
      },
      // 编辑
      handleEdit(item){
        this.$store.dispatch('saveEditItem', item).then(() => {
          wx.navigateTo({
            url: '/pages/productDetail/main?id='+item.id
          })
        })
      },
      // 启用禁用
      handleStatus(item){
        const params = {
          id: item.id,
          isDisable: item.isDisable===false ? true : false
        }
        this.spinShow = true
        this.$http.post(api.product_edit, params).then( res => {
          console.log(res.success)
          if(res.success){
            globe.message(res.errorMsg, 'success')
            this.getList(this.pageNo, this.pageSize)
            this.spinShow = false
          }else{
            globe.message(res.errorMsg, 'warning')
            this.spinShow = false
          }
        })
      },
      // 入库
      handleInpart(item){
        const partsForm = {
          partId: item.id,
          code: item.code,
          name: item.name,
          carModel: item.carModel,
          wholeSale: item.wholeSale,
          produceArea: item.produceArea,
          unitLK: item.unitLK,
          unitLKVal: item.date.unitLK.value
        }
        this.$store.dispatch('saveEditItem', partsForm).then(() => {
          wx.navigateTo({
            url: '/pages/productInpartDetail/main?id='+item.id
          })
        })
      },
      // 删除确认
      handleClick(data){
        const type = data.mp._relatedInfo.anchorTargetText
        const that = this
        if(type === '删除'){
          that.deleteApi(that.deleteId,function(){
            that.modalVisible = false
          })
        }else{
          that.modalVisible = false
        }
      },
      // 删除维修项目
      handleDelete(id){
        this.deleteId = id
        this.modalVisible = true
      },
      deleteApi(id,callback){
        this.spinShow = true
        this.$http.delete(api.product_delete+"?id="+id,null).then( res => {
          if(res.success){
            globe.message(res.errorMsg,'success')
            this.getList(this.pageNo, this.pageSize)
            if(callback && typeof callback == 'function'){
              callback()
            }
            this.spinShow = false
          }else{
            globe.message(res.errorMsg,'warning')
            this.spinShow = false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.disable{
  color: red!important;
}
.undisable{
  color: green!important;
}
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
