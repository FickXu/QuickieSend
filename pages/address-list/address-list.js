import request from '../api/request'

const app = getApp();
// pages/home/home.js
Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    title: '收货地址',
    slideButtons: [
      {
        text: '设置为默认地址'
      },
      {
        text: '修改'
      },
      {
        type: 'warn',
        text: '删除'
      }
    ],
    addressList: [],
    currentAddressId: '',
    // 联系人
    contact: '',
    contactAddress: '',
    mobilePhone: '',
    isEdit: false
  },
  onLoad() {
    this.queryshopaddresslist()
  },
  // 获取收货地址列表
  queryshopaddresslist() {
    let params = {
      openId: app.globalData.openId
    }
    let self = this

    request('user/queryshopaddresslist', params).then(res => {
      if (res.data.code == 0) {
        self.setData({
          addressList: res.data.data,
        })
      }
    })
  },
  bindshow(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      currentAddressId: id
    })
  },
  // 选择收货地址
  chooseAddress() {
    let self = this
    wx.chooseAddress({
    	success: res => {
        self.setData({
          contact: res.userName,
          mobilePhone: res.telNumber,
          contactAddress: res.provinceName + ' ' + res.cityName + ' ' + res.countyName + ' ' + res.detailInfo
        })

        if (this.data.isEdit) {
          self.updateshopaddress()
        } else {
          self.saveshopaddress()
        }
    	},
    	fail: err => {
    		console.log('md:', err)
    	}
    })
  },
  // 修改收货地址
  updateshopaddress() {
    let self = this
    let params = {
      id: this.data.currentAddressId,
      contact: this.data.contact,
      contactAddress: this.data.contactAddress,
      isDefault: 0, // 1,非默认;0,默认
      mobilePhone: this.data.mobilePhone,
      openId: app.globalData.openId
    }

    request('user/updateshopaddress', params).then(res => {
      if (res.data.code == 0) {
        wx.showToast({
          title: res.data.msg,
          success() {
            self.queryshopaddresslist()
          }
        })
      }
    })
  },
  // 设置收货地址
  setAddress(e) {
    let index = e.currentTarget.dataset.index
    let currentAddress = this.data.addressList[index]
    let self = this

    // 弹窗确认是否选择地址
    wx.showModal({
      title: '确认收货地址',
      content: `否将收货地址设置为：${currentAddress.contactAddress}。【点击“确定”按钮立刻下单，点击“取消”按钮更换地址】`,
      success (res) {
        if (res.confirm) {
          // url中的参数通过option.query接收；其他通过自定义事件通信
          const eventChannel = self.getOpenerEventChannel()
          eventChannel.emit('setShippingAddress', currentAddress)
          wx.navigateBack()
        }
      }
    })
  },
  // 设置默认地址
  setdefaultshopaddress() {
    let self = this
    let params = {
      id: this.data.currentAddressId,
      openId: app.globalData.openId
    }

    request('user/setdefaultshopaddress', params).then(res => {
      if (res.data.code == 0) {
        wx.showToast({
          title: res.data.msg,
          success() {
            self.queryshopaddresslist()
          }
        })
      }
    })
  },
  // 新增收货地址
  saveshopaddress() {
    let self = this
    let params = {
      contact: this.data.contact,
      contactAddress: this.data.contactAddress,
      isDefault: 0, // 1,非默认;0,默认
      mobilePhone: this.data.mobilePhone,
      openId: app.globalData.openId
    }

    // 新增地址
    this.setData({
      isEdit: false
    })

    request('user/saveshopaddress', params).then(res => {
      if (res.data.code == 0) {
        wx.showToast({
          title: res.data.msg,
          success() {
            self.queryshopaddresslist()
          }
        })
      }
    })
  },
  // 删除收货地址
  delshopaddress() {
    let self = this
    let params = {
      id: this.data.currentAddressId,
      openId: app.globalData.openId
    }

    request('user/delshopaddress', params).then(res => {
      if (res.data.code == 0) {
        wx.showToast({
          title: res.data.msg,
          success() {
            self.queryshopaddresslist()
          }
        })
      }
    })
  },
  slideButtonTap(e) {
    let btnIndex = e.detail.index

    if (btnIndex == 0) {
      // 设置默认地址
      this.setdefaultshopaddress()
    } else if(btnIndex == 1) {
      // 编辑地址
      this.setData({
        isEdit: true
      })
      this.chooseAddress()

    } else {
      // 删除
      this.delshopaddress()
    }
    console.log('slide button tap', e.detail)
  }
})