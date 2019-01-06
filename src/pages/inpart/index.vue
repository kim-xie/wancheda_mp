<template>
  <div class="container">
    <div class="inpart">
      <div class="inpart_header">
        <span class="search">
          <input type="text" v-model="searchVal" @blur="goSearch" placeholder="按订单编号搜索">
          <i v-if="searchVal === ''" class="iconfont icon-search"></i>
          <i v-if="searchVal !== ''" class="iconfont icon-delete" style="color:red" @tap="clear"></i>
        </span>
        <!-- <span class="add_button float-left mr10">公司</span>
        <span class="add_button float-left">供应商</span> -->
      </div>

      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <i-tabs :current="currentTab" @change="handleChange($event)">
        <i-tab key="tab1" title="待入库" :count="inpartCount"></i-tab>
        <i-tab key="tab2" :title="'已入库('+totalData+')'"></i-tab>
      </i-tabs>

      <!-- 待入库 -->
      <div class="tab1" v-if="currentTab === 'tab1'">
        <div class="inpart_total">
          <p class="item">
            <span class="label">支付方式</span>
            <picker @change="bindPickerChange($event, 'inpartingForm', 'payMethhodLKVal')" :range="payMethhodLKVals">
              <span v-if="payMethhodLKVal===''" class="input placeholder">请选择支付方式</span>
              <span v-else class="input">{{payMethhodLKVal}}</span>
            </picker>
          </p>
          <p class="item">
            <span class="label">供应商</span>
            <picker @change="bindPickerChange($event, 'inpartingForm', 'supplierLK')" :range="supplierLKs">
              <span v-if="supplierLK===''" class="input placeholder">请选择供应商</span>
              <span v-else class="input">{{supplierLK}}</span>
            </picker>
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
      </div>

      <!-- 暂无数据 -->
      <i-divider v-if="totalData===0 && firstLoad" color="#2d8cf0" lineColor="#2d8cf0">抱歉，暂无数据</i-divider>

      <!-- 页底加载 -->
      <i-load-more v-if="totalData>pageSize" :tip="tipmessage" :loading="loading" />

      <i-modal title="删除确认" :visible="modalVisible" :actions="actions" @tap="handleClick($event)">
        <view>删除后数据将无法恢复哦</view>
      </i-modal>

    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import globe from '../../utils/globe'
  import api from '../../api/api'
  export default {
    data () {
      return {
        usercompany: '',
        searchVal: '',
        spinShow: true,
        modalVisible: false,
        tipmessage: '我也是有底线的',
        loading: false,
        inpartsTotal: 0,
        currentTab: 'tab1',
        listData: [],
        totalData: 0,
        selectTableData: [],
        pageNo: 1,
        pageSize: 8,
        inpartingForm: {},
        payMethhodLKVal: '',
        payMethhodLKVals: [],
        payMethhodLKValIds: [],
        supplierLK: '',
        supplierLKs: [],
        supplierLKIds: [],
        search: {
          workOrderNo: ''
        },
        isLocked: false,
        actions: [
            {
                name: '取消'
            },
            {
                name: '删除',
                color: '#ed3f14',
            }
        ]
      }
    },
    mounted() {
      // 已入库配件
      this.loadInpartFormData()
      // 供应商
      this.getLookupByCodeAndPicker('supplier','supplierLK')
      // 支付方式
      this.getLookupByCodeAndPicker('pay_type','payMethhodLKVal')
      // 加载列表数据
      this.getList(this.pageNo, this.pageSize)
      // 获取公司
      this.usercompany = this.userInfo.company
    },
    computed: {
      ...mapGetters([
        'inpartCount',
        'userInfo'
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
      // 搜索
      goSearch(){
        console.log(this.searchVal)
        const searchVal = this.searchVal
        this.search.workOrderNo = ''
        this.search.workOrderNo = searchVal
        this.getList(this.pageNo, this.pageSize)
      },
      clear(){
        this.searchVal = ''
        this.search.workOrderNo = ''
        this.getList(this.pageNo, this.pageSize)
      },
      // 获取列表数据
      getList(pageNo, pageSize, callback){
        const params = {
          //'search.supplierLK_eq': this.search.supplierLK,
          'search.workOrderNo_eq': this.search.workOrderNo,
          //'search.company_eq': this.search.company,
          'search.isDeleted_eq': false,
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
      // 普通选择器
      bindPickerChange(data, formName, type){
        const index = data.mp.detail.value
        // 显示的值
        this[type] = this[type+'s'][index]
        // 对应的id
        this[formName][type] = this[type+'Ids'][index]
      },
      // 获取数据字典并且弹出选择框
      getLookupByCodeAndPicker(code, type, successBack){
        const _this = this
        this.getLookupByCode(code, 1, 1000, function(data, total){
          let dataArry = []
          let idArry = []
          for(let i=0; i<data.length; i++){
            dataArry.push(data[i].value)
            idArry.push(data[i].id)
          }

          _this[type+'s'] = dataArry
          _this[type+'Ids'] = idArry

          if(successBack && typeof successBack == 'function'){
            successBack(dataArry, idArry)
          }
        })
      },
      // 根据数据字典code获取数据字典
      getLookupByCode(code, pageNo, pageSize, callback){
        const params = {
          pageNo,
          pageSize
        }
        this.spinShow = true
        this.$http.get(api.getLookupByCode + code, params).then( res => {
          if(res.success){
            if(callback && typeof callback == 'function'){
              callback(res.data.page.content, res.data.page.totalElements)
            }
          }
          this.spinShow = false
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
        // 校验
        if(!this.inpartingForm.payMethhodLKVal){
          globe.message('支付方式不能为空','warning')
          return false
        }
        if(!this.inpartingForm.supplierLK){
          globe.message('供应商不能为空','warning')
          return false
        }
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
            this.$http.post(api.inpart_add, formObj, true).then( res => {
              if(res.success){
                globe.message('入库成功', 'success')
                this.selectTableData.splice(0,this.selectTableData.length)
                this.inpartsTotal = 0
                this.supplierLK = ''
                this.payMethhodLKVal = ''
                this.getList(1, this.pageSize)
                this.currentTab = 'tab2'
                this.$store.dispatch('updateInPartCount', 0)
              }
              this.spinShow = false
            })
          }else{
            globe.message('入库信息为空，请选择配件！','error')
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
    height: 80rpx;
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
    .item{
      margin: 6px 0;
      padding: 6px;
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
