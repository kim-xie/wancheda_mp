<template>
  <div>
    <!-- iview 全局提示组件 -->
    <i-message id="message"/>
  </div>
</template>

<script>
import eventBus from "../../utils/bus"
import {
    $Message
} from '../../dist/base/index'

export default {
  created () {
    // 监听showGlobeMessage事件
    eventBus.$on('showGlobeMessage', param => {
      this.globeMessage(param.msg, param.type, param.time)
    })
  },
  methods: {
    // 全局提示事件
    globeMessage(msg, type, time) {
      $Message({
        content: msg ? msg : '成功',
        type: type ? type : 'success',
        duration: time ? time : 3,
        selector: '#message'
      })
    }
  }
}
</script>