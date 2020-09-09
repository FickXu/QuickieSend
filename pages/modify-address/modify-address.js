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
    hospitals: [],
    hospitalIndex: -1,
    buildings: [],
    buildingIndex: -1,
    floors: [],
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
      contact: wx.getStorageSync('userInfo').nickName,
      // 联系地址
      contactAddress: '',
      // 电话号码
      mobilePhone: wx.getStorageSync('userInfo').telephone,
      // 商家id
      shopId: '',
      // 是否为默认地址
      isDefault: 0
    },
    // 所有的医院列表
    hospitalArray: [],
    // 当前绑定的数据
    multiArray: [],
    // 当前选中的下标
    multiIndex: [0, 0, 0]
  },
  onLoad() {
    let shopId = wx.getStorageSync('shopDetails').shopId
    this.setData({
      'params.shopId': shopId
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendData', data => {
      this.setData({
        isEdit: data.isEdit,
        params: data.isEdit ? data : this.data.params
      })
      // if (data.isEdit) {
      //   this.queryInfo()
      // }
      // console.log(this.data.isEdit, this.data.params)
      this.getHospitalList()
    })
    // this.getShopAreaList({
    //   parentId: 0, 
    //   shopId: wx.getStorageSync('shopDetails').shopId
    // }, 'hospital')
    // this.getHospitalList()
  },
  // 获取所有的医院列表
  getHospitalList() {
    let params = {
      parentId: 0,
      shopId: wx.getStorageSync('shopDetails').shopId
    }
    request('shop/getshoparea', params).then(res => {
      let data = res.data.data
      this.setData({
        hospitalArray: data,
        multiArray: [data, data[0].children, data[0].children[0].children]
      })
      // 编辑是回显地址
      if (this.data.params.isEdit) {
        this.setData({
          multiIndex: this.data.params.multiindex.split(',')
        })
      }
      this.setParams([0, 0, 0])
    })
  },
  // 选择地址
  bindMultiPickerChange(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setParams(e.detail.value)
  },
  // 设置参数
  setParams(arr) {
    let _hospitalArray = this.data.hospitalArray
    this.setData({
      // 医院
      'params.areaTypeOne': _hospitalArray[arr[0]].id,
      'params.areaTypeOneName': _hospitalArray[arr[0]].areaName,
      // 楼栋
      'params.areaTypeTwo': _hospitalArray[arr[0]].children[arr[1]].id,
      'params.areaTypeTwoName': _hospitalArray[arr[0]].children[arr[1]].areaName,
      // 楼层
      'params.areaTypeThree': _hospitalArray[arr[0]].children[arr[1]].children[arr[2]].id,
      'params.areaTypeThreeName': _hospitalArray[arr[0]].children[arr[1]].children[arr[2]].areaName,
    })
    console.log(this.data.params, this.data.multiIndex)
  },
  // 列选择变化时
  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    let columnIndex = e.detail.column
    let columnValueIndex = e.detail.value
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[columnIndex] = columnValueIndex
    let _hospitalArray = this.data.hospitalArray
    switch (columnIndex) {
      // 第一列
      case 0:
        data.multiArray[1] = _hospitalArray[columnValueIndex].children
        data.multiArray[2] = _hospitalArray[columnValueIndex].children[0].children
        data.multiIndex[1] = 0
        data.multiIndex[2] = 0
        break;
      case 1:
        data.multiArray[2] = _hospitalArray[data.multiIndex[0]].children[columnValueIndex].children
        data.multiIndex[2] = 0
        break
      default:
        console.log('选择了(columnIndex,columnValueIndex)：', columnIndex, columnValueIndex)
        break
    }
    this.setData({
      multiArray: data.multiArray,
      multiIndex: data.multiIndex
    })
  },
  // 获取商家区域
  // getShopAreaList(params, areaFlag) {
  //   let obj = {
  //     ...params
  //   }
  //   request('shop/getshoparea', obj).then(res => {
  //     if (areaFlag === 'hospital') {
  //       this.setData({
  //         hospitals: res.data.data
  //       })
  //     }
  //     if (areaFlag === 'build') {
  //       this.setData({
  //         buildings: res.data.data
  //       })
  //     }
  //     if (areaFlag === 'floor') {
  //       this.setData({
  //         floors: res.data.data
  //       })
  //     }
  //   })
  // },

  // 获取收货地址详情
  queryInfo() {
    let params = {
      ...this.data.params
    }
    this.setData({
      // 医院
      'params.areaTypeOne': params.areaTypeOne,
      'params.areaTypeOneName': params.areaTypeOneName,
      // 楼栋
      'params.areaTypeTwo': params.areaTypeTwo,
      'params.areaTypeTwoName': params.areaTypeTwoName,
      // 楼层
      'params.areaTypeThree': params.areaTypeThree,
      'params.areaTypeThreeName': params.areaTypeThreeName,
      
    })
    this.getShopAreaList({
      parentId: params.areaTypeOne, 
      shopId: this.data.params.shopId
    }, 'build')
    this.getShopAreaList({
      parentId: params.areaTypeTwo, 
      shopId: this.data.params.shopId
    }, 'floor')

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
      'params.areaTypeOneName': this.data.hospitals[index].areaName,
      'params.areaTypeTwo': '',
      'params.areaTypeTwoName': '',
      'params.areaTypeThree': '',
      'params.areaTypeThreeName': ''
    })
    this.getShopAreaList({
      parentId: this.data.hospitals[index].id, 
      shopId: this.data.params.shopId
    }, 'build')
  },

  // 选择楼栋
  regionChange2(e) {
    let index = e.detail.value

    this.setData({
      buildingIndex: index,
      'params.areaTypeTwo': this.data.buildings[index].id,
      'params.areaTypeTwoName': this.data.buildings[index].areaName,
      'params.areaTypeThree': '',
      'params.areaTypeThreeName': ''
    })
    this.getShopAreaList({
      parentId: this.data.buildings[index].id, 
      shopId: this.data.params.shopId
    }, 'floor')
  },

  // 选择楼层
  regionChange3(e) {
    let index = e.detail.value

    this.setData({
      floorIndex: index,
      'params.areaTypeThree': this.data.floors[index].id,
      'params.areaTypeThreeName': this.data.floors[index].areaName
    })
  },
  
  // 保存收货地址（新增或编辑）
  saveAddress() {
    let self = this
    
    // this.joinAddress()

    let params = {
      ...this.data.params,
      multiindex: this.data.multiIndex.join(',')
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