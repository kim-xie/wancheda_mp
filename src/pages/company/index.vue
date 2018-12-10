<template>
  <div class="container">
    <div class="company">
      <i-panel title="公司列表">
        <i-cell-group>
          <i-cell v-for="(item,index) in companyData" :key="index" :title="item.name" value="详细信息" is-link :url="'/pages/companyDetail/main?id='+item.id"></i-cell>
        </i-cell-group>
      </i-panel>
    </div>
  </div>
</template>

<script>
  import api from '../../api/api'
  export default {
    data () {
      return {
        companyData: [],
        totalData: 0
      }
    },
    mounted() {
      this.getCompanyList(1, 1000)
    },
    methods: {
      // 获取公司列表
      getCompanyList(pageNo, pageSize){
        const params = {
          pageNo,
          pageSize
        }
        this.$http.get(api.company_list, params).then( res => {
          console.log(res)
          if(res.success){
            this.companyData = res.data.page.content
            this.totalData = res.data.page.totalElements
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .company{
    width: 100%;
  }
</style>
