<template>
  <div class="container">
    <div class="productInpartDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <p class="input_wrap">
        <span class="input_label">进货价:</span>
        <input v-model="cost"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件数量:</span>
        <input v-model="count"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">库位号:</span>
        <picker @change="bindPickerChange($event, 'form', 'repCodeLK')" :range="repCodeLKs">
          <input v-model="repCodeLK" readonly/>
        </picker>
      </p>
      <button class="save" @tap="handleSave">入 库</button>
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
        form: {},
        spinShow: true,
        cost: '',
        count: 1,
        repCodeLK: '',
        repCodeLKs: [],
        repCodeLKIds: [],
        id: ''
      }
    },
    mounted(data) {
      // 库位号
      this.getLookupByCodeAndPicker('repCode', 'repCodeLK')
    },
    onLoad() {
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
    },
    methods: {
      // 获取详情
      getDetail(id){
        let item = this.$store.getters.editItem
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
            if(callback && typeof callback == 'function'){
              callback(res.data.page.content, res.data.page.totalElements)
            }
          }
          this.spinShow = false
        })
      },
      // 保存
      handleSave(){
        const _this = this
        this.form.cost = this.cost
        this.form.count = this.count
        this.form.repCodeLKVal = this.repCodeLK
        // 校验
        if(!this.form.cost){
          globe.message('进货价不能为空','warning')
          return false
        }else if(!this.form.count){
          globe.message('配件数量不能为空','warning')
          return false
        }else if(!this.form.repCodeLK){
          globe.message('库位号不能为空','warning')
          return false
        }
        this.spinShow = true
        // 分发数据到vuex
        this.$store.dispatch('updateInpartFormParam', this.form).then(() => {
          setTimeout(function(){
            this.spinShow = false
            wx.navigateTo({
              url: '/pages/inpart/main'
            })
          }, 1000)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .productInpartDetail{
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
