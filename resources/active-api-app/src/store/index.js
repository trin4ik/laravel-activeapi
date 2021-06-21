import AppStore from "./app";
import RouterStore from "./router";
import VarsStore from "./vars";
import RequestStore from "./request";
import {reaction, toJS} from "mobx"
import AsyncStorage from "@react-native-async-storage/async-storage";

class Store {
    constructor() {
        this.app = new AppStore(this)
        this.router = new RouterStore(this)
        this.vars = new VarsStore(this)
        this.request = new RequestStore(this)

        this.loadVars();

        reaction(
            () => toJS(this.vars.server),
            async vars => {
                await AsyncStorage.setItem('@store.vars.server', JSON.stringify(vars))
            }
        )
    }

    loadVars = async () => {
        const result = await AsyncStorage.getItem('@store.vars.server')
        const vars = result != null ? JSON.parse(result) : null;
        if (vars) {
            Object.entries(vars).map(([key, value]) => {
                this.vars.add(key, value, {notify: false});
            })
        }
    }
}

export default Store
