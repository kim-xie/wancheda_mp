<template>
  <div class="container">
    <div class="inpart">
      <div class="inpart_header">
        <span class="search">
          <input type="text" placeholder="按名称或编号搜索">
          <i class="iconfont icon-search"></i>
        </span>
        <span class="add_button float-left mr10">公司</span>
        <span class="add_button float-left">供应商</span>
      </div>

      <i-tabs :current="currentTab" @change="handleChange($event)">
        <i-tab key="tab1" title="待入库" :count="inpartCount"></i-tab>
        <i-tab key="tab2" :title="'已入库('+totalData+')'"></i-tab>
      </i-tabs>

      <!-- 待入库 -->
      <div class="tab1" v-if="currentTab === 'tab1'">
        <div class="inpart_total">
          <p class="item">
            <span class="label">支付方式</span>
            <input type="text">
          </p>
          <p class="item">
            <span class="label">供应商</span>
            <input type="text">
          </p>
          <p class="item">
            <span class="label">支付金额</span>
            <span>￥{{inpartsTotal}}</span>
          </p>
          <p class="item">
            <span class="button" @tap="saveProduction">结算</span>
          </p>
        </div>
        <div class="inpart_item" v-for="(item,index) in selectTableData" :key="index">
          <div class="item_header">
            <p class="item_name">
              <span class="name">{{item.name}}</span>
              <span class="code float-right">{{item.code}}</span>
            </p>
          </div>
          <div class="item_detail">
            <p class="detail">
              <p class="">
                <span class="label">进货价:</span>
                <span class="value">{{item.cost}}</span>
              </p>
              <p class="">
                <span class="label">数量:</span>
                <span class="value">{{item.count}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="">
                <span class="label">单位:</span>
                <span class="value">{{item.unitLKVal}}</span>
              </p>
              <p class="">
                <span class="label">金额:</span>
                <span class="value">{{item.subtotal}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="">
                <span class="label">产地:</span>
                <span class="value">{{item.produceArea}}</span>
              </p>
              <p class="">
                <span class="label">库位号:</span>
                <span class="value">{{item.repCodeLKVal}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="">
                <span class="label">适用车型:</span>
                <span class="value">{{item.carModel}}</span>
              </p>
            </p>
          </div>
          <div class="item_footer">
            <p class="item_edit">
              <span class="button edit">编辑</span>
              <span class="button delete" @tap="handleDelete(index,item.subtotal)">删除</span>
            </p>
          </div>
        </div>
      </div>

      <!-- 已入库 -->
      <div class="tab2" v-if="currentTab === 'tab2'">
        <div class="inpart_item" v-for="(item,index) in listData" :key="index">
          <div class="item_header">
            <p class="item_orderNo">
              <span class="name">订单编号：{{item.workOrderNo}}</span>
            </p>
            <p class="item_name">
              <span class="name">{{item.date.partId.name}}</span>
              <span class="code float-right">{{item.date.partId.code}}</span>
            </p>
          </div>
          <div class="item_detail">
            <p class="detail">
              <p class="">
                <span class="label">进货价:</span>
                <span class="value">{{item.cost}}</span>
              </p>
              <p class="">
                <span class="label">数量:</span>
                <span class="value">{{item.count}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="">
                <span class="label">单位:</span>
                <span class="value">{{item.date.unitLK.value}}</span>
              </p>
              <p class="">
                <span class="label">供应商:</span>
                <span class="value">{{item.date.supplierLK.value}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="">
                <span class="label">产地:</span>
                <span class="value">{{item.date.partId.produceArea}}</span>
              </p>
              <p class="">
                <span class="label">库位号:</span>
                <span class="value">{{item.date.repositoryCodeLK.value}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="">
                <span class="label">适用车型:</span>
                <span class="value">{{item.date.partId.carModel}}</span>
              </p>
              <p class="">
                <span class="label">入库时间:</span>
                <span class="value">{{item.date.workOrderNo.inTime}}</span>
              </p>
            </p>
          </div>
        </div>
        <!-- 页底加载 -->
        <i-load-more :tip="tipmessage" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import api from '../../api/api'
  export default {
    data () {
      return {
        tipmessage: '我也是有底线的',
        loading: false,
        inpartsTotal: 0,
        currentTab: 'tab1',
        listData: [],
        totalData: 0,
        selectTableData: [],
        pageNo: 1,
        pageSize: 8,
        form: {},
        isLocked: false
      }
    },
    mounted() {
      this.loadInpartFormData()
      this.getList(this.pageNo, this.pageSize)
    },
    computed: {
      ...mapGetters([
        'inpartCount'
      ])
    },
    // 下拉刷新
    onPullDownRefresh() {
      console.log('下拉刷新')
      console.log(this.pageNo)
      if(this.pageNo > 1){
        this.pageNo = this.pageNo-1
        this.getList(this.pageNo, this.pageSize, function(){
          wx.stopPullDownRefresh()
        })
      }
    },
    // 上拉加载，拉到底部触发
    onReachBottom() {
      // 到这底部在这里需要做什么事情
      console.log('上拉加载')
      const that = this
      if(this.pageNo < this.totalData/this.pageSize){
        this.loading = true
        this.tipmessage = '玩命加载中'
        this.pageNo = this.pageNo+1
        this.getList(this.pageNo, this.pageSize, function(){
          that.loading = false
          that.tipmessage = '我也是有底线的'
        })
      }
    },
    methods: {
      // 获取列表数据
      getList(pageNo, pageSize, callback){
        const params = {
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.$http.get(api.inpartInfo_list, params).then( res => {
          if(res.success){
            this.listData = res.data.page.content
            this.totalData = res.data.page.totalElements
            if(callback && typeof callback == 'function'){
              callback()
            }
          }
        })
      },
      // 加载待入库配件
      loadInpartFormData() {
        if(this.$store.state.inpartFormParam){
          let totals = 0
          let _this = this
          this.selectTableData = this.$store.state.inpartFormParam
          console.log(this.selectTableData)
          this.selectTotal = this.selectTableData.length
          for(var i=0;i<_this.selectTableData.length;i++){
            _this.selectTableData[i].subtotal = Number(_this.selectTableData[i].cost) * Number(_this.selectTableData[i].count)
            totals += Number(_this.selectTableData[i].subtotal)
          }
          this.inpartsTotal = totals
        }
      },
      // tab切换
      handleChange(data){
        this.currentTab = data.mp.detail.key
      },
      // 删除
      handleDelete(index, subtotal) {
        let Len = this.selectTableData.length
        this.selectTableData.splice(index,1)
        this.inpartsTotal = this.inpartsTotal-subtotal
        this.$store.dispatch('updateInPartCount', Len - 1)
      },
      // 结算
      saveProduction(){
        if(!this.isLocked){
          this.isLocked = true
          let _this = this
          let inpartInfos = []
          for(var i=0;i< _this.selectTableData.length;i++){
            let inpartInfoObj = {
              "workOrderNo": "",
              "partId": _this.selectTableData[i].partId,
              "count": _this.selectTableData[i].count,
              "cost": _this.selectTableData[i].cost,
              "supplierLK": _this.inpartingForm.supplierLK,
              "repositoryCodeLK": _this.selectTableData[i].repCodeLK,
              "isDeleted": false
            }
            inpartInfos.push(inpartInfoObj)
          }
          let formObj = {
            "inPart": {
                "workOrderNo": "",
                "payMethhodLK": _this.inpartingForm.payMethhodLKVal,
                "sum": _this.inpartsTotal,
                "inTime": "",
                "supplierLK": _this.inpartingForm.supplierLK,
                "company": _this.usercompany,
                "isDeleted": false
            },
            "inpartInfos": inpartInfos
          }
          if(_this.selectTableData.length>0){
            this.$http.post('/supercar/inPart/newInPart',formObj).then((response) => {
              if(response.body.success){
                this.$message({
                type: 'success',
                message: '入库成功',
                duration: 2000,
                showClose: true
              })
                this.selectTableData.splice(0,this.selectTableData.length)
                this.inpartsTotal = 0
                this.loadData(1,this.pageSize)
                this.$store.commit('updateInPartCount', 0)
                $('.el-tabs__item').first().trigger('click')
              }
            }, response => {
              this.$message({
                type: 'error',
                message: '网络连接失败，请重试！',
                duration: 2000,
                showClose: true
              })
            })
          }else{
            this.$message({
              type: 'error',
              message: '出库信息为空，请选择配件！',
              duration: 2000,
              showClose: true
            })
          }
          this.isLocked = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.inpart{
  width: 100%;
  .inpart_header{
    width: 90%;
    padding: 6px;
    background-color: #f2f4fb;
    height: 140rpx;
    margin: 0 auto;
    .add_button{
      padding: 3px 10px;
      border: 1px solid $--color-info;
      border-radius: 4px;
      margin-top:4px;
    }
    .search{
      display: block;
      position: relative;
      input{
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 3rpx 80rpx 6rpx 12rpx;
      }
      .iconfont{
        position: absolute;
        right: 12rpx;
        top: 8rpx;
        font-size: 22px;

      }
    }
  }
  .inpart_item{
    width: 90%;
    background-color: #f2f4fb;
    margin: 20px auto;
    border: 1px solid #f2f4fb;
    border-radius: 6px;
    padding: 6px;
    .item_orderNo{
      text-align: center;
    }
    .item_header{
      border-bottom: 1px solid $--color-info;
      padding: 0 0 4px 0;
      .code{
        color: $--color-info;
      }
    }
    .item_detail{
      padding: 6px 0;
      .label{
        display: inline-block;
        width: 200rpx;
        color: $--color-text-regular;
      }
    }
    .item_footer{
      border-top: 1px solid $--color-info;
      text-align: center;
      padding-top: 6px;
      .button{
        display: inline-block;
        padding: 2px 10px;
        border: 1px solid $--color-info;
        border-radius: 4px;
        margin: 0 8px;
        color: $--color-text-regular;
      }
    }
  }
  .inpart_total{
    height: 100%;
    width: 90%;
    margin: 0 auto;
    padding: 6px;
    .item{
      margin: 6px 0;
      overflow: hidden;
      border: 1px solid #ccc;
      .label{
        width: 30%;
        float: left;
      }
      input{
        width: 70%;
        float: left;
      }
      .button{
        display: block;
        width: 100%;
        height: 26px;
        line-height: 26px;
        text-align: center;
      }
    }
  }
}
</style>
