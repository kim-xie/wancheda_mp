<template>
  <div class="container">
    <div class="outpart">
      <div class="outpart_header clearfix">
        <div class="search">
          <input type="text" v-model="searchVal" @blur="goSearch" placeholder="按订单编号搜索">
          <i v-if="searchVal === ''" class="iconfont icon-search"></i>
          <i v-if="searchVal !== ''" class="iconfont icon-delete" style="color:red" @tap="clear"></i>
        </div>
      </div>

      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <i-tabs :current="currentTab" @change="handleChange($event)">
        <i-tab key="tab1" title="待出库" :count="outpartCount"></i-tab>
        <i-tab key="tab2" :title="'已出库('+totalData+')'"></i-tab>
      </i-tabs>

      <!-- 待出库 -->
      <div class="tab1" v-if="currentTab === 'tab1'">
        <div class="outpart_total">
          <p class="item">
            <span class="label">出库类型</span>
            <picker @change="bindPickerChange($event, 'outpartingForm', 'outpartType')" :range="outpartTypes">
              <span v-if="outpartType===''" class="input placeholder">请选择出库类型</span>
              <span v-else class="input">{{outpartType}}</span>
            </picker>
          </p>
          <p class="item" v-if="outpartType === '维修领料'">
            <span class="label">维修工单号</span>
            <input class="input" v-model="outpartingForm.repairItemNo" type="text">
          </p>
          <p class="item" v-if="outpartType === '配件销售'">
            <span class="label">车牌号</span>
            <input class="input" v-model="outpartingForm.carNo" type="text">
          </p>
          <p class="item" v-if="outpartType === '配件销售'">
            <span class="label">客户名称</span>
            <input class="input" v-model="outpartingForm.clientName" type="text">
          </p>
          <p class="item" v-if="outpartType === '配件内耗'">
            <span class="label">门店名称</span>
            <picker @change="bindPickerChange($event, 'outpartingForm', 'company')" :range="companys">
              <span v-if="company===''" class="input placeholder">请选择门店</span>
              <span v-else class="input">{{company}}</span>
            </picker>
          </p>
          <p class="item" v-if="outpartType === '配件内耗'">
            <span class="label">部门名称</span>
            <input class="input" v-model="outpartingForm.department" type="text">
          </p>
          <p class="item">
            <span class="label">领料人</span>
            <picker @change="bindPickerChange($event, 'outpartingForm', 'receiver')" :range="receivers">
              <span v-if="receiver===''" class="input placeholder">请选择领料人</span>
              <span v-else class="input">{{receiver}}</span>
            </picker>
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
        firstLoad: false,
        tipmessage: '我也是有底线的',
        loading: false,
        outpartsTotal: 0,
        currentTab: 'tab1',
        listData: [],
        totalData: 0,
        selectTableData: [],
        pageNo: 1,
        pageSize: 8,
        outpartingForm: {},
        outpartType: '',
        outpartTypes: [],
        outpartTypeIds: [],
        receiver: '',
        receivers: [],
        receiverIds: [],
        company: '',
        companys: [],
        companyIds: [],
        search: {
          workOrderNo: ''
        },
        deleteIndex: '',
        deleteSubtotal: '',
        actions: [
            {
                name: '取消'
            },
            {
                name: '删除',
                color: '#ed3f14',
            }
        ],
        isLocked: false
      }
    },
    mounted() {
      const that = this
      // 加载已出库
      this.loadoutpartFormData()
      // 出库类型
      this.getLookupByCodeAndPicker('outpart_type','outpartType')
      // 领料人
      this.getUserList(function(valueArray, idArray){
        that.receivers = valueArray
        that.receiverIds = idArray
      })
      // 获取公司列表
      this.getCompanyList('company')
      // 加载列表数据
      this.getList(this.pageNo, this.pageSize)
      // 获取公司
      this.usercompany = this.userInfo.company
    },
    onLoad(){
      this.deleteIndex = ''
      this.deleteSubtotal = ''
      this.spinShow = false
    },
    computed: {
      ...mapGetters([
        'outpartCount',
        'userInfo'
      ])
    },
    // 上拉加载，拉到底部触发
    onReachBottom() {
      // 到这底部在这里需要做什么事情
      console.log('上拉加载')
      const that = this
      if(this.pageSize < this.totalData){
        this.loading = true
        this.tipmessage = '玩命加载中'
        this.pageSize = this.pageSize+10
        this.getList(this.pageNo, this.pageSize, function(){
          that.loading = false
          that.tipmessage = '我也是有底线的'
        })
      }
    },
    methods: {
      // 搜索
      goSearch(){
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
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.$http.get(api.outpartInfo_list, params).then( res => {
          if(res.success){
            this.firstLoad = true
            let _this = this
            let tableData = []
            tableData = res.data.page.content
            this.totalData = res.data.page.totalElements
            for(let i=0; i<tableData.length; i++){
              _this.getDataFormLUPById(tableData[i].date.workOrderNo.type, function(data){
                tableData[i].outpartTypeVal = data.value
                if(i === tableData.length - 1){
                  //_this.isLocked = true
                  _this.listData = tableData
                  //console.log(_this.listData)
                  if(callback && typeof callback == 'function'){
                    callback()
                  }
                }
              })
            }
          }
        })
      },
      // 获取公司列表
      getCompanyList(type, successBack){
        const params = {
          'search.isDeleted_eq': false,
          pageNo: 1,
          pageSize: 1000
        }
        const _this = this
        this.spinShow = true
        this.$http.get(api.company_list, params).then( res => {
          if(res.success){
            const data = res.data.page.content
            //console.log(data)
            let dataArry = []
            let idArry = []
            for(let i=0; i<data.length; i++){
              dataArry.push(data[i].name)
              idArry.push(data[i].id)
            }
            _this[type+'s'] = dataArry
            _this[type+'Ids'] = idArry
            this.spinShow = false
            if(successBack && typeof successBack == 'function'){
              successBack(dataArry, idArry)
            }
          }else{
            this.spinShow = false
          }
        })
      },
      // 获取用户列表
      getUserList(callback){
        const _this = this
        const params = {
          'search.company_eq': '',
          'page.pn': 1,
          'page.size': 1000
        }
        this.spinShow = true
        this.$http.get(api.account_list, params).then( res => {
          if(res.success){
            this.spinShow = false
            let data = res.data.page.content
            let dataArry = []
            let idArry = []
            for(let i=0; i<data.length; i++){
              dataArry.push(data[i].fullname)
              idArry.push(data[i].id)
            }
            if(callback && typeof callback == 'function'){
              callback(dataArry, idArry)
            }
          }
          this.spinShow = false
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
      // 加载待出库配件
      loadoutpartFormData() {
        if(this.$store.state.outpartFormParam){
          let totals = 0
          let _this = this
          this.selectTableData = this.$store.state.outpartFormParam
          //console.log(this.selectTableData)
          this.selectTotal = this.selectTableData.length
          for(var i=0;i<_this.selectTableData.length;i++){
            _this.selectTableData[i].subtotal = Number(_this.selectTableData[i].sale) * Number(_this.selectTableData[i].count)
            totals += Number(_this.selectTableData[i].subtotal)
          }
          this.outpartsTotal = totals
        }
      },
      // tab切换
      handleChange(data){
        this.currentTab = data.mp.detail.key
      },
      // 删除确认
      handleClick(data){
        const type = data.mp._relatedInfo.anchorTargetText
        const that = this
        if(type === '删除'){
          that.deleteApi(that.deleteIndex,that.deleteSubtotal)
          that.modalVisible = false
        }else{
          that.modalVisible = false
        }
      },
      deleteApi(index, subtotal){
        this.spinShow = true
        let Len = this.selectTableData.length
        this.selectTableData.splice(index,1)
        this.outpartsTotal = this.outpartsTotal-subtotal
        this.$store.dispatch('updateOutPartCount', Len - 1).then(() => {
          this.spinShow = false
        })
      },
      // 删除
      handleDelete(index, subtotal) {
        this.deleteIndex = index
        this.deleteSubtotal = subtotal
        this.modalVisible = true
      },
      // 结算
      saveProduction(){
        // 校验
        if(!this.outpartingForm.outpartType){
          globe.message('出库类型不能为空','warning')
          return false
        }else if(this.outpartType === '维修领料'){
          if(!this.outpartingForm.repairItemNo){
            globe.message('维修工单号不能为空','warning')
            return false
          }
        }else if(this.outpartType === '配件销售'){
          if(!this.outpartingForm.carNo){
            globe.message('车牌号不能为空','warning')
            return false
          }
          if(!this.outpartingForm.clientName){
            globe.message('客户名称不能为空','warning')
            return false
          }
        }else if(this.outpartType === '配件内耗'){
          if(!this.outpartingForm.company){
            globe.message('公司不能为空','warning')
            return false
          }
          if(!this.outpartingForm.department){
            globe.message('部门不能为空','warning')
            return false
          }
        }
        if(!this.outpartingForm.receiver){
          globe.message('领料人不能为空','warning')
          return false
        }

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
                "clientName":  _this.outpartingForm.clientName,// _this.$store.state.userInfo.userName,//客户名称
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
            this.spinShow = true
            this.$http.post(api.outPart_add,formObj,true).then((res) => {
              if(res.success){
                this.selectTableData.splice(0,this.selectTableData.length)
                this.outpartsTotal = 0
                this.getList(1, this.pageSize)
                this.outpartType = ''
                this.receiver = ''
                this.$store.dispatch('updateOutPartCount', 0)
                globe.message('配件出库成功','success')
                this.currentTab = 'tab2'
                this.isLocked = false
              }
              this.spinShow = false
            })
          }else{
            globe.message('出库信息为空，请选择配件！','error')
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
      .delete{
        color: '#ed3f14';
      }
    }
  }
}
</style>
