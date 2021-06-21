import {action, makeObservable, observable, runInAction} from "mobx";

class VarsStore {

    server = {}

    constructor(store) {
        makeObservable(this, {
            server: observable,
            add: action,
            remove: action,
        })
        this.store = store
    }

    add = (name, value, options = {}) => {
        if (options.notify !== false) {
            this.store.app.addNotify('Переменная "' + name + '" установлена')
        }
        this.server[name] = value
    }

    remove = (name) => {
        this.store.app.addNotify('Переменная "' + name + '" удалена')
        delete this.server[name]
    }
}

export default VarsStore;
