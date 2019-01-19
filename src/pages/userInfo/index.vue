<template>
  <div class="container">
    <div class="userInfo">
      <p class="input_wrap">
        <span class="input_label">用户名</span>
        <input v-model="userInfo.username"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">真实姓名</span>
        <input v-model="userInfo.fullname"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">联系电话</span>
        <input v-model="userInfo.mobile"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">邮箱</span>
        <input v-model="userInfo.email"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">所属公司</span>
        <input v-model="userInfo.date.company.name"/>
      </p>
      <p class="input_wrap">
        <span class="input_label">角色</span>
        <input v-model="userInfo.date.role.value"/>
      </p>
      <button class="save" @click="handleSave">保 存</button>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {

      }
    },
    created () {

    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      // 修改用户信息
      handleSave(){
        //console.log(JSON.stringify(this.userInfo))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .userInfo{
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
