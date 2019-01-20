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

      <div class="transition tab_order">
        <div>
          <i-tabs :current="tab_current" color="#1296db" @change="handleChangeTab($event)">
            <i-tab key="tab1" :title="'待付款('+repairWorkorderTotal+')'"></i-tab>
            <i-tab key="tab2" :title="'已完成('+repairPayedWorderTotal+')'"></i-tab>
            <i-tab key="tab3" :title="'全部订单('+repairWorkorderAllTotal+')'"></i-tab>
          </i-tabs>
          <!-- 待完成订单 -->
          <div class="tab_repaire" v-if="tab_current==='tab1'">
            <div class="tab_list" v-for="(item, index) in repairWorkorders" :key="index" v-if="item.date.clientId">
              <ul v-if="item.date.clientId">
                <li class="ellipsis">
                  <span>{{item.date.clientId.carNo}}</span>
                  <van-button size="small" plain type="danger" class="float-right" @tap="handlePay(item.id)">结账</van-button>
                </li>
                <li class="ellipsis">
                  <span>{{item.date.clientId.carModel}}</span>
                </li>
                <li class="ellipsis">
                  <span class="label">维修工单: </span>
                  <span class="value">{{item.workorderNo}}</span>
                  <span class="float-right" v-if="item.workorderState==='维修中'" style="color:#ed3f14;">{{item.workorderState}}</span>
                  <span class="float-right" v-else style="color:#07c160;">{{item.workorderState}}</span>
                </li>
                <li class="ellipsis">
                  <span class="label">到店时间: </span>
                  <span class="value">{{item.sendTime}}</span>
                </li>
                <li class="ellipsis">
                  <span class="label">消费金额: </span>
                  <span class="value">￥{{item.sum}}</span>
                  <van-button size="small" plain type="primary" class="float-right" @tap="getOrderDetail(item.workorderNo)">订单详情</van-button>
                </li>
              </ul>
            </div>
          </div>

          <!-- 已完成订单 -->
          <div class="tab_repaire" v-if="tab_current==='tab2'">
            <div class="tab_list" v-for="(item, index) in repairPayedWorders" :key="index">
              <ul>
                <li class="ellipsis" v-if="item.date.clientId">
                  <span>{{item.date.clientId.carNo}}</span>
                </li>
                <li class="ellipsis" v-if="item.date.clientId">
                  <span>{{item.date.clientId.carModel}}</span>
                </li>
                <li class="ellipsis">
                  <span class="label">维修工单: </span>
                  <span class="value">{{item.workorderNo}}</span>
                  <span class="float-right" v-if="item.workorderState==='维修中'" style="color:#ed3f14;">{{item.workorderState}}</span>
                  <span class="float-right" v-else style="color:#07c160;">{{item.workorderState}}</span>
                </li>
                <li class="ellipsis">
                  <span class="label">到店时间: </span>
                  <span class="value">{{item.sendTime}}</span>
                </li>
                <li class="ellipsis">
                  <span class="label">消费金额: </span>
                  <span class="value">￥{{item.sum}}</span>
                  <van-button size="small" plain type="primary" class="float-right" @tap="getOrderDetail(item.workorderNo)">订单详情</van-button>
                </li>
              </ul>
            </div>
          </div>

          <!-- 全部订单 -->
          <div class="tab_repaire" v-if="tab_current==='tab3'">
            <div class="tab_list" v-for="(item, index) in repairWorkorderAlls" :key="index">
              <ul>
                <li class="ellipsis" v-if="item.date.clientId">
                  <span>{{item.date.clientId.carNo}}</span>
                  <van-button v-if="item.workorderState==='维修中'" size="small" plain type="danger" class="float-right" @tap="handlePay(item.id)">结账</van-button>
                </li>
                <li class="ellipsis" v-if="item.date.clientId">
                  <span>{{item.date.clientId.carModel}}</span>
                </li>
                <li class="ellipsis">
                  <span class="label">维修工单: </span>
                  <span class="value">{{item.workorderNo}}</span>
                  <span class="float-right" v-if="item.workorderState==='维修中'" style="color:#ed3f14;">{{item.workorderState}}</span>
                  <span class="float-right" v-else style="color:#07c160;">{{item.workorderState}}</span>
                </li>
                <li class="ellipsis">
                  <span class="label">到店时间: </span>
                  <span class="value">{{item.sendTime}}</span>
                </li>
                <li class="ellipsis">
                  <span class="label">消费金额: </span>
                  <span class="value">￥{{item.sum}}</span>
                  <van-button size="small" plain type="primary" class="float-right" @tap="getOrderDetail(item.workorderNo)">订单详情</van-button>
                </li>
              </ul>
            </div>
          </div>

          <!-- 暂无数据 -->
          <i-divider v-if="repairWorkorderAllTotal===0" color="#2d8cf0" lineColor="#2d8cf0">抱歉，暂无数据</i-divider>

          <!-- 页底加载 -->
          <i-load-more v-if="repairWorkorderAllTotal>allPageSize" :tip="tipmessage" :loading="loading" />
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
        loading: false,
        tipmessage: '我也是有底线',
        modalSuccess: true,
        modalVisible: false,
        modalMessage: '',
        payModal: false,
        payId: '',
        spinShow: true,
        hasPermission: false,
        current: 'order',
        tab_current: 'tab1',
        repairWorkorders: [],
        repairPayedWorders: [],
        repairWorkorderAlls: [],
        repairWorkorderTotal: 0,
        repairPayedWorderTotal: 0,
        repairWorkorderAllTotal: 0,
        allPageNo: 1,
        allPageSize: 10,
        usercompany: ''
      }
    },
    mounted() {
      this.spinShow = false
      const that = this
      this.getRepairWorkorder(this.allPageNo, this.allPageSize)
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'client'
      ])
    },
    // 上拉加载，拉到底部触发
    onReachBottom() {
      // 到这底部在这里需要做什么事情
      console.log('上拉加载')
      const that = this
      if(this.allPageSize < this.repairWorkorderAllTotal){
        this.loading = true
        this.tipmessage = '玩命加载中'
        this.allPageSize = this.allPageSize+10
        this.getRepairWorkorder(this.allPageNo, this.allPageSize, function(){
          that.loading = false
          that.tipmessage = '我也是有底线的'
        })
      }
    },
    methods: {
      // 转化为两位数价格
      toDecimal2(x) {
        let f = parseFloat(x)
        if (isNaN(f)) {
          return false
        }
        let float = Math.round(x*100)/100
        let s = float.toString()
        let rs = s.indexOf('.')
        if (rs < 0) {
          rs = s.length
          s += '.'
        }
        while (s.length <= rs + 2) {
          s += '0'
        }
        //console.log(s)
        return s
      },
      // 切换tab-bar
      handleChangeTabBar (data) {
        this.current = data.mp.detail.key
        wx.switchTab({
          url: '../../pages/'+this.current+'/main'
        })
      },
      // 切换tab
      handleChangeTab (data) {
        this.tab_current = data.mp.detail.key
      },
      // 结账
      handlePay(id){
        this.payId = id
        this.modalMessage = '确认收到账款了吗？此操作后将无法撤销, 是否继续?'
        this.modalVisible = true
        this.modalSuccess = false
        this.payModal = true
      },
      payApi(id){
        const that = this
        return new Promise((resolve,reject) => {
          let editFormObj = {
            "repairWorkorder": {
              "id": id,
              "workorderState": '已结账',//工单状态
            }
          }
          that.spinShow = true
          that.$http.post(api.editRepairOrder, editFormObj, true).then((res) => {
            if(res.success){
              globe.message('结账成功!','success')
              that.getRepairWorkorder(that.allPageNo,that.allPageSize)
            }else{
              globe.message(res.errMsg,'wraning')
            }
            that.spinShow = false
          })
        })
      },
      // 获取订单详情
      getOrderDetail(orderNo){
        wx.navigateTo({
          url: '/pages/orderDetail/main?id='+orderNo
        })
      },
      // 弹窗确定按钮
      handleOk(){
        if(this.modalSuccess){
          this.modalVisible = false
          this.getRepairWorkorder(this.allPageNo,this.allPageSize)
        }else if(this.payModal){
          this.modalVisible = false
          this.payApi(this.payId)
        }else{
          this.modalVisible = false
        }
      },
      // 弹窗关闭按钮
      handleClose(){
        if(this.modalSuccess){
          this.modalVisible = false
          this.current = 'index'
          this.stepCurrent = 0
          this.clientForm = {}
          this.repairForm = {}
        }else{
          this.modalVisible = false
        }
      },
      // 获取维修记录
      getRepairWorkorder(pageNo,pageSize,callback){
        const params = {
          'search.company_eq': '',
          //'search.workorderState_eq': status,
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.spinShow = true
        this.$http.get(api.repairWorkorder, params).then( res => {
          if(res.success){
            this.spinShow = false
            this.repairWorkorderAlls = res.data.page.content
            this.repairWorkorderAllTotal = res.data.page.totalElements
            this.repairWorkorders = this.repairWorkorderAlls.filter(item => {
              return item.workorderState === '维修中'
            })
            this.repairPayedWorders = this.repairWorkorderAlls.filter(item => {
              return item.workorderState === '已结账'
            })
            this.repairWorkorderTotal = this.repairWorkorders.length
            this.repairPayedWorderTotal = this.repairPayedWorders.length
            if(callback && typeof callback === 'function'){
              callback()
            }
          }
          this.spinShow = false
        })
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
      color: #98ccd3;
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
