
import axios from 'axios'

// 根路径
let baseURL = ''

// 环境的切换
if (process.env.NODE_ENV === 'development') {
  baseURL = 'https://www.apiopen.top/'
} else if (process.env.NODE_ENV === 'debug') {
  baseURL = ''
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://easy-mock.com/mock/5bfc161b791edf0246129e75/v1/'
}

// 当创建实例的时候配置默认配置
let instance = axios.create({
  baseURL: baseURL,
  timeout: 3000,
  withCredentials: true // 支持跨域访问
})

// 当实例创建时候修改配置
const AUTH_TOKEN = 'abcd'
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 添加一个请求拦截器
instance.interceptors.request.use(config => {
  // 在请求发出之前进行一些操作
  return config
}, err => {
  // Do something with request error
  return Promise.reject(err)
})

// 添加一个响应拦截器
instance.interceptors.response.use(res => {
  // 在这里对返回的数据进行处理
  return res
}, err => {
  // Do something with response error
  return Promise.reject(err)
})

// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

/**
 * axios封装
 * @param {*} method
 * @param {*} url
 * @param {*} params
 * @param {*} succes
 * @param {*} failure
 */
function apiAxios(method, url, params) {
  return new Promise((resolve, reject) => {
    if (params) {
      params = filterNull(params)
    }
    instance({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null
    }).then(res => {
      if (res.data.code === 200) {
        Message({
          message: res.data.msg,
          type: 'success',
          showClose: true
        })
        resolve(res.data)
      } else {
        Message({
          message: res.data.msg,
          type: 'warning',
          showClose: true
        })
        reject(res.data)
      }
    }).catch(err => {
      let res = err.response
      if (err) {
        Message({
          message: 'api error, HTTP CODE: ' + res.status,
          type: 'error',
          showClose: true
        })
      }
      reject(err)
    })
  })
}

// 返回在vue模板中的调用接口
export default {
  get: (url, params) => {
    return apiAxios('GET', url, params)
  },
  post: (url, params) => {
    return apiAxios('POST', url, params)
  },
  put: (url, params) => {
    return apiAxios('PUT', url, params)
  },
  delete: (url, params) => {
    return apiAxios('DELETE', url, params)
  }
}
