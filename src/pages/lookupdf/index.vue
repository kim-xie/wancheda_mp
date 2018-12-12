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

        <i-action-sheet :visible="actionVisible" :actions="actions" show-cancel @cancel="handleCancel" @click="handleClickItem" :mask-closable="false">
          <view slot="header" style="padding: 16px">
            <view style="color: #444;font-size: 16px">确定吗？</view>
            <text>删除后无法恢复哦</text>
          </view>
        </i-action-sheet>

        <i-swipeout v-for="(item,index) in listData" :key="index" :operateWidth="180" :unclosable="true" :toggle="toggle">
          <view slot="content">
            <view class="i-swipeout-des">
              <view class="i-swipeout-des-h2">{{item.name}} -- {{item.code}}</view>
              <view class="i-swipeout-des-detail">{{item.description}}</view>
            </view>
          </view>
          <view slot="button" class="i-swipeout-button-group" style="background:#2db7f5;">
              <view class="i-swipeout-button" @tap="actionsTap"><i-icon size="32" type="like_fill"></i-icon></view>
              <view class="i-swipeout-button" @tap="actionsTap"><i-icon size="32" type="share_fill"></i-icon></view>
              <view class="i-swipeout-button" @tap="actionsTap"><i-icon size="32" type="delete_fill"></i-icon></view>
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
      this.getList()
    },
    methods: {
      getList(pageNo, pageSize){
        const params = {
          pageNo,
          pageSize
        }
        this.$http.get(api.lookupdf_list, params).then( res => {
          console.log(res)
          if(res.success){
            this.listData = res.data.page.content
            this.totalData = res.data.page.totalElements
            this.collapseName = this.listData[0].id
          }
        })
      },
      handleClickItem(){

      },
      handleCancel(){

      },
      actionsTap(){

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
    .i-swipeout-des{
      height: 120rpx;
      .i-swipeout-des-detail{
        height: 60rpx;
        line-height: 60rpx;
        text-overflow: ellipsis;
        font-size: 12px;
        color: $--color-text-placeholder;
      }
    }
    .i-swipeout-button{
      float: left;
      width: 60px;
      text-align: center;
    }
  }
</style>
