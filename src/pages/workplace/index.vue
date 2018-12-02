<template>
  <div class="container">
    <div class="tab_content">
      <i-grid>
        <i-row>
            <i-grid-item i-class="grid-item">
                <i-grid-icon>
                    <i-icon size="24" type="activity" />
                    <i-grid-label i-class="grid-label">报表</i-grid-label>
                </i-grid-icon>
            </i-grid-item>
            <i-grid-item i-class="grid-item">
                <i-grid-icon>
                    <i-icon size="24" type="addressbook" />
                    <i-grid-label i-class="grid-label">库存</i-grid-label>
                </i-grid-icon>
            </i-grid-item>
            <i-grid-item i-class="grid-item">
                <i-grid-icon>
                    <i-icon size="24" type="barrage" />
                    <i-grid-label i-class="grid-label">入库</i-grid-label>
                </i-grid-icon>
            </i-grid-item>
        </i-row>
        <i-row>
            <i-grid-item i-class="grid-item">
                <i-grid-icon>
                    <i-icon size="24" type="collection" />
                    <i-grid-label i-class="grid-label">收货</i-grid-label>
                </i-grid-icon>
            </i-grid-item>
            <i-grid-item i-class="grid-item">
                <i-grid-icon>
                    <i-icon size="24" type="computer" />
                    <i-grid-label i-class="grid-label">配件</i-grid-label>
                </i-grid-icon>
            </i-grid-item>
            <i-grid-item i-class="grid-item">
                <i-grid-icon>
                    <i-icon size="24" type="coupons" />
                    <i-grid-label i-class="grid-label">套餐</i-grid-label>
                </i-grid-icon>
            </i-grid-item>
        </i-row>
        <i-row>
            <i-grid-item i-class="grid-item">
                <i-grid-icon>
                    <i-icon size="24" type="flag" />
                    <i-grid-label i-class="grid-label">商城</i-grid-label>
                </i-grid-icon>
            </i-grid-item>
            <i-grid-item i-class="grid-item">
                <i-grid-icon>
                    <i-icon size="24" type="interactive" />
                    <i-grid-label i-class="grid-label">挂账</i-grid-label>
                </i-grid-icon>
            </i-grid-item>
            <i-grid-item i-class="grid-item">
                <i-grid-icon>
                    <i-icon size="24" type="mail" />
                    <i-grid-label i-class="grid-label">客户</i-grid-label>
                </i-grid-icon>
            </i-grid-item>
        </i-row>
      </i-grid>
    </div>
    <div class="tab_bar">
      <i-tab-bar fixed :current="current" color="#f759ab" @change="handleChangeTabBar($event)">
        <i-tab-bar-item key="index" icon="financial_fill" current-icon="financial_fill" title="接车"></i-tab-bar-item>
        <i-tab-bar-item key="order" icon="createtask" current-icon="createtask_fill" title="工单"></i-tab-bar-item>
        <i-tab-bar-item key="workplace" icon="shop_fill" current-icon="shop_fill" title="工作台"></i-tab-bar-item>
        <i-tab-bar-item key="mine" icon="mine" current-icon="mine_fill" title="我的"></i-tab-bar-item>
      </i-tab-bar>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        current: 'workplace'
      }
    },
    created () {

    },
    methods: {
      // 切换tab-bar
      handleChangeTabBar (data) {
        let detail = data.mp.detail.key
        console.log(detail)
        wx.navigateTo({
          url: '../../pages/'+detail+'/main'
        })
      }
    }
  }
</script>

<style>
.grid-item{
  height: 185rpx;
}
.grid-label{
  margin-top: 0!important;
}
</style>

<style lang="scss" scoped>
.tab_content{
  width: 100%;
}
.tab_bar{
  width: 100vw;
}
</style>
