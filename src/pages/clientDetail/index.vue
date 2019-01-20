<template>
  <div class="container">
    <div class="accountDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>
      <!-- 弹层 -->
      <van-popup :show="showArea" @close="onClose" position="bottom" :overlay="true">
        <van-area v-if="pupType === 'area'" :area-list="areaList" @confirm="selectedArea" @cancel="cancelArea"/>
        <van-datetime-picker v-if="pupType === 'dateTime'" type="datetime" :minDate="minDate" @confirm="selectedDate" @cancel="cancelDate"/>
      </van-popup>

      <p class="input_wrap">
        <span class="input_label">客户姓名</span>
        <input v-model="form.name" placeholder="请输入客户姓名"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">客户手机</span>
        <input v-model="form.mobile" placeholder="请输入客户手机号"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">车牌号</span>
        <input v-model="form.carNo" placeholder="请输入车牌号"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">汽车品牌</span>
        <picker @change="bindPickerChange($event, 'form', 'carBrand')" :range="carBrands">
          <span v-if="carBrand===''" class="input placeholder">请选择汽车品牌</span>
          <span v-else class="input">{{carBrand}}</span>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">车型</span>
        <input v-model="form.carModel" placeholder="请输入车型"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">客户级别</span>
        <picker @change="bindPickerChange($event, 'form', 'level')" :range="levels">
          <span v-if="level===''" class="input placeholder">请选择客户级别</span>
          <span v-else class="input">{{level}}</span>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">客户类型</span>
        <picker @change="bindPickerChange($event, 'form', 'type')" :range="types">
          <span v-if="type===''" class="input placeholder">请选择客户类型</span>
          <span v-else class="input">{{type}}</span>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">车身颜色</span>
        <input v-model="form.carColor" placeholder="请输入车身颜色"/>
      </p>
      <!-- <p class="input_wrap">
        <span class="input_label">所属公司</span>
        <picker @change="bindPickerChange($event, 'form', 'company')" :range="companys">
          <input v-model="company" readonly/>
        </picker>
      </p> -->

      <p class="input_wrap">
        <span class="input_label">客户地址</span>
        <span v-if="!form.address" class="input placeholder" @tap="selectArea">请选择客户地址</span>
        <span v-else class="input" @tap="selectArea">{{form.address}}</span>
      </p>
      <p class="input_wrap">
        <span class="input_label">补充详细地址</span>
        <input v-model="form.address" placeholder="请输入客户详细地址"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">证件号</span>
        <input v-model="form.idcard" placeholder="请输入证件号"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">车架号</span>
        <input v-model="form.carVIN" placeholder="请输入车架号"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">发动机号</span>
        <input v-model="form.engineNo" placeholder="请输入发动机号"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">上牌日期</span>
        <span v-if="!form.registrationDate" class="input placeholder" @tap="selectDate('form','registrationDate')">请选择上牌日期</span>
        <span v-else class="input" @tap="selectDate('form','registrationDate')">{{form.registrationDate}}</span>
        <!-- <picker
          mode="date"
          :value="registrationDate"
          @change="handleDateChange($event, 'reg')">
          <span v-if="registrationDate===''" class="input placeholder">请选择上牌日期</span>
          <span v-else class="input">{{registrationDate}}</span>
        </picker> -->
      </p>
      <p class="input_wrap">
        <span class="input_label">客户邮箱</span>
        <input v-model="form.email" placeholder="请输入客户邮箱"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">客户性别</span>
        <span v-if="clientSex===''" class="input placeholder" @tap="selectSex">请选择客户性别</span>
        <span v-else class="input" @tap="selectSex">{{clientSex}}</span>
      </p>
      <p class="input_wrap">
        <span class="input_label">保险公司</span>
        <input v-model="form.insurer" placeholder="请输入保险公司"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">保险到期时间</span>
        <span v-if="!form.insuranceEndtime" class="input placeholder" @tap="selectDate('form','insuranceEndtime')">请选择保险到期时间</span>
        <span v-else class="input" @tap="selectDate('form','insuranceEndtime')">{{form.insuranceEndtime}}</span>
        <!-- <picker
          mode="date"
          :value="insuranceEndtime"
          @change="handleDateChange($event, 'insur')">
          <span v-if="insuranceEndtime===''" class="input placeholder">请选择保险到期时间</span>
          <span v-else class="input">{{insuranceEndtime}}</span>
        </picker> -->
      </p>
      <p class="input_wrap">
        <span class="input_label">备注</span>
        <input type="textarea" v-model="form.description" placeholder="请输入备注信息"/>
      </p>
      <button class="save" @click="handleSave">保 存</button>
    </div>
  </div>
</template>

<script>
  import globe from '../../utils/globe'
  import api from '../../api/api'
  import {formatDatetime,cloneObj} from '../../utils/index'
  import areaLists from '../../utils/area'
  import { setTimeout } from 'timers'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        id: '',
        form: {},
        // companys: [],
        // companyIds: [],
        // company: '',
        types: [],
        typeIds: [],
        type: '',
        levels: [],
        levelIds: [],
        level: '',
        carBrands: [],
        carBrandIds: [],
        carBrand: '',
        registrationDate: '',
        insuranceEndtime: '',
        spinShow: true,
        clientSex: '',
        showArea: false,
        pupType: 'area',
        areaList: areaLists,
        formName: '',
        currentName: '',
        minDate: new Date().getTime()
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    onLoad() {
      //this.company = ''
      this.type = ''
      this.level = ''
      this.carBrand = ''
      this.registrationDate = ''
      this.insuranceEndtime = ''
      this.clientSex = ''
      this.form = {}
      this.id = ''
      //console.log(globe.getCurrentPageUrlArgs())
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        this.id = urlParams.split('=')[1]
        if(this.id){
          this.getDetail()
        }
      }
    },
    mounted() {
      this.spinShow = false
      // 汽车品牌
      this.getLookupByCodeAndPicker('car_brand', 'carBrand')
      // 客户类型
      this.getLookupByCodeAndPicker('client_type', 'type')
      // 客户级别
      this.getLookupByCodeAndPicker('client_level', 'level')
      // 获取公司列表
      // this.getCompanyList('company')
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
        this.form.address = area
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
      // 获取详情
      getDetail(){
        const that = this
        let item = this.$store.getters.editItem
        // for(let i=0;i<that.companyIds.length;i++){
        //   if(item.company === that.companyIds[i]){
        //     that.company = that.companys[i]
        //   }
        // }
        console.log(item)
        this.level = item.date.level.value
        this.type = item.date.type.value
        this.carBrand = item.date.carBrand.value
        this.clientSex = item.sex === true ? '男':'女'
        this.registrationDate = item.registrationDate
        this.insuranceEndtime = item.insuranceEndtime
        this.form = item
      },
      // 选择性别
      selectSex(){
        const _this = this
        this.showActionSheet(['男', '女'], function(index){
          if(index === 0){
            _this.form.sex = true
            _this.clientSex = '男'
          }else{
            _this.form.sex = false
            _this.clientSex = '女'
          }
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
      },
      // 日期选择器
      handleDateChange(data, type) {
        console.log('picker发送选择改变，携带值为', data.mp.detail.value)
        const id = data.mp.detail.value
        const value = data.mp.detail.value
        if(type === 'reg'){
          this.form.registrationDate = id
          this.registrationDate = value
        }else{
          this.form.insuranceEndtime = id
          this.insuranceEndtime = value
        }
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
      // 保存
      handleSave(callback){
        const clientForm = cloneObj(this.form)
        let url = ''
        if(this.id){
          url = api.client_edit
          delete clientForm.date
          delete clientForm.createTime
          delete clientForm.updateTime
          delete clientForm.isDeleted
          delete clientForm.company
        }else{
          url = api.client_add
          clientForm.company = this.userInfo.company
        }
        if(!clientForm.name){
          globe.message('客户名不能为空', 'warning')
          return false
        }else if(!clientForm.level){
          globe.message('客户级别不能为空', 'warning')
          return false
        }else if(!clientForm.type){
          globe.message('客户类型不能为空', 'warning')
          return false
        }else if(!clientForm.mobile){
          globe.message('手机号不能为空', 'warning')
          return false
        }else if(!clientForm.carNo){
          globe.message('车牌号不能为空', 'warning')
          return false
        }else if(!clientForm.carBrand){
          globe.message('汽车品牌不能为空', 'warning')
          return false
        }
        if(clientForm.registrationDate){
          clientForm.registrationDate = new Date(clientForm.registrationDate)
        }
        if(clientForm.insuranceEndtime){
          clientForm.insuranceEndtime = new Date(clientForm.insuranceEndtime)
        }

        this.spinShow = true
        this.$http.post(url, clientForm).then( res => {
          if(res.success){
            globe.message(res.errorMsg, 'success')
            setTimeout(function(){
              this.spinShow = false
              wx.navigateTo({
                url: '/pages/client/main'
              })
            },1000)
          }else{
            globe.message(res.errorMsg, 'warning')
            this.spinShow = false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .accountDetail{
    width: 100%;
    width: 100%;
    .input_wrap{
      width: 90%;
      margin: 0px auto;
      height: 78rpx;
      line-height: 78rpx;
      border-bottom: $--border-base;
      padding: 0 10px;
      .input_label{
        float: left;
        display: block;
        width: 120px;
        color: $--color-info;
      }
      input{
        width: calc(100% - 126px);
        height: 100%;
        line-height: 70rpx;
      }
    }
    .save{
      width: 95%;
      margin: 0 auto;
      height: 80rpx;
      line-height: 80rpx;
      margin: 18px auto;
      background-color: $--color-primary;
      box-shadow:0 0 10rpx $--color-primary;
      color: $--color-white;
      font-size: 36rpx;
    }
    .placeholder{
      color: #777;
    }
  }
</style>
