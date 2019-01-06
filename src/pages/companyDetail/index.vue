<template>
  <div class="container">
    <div class="company">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>
      <p class="input_wrap">
        <span class="input_label">所属品牌</span>
        <input v-model="form.brand" placeholder="请输入所属品牌"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">门店类型</span>
        <picker @change="bindPickerChange($event, 'form', 'type')" :range="types">
          <span v-if="type===''" class="input placeholder">请选择门店类型</span>
          <span v-else class="input">{{type}}</span>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">门店名称</span>
        <input v-model="form.name" placeholder="请输入门店名称"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">门店代码</span>
        <input v-model="form.code" placeholder="请输入门店代码"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">门店地址</span>
        <input v-model="form.address" placeholder="请输入门店地址"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">客服邮箱</span>
        <input v-model="form.email" placeholder="请输入客服邮箱"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">客服热线</span>
        <input v-model="form.mobile" placeholder="请输入客服热线"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">默认车牌</span>
        <input v-model="form.carNo" placeholder="请输入默认车牌"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">备注</span>
        <input v-model="form.description" placeholder="请输入备注信息"/>
      </p>
      <button class="save" @click="handleSave">保 存</button>
    </div>
  </div>
</template>

<script>
  import globe from '../../utils/globe'
  import api from '../../api/api'
  import { setTimeout } from 'timers'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        id: '',
        form: {},
        types: [],
        typeIds: [],
        type: '',
        spinShow: true
      }
    },
    onLoad() {
      this.form = {}
      this.type = ''
      this.id = ''
      this.spinShow = false
      console.log(globe.getCurrentPageUrlArgs())
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        this.id = urlParams.split('=')[1]
        if(this.id){
          this.getCompanyDetail()
        }
      }
      // 所属分类
      this.getLookupByCodeAndPicker('company_type', 'type')
    },
    methods: {
      // 获取公司详情
      getCompanyDetail(id){
        let item = this.$store.getters.editItem
        this.type = item.date.type.value
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
          url = api.company_edit
          delete this.form.date
          delete this.form.createTime
          delete this.form.updateTime
          delete this.form.isDeleted
        }else{
          url = api.company_add
        }
        if(!this.form.code){
          globe.message('公司代码不能为空', 'warning')
          return false
        }else if(!this.form.name){
          globe.message('公司名称不能为空', 'warning')
          return false
        }else if(!this.form.type){
          globe.message('门店类型不能为空', 'warning')
          return false
        }else if(!this.form.address){
          globe.message('门店地址不能为空', 'warning')
          return false
        }else if(!this.form.mobile){
          globe.message('客服热线不能为空', 'warning')
          return false
        }else if(!this.form.carNo){
          globe.message('默认车牌不能为空', 'warning')
          return false
        }
        this.spinShow = true
        this.$http.post(url, this.form).then( res => {
          if(res.success){
            globe.message(res.errorMsg, 'success')
            setTimeout(function(){
              this.spinShow = false
              wx.navigateTo({
                url: '/pages/company/main'
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
  .company{
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
    .placeholder{
      color: #777;
    }
  }
</style>
