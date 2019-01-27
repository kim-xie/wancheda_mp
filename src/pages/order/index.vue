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

      <div class="tab_header clearfix">
        <div class="search">
          <input type="text" v-model="searchVal" @blur="goSearch" placeholder="按车牌号搜索">
          <i v-if="searchVal === ''" class="iconfont icon-search"></i>
          <i v-if="searchVal !== ''" class="iconfont icon-delete" style="color:red" @tap="clear"></i>
        </div>
      </div>


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
                  <span>{{item.carBrandVal}}{{item.date.clientId.carModel}}</span>
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
                  <span>{{item.carBrandVal}}{{item.date.clientId.carModel}}</span>
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
                  <span>{{item.carBrandVal}}{{item.date.clientId.carModel}}</span>
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
        searchVal: '',
        search: {
          carNo: '',
          clientId: []
        },
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
    },
    onLoad(){
      this.spinShow = false
      const that = this
      this.getRepairWorkorder(that.allPageNo, that.allPageSize, '维修中')
      this.getRepairWorkorder(this.allPageNo, this.allPageSize, '已结账')
      this.getRepairWorkorder(this.allPageNo, this.allPageSize, '')
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
      if(this.tab_current === 'tab1'){
        if(this.allPageSize < this.repairWorkorderTotal){
          this.loading = true
          this.tipmessage = '玩命加载中'
          this.allPageSize = this.allPageSize+10
          this.getRepairWorkorder(this.allPageNo, this.allPageSize, '维修中', function(){
            that.loading = false
            that.tipmessage = '我也是有底线的'
          })
        }
      }else if(this.tab_current === 'tab2'){
        if(this.allPageSize < this.repairPayedWorderTotal){
          this.loading = true
          this.tipmessage = '玩命加载中'
          this.allPageSize = this.allPageSize+10
          this.getRepairWorkorder(this.allPageNo, this.allPageSize, '已结账', function(){
            that.loading = false
            that.tipmessage = '我也是有底线的'
          })
        }
      }else{
        if(this.allPageSize < this.repairWorkorderAllTotal){
          this.loading = true
          this.tipmessage = '玩命加载中'
          this.allPageSize = this.allPageSize+10
          this.getRepairWorkorder(this.allPageNo, this.allPageSize, null, function(){
            that.loading = false
            that.tipmessage = '我也是有底线的'
          })
        }
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
        if(this.tab_current === 'tab1'){
          this.getRepairWorkorder(this.allPageNo, this.allPageSize, '维修中')
        }else if(this.tab_current === 'tab2'){
          this.getRepairWorkorder(this.allPageNo, this.allPageSize, '已结账')
        }else{
          this.getRepairWorkorder(this.allPageNo, this.allPageSize, '')
        }
      },
      // 搜索
      goSearch(){
        const that = this
        const searchVal = this.searchVal
        this.search.carNo = searchVal
        if(this.tab_current === 'tab1'){
          that.getClientIds(()=>{
            that.getRepairWorkorder(that.allPageNo, that.allPageSize, '维修中')
          })
        }else if(this.tab_current === 'tab2'){
          that.getClientIds(()=>{
            that.getRepairWorkorder(that.allPageNo, that.allPageSize, '已结账')
          })
        }else{
          that.getClientIds(()=>{
            that.getRepairWorkorder(that.allPageNo, that.allPageSize, '')
          })
        }
      },
      clear(){
        this.searchVal = ''
        this.search.carNo = ''
        this.search.clientId = ''
        if(this.tab_current === 'tab1'){
          this.getRepairWorkorder(this.allPageNo, this.allPageSize, '维修中')
        }else if(this.tab_current === 'tab2'){
          this.getRepairWorkorder(this.allPageNo, this.allPageSize, '已结账')
        }else{
          this.getRepairWorkorder(this.allPageNo, this.allPageSize, '')
        }
      },
      // 根据车牌号找对客户
      getClientIds(callback){
        const that = this
        that.spinShow = true
        const params = {
          'search.carNo_like': that.search.carNo,
          'search.isDeleted_eq': false,
          'page.pn': 1,
          'page.size': 1000
        }
        that.$http.get(api.client_list, params).then( res => {
          if(res.success){
            const datas = res.data.page.content
            for(let i=0;i<datas.length;i++){
              that.search.clientId.push(datas[i].id)
            }
            that.spinShow = false
            if(callback && typeof callback == 'function'){
              callback()
            }
          }else{
            that.spinShow = false
          }
          this.firstLoad = true
        }).catch(err => {
          console.log(err)
          that.spinShow = false
        })
      },
      // 结账
      handlePay(id){
        this.payId = id
        this.modalMessage = '确认收到账款了吗？'
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
      // 获取数据字典
      getLookUpByIds(id){
        return new Promise((resolve,reject) => {
          const params = {
            id
          }
          this.$http.get(api.getLookupById, params).then( res => {
            if(res.success){
              resolve(res.data.entity.value)
            }
          })
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
          this.stepCurrent = 0
        }else{
          this.modalVisible = false
        }
      },
      // 获取维修记录
      getRepairWorkorder(pageNo,pageSize,status,callback){
        const that = this
        const params = {
          'search.company_eq': '',
          'search.workorderState_eq': status?status:'',
          'search.clientId_in': this.search.clientId.length>0 ? this.search.clientId.join(',') : '',
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.spinShow = true
        this.$http.get(api.repairWorkorder, params).then( res => {
          if(res.success){
            let locked = true
            this.spinShow = false
            let datas = res.data.page.content
            const total = res.data.page.totalElements
            for(let i=0;i<datas.length;i++){
              if(datas[i].date.clientId){
                that.getLookUpByIds(datas[i].date.clientId.carBrand).then(data => {
                  datas[i].carBrandVal = data
                  if(!status){
                    this.repairWorkorderAlls = datas
                    this.repairWorkorderAllTotal = total
                    // this.repairWorkorders = this.repairWorkorderAlls.filter(item => {
                    //   return item.workorderState === '维修中'
                    // })
                    // this.repairPayedWorders = this.repairWorkorderAlls.filter(item => {
                    //   return item.workorderState === '已结账'
                    // })
                    // this.repairWorkorderTotal = this.repairWorkorders.length
                    // this.repairPayedWorderTotal = this.repairPayedWorders.length
                  }else if(status === '维修中'){
                    this.repairWorkorders = datas
                    this.repairWorkorderTotal = this.repairWorkorders.length
                  }else if(status === '已结账'){
                    this.repairPayedWorders = datas
                    this.repairPayedWorderTotal = this.repairPayedWorders.length
                  }
                  if(callback && typeof callback === 'function'){
                    callback()
                  }
                })
              }
            }
          }
          this.spinShow = false
        })
      }
    }
  }
</script>
<style lang="scss">
.i-grid-item{
  padding: 0px!important;
}
</style>

<style lang="scss" scoped>
.transition{
  transition: $--fade-transition;
}
.tab_content{
  width: 100%;
  .tab_header{
    height: 100%;
    margin: 0 auto;
    .add_button{
      margin: 10px 10px 10px 0;
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
      height: 38px;
      line-height: 38px;
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
