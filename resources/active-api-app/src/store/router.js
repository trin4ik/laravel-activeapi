import {makeObservable, observable, action} from "mobx";

class RouterStore {

    home = true
    controller = false
    action = false

    constructor(store) {
        makeObservable(this, {
            home: observable,
            controller: observable,
            action: observable,
            setHome: action,
            setController: action,
            setAction: action
        })
        this.store = store
    }

    setHome = () => {
        this.home = true
        this.controller = false
        this.action = false
    }

    setController = (controller) => {
        this.home = false
        this.controller = controller
    }

    setAction = (action) => {
        this.home = false
        this.action = action
    }
}

export default RouterStore;
