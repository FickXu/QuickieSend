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
    title: '选择收货地址',
    addressList: [],
    currentAddressId: '',
    // 联系人
    contact: '',
    contactAddress: '',
    mobilePhone: '',
    isEdit: false,
    hospitals: [
      {
        id: 1,
        name: '湘雅三医院'
      },
      {
        id: 2,
        name: '市妇幼'
      }
    ],
    hospitalIndex: -1,
    buildings: [
      {
        id: 1,
        name: '1#'
      },
      {
        id: 2,
        name: '2#'
      }
    ],
    buildingIndex: -1,
    floors: [
      {
        id: 1,
        name: '1L'
      },
      {
        id: 2,
        name: '2L'
      }
    ],
    floorIndex: -1,
    params: {
      id: '',
      // 医院id
      areaTypeOne: '',
      // 医院名称
      areaTypeOneName: '',
      // 楼层id
      areaTypeThree: '',
      // 楼层名称
      areaTypeThreeName: '',
      // 楼栋id
      areaTypeTwo: '',
      // 楼栋名称
      areaTypeTwoName: '',
      // 联系人
      contact: '',
      // 联系地址
      contactAddress: '',
      // 电话号码
      mobilePhone: '',
      // 商家id
      shopId: 0,
      // 是否为默认地址
      isDefault: 0
    }
  },
  onLoad() {
    
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendData', data => {
      this.setData({
        isEdit: data.isEdit,
        params: data.isEdit ? data : this.data.params
      })

      if (data.isEdit) {
        this.queryInfo()
      }

      console.log(this.data.isEdit, this.data.params)
    })
  },

  // 获取收货地址详情
  queryInfo() {
    let params = {
      ...this.data.params
    }

    this.setData({
      // 医院
      hospitalIndex: this.data.hospitals.findIndex(item => item.id == params.areaTypeOne),
      // 楼栋
      buildingIndex: this.data.buildings.findIndex(item => item.id == params.areaTypeTwo),
      // 楼层
      floorIndex: this.data.floors.findIndex(item => item.id == params.areaTypeThree),
    })

    console.log(this.data.hospitals.findIndex(item => item.id == params.areaTypeOne))

  },

  // // 拼接地址
  // joinAddress() {
  //   let params = this.data.params
  //   this.setData({
  //     'params.contactAddress': `${params.areaTypeOneName} ${params.areaTypeTwoName} ${params.areaTypeThreeName} ${params.contactAddress}`
  //   })
  // },

  // 表单输入
  bindinput(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    if (key == 'contact') {
      this.setData({
        'params.contact': value
      })
    }
    if (key == 'mobilePhone') {
      this.setData({
        'params.mobilePhone': value
      })
    }
    if (key == 'contactAddress') {
      this.setData({
        'params.contactAddress': value
      })

      console.log(this.data.params.contactAddress)
    }
  },

  // 是否为默认地址
  switchChange(e) {
    this.setData({
      'params.isDefault': e.detail.value ? 0 : 1
    })
  },

  // 选择医院
  regionChange1(e) {
    let index = e.detail.value

    this.setData({
      hospitalIndex: index,
      'params.areaTypeOne': this.data.hospitals[index].id,
      'params.areaTypeOneName': this.data.hospitals[index].name
    })
  },

  // 选择楼栋
  regionChange2(e) {
    let index = e.detail.value

    this.setData({
      buildingIndex: index,
      'params.areaTypeTwo': this.data.buildings[index].id,
      'params.areaTypeTwoName': this.data.buildings[index].name
    })
  },

  // 选择楼层
  regionChange3(e) {
    let index = e.detail.value

    this.setData({
      floorIndex: index,
      'params.areaTypeThree': this.data.floors[index].id,
      'params.areaTypeThreeName': this.data.floors[index].name
    })
  },
  
  // 保存收货地址（新增或编辑）
  saveAddress() {
    let self = this
    
    // this.joinAddress()

    let params = {
      ...this.data.params
    }

    let api = ''
    if (this.data.isEdit) {
      api = 'user/address/update'
    } else {
      api = 'user/address/add'
    }

    request(api, params).then(res => {
      if (res.data.code == 10000) {
        wx.showToast({
          title: res.data.msg,
          success() {
            // 返回列表
            const eventChannel = self.getOpenerEventChannel()
            eventChannel.emit('refresh')
            wx.navigateBack()
          }
        })
      }
    })
  },
})