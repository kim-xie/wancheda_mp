<template>
  <div class="container">
    <div class="account">
      <i-panel title="账号列表">
        <i-cell-group>
          <i-cell title="admin" value="详细信息" is-link url="/pages/accountDetail/main?id=1"></i-cell>
          <i-cell title="superadmin" value="详细信息" is-link url="/pages/accountDetail/main?id=2"></i-cell>
        </i-cell-group>
      </i-panel>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    created () {

    },
    methods: {
      
    }
  }
</script>

<style lang="scss" scoped>
  .account{
    width: 100%;
  }
</style>
