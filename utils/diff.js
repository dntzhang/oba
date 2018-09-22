const ARRAYTYPE = '[object Array]'
const OBJECTTYPE = '[object Object]'
const FUNCTIONTYPE = '[object Function]'

export default function diff(current, pre) {
    const result = {}
    syncKeys(current, pre)
    _diff(current, pre, '', result)
    return result
}

function syncKeys(current, pre) {
    if (current === pre) return
    const rootCurrentType = type(current)
    const rootPreType = type(pre)
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        for (let key in pre) {
            const currentValue = current[key]
            if (currentValue === undefined) {
                current[key] = null
            } else {
                const preValue = pre[key]
                const currentType = type(currentValue)
                const preType = type(preValue)
                if (currentType == ARRAYTYPE && preType == ARRAYTYPE) {
                    if (currentValue.length >= preValue.length) {
                        preValue.forEach((item, index) => {
                            syncKeys(currentValue[index], item)
                        })
                    }
                } else if (currentType == OBJECTTYPE && preType == OBJECTTYPE) {
                    for (let subKey in preValue) {
                        syncKeys(currentValue, preValue)
                    }
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach((item, index) => {
                syncKeys(current[index], item)
            })
        }
    }
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
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue)
                        } else {
                            currentValue.forEach((item, index) => {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result)
                            })
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue)
                    } else {
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
            if (current.length < pre.length) {
                setResult(result, path, current)
            } else {
                current.forEach((item, index) => {
                    _diff(item, pre[index], path + '[' + index + ']', result)
                })
            }
        }
    } else {
        setResult(result, path, current)
    }
}

function setResult(result, k, v) {
    type(v) != FUNCTIONTYPE && (result[k] = v)
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

// console.log(diff({
//     a: 1, b: 2, c: "str", d: { e: [2, { a: 4 }, 5] }, f: true, h: [1], g: { a: [1, 2], j: 111 }
// }, {
//         a: [], b: "aa", c: 3, d: { e: [3, { a: 3 }] }, f: false, h: [1, 2], g: { a: [1, 1, 1], i: "delete" }, k: 'del'
//     }))
// {"a":1,"b":2,"c":"str","d.e[0]":2,"d.e[1].a":4,"d.e[2]":5,"f":true,"h":[1],"g.a":[1,2],"g.j":111}