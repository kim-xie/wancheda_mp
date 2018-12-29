<template>
  <div class="container">
    <div class="accountDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>
      <p class="input_wrap">
        <span class="input_label">账号名</span>
        <input v-model="form.username"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">真实姓名</span>
        <input v-model="form.fullname"/>
      </p>
      <p class="input_wrap" v-if="id === ''">
        <span class="input_label">初始密码</span>
        <input type="password" v-model="password"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">联系电话</span>
        <input v-model="form.mobile"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">邮箱</span>
        <input v-model="form.email"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">所属公司</span>
        <picker @change="bindPickerChange($event, 'form', 'company')" :range="companys">
          <input v-model="company" readonly/>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">角色</span>
        <picker @change="bindPickerChange($event, 'form', 'role')" :range="roles">
          <input v-model="role" readonly/>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">备注</span>
        <input v-model="form.description"/>
      </p>
      <button class="save" @click="handleSave">保 存</button>
    </div>
  </div>
</template>

<script>
  import globe from '../../utils/globe'
  import api from '../../api/api'
  import CryptoJS from 'crypto-js/core'
  import MD5 from 'crypto-js/md5'
  import { setTimeout } from 'timers'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        id: '',
        form: {},
        password: '',
        companys: [],
        companyIds: [],
        company: '',
        roles: [],
        roleIds: [],
        role: '',
        spinShow: true,
      }
    },
    onLoad() {
      this.company = ''
      this.role = ''
      this.form = {}
      this.spinShow = false
      this.id = ''
      console.log(globe.getCurrentPageUrlArgs())
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        this.id = urlParams.split('=')[1]
        if(this.id){
          this.getDetail()
        }
      }
      // 角色
      this.getLookupByCodeAndPicker('user_role', 'role')
      // 获取公司列表
      this.getCompanyList('company')
    },
    methods: {
      // 获取详情
      getDetail(){
        let item = this.$store.getters.editItem
        this.company = item.date.company.name
        this.role = item.date.role.value
        this.currentStatus = item.isDisabled
        this.form = item
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
            console.log(data)
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
        let url = ''
        if(this.id){
          url = api.account_edit
          delete this.form.date
          delete this.form.password
          delete this.form.createTime
          delete this.form.updateTime
          delete this.form.isDeleted
        }else{
          url = api.account_add
          const hashPwd = CryptoJS.MD5(this.password).toString()
          this.form.password = hashPwd
        }
        if(!this.form.username){
          globe.message('账号名称不能为空', 'warning')
          return false
        }else if(!this.form.fullname){
          globe.message('真实姓名不能为空', 'warning')
          return false
        }else if(!this.form.password){
          globe.message('初始密码不能为空', 'warning')
          return false
        }else if(!this.form.company){
          globe.message('所属公司不能为空', 'warning')
          return false
        }else if(!this.form.role){
          globe.message('所属角色不能为空', 'warning')
          return false
        }else if(!this.form.mobile){
          globe.message('手机不能为空', 'warning')
          return false
        }
        this.spinShow = true
        this.$http.post(url, this.form).then( res => {
          if(res.success){
            globe.message(res.errorMsg, 'success')
            setTimeout(function(){
              this.spinShow = false
              wx.navigateTo({
                url: '/pages/account/main'
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
        width: 100px;
        font-size: 18px;
        color: $--color-info;
      }
      .radio_group{
        width: calc(100% - 106px);
        height: 100%;
        line-height: 70rpx;
        .radio{
          float: left;
        }
      }
      input{
        width: calc(100% - 106px);
        height: 100%;
        line-height: 70rpx;
      }
    }
    .save{
      width: 95%;
      margin: 0 auto;
      height: 80rpx;
      line-height: 80rpx;
      margin-top: 18px;
      background-color: $--color-primary;
      box-shadow:0 0 10rpx $--color-primary;
      color: $--color-white;
      font-size: 36rpx;
    }
  }
</style>
