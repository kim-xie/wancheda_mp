<template>
  <div class="container">
    <div class="product">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <div class="product_header clearfix">
        <div class="search">
          <input type="text" v-model="searchVal" @blur="goSearch" placeholder="按名称或编号搜索">
          <i v-if="searchVal === ''" class="iconfont icon-search"></i>
          <i v-if="searchVal !== ''" class="iconfont icon-delete" style="color:red" @tap="clear"></i>
        </div>
        <van-button size="small" plain type="primary" class="add_button float-right" @tap="handleAdd">新增</van-button>
      </div>

      <van-collapse custom-class="item_wrap" :value="activeName" accordion v-if="listData.length>0">
        <van-collapse-item content-class="product_item" custom-class="product_item" v-for="(item,index) in listData" :key="index" :title="item.name" :value="item.code" :name="index" @tap="onChange($event,index)">
          <div class="item_detail">
            <p class="detail">
              <p class="items">
                <span class="label">批发价:</span>
                <span class="value">{{item.wholeSale}}</span>
              </p>
              <p class="items">
                <span class="label">销售价:</span>
                <span class="value">{{item.sale}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="items">
                <span class="label">单位:</span>
                <span class="value" v-if="item.date.unitLK">{{item.date.unitLK.value}}</span>
              </p>
              <p class="items">
                <span class="label">产地:</span>
                <span class="value">{{item.produceArea}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="items">
                <span class="label">适用车型:</span>
                <span class="value">{{item.carModel}}</span>
              </p>
              <p class="items">
                <span class="label">配件规格:</span>
                <span class="value" v-if="item.date.specificationLK">{{item.date.specificationLK.value}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="items">
                <span class="label">所属分类:</span>
                <span class="value" v-if="item.date.pCategoryLK">{{item.date.pCategoryLK.value}}</span>
              </p>
              <p class="items">
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
              <span v-if="item.isDisable == false" class="button disable" @tap.stop="handleStatus(item)">禁用</span>
              <span v-if="item.isDisable == true" class="button undisable" @tap.stop="handleStatus(item)">启用</span>
              <span v-if="item.isDisable == false" class="button edit" @tap.stop="handleEdit(item)">编辑</span>
              <span v-if="item.isDisable == false" class="button" @tap.stop="handleInpart(item)">入库</span>
              <span class="button delete" @tap.stop="handleDelete(item.id)">删除</span>
            </p>
          </div>
        </van-collapse-item>
      </van-collapse>

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
        activeName: -1,
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
    // 上拉加载，拉到底部触发
    onReachBottom() {
      // 到这底部在这里需要做什么事情
      //console.log('上拉加载')
      const that = this
      if(this.pageSize < this.totalData){
        this.loading = true
        this.tipmessage = '玩命加载中'
        this.pageSize = this.pageSize+10
        this.getList(this.pageNo, this.pageSize, function(){
          that.loading = false
          that.tipmessage = '我也是有底线的'
        })
      }
    },
    methods: {
      // 切换手风琴
      onChange(data,index){
        if(this.activeName == index){
          this.activeName = -1
        }else{
          this.activeName = index
        }
      },
      // 搜索
      goSearch(){
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
          //console.log(res)
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
    height: 100%;
    margin: 0 auto;
    .add_button{
      margin: 10px 10px 10px 0;
    }
    .search{
      display: block;
      position: relative;
      width: 95%;
      margin: 0 auto;
      input{
        height: 30px;
        line-height: 30px;
        border: 1px solid $--color-text-placeholder;
        border-radius: 4px;
        padding: 3rpx 80rpx 6rpx 12rpx;
      }
      .iconfont{
        position: absolute;
        right: 12rpx;
        top: 14rpx;
        font-size: 22px;
        color: $--color-text-placeholder;
      }
    }
  }
  .item_wrap{
    padding: 10px;
    width: 88%;
    margin: 0 auto;
    margin-top: 20px;
  }
  .product_item{
    box-shadow: $--box-shadow-light;
    .item_header{
      border-bottom: 1px solid $--color-border-white;
      padding: 0 0 6px 0;
      .code{
        color: $--color-text-placeholder;
      }
    }
    .item_detail{
      padding: 0 0 10px 4px;
      .items{
        padding: 2px 0;
      }
      .label{
        display: inline-block;
        width: 200rpx;
        color: $--color-text-regular;
      }
    }
    .item_footer{
      border-top: 1px solid $--color-border-white;
      text-align: center;
      padding-top: 8px;
      .button{
        display: inline-block;
        padding: 2px 10px;
        border: 1px solid $--color-text-placeholder;
        border-radius: 4px;
        margin: 0 8px;
        font-size: 14px;
        color: $--color-text-regular;
      }
      .button:hover{
        background-color: $--color-border-white;
      }
      .delete{
        color: $--color-danger;
      }
    }
  }
}
</style>
