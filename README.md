# Westore

世界上最小的小程序框架 - [28 行代码](https://github.com/dntzhang/westore/blob/master/utils/create.js)搞定全局状态管理和跨页通讯

## 使用指南

### 定义全局 store

```js
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
```

### 创建页面

```js
import store from '../../store'
import create from '../../utils/create'

const app = getApp()

create(Page, store, {

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
```
## 更新页面

```js
this.store.any_prop_you_want_to_change = 'any_thing_you_want_change_to'
this.store.update()
```

## 创建组件

```js

import create from '../../utils/create'

// components/hello/hello.js
create(Component, {

})

```

## 更新组件

```js
this.store.any_prop_you_want_to_change = 'any_thing_you_want_change_to'
this.store.update()
```

## License
MIT @dntzhang
