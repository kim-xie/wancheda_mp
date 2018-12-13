<template>
  <div class="container">
    <div class="lookupdfDetail">
      <p class="input_wrap">
        <span class="input_label">名称</span>
        <input v-model="form.name"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">代码</span>
        <input v-model="form.code"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">类型</span>
        <input v-model="form.type"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">描述</span>
        <input v-model="form.description"/>
      </p>
      <button class="save" @click="handleSave">保 存</button>
    </div>
  </div>
</template>

<script>
  import globe from '../../utils/globe'
  export default {
    data () {
      return {
        form: {},
        lookupdfId: ''
      }
    },
    mounted(data) {
      console.log(globe.getCurrentPageUrlArgs())
      const urlParams = globe.getCurrentPageUrlArgs()
      this.lookupdfId = urlParams.split('=')[1]
      this.getLookUpDetail(this.lookupdfId)
    },
    methods: {
      // 获取数据字典定义详情
      getLookUpDetail(id){
        console.log(id)
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
