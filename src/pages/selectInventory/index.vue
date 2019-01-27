<template>
  <div class="container">
    <div class="inventoryDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <p class="input_wrap">
        <span class="input_label">销售价:</span>
        <input type="number" v-model="form.sale" placeholder="请输入销售价"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件数量:</span>
        <input type="number" v-model="form.count" placeholder="请输入配件数量"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">领料人:</span>
        <picker @change="bindPickerChange($event, 'form', 'receiver')" :range="receivers">
          <span v-if="receiver===''" class="input placeholder">请选择领料人</span>
          <span v-else class="input">{{receiver}}</span>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">备注:</span>
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
        form: {},
        maxCount: 0,
        discount: 10,
        spinShow: true,
        inventoryId: '',
        receiverIds: [],
        receivers: [],
        receiver: '',
        addInventory: false,
        inventoryIndex: ''
      }
    },
    onLoad() {
      this.inventoryIndex = ''
      this.receiver = ''
      this.spinShow = false
      this.addInventory = false
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        const ids = urlParams.split('?')[1]
        this.inventoryId = ids.split('=')[1]
        this.getDetail()
      }
      // 获取用户列表
      this.getUserList(function(valueArray, idArray){
        that.receivers = valueArray
        that.receiverIds = idArray
      })

      const that = this
      this.getLookUpById(this.client.level).then(data => {
        that.discount = Number(data.additional)
      })
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'client'
      ])
    },
    methods: {
      // 获取详情
      getDetail(){
        let item = this.$store.getters.editItem
        this.addInventory = item.add
        this.maxCount = item.count
        if(!item.add){
          this.receiver = item.receiverVal
          this.inventoryIndex = item.index
        }
        this.form = item
      },
      // 根据ID获取对应的数据字典
      getLookUpById(id){
        return new Promise((resolve,reject) => {
          this.spinShow = true
          this.$http.get(api.getLookupById + '?id=' + id, null).then( res => {
            if(res.success){
              this.spinShow = false
              resolve(res.data.entity)
            }else{
              this.spinShow = false
            }
          })
        })
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
      // 获取用户列表
      getUserList(callback){
        const _this = this
        const params = {
          'search.company_eq': this.userInfo.company,
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
      // 保存
      handleSave(){
        const _this = this
        // 返回到上几个页面
        let delta = 1
        let message = '配件添加成功!'
        // 校验
        if(!this.form.sale){
          globe.message('销售价不能为空','warning')
          return false
        }else if(!this.form.count){
          globe.message('配件数量不能为空','warning')
          return false
        }else if(this.form.count > this.maxCount){
          globe.message('出库配件数量不能大于库存','warning')
          return false
        }else if(!this.form.receiver){
          globe.message('领料人不允许为空','warning')
          return false
        }

        // 新增
        if(this.addInventory){
          delta = 2
          this.form.receiverVal = this.receiver
          // 用户折扣信息
          this.form.discount = this.discount
          const total = globe.accMul(Number(_this.form.sale),Number(_this.form.count))
          this.form.total = total
          this.form.subtotal = globe.accMul(total,Number(_this.form.discount/10))
        }else{
          message = '配件编辑成功!'
          // 编辑
          this.form.receiverVal = this.receiver
          // 用户折扣信息
          this.form.discount = this.discount
          const total = globe.accMul(Number(_this.form.sale),Number(_this.form.count))
          this.form.total = total
          this.form.subtotal = globe.accMul(total,Number(_this.form.discount/10))
        }
        this.spinShow = true
        // 将数据添加至vuex
        this.$store.dispatch('updateInventoryItem', this.form).then(() => {
          globe.message(message, 'success')
          // 返回页面
          setTimeout(function(){
            _this.spinShow = false
            wx.navigateBack({
              delta: delta
            })
          },2000)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .inventoryDetail{
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
