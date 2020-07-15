const app = new getApp()

// 服务器地址
let serviceUrl = 'http://skybin.vipgz4.idcfengye.com/api/'
// let serviceUrl = 'https://m.quickssend.com/wechaapplet/api/'

/* 
* path, 业务借口的请求路径
* params, 请求需要携带的参数
*/
let request = (path, params = {}, type='POST') => {

  // 匹配path中的服务器域名
  let urlReg = new RegExp('[a-zA-z]+://[^\s]*')
  // 如果匹配到域名就使用传入的path，否则使用配置的服务器地址
  let isUrl = path.match(urlReg)

  console.log('open id:', wx.getStorageSync('openId'))

  return new Promise((resolve, reject) => {
     return wx.request({
      url: !isUrl ? (serviceUrl + path) : path,
      method: type,
      data: {
        ...params,
        openId: wx.getStorageSync('openId') || ''
      },
      success (res) {
        if (res.data.code == 10000 || isUrl) {
          resolve(res)
          app.globalData.loginCode = 0
        } else {
          if (res.data.code == 10007) {
            // 用户没有登录
            wx.showModal({
              title: '提示',
              content: '用户未登录，请重新登录',
              success (res) {
                if (res.confirm) {
                  wx.clearStorage({
                    success () {
                      wx.clearStorage()
                      wx.navigateTo({
                        url: '../../pages/login/login'
                      })
                    }
                  })
                }
              }
            })
            return
          }

          if (res.data.code == 10003 || res.data.code == 10001) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            return
          }
          !isUrl && wx.showModal({
            title: '系统内部错误',
            content: '错误代码：' + res.data.code
          })
        }
      },
      fail (err) {
        reject(err)
      }
    })
  })
} 

export default request