# Westore

世界上最小的小程序框架 - 一共 28 行代码搞定全局状态管理

## 使用指南

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
    this.store.update()
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

  ready: function () {

  }

})

```

## 更新组件

```js
this.store.any_prop_you_want_to_change = 'any_thing_you_want_change_to'
this.store.update()
```

## License
MIT @dntzhang