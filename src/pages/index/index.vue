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
              <input class="input" v-model="clientForm.carNo" type="text" placeholder="请输入车牌号">
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
              <input class="input" v-model="clientLevelVal" type="text" readonly @tap="selectLevel" placeholder="请选择客户级别">
            </div>
            <div class="item">
              <span class="label">客户类型:</span>
              <input class="input" v-model="clientTypeVal" type="text" readonly @tap="selectType" placeholder="请选择客户类型">
            </div>
            <div class="item">
              <span class="label">汽车品牌:</span>
              <input class="input" v-model="clientCarBrand" type="text" readonly @tap="selectBrand" placeholder="请选择汽车品牌">
            </div>
            <div class="item">
              <span class="label">汽车车型:</span>
              <input class="input" v-model="clientForm.carModel" type="text" placeholder="请输入汽车车型">
            </div>
            <div class="item">
              <span class="label">车身颜色:</span>
              <input class="input" v-model="clientForm.carColor" type="text" placeholder="请输入车身颜色">
            </div>
            <div class="item">
              <span class="label">客户邮箱:</span>
              <input class="input" v-model="clientForm.email" type="text" placeholder="请输入客户邮箱">
            </div>
            <div class="item">
              <span class="label">客户性别:</span>
              <input class="input" v-model="clientSex" type="text" @tap="selectSex" placeholder="请选择客户性别">
            </div>
            <div class="item">
              <span class="label">证件号码:</span>
              <input class="input" v-model="clientForm.idcard" type="text" placeholder="请输入证件号码">
            </div>
            <div class="item">
              <span class="label">客户地址:</span>
              <input class="input" v-model="clientForm.address" type="text" placeholder="请输入客户地址">
            </div>
            <div class="item">
              <span class="label">发动机号:</span>
              <input class="input" v-model="clientForm.engineNo" type="text" placeholder="请输入发动机号">
            </div>
            <div class="item">
              <span class="label">车架号:</span>
              <input class="input" v-model="clientForm.carVIN" type="text" placeholder="请输入车架号">
            </div>
            <div class="item">
              <span class="label">保险公司:</span>
              <input class="input" v-model="clientForm.insurer" type="text" placeholder="请输入保险公司">
            </div>
            <div class="item">
              <span class="label">保险到期日期:</span>
              <picker
                mode="date"
                :value="insuranceEndtime"
                @change="handleDateChange($event, 'insur')"
              >
                <input class="input" v-model="insuranceEndtime" type="text" readonly placeholder="请选择保险到期时间">
              </picker>
            </div>
            <div class="item">
              <span class="label">上牌日期:</span>
              <picker
                mode="date"
                :value="registrationDate"
                @change="handleDateChange($event, 'reg')"
              >
                <input class="input" v-model="registrationDate" type="text" readonly placeholder="请选择上牌日期">
              </picker>
            </div>
            <div class="item">
              <span class="label">备注:</span>
              <input class="input" v-model="clientForm.description" type="textarea" placeholder="请输入备注">
            </div>
          </div>

          <!-- 工单信息 -->
          <div class="repairForm" v-if="stepCurrent===1">
            <div class="item">
              <span class="label">维修性质:</span>
              <input class="input" v-model="repairTypeLK" type="text" @tap="selectRepair" placeholder="请选择维修性质">
            </div>
            <div class="item">
              <span class="label">送修人:</span>
              <input class="input" v-model="repairForm.sendMan" type="text" placeholder="请输入送修人">
            </div>
            <div class="item">
              <span class="label">进店油表:</span>
              <input class="input" v-model="carOilmeter" type="text" @tap="selectOil" placeholder="请选择进店油表">
            </div>
            <div class="item">
              <span class="label">进店里程:</span>
              <input class="input" v-model="repairForm.carMileage" type="text" placeholder="请输入进店里程">
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
              <input class="input" v-model="clerk" type="text" readonly @tap="selectReciever" placeholder="请选择服务顾问">
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
            <i-tab key="tab1" title="维修中" :count="repairItemCount"></i-tab>
            <i-tab key="tab2" title="待付款" :count="repairItemCount"></i-tab>
            <i-tab key="tab3" title="已完成(100)"></i-tab>
          </i-tabs>
          <div class="tab_repaire">
            <div class="tab_list" v-for="(item, index) in repaires" :key="index">
              <ul>
                <li class="ellipsis">
                  <span>{{item.carNo}}</span>
                </li>
                <li class="ellipsis">
                  <span>{{item.type}}</span>
                </li>
                <li class="line"></li>
                <li class="ellipsis">
                  <span>工单号: {{item.order}}</span>
                  <span class="float-right">{{item.status}}</span>
                </li>
                <li class="ellipsis">
                  <span>进厂时间: {{item.time}}</span>
                  <span class="float-right">{{item.user}}</span>
                </li>
              </ul>
            </div>
          </div>
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
        clientForm: {},
        clientLevelVal: '',
        clientTypeVal: '',
        clientCarBrand: '',
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
        hasPermission: false,
        current: 'index',
        company: '深圳分店',
        tab_current: 'tab1',
        repaires: [
          {
            id: 1,
            carNo: '粤B09286',
            type: '迈腾2017 1.4TSI 双离合 280TSI领先型',
            order: 'No20181205000001',
            time: '2018-12-05 12:30',
            status: '在修',
            user: 'kim'
          },
          {
            id: 2,
            carNo: '桂M09286',
            type: '迈腾2018 1.4TSI 双离合 280TSI领先型',
            order: 'No20181205000002',
            time: '2018-12-05 10:30',
            status: '在修',
            user: 'kim'
          },
          {
            id: 3,
            carNo: '桂B09286',
            type: '迈腾2019 1.4TSI 双离合 280TSI领先型',
            order: 'No20181205000003',
            time: '2018-12-05 10:30',
            status: '在修',
            user: 'kim'
          }
        ]
      }
    },
    mounted() {
      this.hasPermission = this.checkPermission(),
      this.spinShow = false
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'inpartCount',
        'outpartCount',
        'repairItemCount'
      ])
    },
    methods: {
      checkPermission,
      // 切换tab-bar
      handleChangeTabBar (data) {
        this.current = data.mp.detail.key
      },
      handleChangeTab (data) {
        this.tab_current = data.mp.detail.key
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
        const stepCurrent = this.stepCurrent + 1
        this.stepCurrent = stepCurrent > 3 ? 3 : stepCurrent
      },
      // 选择用户级别
      selectLevel(){
        const _this = this
        this.getLookupByCodeAndShowSheet('client_level', function(id, value){
          _this.clientForm.level = id
          _this.clientLevelVal = value
        })
      },
      // 选择用户类型
      selectType(){
        const _this = this
        this.getLookupByCodeAndShowSheet('client_type', function(id, value){
          _this.clientForm.type = id
          _this.clientTypeVal = value
        })
      },
      // 选择汽车品牌
      selectBrand(){
        const _this = this
        this.getLookupByCodeAndShowSheet('car_brand', function(id, value){
          _this.clientForm.carBrand = id
          _this.clientCarBrand = value
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
      // 选择维修性质
      selectRepair(){
        const _this = this
        this.getLookupByCodeAndShowSheet('work_type', function(id, value){
          _this.repairForm.repairTypeLK = id
          _this.repairTypeLK = value
        })
      },
      // 选择进店油表
      selectOil(){
        const _this = this
        this.getLookupByCodeAndShowSheet('carOilmeter', function(id, value){
          _this.repairForm.carOilmeter = id
          _this.carOilmeter = value
        })
      },
      // 选择服务顾问
      selectReciever(){
        const _this = this
        this.getUserList(function(id, value){
          _this.repairForm.clerk = id
          _this.clerk = value
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
            let data = res.data.page.content
            let dataArry = []
            let idArry = []
            for(let i=0; i<data.length; i++){
              dataArry.push(data[i].fullname)
              idArry.push(data[i].id)
            }
            _this.showActionSheet(dataArry, function(index){
              if(callback && typeof callback == 'function'){
                callback(idArry[index], dataArry[index])
              }
            })
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
.step_button{
  width: 100%;
  margin: 0 auto;
  margin-bottom: 70px;
}

</style>
