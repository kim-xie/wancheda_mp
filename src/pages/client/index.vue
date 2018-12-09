<template>
  <div class="container">
    <div class="client">
      <i-panel title="客户列表">
        <i-cell-group>
          <i-cell title="king" value="详细信息" is-link url="/pages/clientDetail/main?id=1"></i-cell>
          <i-cell title="kim" value="详细信息" is-link url="/pages/clientDetail/main?id=2"></i-cell>
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
  .client{
    width: 100%;
  }
</style>
