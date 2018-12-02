import Fly from 'flyio/dist/npm/wx'

// 根路径
let baseURL = ''

// 环境地址配置
if (process.env.NODE_ENV === 'development') {
  console.log('development')
  baseURL = 'https://easy-mock.com/mock/5bfc161b791edf0246129e75/v1/'
} else if (process.env.NODE_ENV === 'debug') {
  console.log('debug')
  baseURL = ''
} else if (process.env.NODE_ENV === 'production') {
  console.log('production')
  baseURL = 'https://easy-mock.com/mock/5bfc161b791edf0246129e75/v1/'
}

// 初始化fly实例
const fly = new Fly

// fly全局配置
fly.config = {
  // 定义公共headers
  headers: {
    'X-Tag': 'flyio'
  },
  // 设置超时
  timeout: 10000,
  // 允许携带cookie信息
  withCredentials: true,
  // 设置请求基地址
  baseURL: baseURL
}

//添加请求拦截器
fly.interceptors.request.use((request) => {
  //打印出请求体
  console.log(request)
  //终止请求
  //var err = new Error("xxx")
  //err.request = request
  //return Promise.reject(new Error(""))

  //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use((res) => {
    //只将请求结果的data字段返回
    return res.data
  }, (err) => {
    //发生网络错误后会走到这里
    //return Promise.resolve("ssss")
  }
)

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
 * flyio封装
 * @param {*} method
 * @param {*} url
 * @param {*} params
 * @param {*} succes
 * @param {*} failure
 */
function apiFly(method, url, params) {
  return new Promise((resolve, reject) => {
    if (params) {
      params = filterNull(params)
    }
    // fly api
    fly.request(url, params, {method}).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 返回在vue模板中的调用接口
export default {
  get: (url, params) => {
    return apiFly('GET', url, params)
  },
  post: (url, params) => {
    return apiFly('POST', url, params)
  },
  put: (url, params) => {
    return apiFly('PUT', url, params)
  },
  delete: (url, params) => {
    return apiFly('DELETE', url, params)
  }
}
