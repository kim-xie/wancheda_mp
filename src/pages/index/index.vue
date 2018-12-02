<template>
  <div class="container">
    <div class="tab_content">
      <div class="company">
        <h4>{{company}}</h4>
      </div>
      <div v-if="current === 'index'" class="transition tab_index">
        <div>
          <i-panel title="接车单">
            <i-input :value="car_pin" autofocus title="车牌号" mode="wrapped" placeholder="请输入车牌号" />
            <i-input :value="car_jia" title="车架号" mode="wrapped" placeholder="请输入车架号" />
            <i-input :value="value2" type="number" title="行驶里程" mode="wrapped" placeholder="请输入行驶里程(公里)" />
            <i-input :value="value" type="number" title="联系电话" mode="wrapped" placeholder="请输入联系电话" />
            <i-input :value="car_pin2" title="联系人" mode="wrapped" placeholder="请输入联系人" />
            <i-input :value="car_pin1" title="维修性质" mode="wrapped" placeholder="请选择维修性质" @tap="select" disabled/>
          </i-panel>
          <i-action-sheet :visible="visible" :actions="actions" show-cancel @cancel="handleCancel" @click.stop="handleClickItem($event)"/>
        </div>
      </div>
      <div v-if="current === 'order'" class="transition tab_order">
        <div>order</div>
      </div>
      <div v-if="current === 'workplace'" class="transition tab_workplace">
        <div>
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
      </div>
      <div v-if="current === 'mine'" class="transition tab_mine">
        <div>mine</div>
      </div>
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
        current: 'index',
        company: '深圳分店',
        visible: false,
        actions: [
            {
              id: '1',
              name: '保养'
            },
            {
              id: '2',
              name: '洗车',
            }
        ],
      }
    },
    created () {

    },
    methods: {
      // 切换tab-bar
      handleChangeTabBar (data) {
        this.current = data.mp.detail.key
      },
      // 选择下拉框
      select(){
        this.visible = true
      },
      // 取消
      handleCancel(){
        this.visible = false
      },
      // 选择
      handleClickItem(data){
        console.log(data.mp._relatedInfo.anchorTargetText)
        console.log(data.mp)
        this.car_pin1 = data.mp._relatedInfo.anchorTargetText
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
</style>

<style lang="scss" scoped>
.company{
  height: 74rpx;
  line-height: 74rpx;
  text-align: center;
  background-color: $--color-success-light;
  color: $--color-warning;
}
.transition{
  transition: $--fade-transition;
}
.tab_content{
  width: 100%;
}
.tab_bar{
  width: 100vw;
}
</style>
