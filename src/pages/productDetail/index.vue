<template>
  <div class="container">
    <div class="productDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>
      <p class="input_wrap">
        <span class="input_label">配件编号:</span>
        <input v-model="form.code" placeholder="请输入配件编号"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件名称:</span>
        <input v-model="form.name" placeholder="请输入配件名称"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">所属分类:</span>
        <picker @change="bindPickerChange($event, 'form', 'pcategoryLK')" :range="pcategoryLKs">
          <span v-if="pcategoryLK===''" class="input placeholder">请选择配件所属分类</span>
          <span v-else class="input">{{pcategoryLK}}</span>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件批发价:</span>
        <input v-model="form.wholeSale" placeholder="请输入配件批发价"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件售价:</span>
        <input v-model="form.sale" placeholder="请输入配件售价"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件产地:</span>
        <input v-model="form.produceArea" placeholder="请输入配件产地"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件单位:</span>
        <picker @change="bindPickerChange($event, 'form', 'unitLK')" :range="unitLKs">
          <span v-if="unitLK===''" class="input placeholder">请选择配件单位</span>
          <span v-else class="input">{{unitLK}}</span>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件规格:</span>
        <picker @change="bindPickerChange($event, 'form', 'specificationLK')" :range="specificationLKs">
          <span v-if="specificationLK===''" class="input placeholder">请选择配件规格</span>
          <span v-else class="input">{{specificationLK}}</span>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">适用车型:</span>
        <input v-model="form.carModel" placeholder="请输入适用车型"/>
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
        pcategoryLKs: [],
        pcategoryLKIds: [],
        unitLK: '',
        unitLKs: [],
        unitLKIds: [],
        specificationLK: '',
        specificationLKs: [],
        specificationLKIds: [],
        id: '',
        spinShow: true
      }
    },
    onLoad() {
      this.form = {}
      this.pcategoryLK = ''
      this.unitLK = ''
      this.specificationLK = ''
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
      // 所属分类
      this.getLookupByCodeAndPicker('part_type', 'pcategoryLK')
      // 选择单位
      this.getLookupByCodeAndPicker('unit', 'unitLK')
      // 选择规格
      this.getLookupByCodeAndPicker('part_specification', 'specificationLK')
    },
    methods: {
      // 获取详情
      getDetail(id){
        let item = this.$store.getters.editItem
        console.log(item)
        this.pcategoryLK = item.date.pCategoryLK.value
        this.unitLK = item.date.unitLK.value
        this.specificationLK = item.date.specificationLK.value
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
