<template>
  <div class="container">
    <div class="accountDetail">
      <p class="input_wrap">
        <span class="input_label">账号名</span>
        <input v-model="form.username"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">真实姓名</span>
        <input v-model="form.realname"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">联系电话</span>
        <input v-model="form.phone"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">邮箱</span>
        <input v-model="form.email"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">所属公司</span>
        <input v-model="form.company"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">角色</span>
        <input v-model="form.role"/>
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
        companyId: ''
      }
    },
    mounted(data) {
      //console.log(globe.getCurrentPageUrlArgs())
      const urlParams = globe.getCurrentPageUrlArgs()
      this.companyId = urlParams.split('=')[1]
      this.getCompanyDetail(this.companyId)
    },
    methods: {
      // 获取公司详情
      getCompanyDetail(id){
        //console.log(id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .accountDetail{
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
