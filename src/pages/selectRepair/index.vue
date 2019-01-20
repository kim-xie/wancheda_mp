<template>
  <div class="container">
    <div class="repairDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>
      <p class="input_wrap">
        <span class="input_label">项目代码:</span>
        <input v-model="form.code" placeholder="请输入项目代码" readonly disabled/>
      </p>
      <p class="input_wrap">
        <span class="input_label">项目名称:</span>
        <input v-model="form.name" placeholder="请输入项目名称" readonly disabled/>
      </p>
      <p class="input_wrap">
        <span class="input_label">所属分类:</span>
        <picker :range="typeLKs">
          <span v-if="typeLK===''" class="input placeholder">请选择所属分类</span>
          <span v-else class="input">{{typeLK}}</span>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">维修工种:</span>
        <picker :range="workTypeLKs">
          <span v-if="workTypeLK===''" class="input placeholder">请选择维修工种</span>
          <span v-else class="input">{{workTypeLK}}</span>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">维修工:</span>
        <picker @change="bindPickerChange($event, 'form', 'mechanic')" :range="mechanics">
          <span v-if="mechanic===''" class="input placeholder">请选择维修工</span>
          <span v-else class="input">{{mechanic}}</span>
        </picker>
      </p>
      <p class="input_wrap">
        <span class="input_label">数量/工时:</span>
        <input v-model="form.workHour" type="number" placeholder="请输入数量/工时"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">单价:</span>
        <input v-model="form.sum" type="number" placeholder="请输入单价"/>
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
        addRepair: false,
        repairIndex: '',
        discount: 10,
        getDiscounted: false,
        id: '',
        form: {},
        workTypeLKs: [],
        workTypeLKIds: [],
        workTypeLK: '',
        typeLKs: [],
        typeLKIds: [],
        typeLK: '',
        mechanics: [],
        mechanicIds: [],
        mechanic: '',
        spinShow: true
      }
    },
    onLoad() {
      const that = this
      this.addRepair = false
      this.workTypeLK = ''
      this.typeLK = ''
      this.mechanic = ''
      this.form = {}
      this.spinShow = false
      this.id = ''
      this.repairIndex = ''
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        this.id = urlParams.split('=')[1]
        if(this.id){
          this.getDetail()
        }
      }
      // 所属分类
      this.getLookupByCodeAndPicker('repair_type', 'typeLK')
      // 维修工种
      this.getLookupByCodeAndPicker('work_type', 'workTypeLK')
      // 获取用户列表
      this.getUserList(function(valueArray, idArray){
        that.mechanics = valueArray
        that.mechanicIds = idArray
      })
      this.getLookUpById(this.client.level).then(data => {
        that.discount = Number(data.additional)
        that.getDiscounted = true
      })
    },
    computed: {
      ...mapGetters([
        'client'
      ])
    },
    methods: {
      // 获取详情
      getDetail(){
        let item = this.$store.getters.editItem
        this.addRepair = item.add
        this.workTypeLK = item.date.workTypeLK.value
        this.typeLK = item.date.typeLK.value
        if(!item.add){
          this.mechanic = item.mechanicVal
          this.repairIndex = item.index
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
      handleSave(callback){
        // 返回到上几个页面
        let delta = 1
        let message = '维修项目添加成功!'
        const _this = this
        if(this.getDiscounted){
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
          }else if(!this.form.mechanic){
            globe.message('维修工不能为空', 'warning')
            return false
          }
          // 新增
          if(this.addRepair){
            delta = 2
            _this.form.mechanicVal = _this.mechanic
            // 用户折扣信息
            _this.form.discount = _this.discount
            const total = globe.accMul(Number(_this.form.workHour),Number(_this.form.sum))
            _this.form.total = total
            _this.form.subtotal = globe.accMul(total,Number(_this.form.discount/10))
          }else{
            message = '维修项目编辑成功!'
            // 编辑
            _this.form.mechanicVal = _this.mechanic
            // 用户折扣信息
            _this.form.discount = _this.discount
            const total = globe.accMul(Number(_this.form.workHour),Number(_this.form.sum))
            _this.form.total = total
            _this.form.subtotal = globe.accMul(total,Number(_this.form.discount/10))
          }
          this.spinShow = true
          // 将数据添加至vuex
          this.$store.dispatch('updateRepairItem', this.form).then(() => {
            globe.message(message, 'success')
            // 返回页面
            setTimeout(function(){
              _this.spinShow = false
              wx.navigateBack({
                delta: delta
              })
            },2000)
          })
        }else{
          globe.message('还未获取到客户优惠券，请刷新重试', 'warning')
        }
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
