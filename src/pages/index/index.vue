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
        <div>
          <i-tabs :current="tab_current" color="#f759ab" @change="handleChangeTab($event)">
            <i-tab key="tab1" title="维修中" count="3"></i-tab>
            <i-tab key="tab2" title="待付款" count="0"></i-tab>
            <i-tab key="tab3" title="已完成" count="100"></i-tab>
          </i-tabs>
          <div class="tab_repaire">
            <div class="tab_list" v-for="(item, index) in repaires" :key="index">
              <ul>
                <li class="ellipsis">
                  <span>{{item.carNo}}</span>
                </li>
                <li class="ellipsis">
                  <span>{{item.type}}</span>
                </li>
                <li class="line"></li>
                <li class="ellipsis">
                  <span>工单号: {{item.order}}</span>
                  <span class="float-right">{{item.status}}</span>
                </li>
                <li class="ellipsis">
                  <span>进厂时间: {{item.time}}</span>
                  <span class="float-right">{{item.user}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div v-if="current === 'workplace'" class="transition tab_workplace">
        <div>
          <i-grid>
            <i-row>
                <i-grid-item i-class="grid-item">
                    <i-grid-icon>
                        <i-icon size="24" type="activity" />
                        <i-grid-label i-class="grid-label">
                          <navigator url="/pages/company/main" hover-class="navigator-hover">公司</navigator>
                        </i-grid-label>
                    </i-grid-icon>
                </i-grid-item>
                <i-grid-item i-class="grid-item">
                    <i-grid-icon>
                        <i-icon size="24" type="addressbook" />
                        <i-grid-label i-class="grid-label">
                          <navigator url="/pages/product/main" hover-class="navigator-hover">库存</navigator>
                        </i-grid-label>
                    </i-grid-icon>
                </i-grid-item>
                <i-grid-item i-class="grid-item">
                    <i-grid-icon>
                        <i-icon size="24" type="barrage" />
                        <i-grid-label i-class="grid-label">
                        <navigator url="/pages/product/main" hover-class="navigator-hover">入库</navigator>
                        </i-grid-label>
                    </i-grid-icon>
                </i-grid-item>
            </i-row>
            <i-row>
                <i-grid-item i-class="grid-item">
                    <i-grid-icon>
                        <i-icon size="24" type="collection" />
                        <i-grid-label i-class="grid-label">
                        <navigator url="/pages/role/main" hover-class="navigator-hover">角色</navigator>
                        </i-grid-label>
                    </i-grid-icon>
                </i-grid-item>
                <i-grid-item i-class="grid-item">
                    <i-grid-icon>
                        <i-icon size="24" type="computer" />
                        <i-grid-label i-class="grid-label">
                        <navigator url="/pages/product/main" hover-class="navigator-hover">配件</navigator>
                        </i-grid-label>
                    </i-grid-icon>
                </i-grid-item>
                <i-grid-item i-class="grid-item">
                    <i-grid-icon>
                        <i-icon size="24" type="coupons" />
                        <i-grid-label i-class="grid-label">
                        <navigator url="/pages/client/main" hover-class="navigator-hover">客户</navigator>
                        </i-grid-label>
                    </i-grid-icon>
                </i-grid-item>
            </i-row>
            <i-row>
                <i-grid-item i-class="grid-item">
                    <i-grid-icon>
                        <i-icon size="24" type="flag" />
                        <i-grid-label i-class="grid-label">
                        <navigator url="/pages/lookupdf/main" hover-class="navigator-hover">字典</navigator>
                        </i-grid-label>
                    </i-grid-icon>
                </i-grid-item>
                <i-grid-item i-class="grid-item">
                    <i-grid-icon>
                        <i-icon size="24" type="interactive" />
                        <i-grid-label i-class="grid-label">
                        <navigator url="/pages/account/main" hover-class="navigator-hover">账号</navigator>
                        </i-grid-label>
                    </i-grid-icon>
                </i-grid-item>
                <i-grid-item i-class="grid-item">
                    <i-grid-icon>
                        <i-icon size="24" type="mail" />
                        <i-grid-label i-class="grid-label">
                        <navigator url="/pages/client/main" hover-class="navigator-hover">客户</navigator>
                        </i-grid-label>
                    </i-grid-icon>
                </i-grid-item>
            </i-row>
          </i-grid>
        </div>
      </div>
      <div v-if="current === 'mine'" class="transition tab_mine">
        <div>
          <i-cell-group>
            <i-cell title="个人信息" is-link link-type="navigateTo" url="/pages/userInfo/main"></i-cell>
            <i-cell title="修改密码" is-link link-type="navigateTo" url="/pages/changePwd/main"></i-cell>
            <i-cell i-class="logout" title="退出当前账号"></i-cell>
          </i-cell-group>
        </div>
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
  import checkPermission from '../../utils/permission'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        hasPermission: false,
        current: 'index',
        company: '深圳分店',
        tab_current: 'tab1',
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
        repaires: [
          {
            id: 1,
            carNo: '粤B09286',
            type: '迈腾2017 1.4TSI 双离合 280TSI领先型',
            order: 'No20181205000001',
            time: '2018-12-05 12:30',
            status: '在修',
            user: 'kim'
          },
          {
            id: 2,
            carNo: '桂M09286',
            type: '迈腾2018 1.4TSI 双离合 280TSI领先型',
            order: 'No20181205000002',
            time: '2018-12-05 10:30',
            status: '在修',
            user: 'kim'
          },
          {
            id: 3,
            carNo: '桂B09286',
            type: '迈腾2019 1.4TSI 双离合 280TSI领先型',
            order: 'No20181205000003',
            time: '2018-12-05 10:30',
            status: '在修',
            user: 'kim'
          }
        ]
      }
    },
    mounted() {
      this.hasPermission = this.checkPermission()
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      checkPermission,
      // 切换tab-bar
      handleChangeTabBar (data) {
        this.current = data.mp.detail.key
      },
      handleChangeTab (data) {
        this.tab_current = data.mp.detail.key
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
.logout{
  text-align: center;
  color: brown;
}
.navigator-hover {
  color:blue;
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
.tab_list{
  background-color: $--background-color-base;
  font-size: 30rpx;
  padding: 20rpx 20rpx;
  margin-bottom: 30rpx;
  ul {
    li{
      margin: 10rpx 0;
      color: $--color-text-secondary;
    }
    .line{
      height: 3rpx;
      background-color: $--color-text-secondary;
    }
  }
}

</style>
