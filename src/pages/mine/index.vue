<template>
  <div class="container">
    <div class="tab_content">

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
        current: 'mine'
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

<style lang="scss" scoped>
.tab_content{
  width: 100%;
}
.tab_bar{
  width: 100vw;
}
</style>
