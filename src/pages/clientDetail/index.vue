<template>
  <div class="container">
    <div class="accountDetail">
      <p class="input_wrap">
        <span class="input_label">客户姓名</span>
        <input v-model="form.name"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">客户手机</span>
        <input v-model="form.mobile"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">车牌号</span>
        <input v-model="form.carNo"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">汽车品牌</span>
        <input v-model="form.date.carBrand.value"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">车型</span>
        <input v-model="form.carModel"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">车身颜色</span>
        <input v-model="form.carColor"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">客户级别</span>
        <input v-model="form.date.level.value"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">所属公司</span>
        <input v-model="form.company"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">客户地址</span>
        <input v-model="form.address"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">证件号</span>
        <input v-model="form.idcard"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">车架号</span>
        <input v-model="form.carVIN"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">发动机号</span>
        <input v-model="form.engineNo"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">上牌日期</span>
        <input v-model="form.registrationDate"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">客户邮箱</span>
        <input v-model="form.email"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">客户性别</span>
        <input v-model="form.sex"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">客户类型</span>
        <input v-model="form.date.type.value"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">保险公司</span>
        <input v-model="form.insurer"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">保险到期时间</span>
        <input v-model="form.insuranceEndtime"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">备注</span>
        <input type="textarea" v-model="form.description"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">创建时间</span>
        <input v-model="form.createTime"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">更新时间</span>
        <input v-model="form.updateTime"/>
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
        clientId: ''
      }
    },
    mounted(data) {
      console.log(globe.getCurrentPageUrlArgs())
      const urlParams = globe.getCurrentPageUrlArgs()
      this.clientId = urlParams.split('=')[1]
      this.getDetail(this.clientId)
    },
    methods: {
      // 获取详情
      getDetail(id){
        console.log(id)
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
        width: 120px;
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
      margin: 10px auto;
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
