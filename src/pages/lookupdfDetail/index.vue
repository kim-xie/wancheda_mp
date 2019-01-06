<template>
  <div class="container">
    <div class="lookupdfDetail">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <p class="input_wrap">
        <span class="input_label">名称</span>
        <input v-model="form.name" placeholder="请输入名称"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">代码</span>
        <input v-model="form.code" v-if="id!==''" readonly disabled/>
        <input v-model="form.code" v-if="id===''" placeholder="请输入代码"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">类型</span>
        <span v-if="type===''" class="input placeholder" @tap="selectType">请选择类型</span>
        <span v-else class="input" @tap="selectType">{{type}}</span>
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
        form: {},
        id: '',
        spinShow: true,
        type: 0
      }
    },
    onLoad(){
      this.id = ''
      this.type = 0
      this.form = {}
      this.spinShow = false
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
      // 获取数据字典定义详情
      getDetail(){
        let item = this.$store.getters.editItem
        this.type = item.type == 0 ? '普通结构' : '树形结构'
        this.form = item
      },
      // 选择类型
      selectType(){
        const _this = this
        this.showActionSheet(['普通结构', '树形结构'], function(index){
          if(index === 0){
            _this.form.type = 0
            _this.type = '普通结构'
          }else{
            _this.form.type = 1
            _this.type = '树形结构'
          }
        })
      },
      // 显示选择栏
      showActionSheet(dataArry, successCallBack){
        wx.showActionSheet({
          itemList: dataArry,
          success(res) {
            // console.log(res)
            // globe.message('选择成功', 'success')
            if(successCallBack && typeof successCallBack == 'function'){
              successCallBack(res.tapIndex)
            }
          },
          fail(res) {
            // globe.message(res.errMsg, 'danger')
          }
        })
      },
      // 保存
      handleSave(callback){
        let url = ''
        if(this.id){
          url = api.lookupdf_edit
          delete this.form.createTime
          delete this.form.updateTime
          delete this.form.isDeleted
        }else{
          url = api.lookupdf_add
        }
        if(!this.form.name){
          globe.message('名称不能为空', 'warning')
          return false
        }else if(!this.form.code){
          globe.message('代码不能为空', 'warning')
          return false
        }else if(!this.form.type){
          globe.message('类型不能为空', 'warning')
          return false
        }
        this.spinShow = true
        this.$http.post(url, this.form).then( res => {
          if(res.success){
            globe.message(res.errorMsg, 'success')
            setTimeout(function(){
              this.spinShow = false
              wx.navigateTo({
                url: '/pages/lookupdf/main'
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
  .lookupdfDetail{
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
