<template>
  <div class="container">
    <div class="company">
      <i-panel title="公司列表">
        <i-cell-group>
          <i-cell title="深圳分店" value="详细信息" is-link url="/pages/companyDetail/main?id=1"></i-cell>
          <i-cell title="广州分店" value="详细信息" is-link url="/pages/companyDetail/main?id=2"></i-cell>
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
  .company{
    width: 100%;
  }
</style>
