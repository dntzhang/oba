# Westore

世界上最小的小程序框架 - [29 行代码](https://github.com/dntzhang/westore/blob/master/utils/create.js)搞定全局状态管理和跨页通讯

总所周知，小程序通过组件各自的 setData 再加上各种父子、祖孙、姐弟、嫂子与堂兄等等组件间的通讯会把程序搞成一团浆糊，所以有了 westore 全局状态管理和跨页通讯框架。

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
  }
})
```

store 从根节点注入，所有子组件都能通过 this.store 访问。

## 更新页面

```js
this.store.any_prop_you_want_to_change = 'any_thing_you_want_change_to'
this.store.update()
```

## 创建组件

```js

import create from '../../utils/create'

create(Component, {

})

```
和创建 Page 不一样的是，创建组件只需传入两个参数，不需要传入 store，因为已经从根节点注入了。

## 更新组件

```js
this.store.any_prop_you_want_to_change = 'any_thing_you_want_change_to'
this.store.update()
```

## 跨页面同步数据

```js
  onShow:function(){
    this.store.update()
  }
```

在 onShow 的时候更新一下 store 就可以了。

## License
MIT @dntzhang
