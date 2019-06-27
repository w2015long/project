const util = require('../../../utils/util.js');
const LAST_CONNECTED_DEVICE = 'last_connected_device';

Component({
  /**
   * 组件的属性列表
   * 使用 this.data 可以获取内部数据和属性值，但不要直接修改它们，应使用 setData 修改。
   */
  properties: {
    isInitPrint: { //是否初始化时 就打印
      type:Boolean,
      value:false ,
      observer: function(newVal, oldVal) {
        // 属性值变化时执行
        this.changeFatherData();
      }
    },
    connected: { //是否连接了到蓝牙
      type:Boolean,
      value:false ,
      observer: function(newVal, oldVal) {
        // 属性值变化时执行
        this.changeFatherData();
      }
    },
    canWrite: { //是否可写
      type:Boolean,
      value:false ,
      observer: function(newVal, oldVal) {
        // 属性值变化时执行
        this.changeFatherData();
      }
    },
    isShowBlueTooth:{// 是否显示
      type:Boolean,
      value:'',
      observer: function(newVal, oldVal) {
        // 属性值变化时执行
        this.changeFatherData();
      }
    },
  },


  data: {
    lastDevice:false,
    devices: [],
    failureCause:'',//失败原因
  },

  // 组件所在页面的生命周期
  pageLifetimes: {
    show() {
      // 尝试从缓存获取最后连接的蓝牙终端
      const lastDevice = wx.getStorageSync(LAST_CONNECTED_DEVICE);
      this.setData({
        lastDevice: lastDevice
      });
    },
  },

  methods: {
    // 改变父组件data
    changeFatherData: function () {
      this.triggerEvent("action", {
        canWrite: this.data.canWrite,
        connected: this.data.connected,
        isShowBlueTooth: this.data.isShowBlueTooth,
      });
    },
    /**
     * 打印小票（可能包含二维码）
     */
    print: function (buffer){
      let self = this;
      if(!this._deviceId || !this._serviceId || !this._characteristicId){
        self.connectionStatusModal(false,0,'打印失败');
        return;
      }
      console.log('ArrayBuffer', 'length: ' + buffer.byteLength, ' hex: ' + util.ab2hex(buffer));
      // 1.并行调用多次会存在写失败的可能性
      // 2.建议每次写入不超过20字节
      // 分包处理，延时调用
      const maxChunk = 20;
      const delay = 20;
      for (let i = 0, j = 0, length = buffer.byteLength; i < length; i += maxChunk, j++) {
        let subPackage = buffer.slice(i, i + maxChunk <= length ? (i + maxChunk) : length);
        setTimeout(this._writeBLECharacteristicValue.bind(self), j * delay, subPackage);
      }
      util.showConfirm('提示',"打印结束");
    },
    _writeBLECharacteristicValue(buffer) {
      let self = this;
      console.log(this._deviceId);
      console.log(this._serviceId);
      console.log(this._characteristicId);
      wx.writeBLECharacteristicValue({
        deviceId: this._deviceId,
        serviceId: this._serviceId,
        characteristicId: this._characteristicId,
        value: buffer,
        success(res) {
          console.log('writeBLECharacteristicValue success', res);
          return true;
        },
        fail(res) {
          console.log('writeBLECharacteristicValue fail', res);
          self.connectionStatusModal(false,res.errCode);
          return false;
        }
      })
    },

    /**
     * 直接连接
     */
    createBLEConnectionWithDeviceId() {
      let self = this;
      // 小程序在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备
      const device = this.data.lastDevice;
      if (!device) {
        return
      }
      const index = device.indexOf(':');
      const name = device.substring(0, index);
      const deviceId = device.substring(index + 1, device.length);
      console.log('createBLEConnectionWithDeviceId', name + ':' + deviceId);
      this._openBluetoothAdapter(this._createBLEConnection(deviceId, name));
    },
    /**
     * 点击连接扫描到设备
     * @param e
     */
    createBLEConnection(e) {
      const ds = e.currentTarget.dataset;
      const deviceId = ds.deviceId;
      const name = ds.name;
      this._createBLEConnection(deviceId, name)
    },
    /**
     * 创建蓝牙连接
     */
    _createBLEConnection(deviceId, name) {
      wx.showLoading();
      wx.createBLEConnection({
        deviceId,
        success: () => {
          console.log('createBLEConnection success');
          this.setData({
            isShowBlueTooth: false,
            connected: true,
            name,
            deviceId,
          });
          this._getBLEDeviceServices(deviceId);
          wx.setStorage({
            key: LAST_CONNECTED_DEVICE,
            data: name + ':' + deviceId
          });
        },
        complete() {
          wx.hideLoading()
        },
        fail: (res) => {
          console.log('createBLEConnection fail', res);
          if (res.errMsg === "createBLEConnection:fail:already connect"){
            this.setData({
              isShowBlueTooth: false,
              connected: true,
              name,
              deviceId,
            });
            this._getBLEDeviceServices(deviceId);
          }else{
             if(res.errCode){
               console.log(res.errCode)
                 this.connectionStatusModal(false,res.errCode);
             }
            // 显示蓝牙扫描
            this.setData({
              isShowBlueTooth:true
            })
          }
        }
      });
      this.stopBluetoothDevicesDiscovery()
    },
    /**
     * 获取蓝牙设备所有服务(service)
     * @param deviceId  蓝牙设备 id
     */
    _getBLEDeviceServices(deviceId) {
      wx.getBLEDeviceServices({
        deviceId,
        success: (res) => {
          console.log('getBLEDeviceServices', res);
          for (let i = 0; i < res.services.length; i++) {
            if (res.services[i].isPrimary) {
              this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid);
              return
            }
          }
        }
      })
    },
    /**
     * 获取蓝牙设备某个服务中所有特征值(characteristic)
     * @param deviceId 蓝牙设备 id
     * @param serviceId 蓝牙服务 uuid，需要使用 getBLEDeviceServices 获取
     */
    getBLEDeviceCharacteristics(deviceId, serviceId) {
      wx.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: (res) => {
          console.log('getBLEDeviceCharacteristics success', res.characteristics);
          // 这里会存在特征值是支持write，写入成功但是没有任何反应的情况
          // 只能一个个去试
          for (let i = 0; i < res.characteristics.length; i++) {
            const item = res.characteristics[i];
            if (item.properties.write) {
              console.log("writeItem");
              console.log(item);
              this.setData({
                canWrite: true
              });
              this._deviceId = deviceId;
              this._serviceId = serviceId;
              this._characteristicId = item.uuid;
              break;
            }
          }

          if(this.data.isInitPrint){
            // 打印小票
            this.triggerEvent("print");
          }
        },
        fail(res) {
          console.error('getBLEDeviceCharacteristics', res)
          this.connectionStatusModal(false,res.errCode,'打印失败！');
        }
      })
    },
    /**
     * 停止扫描
     */
    stopBluetoothDevicesDiscovery() {
      wx.stopBluetoothDevicesDiscovery({
        complete: () => {
          console.log('stopBluetoothDevicesDiscovery');
          this._discoveryStarted = false
        }
      })
    },
    /**
     * 开启蓝牙扫描
     */
    startBluetoothScanning() {
      let self = this;
      if (!wx.openBluetoothAdapter) {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        });
        return;
      }
      this._openBluetoothAdapter(this._startBluetoothDevicesDiscovery());
    },
    /**
     * 开始扫描蓝牙外围设备
     */
    _startBluetoothDevicesDiscovery() {
      if (this._discoveryStarted) {
        return;
      }
      this._discoveryStarted = true;
      wx.startBluetoothDevicesDiscovery({
        success: (res) => {
          console.log('startBluetoothDevicesDiscovery success', res);
          this._onBluetoothDeviceFound()
        },
        fail: (res) => {
          console.log('startBluetoothDevicesDiscovery fail', res)
          if(!res.errCode){
            this.connectionStatusModal(false,10004);
          }else{
            this.connectionStatusModal(false,res.errCode);
          }
        }
      })
    },
    _onBluetoothDeviceFound() {
      wx.onBluetoothDeviceFound((res) => {
        res.devices.forEach(device => {
          if (!device.name && !device.localName) {
            return
          }
          const foundDevices = this.data.devices;
          const idx = util.inArray(foundDevices, 'deviceId', device.deviceId);
          const data = {};
          if (idx === -1) {
            data[`devices[${foundDevices.length}]`] = device
          } else {
            data[`devices[${idx}]`] = device
          }
          this.setData(data)
        })
      })
    },
    /**
     * 初始化蓝牙模块
     * @param callBack 回调
     * @private
     */
    _openBluetoothAdapter(callBack=()=>{}){
      let self = this;
      wx.openBluetoothAdapter({
        success: (res) => {
          console.log('openBluetoothAdapter success', res);
          callBack();
        },
        fail: (res) => {
          console.log('openBluetoothAdapter fail', res);
          wx.showModal({
            title: '错误',
            content: '未找到蓝牙设备, 请打开蓝牙后重试。',
            showCancel: false
          });
          if (res.errCode === 10001) {
            wx.onBluetoothAdapterStateChange((res) => {
              console.log('onBluetoothAdapterStateChange', res);
              if (res.available) {
                // 取消监听，否则stopBluetoothDevicesDiscovery后仍会继续触发onBluetoothAdapterStateChange，
                // 导致再次调用startBluetoothDevicesDiscovery
                wx.onBluetoothAdapterStateChange(() => {
                });
                callBack()
              }
            })
          }
        }
      });
      wx.onBLEConnectionStateChange((res) => {
        // 该方法回调中可以用于处理连接意外断开等异常情况
        console.log('onBLEConnectionStateChange', `device ${res.deviceId} state has changed, connected: ${res.connected}`);
        self.connectionStatusModal(res.connected,0,'蓝牙连接已断开');
      });
    },
    /**
     * 蓝牙连接提示
     * @param isConnected boolean 是否连接
     * @param errorCode 错误码
     * @param msg  消息
     */
    connectionStatusModal(isConnected,errorCode = 0,msg = '操作成功') {
      if(0 !== errorCode){
        msg = this._getBLEErrorMsg(errorCode);
      }

      this.setData({
        connected: isConnected
      });
      if (!isConnected) {
        util.showConfirm('提示',msg);
      }
    },
    /**
     * 获取蓝牙错误信息
     */
    _getBLEErrorMsg(errorCode){
      switch(errorCode){
        case 10000 :
          return "蓝牙设备未初始化,请稍后重试";
        case 10001 :
          return "未找到蓝牙设备,请打开蓝牙后重试";
        case 10002 :
          return "没有找到指定蓝牙设备,请检查设备是否启动";
        case 10003 :
          return "连接失败,请检查设备是否正常";
        case 10004 :
          return "没有找到指定服务";
        case 10005 :
          return "没有找到指定特征值";
        case 10006 :
          return "当前连接已断开";
        case 10007 :
          return "当前特征值不支持此操作";
        case 10008 :
          return "当前操作失败,请联系管理员";
        case 10009 :
          return "Android 系统特有，系统版本低于 4.3 不支持 BLE";
        case 10012:
          return "连接超时";
        case 10013:
          return "连接 deviceId 为空或者是格式不正确";
        default    :
          return "未知异常"+errorCode;
      }
    },
    /**
     * 关闭蓝牙模块
     */
    closeBluetoothAdapter() {
      wx.closeBluetoothAdapter();
      this._discoveryStarted = false
    },
  },
});
