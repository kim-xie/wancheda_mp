<template>
  <div class="container">
    <div class="lookup">
      <div class="lookup_header clearfix">
        <!-- <div class="search">
          <input type="text" v-model="searchVal" @blur="goSearch" placeholder="按名称或代码搜索">
          <i v-if="searchVal === ''" class="iconfont icon-search"></i>
          <i v-if="searchVal !== ''" class="iconfont icon-delete" style="color:red" @tap="clear"></i>
        </div> -->
        <van-button size="small" plain type="primary" class="add_button float-right" @tap="handleAdd">新增</van-button>
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
            <p class="" v-if="item.discountVal">
              <span class="label">折扣:</span>
              <span class="value">{{item.discountVal}}</span>
            </p>
            <p class="" v-if="item.zzLevel>1">
              <span class="label">父节点:</span>
              <span class="value">{{item.parentVal}}</span>
            </p>
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
      <i-divider v-if="totalData===0" color="#2d8cf0" lineColor="#2d8cf0">抱歉，暂无数据</i-divider>

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
        search: {
          name: '',
          code: ''
        },
        isParent: false,
        isDiscount: false,
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
      this.isDiscount = false
      this.isParent = false
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
          pageNo,
          pageSize
        }
        this.spinShow = true
        this.$http.get(api.lookup_list + this.lookupdfCode, params).then( res => {
          if(res.success){
            this.spinShow = false
            const datas = res.data.page.content
            for(let i=0; i<datas.length; i++){
              datas[i].parentVal = datas[i].parentId ? this.getParentNameById(datas,datas[i].parentId):''
              datas[i].discountVal = datas[i].additional ? datas[i].additional+"折":''
              if(datas[i].discountVal){
                this.isDiscount = true
              }
              if(datas[i].parentVal){
                this.isParent = true
              }
            }
            this.listData = datas
            this.definitionId = this.listData[0].definitionId
            this.totalData = res.data.page.totalElements
            if(callback && typeof callback == 'function'){
              callback()
            }
          }
          this.firstLoad = true
        })
      },
      // 根据id获取父节点
      getParentNameById(datas,parentId){
        for(let i=0;i<datas.length;i++){
          if(datas[i].id == parentId){
            return datas[i].value
          }
        }
      },
      // 新增
      handleAdd(){
        let item = {}
        if(this.isDiscount){
          item.additional = 10
        }else if(this.isParent){
          item.parentId = true
        }
        this.$store.dispatch('saveEditItem', item).then(() => {
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
    height: 100%;
    margin: 0 auto;
    .add_button{
      margin: 10px 10px 0px 0;
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
  .lookup_item{
    padding: 10px;
    width: 89%;
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
        font-size: 14px;
        color: $--color-text-placeholder;
      }
      .value{
        font-size: 14px;
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
