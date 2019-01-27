<template>
  <div class="container">
    <div class="client">
      <!-- iview 全局提示组件 -->
      <i-message id="message"/>
      <!-- 加载中组件 -->
      <i-spin size="large" fix v-if="spinShow"></i-spin>

      <div class="client_header clearfix">
        <div class="search">
          <input type="text" v-model="searchVal" @blur="goSearch" placeholder="按车牌号搜索">
          <i v-if="searchVal === ''" class="iconfont icon-search"></i>
          <i v-if="searchVal !== ''" class="iconfont icon-delete" style="color:red" @tap="clear"></i>
        </div>
        <van-button size="small" plain type="primary" class="add_button float-right" @tap="handleAdd">新增</van-button>
      </div>

      <van-collapse custom-class="client_wrap" :value="activeName" accordion v-if="listData.length>0">
        <van-collapse-item content-class="client_item" v-for="(item,index) in listData" :key="index" :title="item.carNo" :value="item.name" :name="index" @tap="onChange($event,index)">
          <div class="item_detail">
            <p class="detail">
              <p class="items">
                <span class="label">所属门店:</span>
                <span class="value" v-if="item.company">{{item.company}}</span>
              </p>
              <p class="items">
                <span class="label">手机号码:</span>
                <span class="value">{{item.mobile}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="items">
                <span class="label">客户级别:</span>
                <span class="value" v-if="item.date.level">{{item.date.level.value}}</span>
              </p>
              <p class="items">
                <span class="label">客户类型:</span>
                <span class="value" v-if="item.date.type">{{item.date.type.value}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="items">
                <span class="label">汽车品牌:</span>
                <span class="value" v-if="item.date.carBrand">{{item.date.carBrand.value}}</span>
              </p>
              <p class="items">
                <span class="label">汽车车型:</span>
                <span class="value">{{item.carModel}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="items">
                <span class="label">车身颜色:</span>
                <span class="value">{{item.carColor}}</span>
              </p>
              <p class="">
                <span class="label">车架号:</span>
                <span class="value">{{item.carVIN}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="items">
                <span class="label">发动机号:</span>
                <span class="value">{{item.engineNo}}</span>
              </p>
              <p class="items">
                <span class="label">证件号:</span>
                <span class="value">{{item.idcard}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="items">
                <span class="label">性别:</span>
                <span class="value" v-if="item.sex">男</span>
                <span class="value" v-if="!item.sex">女</span>
              </p>
              <p class="items">
                <span class="label">邮箱:</span>
                <span class="value">{{item.email}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="items">
                <span class="label">客户地址:</span>
                <span class="value">{{item.address}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="items">
                <span class="label">保险公司:</span>
                <span class="value">{{item.insurer}}</span>
              </p>
              <p class="items">
                <span class="label">保险到期时间:</span>
                <span class="value">{{item.insuranceEndtime}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="items">
                <span class="label">上牌日期:</span>
                <span class="value">{{item.registrationDate}}</span>
              </p>
              <p class="items">
                <span class="label">备注:</span>
                <span class="value">{{item.description}}</span>
              </p>
            </p>
            <p class="detail">
              <p class="items">
                <span class="label">创建时间:</span>
                <span class="value">{{item.createTime}}</span>
              </p>
              <p class="items">
                <span class="label">更新时间:</span>
                <span class="value">{{item.updateTime}}</span>
              </p>
            </p>
          </div>
          <div class="item_footer">
            <p class="item_edit">
              <span class="button" @tap.stop="handleCoupon(item)">优惠券</span>
              <span class="button edit" @tap.stop="handleEdit(item)">编辑</span>
              <span class="button delete" @tap.stop="handleDelete(item.id)">删除</span>
            </p>
          </div>
        </van-collapse-item>
      </van-collapse>

      <!-- 暂无数据 -->
      <i-divider v-if="totalData===0 && firstLoad" color="#2d8cf0" lineColor="#2d8cf0">抱歉，暂无数据</i-divider>

      <!-- 页底加载 -->
      <i-load-more v-if="totalData>pageSize" :tip="tipmessage" :loading="loading" />

      <i-modal title="删除确认" :visible="modalVisible" :actions="actions" @tap="handleClick($event)">
        <view>删除后数据将无法恢复哦</view>
      </i-modal>
    </div>
  </div>
</template>

<script>
  import globe from '../../utils/globe'
  import api from '../../api/api'
  import * as utils from '../../assets/js/utils'
  export default {
    data () {
      return {
        activeName: -1,
        modalVisible: false,
        firstLoad: false,
        spinShow: true,
        tipmessage: '我也是有底线的',
        loading: false,
        listData: [],
        totalData: 0,
        pageNo: 1,
        pageSize: 10,
        form: {},
        search: {
          carNo: ''
        },
        companys: [],
        companyIds: [],
        searchVal: '',
        deleteId: '',
        actions: [
            {
                name: '取消'
            },
            {
                name: '删除',
                color: '#ed3f14',
            }
        ]
      }
    },
    onLoad(){
      this.firstLoad = false
      this.spinShow = false
      this.listData = []
      const that = this
      // 获取公司列表
      this.getCompanyList('company').then(that.getList(that.pageNo, that.pageSize))
    },
    // 上拉加载，拉到底部触发
    onReachBottom() {
      // 到这底部在这里需要做什么事情
      //console.log('上拉加载')
      const that = this
      if(this.pageSize < this.totalData){
        this.loading = true
        this.tipmessage = '玩命加载中'
        this.pageSize = this.pageSize+10
        this.getList(this.pageNo, this.pageSize, function(){
          that.loading = false
          that.tipmessage = '我也是有底线的'
        })
      }
    },
    methods: {
      // 切换手风琴
      onChange(data,index){
        if(this.activeName == index){
          this.activeName = -1
        }else{
          this.activeName = index
        }
      },
      // 搜索
      goSearch(){
        const searchVal = this.searchVal
        this.search.carNo = searchVal
        this.getList(this.pageNo, this.pageSize)
      },
      clear(){
        this.searchVal = ''
        this.search.carNo = ''
        this.getList(this.pageNo, this.pageSize)
      },
      // 获取列表数据
      getList(pageNo, pageSize, callback){
        const that = this
        that.spinShow = true
        const params = {
          'search.carNo_like': that.search.carNo,
          'search.isDeleted_eq': false,
          'page.pn': pageNo,
          'page.size': pageSize
        }
        that.$http.get(api.client_list, params).then( res => {
          if(res.success){
            const datas = res.data.page.content
            for(let i=0;i<datas.length;i++){
              for(let j=0;j<that.companyIds.length;j++){
                if(datas[i].company == that.companyIds[j]){
                  datas[i].company = that.companys[j]
                }
              }
            }
            that.listData = datas
            that.totalData = res.data.page.totalElements
            that.spinShow = false
            if(callback && typeof callback == 'function'){
              callback()
            }
          }else{
            that.spinShow = false
          }
          this.firstLoad = true
        }).catch(err => {
          console.log(err)
          that.spinShow = false
        })
      },
      // 获取公司列表
      getCompanyList(type){
        return new Promise((resolve,reject) => {
          const params = {
            'search.isDeleted_eq': false,
            pageNo: 1,
            pageSize: 1000
          }
          const _this = this
          _this.spinShow = true
          this.$http.get(api.company_list, params).then( res => {
            if(res.success){
              const data = res.data.page.content
              let dataArry = []
              let idArry = []
              for(let i=0; i<data.length; i++){
                dataArry.push(data[i].name)
                idArry.push(data[i].id)
              }
              _this[type+'s'] = dataArry
              _this[type+'Ids'] = idArry
              _this.spinShow = false
            }else{
              _this.spinShow = false
            }
            resolve()
          })
        })
      },
      // 新增维修项目
      handleAdd(){
        wx.navigateTo({
          url: '/pages/clientDetail/main'
        })
      },
      // 编辑维修项目
      handleEdit(item){
        this.$store.dispatch('saveEditItem', item).then(() => {
          wx.navigateTo({
            url: '/pages/clientDetail/main?id='+item.id
          })
        })
      },
      // 客户优惠券
      handleCoupon(item){
        wx.navigateTo({
          url: '/pages/coupon/main?id='+item.id
        })
      },
      // 删除确认
      handleClick(data){
        const type = data.mp._relatedInfo.anchorTargetText
        const that = this
        if(type === '删除'){
          that.deleteApi(that.deleteId,function(){
            that.modalVisible = false
          })
        }else{
          that.modalVisible = false
        }
      },
      // 删除维修项目
      handleDelete(id){
        this.deleteId = id
        this.modalVisible = true
      },
      deleteApi(id,callback){
        const that = this
        this.spinShow = true
        this.$http.delete(api.client_delete+"?id="+id,null).then( res => {
          if(res.success){
            globe.message(res.errorMsg,'success')
            this.getCompanyList('company').then(that.getList(that.pageNo, that.pageSize))
            if(callback && typeof callback == 'function'){
              callback()
            }
            this.spinShow = false
          }else{
            globe.message(res.errorMsg,'warning')
            this.spinShow = false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.disable{
  color: red!important;
}
.undisable{
  color: green!important;
}
.client{
  width: 100%;
  .client_header{
    height: 100%;
    margin: 0 auto;
    .add_button{
      margin: 10px 10px 10px 0;
    }
    .search{
      display: block;
      position: relative;
      width: 95%;
      margin: 0 auto;
      input{
        height: 30px;
        line-height: 30px;
        border: 1px solid $--color-text-placeholder;
        border-radius: 4px;
        padding: 3rpx 80rpx 6rpx 12rpx;
      }
      .iconfont{
        position: absolute;
        right: 12rpx;
        top: 14rpx;
        font-size: 22px;
        color: $--color-text-placeholder;
      }
    }
  }
  .client_wrap{
    padding: 10px;
    width: 88%;
    margin: 0 auto;
    margin-top: 20px;
  }
  .client_item{
    box-shadow: $--box-shadow-light;
    .item_header{
      border-bottom: 1px solid $--color-border-white;
      padding: 0 0 6px 0;
      .code{
        color: $--color-text-placeholder;
      }
    }
    .item_detail{
      padding: 0 0 10px 4px;
      .items{
        padding: 2px 0;
      }
      .label{
        display: inline-block;
        width: 200rpx;
        color: $--color-text-regular;
      }
    }
    .item_footer{
      border-top: 1px solid $--color-border-white;
      text-align: center;
      padding-top: 8px;
      .button{
        display: inline-block;
        padding: 2px 10px;
        border: 1px solid $--color-text-placeholder;
        border-radius: 4px;
        margin: 0 8px;
        font-size: 14px;
        color: $--color-text-regular;
      }
      .button:hover{
        background-color: $--color-border-white;
      }
      .delete{
        color: $--color-danger;
      }
    }
  }
}
</style>
