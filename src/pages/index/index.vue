<template>
  <div class="container">
    <div class="tab_content">
      <!-- <div class="company">
        <h4>{{company}}</h4>
      </div> -->
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

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
                  车辆信息
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
                <input class="input" v-model="level" type="text" readonly placeholder="请选择客户级别">
              </picker>
            </div>
            <div class="item">
              <span class="label">客户类型:</span>
              <picker @change="bindPickerChange($event, 'clientForm', 'type')" :range="types">
                <input class="input" v-model="type" type="text" readonly placeholder="请选择客户类型">
              </picker>
            </div>
            <div class="item">
              <span class="label">汽车品牌:</span>
              <picker @change="bindPickerChange($event, 'clientForm', 'carBrand')" :range="carBrands">
                <input class="input" v-model="carBrand" type="text" readonly placeholder="请选择汽车品牌">
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
              <input class="input" v-model="clientSex" type="text" @tap="selectSex" placeholder="请选择客户性别">
            </div>
            <div class="item" v-if="showMore">
              <span class="label">证件号码:</span>
              <input class="input" v-model="clientForm.idcard" type="text" placeholder="请输入证件号码">
            </div>
            <div class="item" v-if="showMore">
              <span class="label">客户地址:</span>
              <input class="input" v-model="clientForm.address" type="text" placeholder="请输入客户地址">
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
              <picker
                mode="date"
                :value="insuranceEndtime"
                @change="handleDateChange($event, 'insur')"
              >
                <input class="input" v-model="insuranceEndtime" type="text" readonly placeholder="请选择保险到期时间">
              </picker>
            </div>
            <div class="item" v-if="showMore">
              <span class="label">上牌日期:</span>
              <picker
                mode="date"
                :value="registrationDate"
                @change="handleDateChange($event, 'reg')"
              >
                <input class="input" v-model="registrationDate" type="text" readonly placeholder="请选择上牌日期">
              </picker>
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
                <input class="input" v-model="repairTypeLK" type="text" placeholder="请选择维修性质">
              </picker>
            </div>
            <div class="item">
              <span class="label">送修人:</span>
              <input class="input" v-model="repairForm.sendMan" type="text" placeholder="请输入送修人">
            </div>
            <div class="item">
              <span class="label">进店油表:</span>
              <picker @change="bindPickerChange($event, 'repairForm', 'carOilmeter')" :range="carOilmeters">
                <input class="input" v-model="carOilmeter" type="text" placeholder="请选择进店油表">
              </picker>
            </div>
            <div class="item">
              <span class="label">进店里程:</span>
              <input class="input" v-model="repairForm.carMileage" type="number" placeholder="请输入进店里程">
            </div>
            <div class="item">
              <span class="label">交车时间:</span>
              <picker
                mode="date"
                :value="endTimeVal"
                @change="handleDateChange($event, 'endTime')">
                <input class="input" v-model="endTimeVal" type="text" readonly placeholder="请选择交车时间">
              </picker>
            </div>
            <div class="item">
              <span class="label">服务顾问:</span>
              <picker @change="bindPickerChange($event, 'repairForm', 'clerk')" :range="clerks">
                <input class="input" v-model="clerk" type="text" readonly placeholder="请选择服务顾问">
              </picker>
            </div>
            <div class="item">
              <span class="label">车主嘱咐:</span>
              <input class="input" v-model="repairForm.clentRemind" type="text" placeholder="请输入车主嘱咐">
            </div>
          </div>

          <!-- 按钮 -->
          <div class="step_button">
            <i-button v-if="stepCurrent<3" @tap="handleNext" type="primary" shape="circle" size="small">下一步</i-button>
            <i-button v-if="stepCurrent>0" @tap="handlePrev" type="info" shape="circle" size="small">上一步</i-button>
          </div>
        </div>
      </div>
      <div v-if="current === 'order'" class="transition tab_order">
        <div>
          <i-tabs :current="tab_current" color="#f759ab" @change="handleChangeTab($event)">
            <i-tab key="tab1" title="维修中" :count="repairWorkorderTotal"></i-tab>
            <i-tab key="tab2" title="待付款" :count="repairWorkorderTotal"></i-tab>
            <i-tab key="tab3" :title="'已完成('+repairWorkorderAllTotal+')'"></i-tab>
          </i-tabs>
          <!-- 待完成订单 -->
          <div class="tab_repaire" v-if="tab_current!=='tab3'">
            <div class="tab_list" v-for="(item, index) in repairWorkorders" :key="index">
              <ul>
                <li class="ellipsis">
                  <span>{{item.date.clientId.carNo}}</span>
                </li>
                <li class="ellipsis">
                  <span>{{item.date.clientId.carModel}}</span>
                </li>
                <li class="line"></li>
                <li class="ellipsis">
                  <span>工单号: {{item.workorderNo}}</span>
                  <span class="float-right">{{item.workorderState}}</span>
                </li>
                <li class="ellipsis">
                  <span>进厂时间: {{item.sendTime}}</span>
                  <span class="float-right">{{item.sendMan}}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 已完成订单 -->
          <div class="tab_repaire" v-if="tab_current==='tab3'">
            <div class="tab_list" v-for="(item, index) in repairWorkorderAlls" :key="index">
              <ul>
                <li class="ellipsis" v-if="item.date.clientId">
                  <span>{{item.date.clientId.carNo}}</span>
                </li>
                <li class="ellipsis" v-if="item.date.clientId">
                  <span>{{item.date.clientId.carModel}}</span>
                </li>
                <li class="line"></li>
                <li class="ellipsis">
                  <span>工单号: {{item.workorderNo}}</span>
                  <span class="float-right">{{item.workorderState}}</span>
                </li>
                <li class="ellipsis">
                  <span>进厂时间: {{item.sendTime}}</span>
                  <span class="float-right">{{item.sendMan}}</span>
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
      <div v-if="current === 'workplace'" class="transition tab_workplace">
        <div class="workplace">
          <div class="menu_list">
            <div class="menu">
              <navigator url="/pages/client/main" hover-class="navigator-hover">
                <i class="iconfont icon-kehu"></i>
                <span>客户管理</span>
              </navigator>
            </div>
            <div class="menu">
              <navigator url="/pages/company/main" hover-class="navigator-hover">
                <i class="iconfont icon-gongsimingcheng"></i>
                <span>公司管理</span>
              </navigator>
            </div>
            <div class="menu">
              <navigator url="/pages/account/main" hover-class="navigator-hover">
                <i class="iconfont icon-zhanghao"></i>
                <span>账号管理</span>
              </navigator>
            </div>
            <div class="menu">
              <navigator url="/pages/lookupdf/main" hover-class="navigator-hover">
                <i class="iconfont icon-shujuzidian"></i>
                <span>字典管理</span>
              </navigator>
            </div>
            <!-- <div class="menu">
              <navigator url="/pages/finance/main" hover-class="navigator-hover">
                <i class="iconfont icon-finance"></i>
                <span>财务管理</span>
              </navigator>
            </div>
            <div class="menu">
              <navigator url="/pages/role/main" hover-class="navigator-hover">
                <i class="iconfont icon-wode"></i>
                <span>角色管理</span>
              </navigator>
            </div> -->
            <div class="menu">
              <navigator url="/pages/product/main" hover-class="navigator-hover">
                <i class="iconfont icon-qichepeijian"></i>
                <span>配件维护</span>
              </navigator>
            </div>
            <div class="menu">
              <navigator url="/pages/inventory/main" hover-class="navigator-hover">
                <i class="iconfont icon-qichepeijian"></i>
                <span>库存管理</span>
              </navigator>
            </div>
            <div class="menu">
              <i-badge :count="inpartCount">
                <navigator url="/pages/inpart/main" hover-class="navigator-hover">
                  <i class="iconfont icon-qichepeijian"></i>
                  <span>配件入库</span>
                </navigator>
              </i-badge>
            </div>
            <div class="menu">
              <i-badge :count="outpartCount">
                <navigator url="/pages/outpart/main" hover-class="navigator-hover">
                  <i class="iconfont icon-qichepeijian"></i>
                  <span>配件出库</span>
                </navigator>
              </i-badge>
            </div>
            <div class="menu">
              <navigator url="/pages/repair/main" hover-class="navigator-hover">
                <i class="iconfont icon-weixiu"></i>
                <span>维修项目</span>
              </navigator>
            </div>
          </div>
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
  import globe from '../../utils/globe'
  import checkPermission from '../../utils/permission'
  import api from '../../api/api'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        tipmessage: '我也是有底线的',
        loading: false,
        showMore: false,
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
        company: '深圳分店',
        tab_current: 'tab1',
        repairWorkorders: [],
        repairWorkorderAlls: [],
        repairWorkorderTotal: 0,
        repairWorkorderAllTotal: 0,
        allPageNo: 1,
        allPageSize: 2,
      }
    },
    mounted() {
      this.hasPermission = this.checkPermission(),
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
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'inpartCount',
        'outpartCount',
        'repairItemCount'
      ])
    },
    // 下拉刷新
    onPullDownRefresh() {
      console.log('下拉刷新')
      console.log(this.allPageNo)
      if(this.allPageNo > 1){
        this.allPageNo = this.allPageNo-1
        this.getRepairWorkorder(this.allPageNo, this.allPageSize, '',function(){
          wx.stopPullDownRefresh()
        })
      }
    },
    // 上拉加载，拉到底部触发
    onReachBottom() {
      // 到这底部在这里需要做什么事情
      console.log('上拉加载')
      const that = this
      if(this.allPageNo < this.repairWorkorderAllTotal/this.allPageSize){
        this.loading = true
        this.tipmessage = '玩命加载中'
        this.allPageNo = this.allPageNo+1
        this.getRepairWorkorder(this.allPageNo, this.allPageSize, '', function(){
          that.loading = false
          that.tipmessage = '我也是有底线的'
        })
      }
    },
    methods: {
      checkPermission,
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
              console.log(clientData)
              for(var i=0;i<clientData.length;i++){
                _this.level = clientData[i].date.level.value
                _this.type = clientData[i].date.type.value
                _this.carBrand = clientData[i].date.level.value
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
        if(this.current === 'order'){
          this.getRepairWorkorder(1,1000,'维修中')
          this.getRepairWorkorder(this.allPageNo,this.allPageSize,'')
        }
      },
      // 切换tab
      handleChangeTab (data) {
        this.tab_current = data.mp.detail.key
      },
      // 普通选择器
      bindPickerChange(data, formName, type){
        const index = data.mp.detail.value
        // 显示的值
        this[type] = this[type+'s'][index]
        // 对应的id
        this[formName][type] = this[type+'Ids'][index]
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
        if(this.stepCurrent === 0){
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
        }
        const stepCurrent = this.stepCurrent + 1
        this.stepCurrent = stepCurrent > 3 ? 3 : stepCurrent
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
      getRepairWorkorder(pageNo,pageSize,status,callback){
        const params = {
          'search.company_eq': '',
          'search.workorderState_eq': status,
          'page.pn': pageNo,
          'page.size': pageSize
        }
        this.spinShow = true
        this.$http.get(api.repairWorkorder, params).then( res => {
          if(res.success){
            this.spinShow = false
            if(status === '维修中'){
              this.repairWorkorders = res.data.page.content
              this.repairWorkorderTotal = res.data.page.totalElements
            }else{
              this.repairWorkorderAlls = res.data.page.content
              this.repairWorkorderAllTotal = res.data.page.totalElements
            }
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
  padding-bottom: 40px;
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
  margin: 10px auto;
  height: 30px;
  line-height: 30px;
  border: 1px solid #ccc;
  overflow: hidden;
  padding: 3px 6px;
  .label{
    float: left;
    width: 40%;
    display: block;
  }
  .input{
    display: inline-block;
    width: 60%;
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

.step_button{
  width: 100%;
  margin: 0 auto;
}

</style>
