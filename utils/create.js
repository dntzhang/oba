export default function create(store, option) {
    if (arguments.length === 2) {
        option.data = store
        const onLoad = option.onLoad
        option.onLoad = function () {
            this.store = store
            const preUpdate = this.store.update
            this.store.update = () => {
                this.setData.call(this, this.store)
                preUpdate && preUpdate()
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
                this.setData.call(this, this.store)
                preUpdate()
            }
            ready && ready.call(this)
        }
        Component(store)
    }
}