import diff from './diff'

let originData = null
let diffResult = null

export default function create(store, option) {
    if (arguments.length === 2) {
        if (!originData) originData = JSON.parse(JSON.stringify(store.data))
        option.data = store.data
        const onLoad = option.onLoad
        option.onLoad = function () {
            this.store = store
            rewriteUpdate(this)
            onLoad && onLoad.call(this)
        }
        Page(option)
    } else {
        const ready = store.ready
        store.ready = function () {
            this.page = getCurrentPages()[getCurrentPages().length - 1]
            this.store = this.page.store;
            this.setData.call(this, this.store.data)
            rewriteUpdate(this)
            ready && ready.call(this)
        }
        Component(store)
    }
}

function rewriteUpdate(ctx){
    const preUpdate = ctx.store.update
    if (preUpdate) {
        ctx.store.update = () => {
            if (!diffResult) {
                diffResult = diff(ctx.store.data, originData)
            }
            ctx.setData.call(ctx, diffResult)
            preUpdate()
            for (let key in diffResult) {
                updateOriginData(originData, key, diffResult[key])
            }
        }
    } else {
        ctx.store.update = () => {
            if (!diffResult) {
                diffResult = diff(ctx.store.data, originData)
            }
            ctx.setData.call(ctx, diffResult)
            for (let key in diffResult) {
                updateOriginData(originData, key, diffResult[key])
            }
            diffResult = null
        }
    }
}

function updateOriginData(origin, path, value) {
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
