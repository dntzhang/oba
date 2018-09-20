export default {
  motto: 'Hello World',
  userInfo: {},
  hasUserInfo: false,
  canIUse: wx.canIUse('button.open-type.getUserInfo'),
  logs: [],
  logMotto:function(){
    console.log(this.motto)
  }
}