<template>
  <div class="container">
    <div class="lookupdf">
      <div class="lookupdf_header clearfix">
        <div class="search">
          <input type="text" v-model="searchVal" @blur="goSearch" placeholder="按名称或代码搜索">
          <i v-if="searchVal === ''" class="iconfont icon-search"></i>
          <i v-if="searchVal !== ''" class="iconfont icon-delete" style="color:red" @tap="clear"></i>
        </div>
        <van-button size="small" plain type="primary" class="add_button float-right" @tap="handleAdd">新增</van-button>
      </div>

        <!-- iview 全局提示组件 -->
        <i-message id="message"/>
        <!-- 加载中组件 -->
        <i-spin size="large" fix v-if="spinShow"></i-spin>

        <i-swipeout v-for="(item,index) in listData" :key="index" :operateWidth="180" :unclosable="true" :toggle="toggle">
          <div slot="content">
            <div class="i-swipeout-des">
              <div class="i-swipeout-des-h2">
                <div class="item_name">
                  {{item.name}}
                  <span class="code float-right">{{item.code}}</span>
                </div>
              </div>
              <div class="i-swipeout-des-detail">{{item.description}}</div>
            </div>
          </div>
          <view slot="button" class="i-swipeout-button-group">
              <view class="i-swipeout-button" @tap="actionsTap('dictionary',item.code)">
                字典
              </view>
              <view v-if="isSuperAdmin || isCompanyAdmin" class="i-swipeout-button" @tap="actionsTap('edit',item)">
                编辑
              </view>
              <view v-if="isSuperAdmin" class="i-swipeout-button" style="color: #ed3f14;" @tap="actionsTap('delete',item.id)">
                删除
              </view>
          </view>
        </i-swipeout>

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
        searchVal: '',
        search: {
          name: '',
          code: ''
        },
        isCompanyAdmin: false,
        isSuperAdmin: false,
        toggle: false,
        modalVisible: false,
        firstLoad: false,
        spinShow: true,
        tipmessage: '我也是有底线的',
        loading: false,
        listData: [],
        totalData: 0,
        pageNo: 1,
        pageSize: 10,
        form: {},
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
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    onLoad(){
      this.spinShow = false
      this.firstLoad = false
      this.listData = []
      this.getList(this.pageNo, this.pageSize)
    },
    // 上拉加载，拉到底部触发
    onReachBottom() {
      // 到这底部在这里需要做什么事情
      console.log('上拉加载')
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
      // 搜索
      goSearch(data){
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
        if(isSuperAdmin(this.userInfo.date.role.code)){
          this.isSuperAdmin = true
        } else if(isCompanyAdmin(this.userInfo.date.role.code)){
          this.isCompanyAdmin = true
        }
        const params = {
          'search.name_like': this.search.name,
          'search.code_like': this.search.code,
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.spinShow = true
        this.$http.get(api.lookupdf_list, params).then( res => {
          if(res.success){
            this.listData = res.data.page.content
            this.totalData = res.data.page.totalElements
            if(callback && typeof callback == 'function'){
              callback()
            }
          }
          this.spinShow = false
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
      // 删除
      handleDelete(id){
        this.deleteId = id
        this.modalVisible = true
      },
      deleteApi(id,callback){
        this.spinShow = true
        this.$http.get(api.lookupdf_delete+'?id='+id,null).then( res => {
          if(res.success){
            this.spinShow = false
            this.toggle = false
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
      },
      // 新增数据字典定义
      handleAdd(){
        wx.navigateTo({
          url: '/pages/lookupdfDetail/main'
        })
      },
      // 操作
      actionsTap(type, id){
        if(type === 'dictionary'){
          wx.navigateTo({
            url: '/pages/lookup/main?id='+id
          })
        }else if(type === 'edit'){
          this.$store.dispatch('saveEditItem', id).then(() => {
            wx.navigateTo({
              url: '/pages/lookupdfDetail/main?id='+id.id
            })
          })
        }else{
          this.handleDelete(id)
        }
      }
    }
  }
</script>

<style lang="scss">
.i-swipeout-item{
  padding: 6px 20px!important;
}
</style>

<style lang="scss" scoped>
  .lookupdf{
    width: 100%;
    .lookupdf_header{
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
    .item_name{
      width: 100%;
    }
    .item_time{
      width: 50%;
      text-align: right;
    }
    .i-swipeout-des{
      width: 100%;
      .i-swipeout-des-detail{
        height: 60rpx;
        line-height: 60rpx;
        text-overflow: ellipsis;
        font-size: 12px;
        color: $--color-text-placeholder;
      }
      .code{
        color: $--color-text-secondary;
      }
    }
    .i-swipeout-button{
      float: left;
      width: 60px;
      text-align: center;
      background-color: $--color-primary-light-1;
      height: 100%;
      line-height: 170rpx;
      color: #fff;
    }
    .i-swipeout-button-group{
      i{
        font-size: 30px;
        color: $--color-white;
      }
      .icon-delete{
        color: $--color-danger;
      }
    }
  }
</style>
