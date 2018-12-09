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
    },
    /*获取当前页url*/
    getCurrentPageUrl: () => {
        const pages = getCurrentPages() //获取加载的页面
        const currentPage = pages[pages.length - 1] //获取当前页面的对象
        const url = currentPage.route //当前页面url
        return url
    },
    /*获取当前页带参数的url*/
    getCurrentPageUrlWithArgs: () => {
        const pages = getCurrentPages() //获取加载的页面
        const currentPage = pages[pages.length - 1] //获取当前页面的对象
        const url = currentPage.route //当前页面url
        const options = currentPage.options //如果要获取url中所带的参数可以查看options
        //拼接url的参数
        let urlWithArgs = url + '?'
        for (let key in options) {
            let value = options[key]
            urlWithArgs += key + '=' + value + '&'
        }
        urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
        return urlWithArgs
    },
    /*获取当前页url参数*/
    getCurrentPageUrlArgs: () => {
        const pages = getCurrentPages() //获取加载的页面
        const currentPage = pages[pages.length - 1] //获取当前页面的对象
        const url = currentPage.route //当前页面url
        const options = currentPage.options //如果要获取url中所带的参数可以查看options
        //拼接url的参数
        let urlArgs = '?'
        for (let key in options) {
            let value = options[key]
            urlArgs += key + '=' + value + '&'
        }
        urlArgs = urlArgs.substring(0, urlArgs.length - 1)
        return urlArgs
    }
}
