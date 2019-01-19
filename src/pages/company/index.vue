<template>
  <div class="container">
    <div class="company">
      <div class="company_header clearfix">
        <div class="search">
          <input type="text" v-model="searchVal" @blur="goSearch" placeholder="按名称或代码搜索">
          <i v-if="searchVal === ''" class="iconfont icon-search"></i>
          <i v-if="searchVal !== ''" class="iconfont icon-delete" style="color:red" @tap="clear"></i>
        </div>
        <van-button v-if="isSuperAdmin" size="small" plain type="primary" class="add_button float-right" @tap="handleAdd">新增</van-button>
      </div>
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <div class="company_item" v-if="listData.length>0" v-for="(item,index) in listData" :key="index">
        <div class="item_header">
          <p class="item_name">
            <span class="name">{{item.name}}</span>
            <span class="code float-right">{{item.code}}</span>
          </p>
        </div>
        <div class="item_detail">
          <p class="detail">
            <p class="">
              <span class="label">门店品牌:</span>
              <span class="value">{{item.brand}}</span>
            </p>
            <p class="">
              <span class="label">门店类型:</span>
              <span class="value">{{item.date.type.value}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">默认车牌:</span>
              <span class="value">{{item.carNo}}</span>
            </p>
            <p class="">
              <span class="label">门店地址:</span>
              <span class="value">{{item.address}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">客服热线:</span>
              <span class="value">{{item.mobile}}</span>
            </p>
            <p class="">
              <span class="label">营业时间:</span>
              <span class="value">{{item.createTime}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">客服邮箱:</span>
              <span class="value">{{item.email}}</span>
            </p>
            <p class="">
              <span class="label">备注:</span>
              <span class="value">{{item.description}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">建立时间:</span>
              <span class="value">{{item.createTime}}</span>
            </p>
            <p class="">
              <span class="label">更新时间:</span>
              <span class="value">{{item.updateTime}}</span>
            </p>
          </p>
        </div>
        <div class="item_footer">
          <p class="item_edit">
            <span v-if="isSuperAdmin || isCompanyAdmin" class="button edit" @tap="handleEdit(item)">编辑</span>
            <span v-if="isSuperAdmin" class="button delete" @tap="handleDelete(item.id)">删除</span>
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
  import global from '../../utils/globe'
  import api from '../../api/api'
  import * as utils from '../../assets/js/utils'
  import {isSuperAdmin, isCompanyAdmin} from '../../utils/permission'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        isSuperAdmin: false,
        isCompanyAdmin: false,
        usercompany: '',
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
          name: '',
          code: '',
        },
        searchVal: '',
        deleteId: '',
        actions: [
            {
                name: '取消'
            },
            {
                name: '删除',
                color: '#ed3f14'
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
      this.spinShow = false
      this.usercompany = this.userInfo.company
      this.listData = []
      this.getCompanyList(this.pageNo, this.pageSize)
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
        this.getCompanyList(this.pageNo, this.pageSize, function(){
          that.loading = false
          that.tipmessage = '我也是有底线的'
        })
      }
    },
    methods: {
      // 搜索
      goSearch(data){
        //console.log(data)
        //console.log(this.searchVal)
        const searchVal = this.searchVal
        this.search.name = ''
        this.search.code = ''
        if(utils.isChinese(searchVal)){
          this.search.name = searchVal
        }else{
          this.search.code = searchVal
        }
        this.getCompanyList(this.pageNo, this.pageSize)
      },
      clear(){
        this.searchVal = ''
        this.search.name = ''
        this.search.code = ''
        this.getCompanyList(this.pageNo, this.pageSize)
      },
      // 获取公司列表
      getCompanyList(pageNo, pageSize, callback){
        if(isSuperAdmin(this.userInfo.date.role.code)){
          this.usercompany = ''
          this.isSuperAdmin = true
        }
        if(isCompanyAdmin(this.userInfo.date.role.code)){
          this.isCompanyAdmin = true
        }
        const params = {
          'search.name_like': this.search.name,
          'search.code_like': this.search.code,
          'search.id_eq': this.usercompany,
          'search.isDeleted_eq': false,
          pageNo,
          pageSize
        }
        this.spinShow = true
        this.$http.get(api.company_list, params).then( res => {
          if(res.success){
            this.spinShow = false
            this.listData = res.data.page.content
            this.totalData = res.data.page.totalElements
            if(callback && typeof callback == 'function'){
              callback()
            }
          }else{
            this.spinShow = false
          }
        })
      },
      // 新增维修项目
      handleAdd(){
        wx.navigateTo({
          url: '/pages/companyDetail/main'
        })
      },
      // 编辑维修项目
      handleEdit(item){
        this.$store.dispatch('saveEditItem', item).then(() => {
          wx.navigateTo({
            url: '/pages/companyDetail/main?id='+item.id
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
        this.$http.delete(api.company_delete+"?id="+id,null).then( res => {
          if(res.success){
            global.message(res.errorMsg,'success')
            this.spinShow = false
            this.getCompanyList(this.pageNo, this.pageSize)
            if(callback && typeof callback == 'function'){
              callback()
            }
          }else{
            global.message(res.errorMsg,'warning')
            this.spinShow = false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .company{
  width: 100%;
  .company_header{
    height: 100%;
    margin: 0 auto;
    .add_button{
      margin: 10px 10px 0 0;
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
  .company_item{
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
