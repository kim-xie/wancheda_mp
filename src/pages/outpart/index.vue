<template>
  <div class="container">
    <div class="outpart">
      <div class="outpart_header">
        <span class="search">
          <input type="text" placeholder="按名称或编号搜索">
          <i class="iconfont icon-search"></i>
        </span>
        <span class="add_button float-left mr10">公司</span>
        <span class="add_button float-left">出库类型</span>
      </div>

      <i-tabs :current="currentTab" @change="handleChange($event)">
        <i-tab key="tab1" title="待出库" :count="outpartCount"></i-tab>
        <i-tab key="tab2" :title="'已出库('+totalData+')'"></i-tab>
      </i-tabs>

      <!-- 待出库 -->
      <div class="tab1" v-if="currentTab === 'tab1'">
        <div class="outpart_total">
          <p class="item">
            <span class="label">出库类型</span>
            <input type="text">
          </p>
          <p class="item">
            <span class="label">领料人</span>
            <input type="text">
          </p>
          <p class="item">
            <span class="label">支付金额</span>
            <span>￥{{outpartsTotal}}</span>
          </p>
          <p class="item">
            <span class="button" @tap="saveProduction">结算</span>
          </p>
        </div>
        <div class="outpart_item" v-for="(item,index) in selectTableData" :key="index">
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
              <span class="button delete" @tap="handleDelete(index, item.subtotal)">删除</span>
            </p>
          </div>
        </div>
      </div>

      <!-- 已出库 -->
      <div class="tab2" v-if="currentTab === 'tab2'">
        <div class="outpart_item" v-for="(item,index) in listData" :key="index">
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
                <span class="label">销售价:</span>
                <span class="value">{{item.sale}}</span>
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
                <span class="label">出库类型:</span>
                <span class="value">{{item.outpartTypeVal}}</span>
              </p>
              <p class="">
                <span class="label">领料人:</span>
                <span class="value" v-if="item.date.receiver">{{item.date.receiver.username}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="">
                <span class="label">适用车型:</span>
                <span class="value">{{item.date.partId.carModel}}</span>
              </p>
              <p class="">
                <span class="label">出库时间:</span>
                <span class="value">{{item.date.workOrderNo.outTime}}</span>
              </p>
            </p>
          </div>
        </div>
        <!-- 页底加载 -->
        <i-load-more v-if="totalData>pageSize" :tip="tipmessage" :loading="loading" />
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
        outpartsTotal: 0,
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
      this.loadoutpartFormData()
      this.getList(this.pageNo, this.pageSize)
    },
    computed: {
      ...mapGetters([
        'outpartCount'
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
        this.$http.get(api.outpartInfo_list, params).then( res => {
          if(res.success){
            let _this = this
            let tableData = []
            tableData = res.data.page.content
            this.totalData = res.data.page.totalElements
            for(let i=0; i<tableData.length; i++){
              _this.getDataFormLUPById(tableData[i].date.workOrderNo.type, function(data){
                tableData[i].outpartTypeVal = data.value
                if(i === tableData.length - 1){
                  _this.isLocked = true
                  _this.listData = tableData
                  console.log(_this.listData)
                  if(callback && typeof callback == 'function'){
                    callback()
                  }
                }
              })
            }
          }
        })
      },
      // 根据字典id获取字典数据
      getDataFormLUPById(lookupId, callback) {
        let params = {
          id: lookupId
        }
        this.$http.get(api.getLookupById, params).then((response) => {
          if (callback && typeof callback == 'function' && response.data) {
            callback(response.data.entity)
          }
        }, response => {
          console.log('加载数据字典时，根据当前数据字典id获取数据字典请求失败...')
        })
      },
      // 加载待入库配件
      loadoutpartFormData() {
        if(this.$store.state.outpartFormParam){
          let totals = 0
          let _this = this
          this.selectTableData = this.$store.state.outpartFormParam
          console.log(this.selectTableData)
          this.selectTotal = this.selectTableData.length
          for(var i=0;i<_this.selectTableData.length;i++){
            _this.selectTableData[i].subtotal = Number(_this.selectTableData[i].cost) * Number(_this.selectTableData[i].count)
            totals += Number(_this.selectTableData[i].subtotal)
          }
          this.outpartsTotal = totals
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
        this.outpartsTotal = this.outpartsTotal-subtotal
        this.$store.dispatch('updateOutPartCount', Len - 1)
      },
      // 结算
      saveProduction(){
        if(!this.isLocked){
          this.isLocked = true
          let _this = this
          let outpartInfos = []
          for(var i=0;i< _this.selectTableData.length;i++){
            let outpartInfoObj = {
              "workOrderNo": "",
              "inventoryId": _this.selectTableData[i].inventoryId,
              "count": _this.selectTableData[i].count,
              "sale": _this.selectTableData[i].sale,
              "isDeleted": false
            }
            outpartInfos.push(outpartInfoObj)
          }
          let formObj = {
            "outPart": {
                "workOrderNo": "", //工单号
                "type": _this.outpartingForm.outpartType, //出库类型
                "clientName": _this.$store.state.userInfo.userName,//客户名称
                "receiver": _this.outpartingForm.receiver,//领料人
                "repairWorkorderNo": _this.outpartingForm.repairItemNo,//维修工单号 -- 对应维修领料
                "carNo": _this.outpartingForm.carNo,//车牌号 -- 对应配件销售
                "departmentLK": _this.outpartingForm.department,//所属部门 -- 对应内部消耗
                "company": _this.usercompany,//所属公司
                "outTime": "",
                "sum": _this.outpartsTotal,
                "isDeleted": false //未删除
            },
            "outPartInfos": outpartInfos
          }
          if(_this.selectTableData.length>0){
            this.$http.post('/supercar/outPart/newOutPart',formObj).then((response) => {
              if(response.body.success){
                this.selectTableData.splice(0,this.selectTableData.length)
                this.outpartsTotal = 0
                this.loadData(1,this.pageSize)
                this.$store.commit('updateOutPartCount', 0)
                this.$message({
                  type: 'success',
                  message: '配件出库成功',
                  duration: 2000,
                  showClose: true
                })
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
.outpart{
  width: 100%;
  .outpart_header{
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
  .outpart_item{
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
  .outpart_total{
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
