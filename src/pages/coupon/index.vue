<template>
  <div class="container">
    <div class="coupon">
      <div class="coupon_header clearfix">
        <!-- <span class="add_button float-right" @tap="handleAdd">新增</span> -->
        <van-button size="small" plain type="primary" class="add_button float-right" @tap="handleAdd">新增</van-button>
      </div>
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <div class="coupon_item" v-if="listData.length>0" v-for="(item,index) in listData" :key="index">
        <div class="item_header">
          <p class="item_name">
            <span class="name" v-if="item.date">{{item.date.couponId.value}}</span>
            <span class="code float-right">{{item.num}}</span>
          </p>
        </div>
        <div class="item_footer">
          <p class="item_edit">
            <span class="button delete" @tap="handleDelete(item)">删除</span>
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
        clientId: '',
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
        deleteId: '',
        deleteItem: {},
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
    mounted() {
      this.spinShow = false
    },
    onLoad(){
      this.firstLoad = false
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        this.clientId = urlParams.split('=')[1]
        if(this.clientId){
          this.listData = []
          this.getList(this.pageNo, this.pageSize)
        }
      }else{
        this.listData = []
        this.getList(this.pageNo, this.pageSize)
      }
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
      // 获取列表数据
      getList(pageNo, pageSize, callback){
        const params = {
          'search.clientId_eq': this.clientId,
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.spinShow = true
        this.$http.get(api.coupon_list, params).then( res => {
          if(res.success){
            this.spinShow = false
            this.listData = res.data.page.content
            this.totalData = res.data.page.totalElements
            if(callback && typeof callback == 'function'){
              callback()
            }
          }
          this.firstLoad = true
        })
      },
      // 新增维修项目
      handleAdd(){
        wx.navigateTo({
          url: '/pages/couponDetail/main?id='+this.clientId
        })
      },
      // 删除确认
      handleClick(data){
        const type = data.mp._relatedInfo.anchorTargetText
        const that = this
        if(type === '删除'){
          that.deleteApi(that.deleteItem,function(){
            that.modalVisible = false
          })
        }else{
          that.modalVisible = false
        }
      },
      // 删除维修项目
      handleDelete(item){
        this.deleteItem = item
        this.deleteId = item.id
        this.modalVisible = true
      },
      deleteApi(deleteItem,callback){
        this.spinShow = true
        delete deleteItem.date
        this.$http.post(api.coupon_delete,deleteItem).then( res => {
          if(res.success){
            this.spinShow = false
            globe.message(res.errorMsg,'success')
            this.getList(this.pageNo, this.pageSize)
            if(callback && typeof callback == 'function'){
              callback()
            }
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
.coupon{
  width: 100%;
  .coupon_header{
    height: 100%;
    margin: 0 auto;
    .add_button{
      margin: 10px 10px 0 0;
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
  .coupon_item{
    padding: 10px;
    width: 88%;
    margin: 0 auto;
    background: $--background-color-base;
    border-radius: 8px;
    margin-top: 20px;
    box-shadow: $--box-shadow-light;
    .item_header{
      border-bottom: 1px solid $--color-border-white;
      padding: 0 0 6px 0;
      .code{
        color: $--color-text-placeholder;
      }
    }
    .item_detail{
      padding: 10px 0;
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
