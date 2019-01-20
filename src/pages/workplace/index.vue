<template>
  <div class="container">
    <div class="tab_content">

      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <!-- 弹窗 -->
      <i-modal title="温馨提示" :visible="modalVisible" @ok="handleOk" @cancel="handleClose">
        <view>{{modalMessage}}</view>
      </i-modal>

      <div class="transition tab_workplace">
        <div class="workplace">
          <div class="menu_list">
            <div class="menu">
              <navigator url="/pages/client/main" hover-class="navigator-hover">
                <i class="iconfont icon-kehu"></i>
                <span>客户管理</span>
              </navigator>
            </div>
            <div class="menu">
              <navigator url="/pages/company/main" hover-class="navigator-hover">
                <i class="iconfont icon-gongsimingcheng"></i>
                <span>公司管理</span>
              </navigator>
            </div>
            <div class="menu">
              <navigator url="/pages/account/main" hover-class="navigator-hover">
                <i class="iconfont icon-zhanghao"></i>
                <span>账号管理</span>
              </navigator>
            </div>
            <div class="menu">
              <navigator url="/pages/lookupdf/main" hover-class="navigator-hover">
                <i class="iconfont icon-shuju"></i>
                <span>字典管理</span>
              </navigator>
            </div>
            <!-- <div class="menu">
              <navigator url="/pages/finance/main" hover-class="navigator-hover">
                <i class="iconfont icon-finance"></i>
                <span>财务管理</span>
              </navigator>
            </div>
            <div class="menu">
              <navigator url="/pages/role/main" hover-class="navigator-hover">
                <i class="iconfont icon-wode"></i>
                <span>角色管理</span>
              </navigator>
            </div> -->
            <div class="menu">
              <navigator url="/pages/product/main" hover-class="navigator-hover">
                <i class="iconfont icon-qichepeijian"></i>
                <span>配件维护</span>
              </navigator>
            </div>
            <div class="menu">
              <navigator url="/pages/inventory/main" hover-class="navigator-hover">
                <i class="iconfont icon-kucun"></i>
                <span>库存管理</span>
              </navigator>
            </div>
            <div class="menu">
              <i-badge :count="inpartCount">
                <navigator url="/pages/inpart/main" hover-class="navigator-hover">
                  <i class="iconfont icon-rukuliucheng"></i>
                  <span>配件入库</span>
                </navigator>
              </i-badge>
            </div>
            <div class="menu">
              <i-badge :count="outpartCount">
                <navigator url="/pages/outpart/main" hover-class="navigator-hover">
                  <i class="iconfont icon-chukuliucheng"></i>
                  <span>配件出库</span>
                </navigator>
              </i-badge>
            </div>
            <div class="menu">
              <navigator url="/pages/repair/main" hover-class="navigator-hover">
                <i class="iconfont icon-weixiu"></i>
                <span>维修项目</span>
              </navigator>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="tab_bar">
      <i-tab-bar fixed :current="current" color="#f759ab" @change="handleChangeTabBar($event)">
        <i-tab-bar-item key="index" icon="financial_fill" current-icon="financial_fill" title="接车"></i-tab-bar-item>
        <i-tab-bar-item key="order" icon="createtask" current-icon="createtask_fill" title="工单"></i-tab-bar-item>
        <i-tab-bar-item key="workplace" icon="shop_fill" current-icon="shop_fill" title="工作台"></i-tab-bar-item>
        <i-tab-bar-item key="mine" icon="mine" current-icon="mine_fill" title="我的"></i-tab-bar-item>
      </i-tab-bar>
    </div> -->
  </div>
</template>

<script>
  import globe from '../../utils/globe'
  import {isSuperAdmin} from '../../utils/permission'
  import api from '../../api/api'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        current: 'workplace',
        modalSuccess: true,
        modalVisible: false,
        modalMessage: '',
        spinShow: true
      }
    },
    mounted() {
      this.spinShow = false
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'inpartCount',
        'outpartCount',
        'repairItemCount'
      ])
    },
    // 上拉加载，拉到底部触发
    onReachBottom() {
    },
    methods: {
      // 切换tab-bar
      handleChangeTabBar (data) {
        this.current = data.mp.detail.key
        wx.switchTab({
          url: '../../pages/'+this.current+'/main'
        })
      },
      // 弹窗确定按钮
      handleOk(){
        if(this.modalSuccess){
          this.modalVisible = false
        }else{
          this.modalVisible = false
        }
      },
      // 弹窗关闭按钮
      handleClose(){
        if(this.modalSuccess){
          this.modalVisible = false
        }else{
          this.modalVisible = false
        }
      }
    }
  }
</script>

<style>

.i-noticebar-content-wrap{
  text-align: center!important;
}
.grid-item{
  height: 185rpx;
}
.grid-label{
  margin-top: 0!important;
}
.logout{
  text-align: center;
  color: brown;
}
.navigator-hover {
  color:blue;
}
.placeholder{
  color: #777;
}
</style>

<style lang="scss" scoped>
.transition{
  transition: $--fade-transition;
}
.tab_content{
  width: 100%;
}
.tab_bar{
  width: 100vw;
}
.tab_list{
  background-color: $--background-color-base;
  padding: 10px;
  margin-bottom: 14px;
  .pay-btn{
    padding: 3px 6px;
    border: 1px solid $--color-text-secondary;
    color: $--color-success;
  }
  ul {
    li{
      height: 34px;
      line-height: 34px;
      color: $--color-text-primary;
      .label{
        display: inline-block;
        text-align: right;
        margin-right: 6px;
        color: $--color-text-secondary;
      }
      .value{
        display: inline-block;
        color: $--color-text-secondary;
      }
    }
    .line{
      height: 3rpx;
      background-color: $--color-text-secondary;
    }
  }
}
.menu_list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  width: 90%;
  margin: 20px auto;
  background-color: #f2f4fb;
  border: 1px solid #f2f4fb;
  border-radius: 8px;
  height: 100%;
  .menu{
    padding: 10px;
    text-align: center;
    .iconfont{
      font-size: 32px;
      color: #1296db;
    }
  }
}
.item{
  width: 90%;
  margin: 6px auto;
  height: 28px;
  line-height: 28px;
  border: 1px solid #ccc;
  overflow: hidden;
  padding: 3px 6px;
  .label{
    float: left;
    width: 30%;
    display: block;
  }
  .input{
    display: inline-block;
    width: 70%;
    height: 100%;
    line-height: 30px;
  }
}
.button_wrap{
  width: 90%;
  margin: 20px auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .item_button{
    background: #ccc;
    border-radius: 50%;
    height: 50px;
    width: 50px;
    line-height: 50px;
    cursor: pointer;
    text-align: center;
  }
}
.productForm{
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  .productForm_button{
    text-align: center;
  }
  .repairList{
    overflow: hidden;
    margin: 0 auto;
    margin-top: 10px;
    .item_button{
      overflow: hidden;
      height: 50px;
      line-height: 50px;
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .button{
        width: 80px;
        margin: 0 auto;
        height: 30px;
        line-height: 30px;
        border: 1px solid #d2d2d2;
        border-radius: 6px;
      }
    }
  }
}
.billingForm{
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  .billingWrap{
    margin: 0 auto;
    .billing_card{
      margin-top: 10px;
    }
  }
}
.step_button{
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

</style>
