<template>
  <div class="container">
    <div class="lookup">
      <div class="lookup_header">
        <span class="add_button float-right" @tap="handleAdd">新增</span>
      </div>
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <div class="lookup_item" v-if="listData.length>0" v-for="(item,index) in listData" :key="index">
        <div class="item_header">
          <p class="item_name">
            <span class="name">{{item.value}}</span>
            <span class="code float-right">{{item.code}}</span>
          </p>
        </div>
        <div class="item_detail">
          <p class="detail">
            <p class="">
              <span class="label">描述:</span>
              <span class="value">{{item.description}}</span>
            </p>
          </p>
        </div>
        <div class="item_footer">
          <p class="item_edit">
            <span class="button edit" @tap="handleEdit(item)">编辑</span>
            <span v-if="isSuperAdmin || isCompanyAdmin" class="button delete" @tap="handleDelete(item)">删除</span>
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
  import {isSuperAdmin, isCompanyAdmin} from '../../utils/permission'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        isCompanyAdmin: false,
        isSuperAdmin: false,
        lookupdfCode: '',
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
        definitionId: '',
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
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    onLoad(){
      this.firstLoad = false
      this.spinShow = false
      this.definitionId = ''
      this.deleteId = ''
      console.log(globe.getCurrentPageUrlArgs())
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        this.lookupdfCode = urlParams.split('=')[1]
        if(this.lookupdfCode){
          this.listData = []
          this.getList(this.pageNo, this.pageSize)
        }
      }else{
        this.listData = []
        this.getList(this.pageNo, this.pageSize)
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
      // 获取列表数据
      getList(pageNo, pageSize, callback){
        if(isSuperAdmin(this.userInfo.date.role.code)){
          this.isSuperAdmin = true
        } else if(isCompanyAdmin(this.userInfo.date.role.code)){
          this.isCompanyAdmin = true
        }
        const params = {
          pageNo,
          pageSize
        }
        this.spinShow = true
        this.$http.get(api.lookup_list + this.lookupdfCode, params).then( res => {
          if(res.success){
            this.spinShow = false
            this.listData = res.data.page.content
            this.definitionId = this.listData[0].definitionId
            this.totalData = res.data.page.totalElements
            if(callback && typeof callback == 'function'){
              callback()
            }
          }
          this.firstLoad = true
        })
      },
      // 新增
      handleAdd(){
        this.$store.dispatch('saveEditItem', '').then(() => {
          wx.navigateTo({
            url: '/pages/lookupDetail/main?id='+this.definitionId
          })
        })
      },
      // 编辑
      handleEdit(item){
        this.$store.dispatch('saveEditItem', item).then(() => {
          wx.navigateTo({
            url: '/pages/lookupDetail/main?id='+item.definitionId
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
      handleDelete(item){
        this.deleteId = item.id
        this.modalVisible = true
      },
      deleteApi(deleteId,callback){
        this.spinShow = true
        this.$http.delete(api.lookup_delete+'?id='+deleteId,null).then( res => {
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
.lookup{
  width: 100%;
  .lookup_header{
    width: 90%;
    padding: 6px;
    height: 22px;
    margin: 0 auto;
    .add_button{
      padding: 3px 10px;
      border: 1px solid $--color-info;
      border-radius: 4px;
      margin: 4px 0;
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
  .lookup_item{
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
