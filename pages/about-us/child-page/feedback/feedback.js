import request from '../../../api/request'

const app = getApp();
// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '帮助与反馈',
    // 评论图片
    files: [],
    // 订单详情
    commodityDetails: {},
    // 返回参数
    params: {
      // 问题描述
      problemDescription: '',
      // 数据类型，1，图片；2，视频
      resType: 1,
      // 图片或视频集合
      childs: []
    },
    // 选择视频或图片
    showActionsheet: false,
    // 弹出菜单集合
    groups: [
      {
        value: 1,
        text: '图片'
      },
      {
        value: 2,
        text: '视频'
      }
    ],
    // 图片或视频集合
    childList: [],
    // 图片或视频长度(图片长度5，视频1)
    childLength: 5
  },

  onLoad() {
  },
  // 输入评论内容
  bindinput(e) {
    let value = e.detail.value
    this.setData({
      'params.problemDescription': value
    })
  },
  // 新增反馈
  confirmComment() {
    let params = {
      problemDescription: this.data.params.problemDescription,
      childs: this.data.childList
    }
    wx.showLoading({
      title: '提交中...',
    })
    request('user/subfeedback', params).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: res.data.msg
      })
      wx.navigateBack()
    })
  },
  // 选择图片或视频
  btnClick(data) {
    let self = this
    if (data.detail.value == 1) {
      if (this.data.childLength != 5) {
        wx.showModal({
          title: '上传提示',
          content: '如果选择图片，将清空已经上传的视频',
          success: res => {
            if (res.confirm) {
              self.setData({
                childList: [],
                childLength: 5,
                resType: 1,
                showActionsheet: false
              })
              // 选择图片
              this.chooseImage()
            }
          }
        })
      } else {
        self.setData({
          childLength: 5,
          resType: 1,
          showActionsheet: false
        })
        // 选择图片
        this.chooseImage()
      }
    } else {
      if (this.data.childLength != 1) {
        wx.showModal({
          title: '上传提示',
          content: '如果选择视频，将清空已经上传的图片',
          success: res => {
            if (res.confirm) {
              self.setData({
                childList: [],
                childLength: 1,
                resType: 2,
                showActionsheet: false
              })
              // 选择视频
              this.chooseVideo()
            }
          }
        })
      } else {
        self.setData({
          childList: [],
          childLength: 1,
          resType: 2,
          showActionsheet: false
        })
        // 选择视频
        this.chooseVideo()
      }
    }
  },
  // 打开弹出啊菜单
  chooseImageOrVideo() {
    this.setData({
      showActionsheet: !this.data.showActionsheet
    })
  },
  // 预览
  viewImage(e) {
    wx.previewImage({
      urls: this.data.childList,
      current: e.currentTarget.dataset.url
    });
  },
  // 删除图片
  delImg(e) {
    wx.showModal({
      title: '删除图片',
      content: `确定要删除这个${this.data.childLength==1?'视频':'图片'}吗？`,
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.childList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            childList: this.data.childList
          })
        }
      }
    })
  },
  // 选择图片
  chooseImage() {
    let self = this
    wx.chooseImage({
      count: 5, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        self.uploadeFile(tempFilePaths[0])
      }
    });
  },
  // 选择视频
  chooseVideo() {
    let self = this
    wx.chooseVideo({
      sourceType: ['album'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        self.uploadeFile(tempFilePaths[0])
      }
    });
  },
  // 上传文件
  uploadeFile(filePath) {
    wx.showLoading({
      title: '上传中...',
    })
    let self = this
    wx.uploadFile({
      url: 'https://m.quickssend.com/wechaapplet/api/base/uploadone', //仅为示例，非真实的接口地址
      filePath: filePath,
      name: 'file',
      // formData: {
      // 	'file': tempFilePaths[0]
      // },
      success (res){
        wx.hideLoading()
        const data = JSON.parse(res.data)
        let arr = [].concat(self.data.childList)
        arr.push({
          resUrl: data.data.reqUrl,
          resType: self.data.params.resType
        })
        self.setData({
          'childList': arr
        })
        console.log('upload file:', self.data.childList)
      },
      fail (err) {
        console.log('upload file fail', err)
      }
    })
  },
})