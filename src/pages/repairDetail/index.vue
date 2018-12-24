<template>
  <div class="container">
    <div class="repairDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>
      <p class="input_wrap">
        <span class="input_label">项目代码:</span>
        <input v-model="form.code"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">项目名称:</span>
        <input v-model="form.name"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">所属分类:</span>
        <picker @change="bindPickerChange($event, 'form', 'typeLK')" :range="typeLKs">
          <input v-model="typeLK" readonly/>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">维修工种:</span>
        <picker @change="bindPickerChange($event, 'form', 'workTypeLK')" :range="workTypeLKs">
          <input v-model="workTypeLK" readonly/>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">数量/工时:</span>
        <input v-model="form.workHour"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">单价:</span>
        <input v-model="form.sum"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">备注:</span>
        <input v-model="form.description"/>
      </p>
      <button class="save" @click="handleSave">保 存</button>
    </div>
  </div>
</template>

<script>
  import globe from '../../utils/globe'
  import api from '../../api/api'
import { setTimeout } from 'timers';
  export default {
    data () {
      return {
        id: '',
        form: {},
        workTypeLKs: [],
        workTypeLKIds: [],
        workTypeLK: '',
        typeLKs: [],
        typeLKIds: [],
        typeLK: '',
        spinShow: true
      }
    },
    mounted(data) {
      this.spinShow = false
      console.log(globe.getCurrentPageUrlArgs())
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        this.id = urlParams.split('=')[1]
        this.getDetail(this.id)
      }
      // 所属分类
      this.getLookupByCodeAndPicker('repair_type', 'typeLK')
      // 维修工种
      this.getLookupByCodeAndPicker('work_type', 'workTypeLK')
    },
    methods: {
      // 获取详情
      getDetail(id){
        console.log(id)
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
      // 显示选择栏
      showActionSheet(dataArry, successCallBack){
        wx.showActionSheet({
          itemList: dataArry,
          success(res) {
            // console.log(res)
            if(successCallBack && typeof successCallBack == 'function'){
              successCallBack(res.tapIndex)
            }
          },
          fail(res) {
            globe.message(res.errMsg, 'danger')
          }
        })
      },
      // 保存
      handleSave(callback){
        let url = ''
        if(this.id){
          url = api.repair_edit
        }else{
          url = api.repair_add
        }
        if(!this.form.code){
          globe.message('维修项目代码不能为空', 'warning')
          return false
        }else if(!this.form.name){
          globe.message('维修项目名称不能为空', 'warning')
          return false
        }else if(!this.form.typeLK){
          globe.message('所属分类不能为空', 'warning')
          return false
        }else if(!this.form.workTypeLK){
          globe.message('维修工种不能为空', 'warning')
          return false
        }else if(!this.form.workHour){
          globe.message('数量/工时不能为空', 'warning')
          return false
        }else if(!this.form.sum){
          globe.message('单价不能为空', 'warning')
          return false
        }
        this.spinShow = true
        this.$http.post(url, this.form).then( res => {
          if(res.success){
            globe.message(res.errorMsg, 'success')
            setTimeout(function(){
              wx.navigateTo({
                url: '/pages/repair/main'
              })
            },2000)
            this.spinShow = false
          }else{
            globe.message(res.errorMsg, 'warning')
          }
          this.spinShow = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .repairDetail{
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
  }
</style>
