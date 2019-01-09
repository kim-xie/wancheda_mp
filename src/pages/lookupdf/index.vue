<template>
  <div class="container">
    <div class="lookupdf">
      <!-- <i-panel title="数据字典定义列表"> -->
        <!-- <i-collapse :name="collapseName" accordion>
            <i-collapse-item v-for="(item,index) in listData" :key="index" :title="item.name" :name="item.id">
                <view slot="content">
                    <p>
                      <span>{{item.code}}</span>
                      <span>{{item.description}}</span>
                      <span>{{item.type}}</span>
                      <span>{{item.createTime}}</span>
                    </p>
                </view>
            </i-collapse-item>
        </i-collapse> -->

        <!-- iview 全局提示组件 -->
        <i-message id="message"/>
        <!-- 加载中组件 -->
        <i-spin size="large" fix v-if="spinShow"></i-spin>

        <!-- <i-action-sheet :visible="actionVisible" :actions="actions" show-cancel @cancel="handleCancel" @click="handleClickItem">
          <div slot="header" style="padding: 16px">
            <div style="color: #444;font-size: 16px">确定要删除此数据吗？</div>
            <p>删除后无法恢复哦</p>
          </div>
        </i-action-sheet> -->

        <i-swipeout v-for="(item,index) in listData" :key="index" :operateWidth="160" :unclosable="true" :toggle="toggle">
          <div slot="content">
            <div class="i-swipeout-des">
              <div class="i-swipeout-des-h2">
                <div class="item_name">
                  {{item.name}} _ <span class="code">{{item.code}}</span>
                </div>
                <!-- <div class="item_time">
                  <span class="">创建时间: {{item.createTime}}</span>
                </div> -->
              </div>
              <div class="i-swipeout-des-detail">{{item.description}}</div>
            </div>
          </div>
          <view slot="button" class="i-swipeout-button-group">
              <view class="i-swipeout-button" @tap="actionsTap('dictionary',item.code)">
                <i class="iconfont icon-i-order"></i>
              </view>
              <view v-if="isSuperAdmin || isCompanyAdmin" class="i-swipeout-button" @tap="actionsTap('edit',item)">
                <i class="iconfont icon-edit"></i>
              </view>
              <view v-if="isSuperAdmin" class="i-swipeout-button" @tap="actionsTap('delete',item.id)">
                <i class="iconfont icon-delete"></i>
              </view>
          </view>
        </i-swipeout>
      <!-- </i-panel> -->

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
  import {isSuperAdmin, isCompanyAdmin} from '../../utils/permission'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
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
        pageSize: 20,
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
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.$http.get(api.lookupdf_list, params).then( res => {
          if(res.success){
            this.listData = res.data.page.content
            this.totalData = res.data.page.totalElements
            if(callback && typeof callback == 'function'){
              callback()
            }
          }
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
      // 操作
      actionsTap(type, id){
        console.log(type)
        console.log(id)
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
    .item_name{
      width: 50%;
    }
    .item_time{
      width: 50%;
      text-align: right;
    }
    .i-swipeout-des{
      height: 100rpx;
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
