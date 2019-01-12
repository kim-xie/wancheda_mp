<template>
  <div class="container">
    <div class="lookupDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>
      <p class="input_wrap">
        <span class="input_label">名称</span>
        <input v-model="form.value" placeholder="请输入名称"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">代码</span>
        <input v-model="form.code" v-if="isEdit" readonly disabled/>
        <input v-model="form.code" v-else placeholder="请输入代码"/>
      </p>
      <p class="input_wrap" v-if="form.additional">
        <span class="input_label">折扣</span>
        <input type="number" v-model="form.additional" placeholder="请输入折扣"/>
      </p>
      <p class="input_wrap" v-if="form.parentId">
        <span class="input_label">父节点</span>
        <picker @change="bindPickerChange($event, 'form', 'parentId')" :range="parentIds">
          <span v-if="parentId===''" class="input placeholder">请选择父节点</span>
          <span v-else class="input">{{parentId}}</span>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">描述</span>
        <input v-model="form.description" placeholder="请输入描述信息"/>
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
        spinShow: true,
        form: {},
        id: '',
        isEdit: false,
        parentId: '',
        parentIds: [],
        parentIdIds: []
      }
    },
    onLoad() {
      this.form = {}
      this.spinShow = false
      this.id = ''
      this.parentId = ''
      this.isEdit = false
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        this.id = urlParams.split('=')[1]
        if(this.id){
          this.getDetail(this.id)
        }
      }
      this.getLookupByCodeAndPicker('repair_type','parentId')
    },
    methods: {
      // 获取详情
      getDetail(id){
        let item = this.$store.getters.editItem
        if(item.id){
          this.isEdit = true
          this.parentId = item.parentVal
        }else{
          this.isEdit = false
        }
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
        let url = api.lookup_add
        if(this.isEdit){
          url = api.lookup_edit
        }else{
          this.form.definitionId = this.id
        }

        if(!this.form.value){
          globe.message('名称不能为空', 'warning')
          return false
        }else if(!this.form.code){
          globe.message('代码不能为空', 'warning')
          return false
        }else if(this.form.parentId===this.form.id){
          globe.message('当前节点不可以作为自己的父节点', 'warning')
          return false
        }
        this.spinShow = true
        this.$http.post(url, this.form).then( res => {
          if(res.success){
            globe.message(res.errorMsg, 'success')
            setTimeout(function(){
              this.spinShow = false
              wx.navigateTo({
                url: '/pages/lookup/main'
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
  .lookupDetail{
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
