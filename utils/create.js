import diff from './diff'

let originStore = null
let diffResult = null

export default function create(store, option) {
    if (arguments.length === 2) {
        if (!originStore) originStore = JSON.parse(JSON.stringify(store))
        option.data = store
        const onLoad = option.onLoad
        option.onLoad = function () {
            this.store = store
            const preUpdate = this.store.update
            if (preUpdate) {
                this.store.update = () => {
                    if (!diffResult) {
                        diffResult = diff(this.store, originStore)
                    }
                    this.setData.call(this, diffResult)
                    preUpdate()
                    for (let key in diffResult) {
                        updateOriginStore(originStore, key, diffResult[key])
                    }
                }
            } else {
                this.store.update = () => {
                    if (!diffResult) {
                        diffResult = diff(this.store, originStore)
                    }
                    this.setData.call(this, diffResult)
                    for (let key in diffResult) {
                        updateOriginStore(originStore, key, diffResult[key])
                    }
                    diffResult = null
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
            if (preUpdate) {
                this.store.update = () => {
                    if (!diffResult) {
                        diffResult = diff(this.store, originStore)
                    }
                    this.setData.call(this, diffResult)
                    preUpdate()
                    for (let key in diffResult) {
                        updateOriginStore(originStore, key, diffResult[key])
                    }
                }
            } else {
                this.store.update = () => {
                    if (!diffResult) {
                        diffResult = diff(this.store, originStore)
                    }
                    this.setData.call(this, diffResult)
                    for (let key in diffResult) {
                        updateOriginStore(originStore, key, diffResult[key])
                    }
                    diffResult = null
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
