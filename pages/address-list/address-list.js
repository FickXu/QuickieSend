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
    this.queryList()
  },
  // 获取收货地址列表
  queryList() {
    let params = {
      shopId: 0
    }
    let self = this

    request('user/address/list', params).then(res => {
      if (res.data.code == 10000) {
        self.setData({
          addressList: res.data.data,
        })
      }
    })
  },
  bindshow(e) {
    let id = e.currentTarget.dataset.id
    console.log(id, '=================================')
    this.setData({
      currentAddressId: id
    })
  },

  // 修改收货地址
  updateshopaddress() {
    wx.navigateTo({
      url: '../modify-address/modify-address',
      events: {
        refresh: () => {
          this.queryList()
        }
      },
      success: res => {
        let params = {
          isEdit: true,
          ...this.data.addressList[this.data.addressList.findIndex(item => item.id == this.data.currentAddressId)]
        }
        res.eventChannel.emit('sendData', params)
      }
    })
  },
  // 设置收货地址
  setAddress(e) {
    let index = e.currentTarget.dataset.index
    let currentAddress = this.data.addressList[index]
    let self = this

    let contactAddress = `${currentAddress.areaTypeOneName} ${currentAddress.areaTypeTwoName} ${currentAddress.areaTypeThreeName} ${currentAddress.contactAddress}`
    // 弹窗确认是否选择地址
    wx.showModal({
      title: '确认收货地址',
      content: `否将收货地址设置为：${contactAddress}。【点击“确定”按钮立刻下单，点击“取消”按钮更换地址】`,
      success (res) {
        if (res.confirm) {
          // url中的参数通过option.query接收；其他通过自定义事件通信
          const eventChannel = self.getOpenerEventChannel()
          eventChannel.emit('refreshAddresss', currentAddress)
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

    request('user/address/setdefault', params).then(res => {
      if (res.data.code == 10000) {
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
  addAddress() {
    // 新增地址
    wx.navigateTo({
      url: '../modify-address/modify-address',
      events: {
        refresh: () => {
          this.queryList()
        }
      },
      success: res => {
        let params = {
          isEdit: false,
        }
        res.eventChannel.emit('sendData', params)
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

    request('user/address/del', params).then(res => {
      if (res.data.code == 10000) {
        wx.showToast({
          title: res.data.msg,
          success() {
            self.queryList()
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
      this.updateshopaddress()

    } else {
      // 删除
      this.delshopaddress()
    }
    console.log('slide button tap', e.detail)
  }
})