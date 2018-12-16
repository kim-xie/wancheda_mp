<template>
  <div class="container">
    <div class="lookupdf">
      <i-panel title="数据字典定义列表">
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

        <i-action-sheet :visible="actionVisible" :actions="actions" show-cancel @cancel="handleCancel" @click="handleClickItem">
          <div slot="header" style="padding: 16px">
            <div style="color: #444;font-size: 16px">确定要删除此数据吗？</div>
            <p>删除后无法恢复哦</p>
          </div>
        </i-action-sheet>

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
              <view class="i-swipeout-button" @tap="actionsTap('edit',item.id)">
                <i class="iconfont icon-edit"></i>
              </view>
              <view class="i-swipeout-button" @tap="actionsTap('delete',item.id)">
                <i class="iconfont icon-delete"></i>
              </view>
          </view>
        </i-swipeout>
      </i-panel>
    </div>
  </div>
</template>

<script>
  import api from '../../api/api'
  import bus from '../../utils/bus'
  export default {
    data () {
      return {
        listData: [],
        totalData: 0,
        pageNo: 1,
        pageSize: 8,
        collapseName: '',
        actionVisible: false,
        toggle: false,
        actions: [
            {
                name: '删除',
                color: '#ed3f14'
            }
        ],
      }
    },
    mounted() {
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
      this.pageNo = this.pageNo+1
      this.getList(this.pageNo, this.pageSize)
    },
    methods: {
      // 获取列表数据
      getList(pageNo, pageSize, callback){
        const params = {
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.$http.get(api.lookupdf_list, params).then( res => {
          console.log(res)
          if(res.success){
            this.listData = res.data.page.content
            this.totalData = res.data.page.totalElements
            this.collapseName = this.listData[0].id
            if(callback && typeof callback == 'function'){
              callback()
            }
          }
        })
      },
      // 点击action sheet
      handleClickItem(){
        console.log('handleClickItem')
      },
      // 点击取消action sheet
      handleCancel(){
        this.actionVisible = false
      },
      // 操作
      actionsTap(type, id){
        console.log(type)
        if(type === 'dictionary'){
          wx.navigateTo({
            url: '/pages/lookup/main?id='+id
          })
        }else if(type === 'edit'){
          wx.navigateTo({
            url: '/pages/lookupdfDetail/main?id='+id
          })
        }else{
          this.actionVisible = true
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
