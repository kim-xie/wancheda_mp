import * as Tips from '../dist/base/index'

export default {
    // 全局提示事件
    message: (msg, type, time) => {
        Tips.$Message({
            content: msg ? msg : '成功',
            type: type ? type : 'success',
            duration: time ? time : 3,
            selector: '#message'
        })
    },
    // 全局弹出层
    toast: (msg, type, time, icon, mask) => {
        Tips.$Toast({
            content: msg,
            content: msg ? msg : '成功',
            type: type ? type : 'success',
            duration: time ? time : 3,
            icon: icon,
            mask: mask ? mask : true,
            selector: '#toast'
        })
    }
}