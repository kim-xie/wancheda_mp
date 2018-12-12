<template>
  <div class="container">
    <div class="client">
      <i-panel title="数据字典">
        <i-cell-group>
          <i-cell v-for="(item,index) in clientData" @tap="lookDetail(item)" :key="index" :title="item.carNo" value="详细信息" is-link :url="'/pages/clientDetail/main?id='+item.id"></i-cell>
        </i-cell-group>
      </i-panel>
    </div>
  </div>
</template>

<script>
  import api from '../../api/api'
  import bus from '../../utils/bus'
  export default {
    data () {
      return {
        clientData: [],
        totalData: 0
      }
    },
    mounted() {
      this.getClientList()
    },
    methods: {
      getClientList(pageNo, pageSize){
        const params = {
          pageNo,
          pageSize
        }
        this.$http.get(api.client_list, params).then( res => {
          console.log(res)
          if(res.success){
            this.clientData = res.data.page.content
            this.totalData = res.data.page.totalElements
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .client{
    width: 100%;
  }
</style>
