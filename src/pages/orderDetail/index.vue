<template>
  <div class="container">
    <div class="orderDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <div class="orderInfo">
        <div class="order_header">
          <span class="order_no">工单号： {{repairWorkorder.workorderNo}}</span>
          <span class="float-right">{{repairWorkorder.workorderState}}</span>
        </div>
        <div class="order_count">
          <span class="order_counts">总消费：￥ {{repairWorkorder.sum}}</span>
        </div>
        <div class="order_detail">
          <span>服务项目消费金额：</span>
          <van-card
            v-for="(item, index) in repairItemDetails" :key="index"
            :num="item.date.itemId.workHour"
            :price="item.discountVal"
            :origin-price="item.sum"
            :desc="item.date.itemId.description"
            :tag="discount+'折'"
            :title="item.date.itemId.name"
            :thumb="123"
          >
            <view slot="tags">
              <van-tag plain type="success">{{discount+'折'}}</van-tag>
            </view>
          </van-card>
          <span>服务项目消费金额：</span>
          <!-- <van-card
            v-for="(item, index) in outpartDetails" :key="index"
            :num="item.date.itemId.workHour"
            :price="item.date.itemId.sum"
            :desc="item.date.itemId.description"
            :title="item.date.itemId.name"
            thumb=""
          /> -->
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
        discount: 10
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
            }
            console.log(_this.repairItemDetails)
          }
          if(res.data.repairWorkorder){
            this.repairWorkorder = res.data.repairWorkorder
            this.repairWorkorder.sum = _this.toDecimal2(this.repairWorkorder.sum)
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .orderDetail{
    width: 100%;
    .orderInfo{
      width: 90%;
      margin: 10px auto;
      background-color: beige;
      border-radius: 6px;
      padding: 8px;
    }
  }

</style>
