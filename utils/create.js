const ARRAYTYPE = '[object Array]'
const OBJECTTYPE = '[object Object]'
const FUNCTIONTYPE = '[object Function]'
let originStore = null

export default function create(store, option) {
    if (arguments.length === 2) {
        if (!originStore) originStore = JSON.parse(JSON.stringify(store))
        option.data = store
        const onLoad = option.onLoad
        option.onLoad = function () {
            this.store = store
            const preUpdate = this.store.update
            this.store.update = () => {
                const result = diff(this.store, originStore)
                this.setData.call(this, result)
                preUpdate && preUpdate()
                for (let key in result) {
                    updateOriginStore(originStore, key, result[key])
                }
            }
            onLoad && onLoad.call(this)
        }
        Page(option)
    } else {
        const ready = store.ready
        store.ready = function () {
            this.page = getCurrentPages()[getCurrentPages().length - 1]
            this.store = this.page.store;
            this.setData.call(this, this.store)
            const preUpdate = this.store.update
            this.store.update = () => {
                const result = diff(this.store, originStore)
                this.setData.call(this, result)
                preUpdate && preUpdate()
                for (let key in result) {
                    updateOriginStore(originStore, key, result[key])
                }
            }
            ready && ready.call(this)
        }
        Component(store)
    }
}

function updateOriginStore(origin, path, value) {

    const arr = path.replace(/\[|(].)/g, '.').split('.')
    let current = origin

    for (let i = 0, len = arr.length; i < len; i++) {
        if (i === len - 1) {
            current[arr[i]] = value
        } else {
            current = current[arr[i]]
        }
    }
}

function diff(current, pre) {
    const result = {}
    _diff(current, pre, '', result)
    return result
}

function _diff(current, pre, path, result) {
    if (current === pre) return
    const rootCurrentType = type(current)
    const rootPreType = type(pre)
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE) {
            setResult(result, path, current)
        } else {
            for (let key in current) {
                const currentValue = current[key]
                const preValue = pre[key]
                const currentType = type(currentValue)
                const preType = type(preValue)
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue)
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue)
                    } else {
                        //diff array
                        currentValue.forEach((item, index) => {
                            _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result)
                        })
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue)
                    } else {
                        //diff obj
                        for (let subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result)
                        }
                    }
                }

            }
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current)
        } else {
            //diff array
            current.forEach((item, index) => {
                _diff(item, pre[index], path + '[' + index + ']', result)
            })
        }
    } else {
        setResult(result, path, current)
    }
}

function setResult(result, k, v) {
    if (type(v) != FUNCTIONTYPE) {
        result[k] = v
    }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

// console.log(JSON.stringify(diff({
//     a: 1, b: 2, c: "str", d: { e: [2, { a: 4 }, 5] }, f: true
// }, {
//         a: [], b: "aa", c: 3, d: { e: [3, { a: 3 }] }, f: false
//     })))
//{"a":1,"b":2,"c":"str","d.e[0]":2,"d.e[1].a":4,"d.e[2]":5,"f":true}