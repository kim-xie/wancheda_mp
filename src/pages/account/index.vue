<template>
  <div class="container">
    <div class="account">
      <i-panel title="账号列表">
        <i-cell-group>
          <i-cell v-for="(item,index) in accountData" @tap="lookAccountDetail(item)" :key="index" :title="item.username" value="详细信息" is-link :url="'/pages/accountDetail/main?id='+item.id"></i-cell>
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
        accountData: [],
        totalData: 0
      }
    },
    mounted() {
      this.getAccountList()
    },
    methods: {
      // 查看账号详情
      lookAccountDetail(item){
        console.log(item)
        bus.$emit('getAccountDetail', item)
      },
      // 获取账号列表
      getAccountList(pageNo, pageSize){
        const params = {
          pageNo,
          pageSize
        }
        this.$http.get(api.account_list, params).then( res => {
          console.log(res)
          if(res.success){
            this.accountData = res.data.page.content
            this.totalData = res.data.page.totalElements
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .account{
    width: 100%;
  }
</style>
