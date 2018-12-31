<template>
  <div class="container">
    <div class="inventoryDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <p class="input_wrap" v-if="type === 'inpart'">
        <span class="input_label">进货价:</span>
        <input type="number" v-model="form.cost"/>
      </p>
      <p class="input_wrap" v-if="type === 'outpart'">
        <span class="input_label">销售价:</span>
        <input type="number" v-model="form.sale"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">配件数量:</span>
        <input type="number" v-model="form.count"/>
      </p>
      <button class="save" v-if="type === 'outpart'" @click="handleSave">出 库</button>
      <button class="save" v-if="type === 'inpart'" @click="handleSave">入 库</button>
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
        maxCount: 0,
        spinShow: true,
        type: '',
        inventoryId: ''
      }
    },
    onLoad() {
      this.spinShow = false
      if(globe.getCurrentPageUrlArgs()){
        const urlParams = globe.getCurrentPageUrlArgs()
        const types = urlParams.split('&')[0]
        const ids = urlParams.split('&')[1]
        this.type = types.split('=')[1]
        this.inventoryId = ids.split('=')[1]
        console.log(this.type)
        console.log(this.inventoryId)
        this.getDetail()
      }
    },
    methods: {
      // 获取详情
      getDetail(){
        let item = this.$store.getters.editItem
        if(this.type === 'outpart'){
          this.maxCount = item.count
        }
        this.form = item
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
        // 校验
        if(this.type === 'inpart' && !this.form.cost){
          globe.message('进货价不能为空','warning')
          return false
        }else if(this.type === 'inpart' && !this.form.count){
          globe.message('配件数量不能为空','warning')
          return false
        }
        if(this.type === 'outpart' && !this.form.sale){
          globe.message('销售价不能为空','warning')
          return false
        }else if(this.type === 'outpart' && !this.form.count){
          globe.message('配件数量不能为空','warning')
          return false
        }else if(this.type === 'outpart' && this.form.count > this.maxCount){
          globe.message('出库配件数量不能大于库存','warning')
          return false
        }
        if(!this.isLocked){
          this.isLocked = true
          this.spinShow = true
          // 分发数据到vuex
          if(this.type === 'inpart'){
            console.log(this.form)
            this.$store.dispatch('updateInpartFormParam', this.form).then(() => {
              setTimeout(function(){
                _this.isLocked = false
                this.spinShow = false
                wx.navigateTo({
                  url: '/pages/inpart/main'
                })
              }, 1000)
            })
          }else{
            console.log(this.form)
            this.$store.dispatch('updateOutpartFormParam', this.form).then(() => {
              setTimeout(function(){
                _this.isLocked = false
                this.spinShow = false
                wx.navigateTo({
                  url: '/pages/outpart/main'
                })
              }, 1000)
            })
          }
        }
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
