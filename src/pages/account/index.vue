<template>
  <div class="container">
    <div class="account">
      <div class="account_header">
        <span class="search">
          <input type="text" v-model="searchVal" @blur="goSearch" placeholder="按用户名或全名搜索">
          <i v-if="searchVal === ''" class="iconfont icon-search"></i>
          <i v-if="searchVal !== ''" class="iconfont icon-delete" style="color:red" @tap="clear"></i>
        </span>
        <span v-if="isCompanyAdmin || isSuperAdmin" class="add_button float-right" @tap="handleAdd">新增</span>
      </div>
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <div class="account_item" v-if="listData.length>0" v-for="(item,index) in listData" :key="index">
        <div class="item_header">
          <p class="item_name">
            <span class="name">{{item.username}}</span>
            <span class="code float-right">{{item.fullname}}</span>
          </p>
        </div>
        <div class="item_detail">
          <p class="detail">
            <p class="">
              <span class="label">所属门店:</span>
              <span class="value">{{item.date.company.name}}</span>
            </p>
            <p class="">
              <span class="label">所属角色:</span>
              <span class="value">{{item.date.role.value}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">手机号码:</span>
              <span class="value">{{item.mobile}}</span>
            </p>
            <p class="">
              <span class="label">状态:</span>
              <span class="value disable" v-if="item.isDisable">禁用</span>
              <span class="value undisable" v-if="!item.isDisable">启用</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">备注:</span>
              <span class="value">{{item.description}}</span>
            </p>
            <p class="">
              <span class="label">创建时间:</span>
              <span class="value">{{item.createTime}}</span>
            </p>
          </p>
        </div>
        <div class="item_footer">
          <p class="item_edit">
            <span class="button undisable" v-if="item.isDisable && (isCompanyAdmin || isSuperAdmin)" @tap="handleStatus(item)">启用</span>
            <span class="button disable" v-if="!item.isDisable && (isCompanyAdmin || isSuperAdmin)" @tap="handleStatus(item)">禁用</span>
            <span v-if="isCompanyAdmin || isSuperAdmin" class="button edit" @tap="handleEdit(item)">编辑</span>
            <span v-if="isCompanyAdmin || isSuperAdmin" class="button delete" @tap="handleDelete(item.id)">删除</span>
          </p>
        </div>
      </div>

      <!-- 暂无数据 -->
      <i-divider v-if="totalData===0 && searchVal !== ''" color="#2d8cf0" lineColor="#2d8cf0">抱歉，暂无数据</i-divider>

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
        usercompany: '',
        accountId: '',
        modalVisible: false,
        spinShow: true,
        tipmessage: '我也是有底线的',
        loading: false,
        listData: [],
        totalData: 0,
        pageNo: 1,
        pageSize: 8,
        form: {},
        search: {
          fullname: '',
          username: ''
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
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    mounted() {

    },
    onLoad(){
      this.usercompany = this.userInfo.company
      this.accountId = this.userInfo.id
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
      // isSuperAdmin,
      // isCompanyAdmin,
      // 搜索
      goSearch(){
        const searchVal = this.searchVal
        this.search.fullname = ''
        this.search.username = ''
        if(utils.isChinese(searchVal)){
          this.search.fullname = searchVal
        }else{
          this.search.username = searchVal
        }
        this.getList(this.pageNo, this.pageSize)
      },
      clear(){
        this.searchVal = ''
        this.search.fullname = ''
        this.search.username = ''
        this.getList(this.pageNo, this.pageSize)
      },
      // 获取列表数据
      getList(pageNo, pageSize, callback){
        if(isSuperAdmin(this.userInfo.date.role.code)){
          this.usercompany = '',
          this.accountId = '',
          this.isSuperAdmin = true
        } else if(isCompanyAdmin(this.userInfo.date.role.code)){
          this.accountId = '',
          this.isCompanyAdmin = true
        }
        const params = {
          'search.fullname_like': this.search.fullname,
          'search.username_like': this.search.username,
          'search.id_eq': this.accountId,
          'search.company_eq': this.usercompany,
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.spinShow = true
        this.$http.get(api.account_list, params).then( res => {
          this.spinShow = false
          if(res.success){
            this.listData = res.data.page.content
            this.totalData = res.data.page.totalElements
            if(callback && typeof callback == 'function'){
              callback()
            }
          }
        })
      },
      // 新增维修项目
      handleAdd(){
        wx.navigateTo({
          url: '/pages/accountDetail/main'
        })
      },
      // 编辑维修项目
      handleEdit(item){
        this.$store.dispatch('saveEditItem', item).then(() => {
          wx.navigateTo({
            url: '/pages/accountDetail/main?id='+item.id
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
        this.$http.post(api.account_edit, params).then( res => {
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
        this.$http.delete(api.account_delete+"?id="+id,null).then( res => {
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
.account{
  width: 100%;
  .account_header{
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
  .account_item{
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
