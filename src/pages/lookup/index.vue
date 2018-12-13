<template>
  <div class="container">
    <div class="client">
      <i-panel title="数据字典">
        <i-cell-group>
          <i-cell v-for="(item,index) in listData" :key="index" :title="item.value" is-link :url="'/pages/lookupDetail/main?id='+item.id"></i-cell>
        </i-cell-group>
      </i-panel>
    </div>
  </div>
</template>

<script>
  import api from '../../api/api'
  import bus from '../../utils/bus'
  import globe from '../../utils/globe'
  export default {
    data () {
      return {
        lookupdfCode: '',
        listData: [],
        totalData: 0
      }
    },
    mounted() {
      const urlParams = globe.getCurrentPageUrlArgs()
      this.lookupdfCode = urlParams.split('=')[1]
      this.getClientList(1, 10)
    },
    methods: {
      getClientList(pageNo, pageSize){
        const params = {
          pageNo,
          pageSize
        }
        this.$http.get(api.lookup_list + this.lookupdfCode, params).then( res => {
          console.log(res)
          if(res.success){
            this.listData = res.data.page.content
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
