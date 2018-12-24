<template>
  <div class="container">
    <div class="repair">
      <div class="repair_header">
        <span class="search">
          <input type="text" placeholder="按名称或代码搜索">
          <i class="iconfont icon-search"></i>
        </span>
        <span class="add_button float-left mr10">分类</span>
        <span class="add_button float-left">工种</span>
        <span class="add_button float-right" @tap="handleAdd">新增</span>
      </div>
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <div class="repair_item" v-for="(item,index) in listData" :key="index">
        <div class="item_header">
          <p class="item_name">
            <span class="name">{{item.name}}</span>
            <span class="code float-right">{{item.code}}</span>
          </p>
        </div>
        <div class="item_detail">
          <p class="detail">
            <p class="">
              <span class="label">数量/工时:</span>
              <span class="value">{{item.workHour}}</span>
            </p>
            <p class="">
              <span class="label">单价:</span>
              <span class="value">{{item.sum}}</span>
            </p>
          </p>
          <p class="detail">
            <p class="">
              <span class="label">所属分类:</span>
              <span class="value">{{item.date.typeLK.value}}</span>
            </p>
            <p class="">
              <span class="label">所属工种:</span>
              <span class="value">{{item.date.workTypeLK.value}}</span>
            </p>
          </p>
          <p class="detail">
            <span class="label">备注:</span>
            <span class="value">{{item.description}}</span>
          </p>
        </div>
        <div class="item_footer">
          <p class="item_edit">
            <span class="button edit" @tap="handleEdit(item.id)">编辑</span>
            <span class="button delete" @tap="handleDelete(item.id)">删除</span>
          </p>
        </div>
      </div>
      <!-- 页底加载 -->
      <i-load-more v-if="totalData>pageSize" :tip="tipmessage" :loading="loading" />
    </div>
  </div>
</template>

<script>
  import global from '../../utils/globe'
  import api from '../../api/api'
  export default {
    data () {
      return {
        spinShow: true,
        tipmessage: '我也是有底线的',
        loading: false,
        listData: [],
        totalData: 0,
        pageNo: 1,
        pageSize: 8,
        form: {}
      }
    },
    mounted() {
      this.spinShow = false
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
        this.spinShow = true
        this.$http.get(api.repair_list, params).then( res => {
          this.spinShow = false
          console.log(res)
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
          url: '/pages/repairDetail/main'
        })
      },
      // 编辑维修项目
      handleEdit(id){
        wx.navigateTo({
          url: '/pages/repairDetail/main?id='+id
        })
      },
      // 删除维修项目
      handleDelete(id){
        this.spinShow = true
        this.$http.delete(api.repair_delete+"?id="+id,null).then( res => {
          this.spinShow = false
          if(res.success){
            global.message(res.errorMsg,'success')
            this.getList(this.pageNo, this.pageSize)
          }else{
            global.message(res.errorMsg,'warning')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.repair{
  width: 100%;
  .repair_header{
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
  .repair_item{
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
