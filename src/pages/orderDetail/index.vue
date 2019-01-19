<template>
  <div class="container">
    <div class="orderDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <!-- 弹窗 -->
      <i-modal title="温馨提示" :visible="modalVisible" @ok="handleOk" @cancel="handleClose">
        <view>{{modalMessage}}</view>
      </i-modal>

      <div class="orderInfo">
        <div class="order_header">
          <span class="order_no">工单号：{{repairWorkorder.workorderNo}}</span>
          <span class="float-right" v-if="repairWorkorder.workorderState==='维修中'" style="color:#ed3f14;">{{repairWorkorder.workorderState}}</span>
          <span class="float-right" v-else style="color:#07c160;">{{repairWorkorder.workorderState}}</span>
        </div>
        <div class="order_count">
          <div class="order_counts">￥<span style="color:#07c160;font-size:32px;">{{repairWorkorder.sum}}</span></div>
          <div class="order_counts" v-if="repairWorkorder.workorderState==='维修中'" style="color:#ed3f14;font-size:16px;">待支付：￥{{repairWorkorder.sum}}</div>
          <div class="order_counts" v-else style="color:#07c160;font-size:16px;">已支付：￥{{repairWorkorder.sum}}</div>
        </div>
        <div class="order_status" v-if="repairWorkorder.workorderState==='维修中'">
          <van-button size="large" round plain type="primary" class="" @tap="handlePay(repairWorkorder.id)">结 账</van-button>
        </div>
      </div>

      <div class="orderInfo">
        <div class="order_header">
          <span class="order_no">车牌号：{{client.carNo}}</span>
          <span class="float-right">{{client.name}}</span>
        </div>
        <div class="order_count">
          <!-- {{client.date.carBrand.value}} -  -->
          <div class="order_counts">
            <span class="label">车型：</span>
            <span class="value">{{client.carModel}}</span>
          </div>
          <div class="order_counts">
            <span class="label">手机：</span>
            <span class="value">{{client.mobile}}</span>
          </div>
          <div class="order_counts" v-if="repairWorkorder.sendTime">
            <span class="label">到店时间：</span>
            <span class="value">{{repairWorkorder.sendTime}}</span>
          </div>
          <div class="order_counts" v-if="repairWorkorder.endTime">
            <span class="label">交车时间：</span>
            <span class="value">{{repairWorkorder.endTime}}</span>
          </div>
          <div class="order_counts" v-if="repairWorkorder.clerkVal">
            <span class="label">服务顾问：</span>
            <span class="value">{{repairWorkorder.clerkVal}}</span>
          </div>
        </div>
      </div>

      <div class="orderInfo">
        <div class="order_header text-center">
          <span>服务项目</span>
        </div>
        <div class="order_detail">
          <van-card
            v-for="(item, index) in repairItemDetails" :key="index"
            :num="item.date.itemId.workHour"
            :price="item.discountVal"
            :origin-price="item.sum"
            :desc="'维修人：'+item.mechanicVal"
            :tag="discount+'折'"
            :title="item.date.itemId.name">
            <view slot="tags">
              <van-tag plain type="success">{{item.date.itemId.description}}</van-tag>
            </view>
          </van-card>
        </div>
      </div>

      <div class="orderInfo" v-if="outpartDetails.length>0">
        <div class="order_header text-center">
          <span>服务领料</span>
        </div>
        <div class="order_detail">
          <!-- <van-card
            v-for="(item, index) in outpartDetails" :key="index"
            :num="item.date.itemId.count"
            :price="item.date.itemId.sale"
            :origin-price="item.sum"
            :desc="'领料人：'+item.mechanicVal"
            :tag="discount+'折'"
            :title="item.date.itemId.name">
            <view slot="tags">
              <van-tag plain type="success">{{item.date.itemId.description}}</van-tag>
            </view>
          </van-card> -->
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import globe from '../../utils/globe'
  import api from '../../api/api'
  export default {
    data () {
      return {
        orderNo: '',
        form: {},
        spinShow: true,
        repairWorkorder: {},
        client: {},
        repairItemDetails: [],
        outpartDetails: [],
        repairCompany: '',
        discount: 10,
        payId: '',
        modalMessage: '',
        modalVisible: false,
        modalSuccess: false,
      }
    },
    onLoad() {
      this.form = {}
      this.spinShow = false
      this.orderNo = ''
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        this.orderNo = urlParams.split('=')[1]
        if(this.orderNo){
          this.getDetail(this.orderNo)
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
        return s
      },
      // 获取详情
      getDetail(orderNo){
        this.$http.get(api.repairOrderDetail + orderNo).then((res) => {
          let _this = this
          if(res.data.client){
            this.client = res.data.client
          }
          if(res.extendInfo){
            this.discount = Number(res.extendInfo.level[res.data.client.level].additional)
          }
          if(res.data.items){
            this.repairItemDetails = res.data.items
            for(let i=0;i<_this.repairItemDetails.length;i++){
              _this.repairItemDetails[i].discountVal = _this.toDecimal2(_this.discount/10 * Number(_this.repairItemDetails[i].date.itemId.sum))
              _this.repairItemDetails[i].sum = _this.toDecimal2(Number(_this.repairItemDetails[i].date.itemId.sum))
              _this.repairItemDetails[i].mechanicVal = res.extendInfo.mechanic[_this.repairItemDetails[i].mechanic].fullname
            }
            //console.log(_this.repairItemDetails)
          }
          if(res.data.repairWorkorder){
            this.repairWorkorder = res.data.repairWorkorder
            this.repairWorkorder.sum = _this.toDecimal2(this.repairWorkorder.sum)
            this.repairWorkorder.clerkVal = res.extendInfo.clerk[this.repairWorkorder.clerk]?res.extendInfo.clerk[this.repairWorkorder.clerk].fullname:''
          }
          if(res.data.repairWorkorder.company){
            this.repairCompany = res.extendInfo.company[res.data.repairWorkorder.company].name
          }
          if(res.data.outPartComposite != null){
            this.outpartDetails = res.data.outPartComposite.outPartInfos
            let outPartInfos = res.data.outPartComposite.outPartInfos
            let partExtendInfo = res.extendInfo.partId
            for(var i=0;i<outPartInfos.length;i++){
              _this.outpartDetails[i].partName = partExtendInfo[outPartInfos[i].date.inventoryId.partId].name
            }
          }
        }, err => {

        })
      },
      // 弹窗确定按钮
      handleOk(){
        if(this.payModal){
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
        }else{
          this.modalVisible = false
        }
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
              this.getDetail(this.orderNo)
            }else{
              globe.message(res.errMsg,'wraning')
            }
            that.spinShow = false
          })
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .orderDetail{
    width: 100%;
    .orderInfo{
      width: 90%;
      margin: 10px auto;
      background-color: $--background-color-base;
      border-radius: 6px;
      padding: 8px;
      .order_header{
        padding:4px 0 8px 0;
        border-bottom:1px solid $--border-color-base;
        color:#333;
        font-size:16px;
      }
      .order_count{
        text-align: center;
        margin: 16px 0;
        .order_counts{
          margin: 4px 0;
          .label{
            display: inline-block;
            width: 100px;
            text-align: right;
            font-size: 14px;
            color: #666;
          }
          .value{
            display: inline-block;
            width: calc(100% - 100px);
            text-align: left;
            font-size: 14px;
            color: #666;
          }
        }
      }
      .order_status{
        text-align: center;
        margin: 5px 0;
      }
      .order_detail{
        margin: 10px 0;
      }
    }
  }

</style>
