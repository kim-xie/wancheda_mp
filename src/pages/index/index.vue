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

      <div v-if="current === 'index'" class="transition tab_index">
        <div>
          <i-steps :current="stepCurrent">
            <i-step>
                <view slot="title">
                  客户信息
                </view>
            </i-step>
            <i-step>
                <view slot="title">
                  工单信息
                </view>
            </i-step>
            <i-step>
                <view slot="title">
                  维修项目
                </view>
            </i-step>
            <i-step>
                <view slot="title">
                  确认下单
                </view>
            </i-step>
          </i-steps>

          <!-- 弹层 -->
          <van-popup :show="showArea" @close="onClose" position="bottom" :overlay="true">
            <van-area v-if="pupType === 'area'" :area-list="areaList" @confirm="selectedArea" @cancel="cancelArea"/>
            <van-datetime-picker v-if="pupType === 'dateTime'" type="datetime" :minDate="minDate" @confirm="selectedDate" @cancel="cancelDate"/>
          </van-popup>

          <!-- 客户信息 -->
          <div class="clientForm" v-if="stepCurrent===0">
            <div class="item">
              <span class="label">车牌号:</span>
              <input class="input" v-model="clientForm.carNo" type="text" placeholder="输入车牌号进行搜索" @blur="searchCar">
            </div>
            <div class="item">
              <span class="label">客户姓名:</span>
              <input class="input" v-model="clientForm.name" type="text" placeholder="请输入客户姓名">
            </div>
            <div class="item">
              <span class="label">客户手机:</span>
              <input class="input" v-model="clientForm.mobile" type="text" placeholder="请输入客户手机">
            </div>
            <div class="item">
              <span class="label">客户级别:</span>
              <picker @change="bindPickerChange($event, 'clientForm', 'level')" :range="levels">
                <span v-if="level===''" class="input placeholder">请选择客户级别</span>
                <span v-else class="input">{{level}}</span>
              </picker>
            </div>
            <div class="item">
              <span class="label">客户类型:</span>
              <picker @change="bindPickerChange($event, 'clientForm', 'type')" :range="types">
                <span v-if="type===''" class="input placeholder">请选择客户类型</span>
                <span v-else class="input">{{type}}</span>
              </picker>
            </div>
            <div class="item">
              <span class="label">汽车品牌:</span>
              <picker @change="bindPickerChange($event, 'clientForm', 'carBrand')" :range="carBrands">
                <span v-if="carBrand===''" class="input placeholder">请选择汽车品牌</span>
                <span v-else class="input">{{carBrand}}</span>
              </picker>
            </div>
            <div class="item">
              <span class="label">汽车车型:</span>
              <input class="input" v-model="clientForm.carModel" type="text" placeholder="请输入汽车车型">
            </div>
            <div class="item" v-if="showMore">
              <span class="label">车身颜色:</span>
              <input class="input" v-model="clientForm.carColor" type="text" placeholder="请输入车身颜色">
            </div>
            <div class="item" v-if="showMore">
              <span class="label">客户邮箱:</span>
              <input class="input" v-model="clientForm.email" type="text" placeholder="请输入客户邮箱">
            </div>
            <div class="item" v-if="showMore">
              <span class="label">客户性别:</span>
              <span v-if="clientSex===''" class="input placeholder" @tap="selectSex">请选择客户性别</span>
              <span v-else class="input" @tap="selectSex">{{clientSex}}</span>
            </div>
            <div class="item" v-if="showMore">
              <span class="label">证件号码:</span>
              <input class="input" v-model="clientForm.idcard" type="text" placeholder="请输入证件号码">
            </div>
            <div class="item" v-if="showMore">
              <span class="label">客户地址:</span>
              <span v-if="!clientForm.address" class="input placeholder" @tap="selectArea">请选择客户地址</span>
              <span v-else class="input" @tap="selectArea">{{clientForm.address}}</span>
            </div>
            <div class="item" v-if="showMore">
              <span class="label">客户详细地址:</span>
              <input class="input" v-model="clientForm.address" type="text" placeholder="请输入客户详细地址">
            </div>
            <div class="item" v-if="showMore">
              <span class="label">发动机号:</span>
              <input class="input" v-model="clientForm.engineNo" type="text" placeholder="请输入发动机号">
            </div>
            <div class="item" v-if="showMore">
              <span class="label">车架号:</span>
              <input class="input" v-model="clientForm.carVIN" type="text" placeholder="请输入车架号">
            </div>
            <div class="item" v-if="showMore">
              <span class="label">保险公司:</span>
              <input class="input" v-model="clientForm.insurer" type="text" placeholder="请输入保险公司">
            </div>
            <div class="item" v-if="showMore">
              <span class="label">保险到期日期:</span>
              <span v-if="!clientForm.insuranceEndtime" class="input placeholder" @tap="selectDate('clientForm','insuranceEndtime')">请选择保险到期时间</span>
              <span v-else class="input" @tap="selectDate('clientForm','insuranceEndtime')">{{clientForm.insuranceEndtime}}</span>
              <!-- <picker
                mode="date"
                :value="insuranceEndtime"
                @change="handleDateChange($event, 'insur')">
                <span v-if="insuranceEndtime===''" class="input placeholder">请选择保险到期时间</span>
                <span v-else class="input">{{insuranceEndtime}}</span>
              </picker> -->
            </div>
            <div class="item" v-if="showMore">
              <span class="label">上牌日期:</span>
              <span v-if="!clientForm.registrationDate" class="input placeholder" @tap="selectDate('clientForm','registrationDate')">请选择上牌日期</span>
              <span v-else class="input" @tap="selectDate('clientForm','registrationDate')">{{clientForm.registrationDate}}</span>
              <!-- <picker
                mode="date"
                :value="registrationDate"
                @change="handleDateChange($event, 'reg')">
                <span v-if="registrationDate===''" class="input placeholder">请选择上牌日期</span>
                <span v-else class="input">{{registrationDate}}</span>
              </picker> -->
            </div>
            <div class="item" v-if="showMore">
              <span class="label">备注:</span>
              <input class="input" v-model="clientForm.description" type="textarea" placeholder="请输入备注">
            </div>

            <div class="button_wrap">
              <span class="item_button" v-if="showMore === false" @tap="showMore = true">更多</span>
              <span class="item_button" v-if="showMore" @tap="showMore = false">收起</span>
              <span class="item_button" @tap="resetInput">重置</span>
            </div>
          </div>

          <!-- 工单信息 -->
          <div class="repairForm" v-if="stepCurrent===1">
            <div class="item">
              <span class="label">维修性质:</span>
              <picker @change="bindPickerChange($event, 'repairForm', 'repairTypeLK')" :range="repairTypeLKs">
                <span v-if="repairTypeLK===''" class="input placeholder">请选择维修性质</span>
                <span v-else class="input">{{repairTypeLK}}</span>
              </picker>
            </div>
            <div class="item">
              <span class="label">送修人:</span>
              <input class="input" v-model="repairForm.sendMan" type="text" placeholder="请输入送修人">
            </div>
            <div class="item">
              <span class="label">进店油表:</span>
              <picker @change="bindPickerChange($event, 'repairForm', 'carOilmeter')" :range="carOilmeters">
                <span v-if="carOilmeter===''" class="input placeholder">请选择进店油表</span>
                <span v-else class="input">{{carOilmeter}}</span>
              </picker>
            </div>
            <div class="item">
              <span class="label">进店里程(km):</span>
              <input class="input" v-model="repairForm.carMileage" type="number" placeholder="请输入进店里程">
            </div>
            <div class="item">
              <span class="label">交车时间:</span>
              <span v-if="!repairForm.endTime" class="input placeholder" @tap="selectDate('repairForm','endTime')">请选择保险到期时间</span>
              <span v-else class="input" @tap="selectDate('repairForm','endTime')">{{repairForm.endTime}}</span>
              <!-- <picker
                mode="date"
                :value="endTimeVal"
                @change="handleDateChange($event, 'endTime')">
                <span v-if="endTimeVal===''" class="input placeholder">请选择交车时间</span>
                <span v-else class="input">{{endTimeVal}}</span>
              </picker> -->
            </div>
            <div class="item">
              <span class="label">服务顾问:</span>
              <picker @change="bindPickerChange($event, 'repairForm', 'clerk')" :range="clerks">
                <span v-if="clerk===''" class="input placeholder">请选择服务顾问</span>
                <span v-else class="input">{{clerk}}</span>
              </picker>
            </div>
            <div class="item">
              <span class="label">车主嘱咐:</span>
              <input class="input" v-model="repairForm.clentRemind" type="text" placeholder="请输入车主嘱咐">
            </div>
          </div>

          <!-- 维修领料 -->
          <div class="productForm" v-if="stepCurrent===2">
            <div class="productForm_button">
              <i-button @click="handleRepair" inline shape="circle" size="small">添加服务项目</i-button>
              <i-button @click="handleProduct" inline shape="circle" size="small">添加维修配件</i-button>
            </div>

            <!-- 服务项目列表 -->
            <div class="repairList">
              <div class="repairItems">
                <i-card v-if="repairItems.length>0" title="维修项目清单" :extra="repairItems.length">
                  <view slot="content" v-for="(item, index) in repairItems" :key="index">
                    项目名称：{{item.name}} <br/>
                    工时/数量：{{item.workHour}} <br/>
                    单价(元)：￥{{item.sum}} <br/>
                    小计(元)：￥{{item.subtotal}} <br/>
                    技师：{{item.mechanicVal}} <br/>
                    备注：{{item.description}} <br/>
                    折扣：{{item.discount}} 折 <br/>
                    <div class="item_button">
                      <div class="button" @tap="handleEditRepair(item,index)">编辑</div>
                      <div class="button delete_button" @tap="handleDeleteRepair(item,index)">删除</div>
                    </div>
                    <hr style="border:1px dashed #ccc;"/>
                  </view>
                  <view slot="footer"></view>
                </i-card>
              </div>
            </div>

            <!-- 领料列表 -->
            <div class="repairList">
              <div class="repairItems">
                <i-card v-if="inventoryItems.length>0" title="维修领料清单" :extra="inventoryItems.length">
                  <view slot="content" v-for="(item, index) in inventoryItems" :key="index">
                    配件名称：{{item.name}} <br/>
                    数量：{{item.count}} <br/>
                    单价(元)：￥{{item.sale}} <br/>
                    小计(元)：￥{{item.subtotal}} <br/>
                    领料人：{{item.receiverVal}} <br/>
                    备注：{{item.description}} <br/>
                    折扣：{{item.discount}} 折 <br/>
                    <div class="item_button">
                      <div class="button" @tap="handleEditInventory(item, index)">编辑</div>
                      <div class="button delete_button" @tap="handleDeleteInventory(item, index)">删除</div>
                    </div>
                    <hr style="border:1px dashed #ccc;"/>
                  </view>
                  <view slot="footer"></view>
                </i-card>
              </div>
            </div>
          </div>

          <!-- 确认下单 -->
          <div class="billingForm" v-if="stepCurrent===3">
            <div class="billingWrap">
              <div class="billing_card">
                <i-card title="客户信息" :extra="clientForm.carNo">
                  <view slot="content">
                    车主：{{clientForm.name}}<br/>
                    车型：{{carBrand}} {{clientForm.carModel}}
                  </view>
                  <view slot="footer">
                    手机：{{clientForm.mobile}}
                  </view>
                </i-card>
              </div>
              <div class="billing_card">
                <i-card title="工单信息" :extra="repairTypeLK">
                  <view slot="content">
                    进店油表：{{carOilmeter}} <br/>
                    进店里程：{{repairForm.carMileage}} km
                  </view>
                  <view slot="footer">服务顾问：{{clerk}}</view>
                </i-card>
              </div>
              <div class="billing_card">
                <i-card v-if="repairItems.length>0" title="维修项目" :extra="'小计：￥'+repairsubtotal">
                  <view slot="content" v-for="(item, index) in repairItems" :key="index">
                    项目名称：{{item.name}} <br/>
                    单价：￥{{item.sum}} <br/>
                    工时/数量：{{item.workHour}} <br/>
                    折扣：{{item.discount}} 折 <br/>
                    <hr style="margin-top:4px;border:1px dashed #ccc;"/>
                  </view>
                  <view slot="footer"></view>
                </i-card>
              </div>
              <div class="billing_card" v-if="inventoryItems.length>0">
                <i-card v-if="inventoryItems.length>0" title="维修领料" :extra="'小计：￥'+inventorysubtotal">
                  <view slot="content" v-for="(item, index) in inventoryItems" :key="index">
                    配件名称：{{item.name}} <br/>
                    单价：￥{{item.sale}} <br/>
                    数量：{{item.count}} <br/>
                    折扣：{{item.discount}} 折 <br/>
                    <hr style="margin-top:4px;border:1px dashed #ccc;"/>
                  </view>
                  <view slot="footer"></view>
                </i-card>
              </div>
              <div class="billing_card">
                <i-cell-group>
                  <picker v-if="ownCoupon" @change="pickerCoupon($event, 'couponForm', 'couponVal')" :range="couponNames">
                    <i-cell  title="优惠券" value="有可用" is-link></i-cell>
                  </picker>
                  <i-cell v-else title="优惠券" value="无可用" is-link></i-cell>
                  <i-cell v-if="couponForm.couponVal>0" title="优惠券" :value="'-￥'+couponPrice"></i-cell>
                  <i-cell title="已优惠" :value="'-￥'+discountPrice"></i-cell>
                  <i-cell title="消费金额" :value="'￥'+consumPrice"></i-cell>
                </i-cell-group>
              </div>
            </div>
          </div>

          <!-- 按钮 -->
          <div class="step_button">
            <i-button v-if="stepCurrent<3" @tap="handleNext" type="primary" inline shape="circle" size="small">下一步</i-button>
            <i-button v-if="stepCurrent>0" @tap="handlePrev" type="info" inline shape="circle" size="small">上一步</i-button>
            <i-button v-if="stepCurrent===3" @tap="billing" type="error" inline shape="circle" size="small">提交订单</i-button>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="tab_bar">
      <i-tab-bar fixed :current="current" color="#f759ab" @change="handleChangeTabBar($event)">
        <i-tab-bar-item key="index" icon="financial_fill" current-icon="financial_fill" title="接车"></i-tab-bar-item>
        <i-tab-bar-item key="order" icon="createtask" current-icon="createtask_fill" title="工单"></i-tab-bar-item>
        <i-tab-bar-item key="workplace" icon="shop_fill" current-icon="shop_fill" title="工作台"></i-tab-bar-item>
        <i-tab-bar-item key="mine" icon="mine" current-icon="mine_fill" title="我的"></i-tab-bar-item>
      </i-tab-bar> -->
    </div>
  </div>
</template>

<script>
  import globe from '../../utils/globe'
  import {isSuperAdmin} from '../../utils/permission'
  import api from '../../api/api'
  import {formatDatetime} from '../../utils/index'
  import areaLists from '../../utils/area'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        modalSuccess: true,
        modalVisible: false,
        modalMessage: '',
        repairtotal: 0,
        repairsubtotal: 0,
        inventorytotal: 0,
        inventorysubtotal: 0,
        discounttotal: 0,
        alltotal: 0,
        discountPrice: '',
        consumPrice: '',
        couponPrice: '',
        clientForm: {},
        level: '',
        type: '',
        carBrand: '',
        clientSex: '',
        insuranceEndtime: '',
        registrationDate: '',
        repairForm: {},
        repairTypeLK: '',
        carOilmeter: '',
        endTimeVal: '',
        clerk: '',
        stepCurrent: 0,
        spinShow: true,
        showMore: false,
        levels: [],
        levelIds: [],
        types: [],
        carBrands: [],
        carBrandIds: [],
        typeIds: [],
        repairTypeLKs: [],
        repairTypeLKIds: [],
        carOilmeters: [],
        carOilmeterIds: [],
        clerks: [],
        clerkIds: [],
        hasPermission: false,
        current: 'index',
        clientCouponTableData: [],
        ownCoupon: false,
        couponForm: {
          couponVal: 0
        },
        couponNames: [],
        couponVals: [],
        usercompany: '',
        outpartType: '',
        showArea: false,
        pupType: 'area',
        areaList: areaLists,
        formName: '',
        currentName: '',
        minDate: new Date().getTime()
      }
    },
    mounted() {
      this.spinShow = false
      const that = this
      // 客户级别
      this.getLookupByCodeAndPicker('client_level', 'level')
      // 客户类型
      this.getLookupByCodeAndPicker('client_type', 'type')
      // 汽车品牌
      this.getLookupByCodeAndPicker('car_brand', 'carBrand')
      // 维修性质
      this.getLookupByCodeAndPicker('work_type','repairTypeLK')
      // 进店油表
      this.getLookupByCodeAndPicker('carOilmeter', 'carOilmeter')
      // 获取用户列表
      this.getUserList(function(valueArray, idArray){
        that.clerks = valueArray
        that.clerkIds = idArray
      })
      // 获取领料类型
      this.getLookupByCode('outpart_type',1,1000,function(data,total){
        const repairOutpart = data
        for (var i = 0; i < repairOutpart.length; i++) {
          if(repairOutpart[i].code == '0'){
            that.outpartType = repairOutpart[i]
          }
        }
      })
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'inpartCount',
        'outpartCount',
        'repairItemCount',
        'repairItems',
        'inventoryItems',
        'client'
      ])
    },
    // 上拉加载，拉到底部触发
    onReachBottom() {
      // 到这底部在这里需要做什么事情
    },
    methods: {
      onClose(){
        this.showArea = false
      },
      // 选择地址
      selectArea(){
        this.pupType = 'area'
        this.showArea = true
      },
      // 选择地址
      selectedArea(data){
        const areas = data.mp.detail.values
        let area = ''
        areas.forEach(element => {
          area += element.name
        })
        //console.log(area)
        this.clientForm.address = area
        this.onClose()
      },
      cancelArea(){
        this.onClose()
      },
      // 选择时间
      selectDate(formName,name){
        this.pupType = 'dateTime'
        this.formName = formName
        this.currentName = name
        this.showArea = true
      },
      // 选择时间
      selectedDate(data){
        const timestamp = data.mp.detail
        let date = new Date(timestamp)
        let fmtDate = formatDatetime(date, 'yyyy-MM-dd hh:mm:ss')
        this[this.formName][this.currentName] = fmtDate
        this.onClose()
      },
      cancelDate(){
        this.onClose()
      },
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
      // 搜索客户信息
      searchCar(){
        if(this.clientForm.carNo){
          const _this = this
          const params = {
            'search.carNo_eq': this.clientForm.carNo,
            'page.pn': 1,
            'page.size': 10
          }
          this.spinShow = true
          this.$http.get(api.client_list, params).then( res => {
            if(res.success){
              this.spinShow = false
              let clientData = res.data.page.content
              //console.log(clientData)
              for(var i=0;i<clientData.length;i++){
                _this.level = clientData[i].date.level.value
                _this.type = clientData[i].date.type.value
                _this.carBrand = clientData[i].date.carBrand.value
                _this.clientSex = clientData[i].sex === true ? '男':'女'
                _this.insuranceEndtime = clientData[i].insuranceEndtime
                _this.registrationDate = clientData[i].registrationDate
                clientData[i].date = ''
                _this.clientForm = clientData[i]
              }
            }
            this.spinShow = false
          })
        }
      },
      // 表单重值
      resetInput(){
        this.clientForm = {}
        this.level = ''
        this.type = ''
        this.carBrand = ''
        this.clientSex = ''
        this.insuranceEndtime = ''
        this.registrationDate = ''
      },
      // 切换tab-bar
      handleChangeTabBar (data) {
        this.current = data.mp.detail.key
        wx.switchTab({
          url: '../../pages/'+this.current+'/main'
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
      // 优惠券选择器
      pickerCoupon(data, formName, type){
        const index = data.mp.detail.value
        // 显示的值
        this[type] = this['couponNames'][index]
        // 对应的id
        this[formName][type] = Number(this[type+'s'][index])
        this.discountPrice = this.toDecimal2(this.discounttotal + this[formName][type])
        this.consumPrice = this.toDecimal2(this.alltotal - this[formName][type])
        this.couponPrice = this.toDecimal2(this[formName][type])
      },
      // 添加维修项目
      handleRepair(){
        wx.navigateTo({
          url: '/pages/repair/main?select=true'
        })
      },
      // 添加维修配件
      handleProduct(){
        wx.navigateTo({
          url: '/pages/inventory/main?select=true'
        })
      },
      // 编辑维修项目
      handleEditRepair(item, index){
        item.delete = false
        item.add = false
        item.index = index
        this.$store.dispatch('saveEditItem', item).then(() => {
          wx.navigateTo({
            url: '/pages/selectRepair/main?id='+item.id
          })
        })
      },
      // 删除维修项目
      handleDeleteRepair(item, index){
        const that = this
        item.delete = true
        item.add = false
        item.index = index
        that.spinShow = true
        that.$store.dispatch('updateRepairItem', item).then(() => {
          globe.message('删除成功','success')
          that.spinShow = false
        })
      },
      // 编辑配件
      handleEditInventory(item, index){
        item.delete = false
        item.add = false
        item.index = index
        this.$store.dispatch('saveEditItem', item).then(() => {
          wx.navigateTo({
            url: '/pages/selectInventory/main?id='+item.id
          })
        })
      },
      // 删除配件
      handleDeleteInventory(item, index){
        const that = this
        item.delete = true
        item.add = false
        item.index = index
        that.spinShow = true
        that.$store.dispatch('updateInventoryItem', item).then(() => {
          globe.message('删除成功','success')
          that.spinShow = false
        })
      },
      // 提交订单
      billing(formName){
        const _this = this
        _this.spinShow = true
        // 维修项目
        let newRepairItemTable = []
        for(var i=0;i<this.repairItems.length;i++){
          let tableDate = {}
          tableDate.workorderId = ""
          tableDate.itemId = _this.repairItems[i].id
          tableDate.mechanic = _this.repairItems[i].mechanic
          newRepairItemTable.push(tableDate)
        }
        // 出库配件
        let outpartInfos = []
        for(var i=0;i< _this.inventoryItems.length;i++){
          let outpartInfoObj = {
            "workOrderNo": "",
            "inventoryId": _this.inventoryItems[i].id,
            "count": _this.inventoryItems[i].count,
            "sale": _this.inventoryItems[i].sale,
            "isDeleted": false
          }
          outpartInfos.push(outpartInfoObj)
        }
        // 客户信息
        if(_this.clientForm.id){
          delete _this.clientForm.date
          delete _this.clientForm.levelVal
          delete _this.clientForm.insuranceEndtime
          delete _this.clientForm.registrationDate
          delete _this.clientForm.createTime
          delete _this.clientForm.updateTime
          _this.clientForm.company = _this.clientForm.company?_this.clientForm.company:_this.userInfo.company
        }else{
          _this.clientForm.registrationDate = _this.clientForm.registrationDate ? new Date(_this.clientForm.registrationDate):''
          _this.clientForm.insuranceEndtime = _this.clientForm.insuranceEndtime ? new Date(_this.clientForm.insuranceEndtime):''
          _this.clientForm.company = _this.clientForm.company?_this.clientForm.company:_this.userInfo.company
        }

        // 订单详情
        var addFormObj = {
          // 客户信息
          "client": _this.clientForm,
          // 维修工单
          "repairWorkorder": {
            "workorderState": '维修中',//工单状态
            "repairTypeLK": _this.repairForm.repairTypeLK,//维修性质
            "sum": Number(_this.inventorysubtotal) + Number(_this.repairsubtotal) - Number(_this.couponForm.couponVal) <=0?'':Number(_this.inventorysubtotal) + Number(_this.repairsubtotal) - Number(_this.couponForm.couponVal),//消费金额
            "clerk": _this.repairForm.clerk,//服务顾问
            "carMileage": _this.repairForm.carMileage,//进店里程
            "carOilmeter": _this.carOilmeter,//进店油表
            "sendMan": _this.repairForm.sendMan,//送修人
            "endTime": new Date(_this.repairForm.endTime),//离店时间
            "clentRemind": _this.repairForm.clentRemind,//客户嘱咐
            "company": _this.userInfo.company//公司
          },
          // 工单详情
          "repairWorkorderItems": newRepairItemTable,
          // 领料单
          "outPartComposite": {
            "outPart": {
              "type": _this.outpartType.id, //出库类型 -- 维修领料
              "receiver": _this.inventoryItems[0] ? _this.inventoryItems[0].receiver : '', //领料人
              "sum": _this.inventorysubtotal, //总金额
              "repairWorkorderNo": "", // 对应维修开单
              "clientName": "", // 对应配件销售
              "carNo": "", // 对应配件销售
              "departmentLK": "",// 对应配件内耗
              "company": _this.userInfo.company,//公司
              "isDeleted": false
            },
            "outPartInfos": outpartInfos
          }
        }
        _this.$http.post(api.addRepairOrder, addFormObj, true).then((res) => {
          if(res.success){
            setTimeout(function(){
              _this.spinShow = false
              _this.modalMessage = '订单提交成功，前往查看订单？'
              _this.modalVisible = true
              _this.modalSuccess = true
            },1000)
          }else{
            setTimeout(function(){
              _this.spinShow = false
              _this.modalMessage = '订单提交失败,请稍后重试!'
              _this.modalVisible = true
              _this.modalSuccess = false
            },1000)
          }
        }, error => {
          globe.message('网络连接失败，请重试！','error')
        })
      },
      // 弹窗确定按钮
      handleOk(){
        if(this.modalSuccess){
          this.modalVisible = false
          wx.navigateTo({
            url: '../../pages/order/main'
          })
        }else{
          this.modalVisible = false
        }
      },
      // 弹窗关闭按钮
      handleClose(){
        if(this.modalSuccess){
          this.modalVisible = false
          this.stepCurrent = 0
          this.clientForm = {}
          this.repairForm = {}
        }else{
          this.modalVisible = false
        }
      },
      // 日期选择器
      handleDateChange(data, type) {
        console.log('picker发送选择改变，携带值为', data.mp.detail.value)
        const id = data.mp.detail.value
        const value = data.mp.detail.value
        if(type === 'reg'){
          this.clientForm.registrationDate = id
          this.registrationDate = value
        }else if(type === 'endTime'){
          this.repairForm.endTime = id
          this.endTimeVal = value
        }else{
          this.clientForm.insuranceEndtime = id
          this.insuranceEndtime = value
        }
      },
      // 下单上一步
      handlePrev(){
        const stepCurrent = this.stepCurrent - 1
        this.stepCurrent = stepCurrent < 1 ? 0 : stepCurrent
      },
      // 下单下一步
      handleNext(){
        if(this.stepCurrent == 0){
          if(!this.clientForm.carNo){
            globe.message('车牌号不能为空', 'warning')
            return false
          }else if(!this.clientForm.name){
            globe.message('客户名称不能为空', 'warning')
            return false
          }else if(!this.clientForm.level){
            globe.message('客户级别不能为空', 'warning')
            return false
          }else if(!this.clientForm.mobile){
            globe.message('客户手机不能为空', 'warning')
            return false
          }else if(!this.clientForm.type){
            globe.message('客户类型不能为空', 'warning')
            return false
          }else if(!this.clientForm.carBrand){
            globe.message('汽车品牌不能为空', 'warning')
            return false
          }else if(!this.clientForm.carModel){
            globe.message('汽车车型不能为空', 'warning')
            return false
          }
          // 分发客户信息
          this.$store.dispatch('saveClient',this.clientForm).then(()=>{

          })
        }else if(this.stepCurrent === 1){
          if(!this.repairForm.repairTypeLK){
            globe.message('维修性质不能为空', 'warning')
            return false
          }else if(!this.repairForm.carOilmeter){
            globe.message('进店油表不能为空', 'warning')
            return false
          }else if(!this.repairForm.carMileage){
            globe.message('进店里程不能为空', 'warning')
            return false
          }else if(!this.repairForm.clerk){
            globe.message('服务顾问不能为空', 'warning')
            return false
          }
        }else if(this.stepCurrent === 2){
          const that = this
          if(this.repairItems.length<1){
            globe.message('请添加服务项目', 'warning')
            return false
          }
          that.repairtotal = 0
          that.repairsubtotal = 0
          that.inventorytotal = 0
          that.inventorysubtotal = 0
          for(let i=0; i<that.repairItems.length;i++){
            that.repairtotal += Number(that.repairItems[i].total)
            that.repairsubtotal += Number(that.repairItems[i].subtotal)
          }
          if(that.inventoryItems.length > 0){
            for(let i=0; i<that.inventoryItems.length;i++){
              that.inventorytotal += Number(that.inventoryItems[i].total)
              that.inventorysubtotal += Number(that.inventoryItems[i].subtotal)
            }
          }
          const allTotal = Number(that.repairtotal) + Number(that.inventorytotal)
          const allSubTotal = Number(that.repairsubtotal) + Number(that.inventorysubtotal)
          that.discounttotal = Number(allTotal - allSubTotal)
          that.alltotal = Number(allSubTotal)
          that.discountPrice = that.toDecimal2(that.discounttotal)
          that.consumPrice = that.toDecimal2(that.alltotal)
          that.loadClientCouponData(that.client.id)
        }
        let stepCurrent = this.stepCurrent + 1
        this.stepCurrent = stepCurrent > 3 ? 3 : stepCurrent
      },
      // 加载客户优惠券
      loadClientCouponData(clientId) {
        const params = {
          'search.clientId_eq': clientId,
          'page.pn': 1,
          'page.size': 100
        }
        this.$http.get(api.coupon_list, params).then((res) => {
          if(res.success){
            this.clientCouponTableData = res.data.page.content
            if(this.clientCouponTableData.length>0){
              this.ownCoupon = true
              let nameArray = []
              let codeArray = []
              for(let i=0;i<this.clientCouponTableData.length;i++){
                nameArray.push(this.clientCouponTableData[i].date.couponId.value)
                codeArray.push(this.clientCouponTableData[i].date.couponId.code)
              }
              this.couponNames = nameArray
              this.couponVals = codeArray
            }else{
              this.ownCoupon = false
            }
          }
        })
      },
      // 选择性别
      selectSex(){
        const _this = this
        this.showActionSheet(['男', '女'], function(index){
          if(index === 0){
            _this.clientForm.sex = true
            _this.clientSex = '男'
          }else{
            _this.clientForm.sex = false
            _this.clientSex = '女'
          }
        })
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
      // 获取数据字典并且弹出选择框
      getLookupByCodeAndShowSheet(code, successBack){
        const _this = this
        this.getLookupByCode(code, 1, 1000, function(data, total){
          let dataArry = []
          let idArry = []
          for(let i=0; i<data.length; i++){
            dataArry.push(data[i].value)
            idArry.push(data[i].id)
          }
          _this.showActionSheet(dataArry, function(index){
            if(successBack && typeof successBack == 'function'){
              successBack(idArry[index], dataArry[index])
            }
          })
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
            this.spinShow = false
            if(callback && typeof callback == 'function'){
              callback(res.data.page.content, res.data.page.totalElements)
            }
          }
          this.spinShow = false
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
      },
      // 显示选择栏
      showActionSheet(dataArry, successCallBack){
        wx.showActionSheet({
          itemList: dataArry,
          success(res) {
            // console.log(res)
            // globe.message('选择成功', 'success')
            if(successCallBack && typeof successCallBack == 'function'){
              successCallBack(res.tapIndex)
            }
          },
          fail(res) {
            globe.message(res.errMsg, 'danger')
          }
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
  padding-bottom: 46px;
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
