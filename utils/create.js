export default function create(ctor, store, option) {
    if (ctor === Page) {
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
    } else if (ctor === Component) {
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
    }
    ctor(option || store)
}