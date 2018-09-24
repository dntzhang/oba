# Westore

> 世界上最小却强大的小程序框架 - [100多行代码](https://github.com/dntzhang/westore/blob/master/utils/create.js)搞定全局状态管理和跨页通讯

众所周知，小程序通过页面或组件各自的 setData 再加上各种父子、祖孙、姐弟、嫂子与堂兄等等组件间的通讯会把程序搞成一团浆糊，如果再加上跨页面之间的组件通讯，会让程序非常难维护和调试。虽然市面上出现了许多技术栈编译转小程序的技术，但是我觉没有戳中小程序的痛点。小程序不管从组件化、开发、调试、发布、灰度、回滚、上报、统计、监控和最近的云能力都非常完善，小程序的工程化简直就是前端的典范。而开发者工具也在持续更新，可以想象的未来，组件布局的话未必需要写代码了。所以最大的痛点只剩下状态管理和跨页通讯。

受 [Omi 框架](https://github.com/Tencent/omi) 的启发，且专门为小程序开发的 [JSON Diff 库](https://github.com/dntzhang/westore/blob/master/utils/diff.js)，所以有了 westore 全局状态管理和跨页通讯框架让一切尽在掌握中，且受高性能 JSON Diff 库的利好，长列表滚动加载显示变得轻松可驾驭。

* 超小的代码尺寸
* 高性能长列表显示和加载
* 和 Omi 同样简洁的 Store API
* 没有使用 Object.defineProperty 且重写数组所有方法的黑魔法，浪费内存不说且不是标准

---

- [使用指南](#使用指南)
	- [定义全局 store](#定义全局-store)
  - [创建页面](#创建页面)
  - [绑定数据](#绑定数据)
  - [更新页面](#更新页面)
  - [创建组件](#创建组件)
  - [更新组件](#更新组件)
  - [跨页面同步数据](#跨页面同步数据)
  - [超大型小程序最佳实践](#超大型小程序最佳实践两种方案)
- [原理](#原理)
  - [JSON Diff](#json-diff)
  - [Store Update 链](#store-update-链)
- [License](#license)

## 使用指南

### 定义全局 store

```js
export default {
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logs: []
  },
  logMotto: function () {
    console.log(this.data.motto)
  }
}
```

### 创建页面

```js
import store from '../../store'
import create from '../../utils/create'

const app = getApp()

create(store, {

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.store.data.userInfo = app.globalData.userInfo
      this.store.data.hasUserInfo = true
      this.store.update()
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.store.data.userInfo = res.userInfo
        this.store.data.hasUserInfo = true
        this.store.update()
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.store.data.userInfo = res.userInfo
          this.store.data.hasUserInfo = true
          this.store.update()
        }
      })
    }
  }

})
```

创建 Page 只需传入两个参数，store 从根节点注入，所有子组件都能通过 this.store 访问。

### 绑定数据

```jsx
<view class="container">
   
  <view class="userinfo">
    <button wx:if="{{!hasUserInfo && canIUse}}" open-type="getUserInfo" bindgetuserinfo="getUserInfo"> 获取头像昵称 </button>
    <block wx:else>
      <image bindtap="bindViewTap" class="userinfo-avatar" src="{{userInfo.avatarUrl}}" mode="cover"></image>
      <text class="userinfo-nickname">{{userInfo.nickName}}</text>
    </block>
  </view>
  <view class="usermotto">
    <text class="user-motto">{{motto}}</text>
  </view>

  <hello></hello>
</view>
```

和以前的写法没有差别，直接把 `store.data` 作为绑定数据源。 

### 更新页面

```js
this.store.data.any_prop_you_want_to_change = 'any_thing_you_want_change_to'
this.store.update()
```

### 创建组件

```js

import create from '../../utils/create'

create({
  ready: function () {
   //you can use this.store here
  },

  methods: {
    //you can use this.store here
  }
})

```
和创建 Page 不一样的是，创建组件只需传入一个参数，不需要传入 store，因为已经从根节点注入了。

### 更新组件

```js
this.store.data.any_prop_you_want_to_change = 'any_thing_you_want_change_to'
this.store.update()
```

### 跨页面同步数据

```js
this.store.update()
```

使用 westore 跨页通讯非常方便，改变完 store 的 data 之后，在任意页面执行 update 方法就可以了。

### 超大型小程序最佳实践(两种方案)

* 第一种方案，拆分 store 的 date 为不同模块，如:

```js
export default {
  data: {
    commonA: 'a',
    commonB: 'b',
    pageA: {
      a: 1
      xx: 'xxx'
    },
    pageB: {
      b: 2,
      c: 3
    }
  },
  xxx: function () {
    console.log(this.data)
  }
}
```

* 第二种方案，拆分 store 的 data 到不同文件且合并到一个 store 暴露给 create 方法，如：

a.js

```js
export default {
  data: {
    a: 1
    xx: 'xxx'
  },
  aMethod: function (num) {
    this.data.a += num
  }
}
```

b.js


```js
export default {
  data: {
    b: 2,
    c: 3
  },
  bMethod: function () {
    
  }
}
```

store.js

```js
import a from 'a.js'
import b from 'b.js'

export default {
  data: {
    commonNum: 1,
    commonB: 'b',
    pageA: a.data
    pageB: b.data
  },
  xxx: function () {
    //you can call the methods of a or b and can pass args to them
    console.log(a.aMethod(commonNum))
  },
  xx: function(){

  }
}
```

当然，也可以不用按照页面拆分文件或模块，也可以按照领域来拆分，这个很自由，视情况而定。

## 原理

### JSON Diff

先看一下我为 westore 专门定制开发的 [JSON Diff 库](https://github.com/dntzhang/westore/blob/master/utils/diff.js) 的能力:

``` js
diff({
    a: 1, b: 2, c: "str", d: { e: [2, { a: 4 }, 5] }, f: true, h: [1], g: { a: [1, 2], j: 111 }
}, {
    a: [], b: "aa", c: 3, d: { e: [3, { a: 3 }] }, f: false, h: [1, 2], g: { a: [1, 1, 1], i: "delete" }, k: 'del'
})
```

Diff 的结果是:

``` js
{ "a": 1, "b": 2, "c": "str", "d.e[0]": 2, "d.e[1].a": 4, "d.e[2]": 5, "f": true, "h": [1], "g.a": [1, 2], "g.j": 111, "g.i": null, "k": null }
```

![diff](./asset/diff.jpg)

Diff 原理:

* 同步所有 key 到当前 store.data
* 携带 path 和 result 递归遍历对比所有 key value

```
export default function diff(current, pre) {
    const result = {}
    syncKeys(current, pre)
    _diff(current, pre, '', result)
    return result
}
```
未完待续...

### 小程序 setData

setData 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）。

其中 key 可以以数据路径的形式给出，支持改变数组中的某一项或对象的某个属性，如 array[2].message，a.b.c.d，并且不需要在 this.data 中预先定义。比如：

```js
this.setData({
      'array[0].text':'changed data'
})
```

所以 diff 的结果可以直接传递给 `setData`，也就是 `this.store.update`。

### Store Update 链

马上更新...

## License
MIT [@dntzhang](https://github.com/dntzhang)
