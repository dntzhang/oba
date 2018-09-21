import store from '../../store'
import create from '../../utils/create'

const app = getApp()

create(store, {

  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.store.userInfo = app.globalData.userInfo
      this.store.hasUserInfo = true
      this.store.update()
    } else if (this.data.canIUse) {

      app.userInfoReadyCallback = res => {
        this.store.userInfo = res.userInfo
        this.store.hasUserInfo = true
        this.store.update()
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.store.userInfo = res.userInfo
          this.store.hasUserInfo = true
          this.store.update()
        }
      })
    }
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.store.userInfo = e.detail.userInfo
    this.store.hasUserInfo = true
    this.store.update()
  }
})