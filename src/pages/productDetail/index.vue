<template>
  <div class="container">
    <div class="productDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>
      <p class="input_wrap">
        <span class="input_label">配件编号:</span>
        <input v-model="form.code"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件名称:</span>
        <input v-model="form.name"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">所属分类:</span>
        <input v-model="pcategoryLK" readonly @tap="selectPcategory"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件批发价:</span>
        <input v-model="form.wholeSale"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件售价:</span>
        <input v-model="form.sale"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件产地:</span>
        <input v-model="form.produceArea"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件单位:</span>
        <input v-model="unitLK" readonly @tap="selectUnitLK"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件规格:</span>
        <input v-model="specificationLK" readonly @tap="selectSpecificationLK"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">适用车型:</span>
        <input v-model="form.carModel"/>
      </p>
      <button class="save" @click="handleSave">保 存</button>
    </div>
  </div>
</template>

<script>
  import globe from '../../utils/globe'
  import api from '../../api/api'
  export default {
    data () {
      return {
        form: {},
        pcategoryLK: '',
        unitLK: '',
        specificationLK: '',
        productId: '',
        spinShow: true
      }
    },
    mounted(data) {
      this.spinShow = false
      console.log(globe.getCurrentPageUrlArgs())
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        this.productId = urlParams.split('=')[1]
        this.getDetail(this.productId)
      }
    },
    methods: {
      // 获取详情
      getDetail(id){
        console.log(id)
      },
      // 选择分类
      selectPcategory(){
        const _this = this
        this.getLookupByCodeAndShowSheet('part_type', function(id, value){
          _this.form.pcategoryLK = id
          _this.pcategoryLK = value
        })
      },
      // 选择单位
      selectUnitLK(){
        const _this = this
        this.getLookupByCodeAndShowSheet('unit', function(id, value){
          _this.form.unitLK = id
          _this.unitLK = value
        })
      },
      // 选择规则
      selectSpecificationLK(){
        const _this = this
        this.getLookupByCodeAndShowSheet('part_specification', function(id, value){
          _this.form.specificationLK = id
          _this.specificationLK = value
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .productDetail{
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
