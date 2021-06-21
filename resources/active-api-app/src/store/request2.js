import { makeObservable, observable, action, toJS, runInAction, computed } from "mobx";
import axios from 'axios'
import { config } from './config'
import set from 'lodash/set'
import get from 'lodash/get'

class RequestStore {

    url = false
    fullUrl = false
    method = false
    header = {}
    data = {}
    param = {}
    paramStatus = {}
    response = false
    startTime = 0
    stopTime = 0
    raw = {}


    constructor (store) {
        makeObservable(this, {
            url: observable,
            fullUrl: observable,
            method: observable,
            header: observable,
            data: observable,
            raw: observable,
            param: observable,
            paramStatus: observable,
            startTime: observable,
            stopTime: observable,
            response: observable,
            setRequest: action,
            setData: action,
            setDataNull: action,
            addDataObject: action,
            reset: action,
            resetData: action,
            addHeader: action,
            removeHeader: action,
            setParam: action,
            setParamStatus: action,
            getData: computed,
            getUrl: computed,
            getFullUrl: computed,
            getRequestData: computed,
            getTable: computed,
        })
        this.store = store
    }

    setRequest = ({ url, fullUrl, method, header, data = {}, raw = {} }) => {
        this.url = url
        this.fullUrl = fullUrl
        this.method = method
        this.header = header
        this.data = data
        this.param = {}
        this.paramStatus = {}
        this.raw = raw
    }

    setData = (id, value, arrayIndex = false) => {
        const index = this.data.findIndex((item, i) => item.id === id)
        const item = this.raw.field.find(item => item.id === id)

        switch (item.type) {
            case 'array':
            case 'object': {
                if (arrayIndex !== false) {
                    if (value === false) {
                        this.data[index].value.splice(arrayIndex, 1)
                    } else {
                        if (this.data[index].value === null) {
                            this.data[index].value = []
                        }
                        this.data[index].value[arrayIndex] = value
                    }
                }
                break
            }
            default: {
                this.data[index].value = value
            }
        }
        this.data = [...this.data]
    }

    setDataNull = (id, isNull) => {
        const index = this.data.findIndex((item, i) => item.id === id)
        const item = this.raw.field.find(item => item.id === id)

        switch (item.type) {
            case 'array':
            case 'object': {
                this.data[index].value = isNull ? null : ['']
                break
            }
            default: {
                this.data[index].value = isNull ? null : ''
            }
        }

        this.data = [...this.data]
    }

    addDataObject = (id) => {
        const index = this.data.findIndex(item => item.id === id)
        const item = this.raw.field.find(item => item.id === id)

        this.data[index].children = [...this.data[index].children, toJS(item.item)[0]]

        this.data = [...this.data]
    }

    get getData () {
        return toJS(this.data)
    }

    getDataValue = (field, arrayIndex = false) => {
        /*let children = false
        if (id.indexOf('.*.') !== -1) {
            children = id.substr(id.indexOf('.*.') + 3);
            id = id.substr(0, id.indexOf('.*.'))
        }

        const index = this.data.findIndex((item, i) => item.id === id)
        const item = this.raw.field.find(item => item.id === id)

        switch (item.type) {
            case 'array': {
                if (!this.data[index].value || !(arrayIndex in this.data[index].value)) {
                    return null
                }
                return this.data[index].value[arrayIndex]
                break
            }
            case 'object': {
                if (!this.data[index].value || !(arrayIndex in this.data[index].value)) {
                    return null
                }
                return this.data[index].value[arrayIndex][children]
                break
            }
            default: {
                return this.data[index].value
            }
        }*/

        let value = ''
        const dot = field.indexOf('.')
        console.log(field, dot, field.substr(dot + 1).split('.'));
        if (dot !== -1) {
            value = field.substr(dot + 1).split('.').reduce((o, i) => o[i], this.data[field.substr(0, dot)].value)
        } else {
            value = this.data[field].value
        }

        return value
    }

    reset = () => {
        this.url = false
        this.fullUrl = false
        this.method = false
        this.header = {}
        this.data = {}
        this.raw = {}
        this.response = false
        this.param = {}
        this.paramStatus = {}
        this.startTime = 0
        this.stopTime = 0
    }

    resetData = () => {
        this.data = {}

        this.raw.field.map(item => {
            if (item.id.indexOf('.') !== -1) {
                item.id = item.id.replace('*', '0')
            }
            set(this.data, item.id, null)
        })

        console.log('ololo set', toJS(this.data));

        this.data = { ...this.data }
    }

    sendRequest = async () => {
        this.response = false
        this.startTime = Date.now()
        this.stopTime = Date.now()
        axios({
            url: this.getFullUrl,
            method: this.method,
            headers: this.header,
            data: this.getRequestData
        }).then(response => {
            console.log('response', JSON.stringify(response, null, 2));

            config.variable.map(vars => {
                if (vars.from.url === this.url) {
                    if (vars.data.eval.slice(0, 10) === '@response.') {
                        this.store.vars.add(vars.data.id, vars.data.eval.slice(10).split('.').reduce((o, i) => o[i], response.data))
                    }
                }
            })

            runInAction(() => {
                this.stopTime = Date.now()
                this.response = response
            })
        }).catch(error => {
            runInAction(() => {
                this.stopTime = Date.now()
                if (error.response) {
                    this.response = error.response
                } else {
                    this.response = {
                        status: 'error',
                        statusText: 'Network error',
                        error
                    }
                }
            })
        })
    }

    addHeader = (key, value) => {
        this.header = { ...this.header, [key]: value }
    }

    removeHeader = (key) => {
        const tmp = { ...this.header }
        delete tmp[key]
        this.header = tmp
    }

    setParam = (key, value) => {
        this.param = { ...this.param, [key]: value }
        if (!this.paramStatus[key]) {
            this.paramStatus = { ...this.paramStatus, [key]: true }
        }
    }

    setParamStatus = (key, value) => {
        this.paramStatus = { ...this.paramStatus, [key]: value }
    }

    get getUrl () {
        let url = this.url
        Object.entries(this.param).map(([key, value]) => {
            if (url.indexOf('{' + key + '}') !== -1 && value && this.paramStatus[key]) {
                url = url.replace('{' + key + '}', value)
            }
        })
        console.log('computing', url);
        return url
    }

    get getFullUrl () {
        let url = this.fullUrl
        Object.entries(this.param).map(([key, value]) => {
            if (url.indexOf('{' + key + '}') !== -1 && value && this.paramStatus[key]) {
                url = url.replace('{' + key + '}', value)
            }
        })
        console.log('computing', url);
        return url
    }

    get getRequestData () {
        const result = {}
        toJS(this.data).map(item => result[item.id] = item.value)
        return result
    }

    get getTable () {
        const result = []

        const flatten = flattenObject(this.data)
        console.log('flatten', flatten)

        this.data.map(item => {
            switch (item.type) {
                case 'array': {
                    if (!item.value || !item.value.length) {
                        item.value = ['']
                    }
                    item.value.map((value, key) => {
                        result.push({
                            id: item.id + '[]',
                            field: item.id + '.' + key,
                            type: item.type,
                            name: item.name,
                            text: item.text,
                            rules: item.rules,
                            value
                        })
                    })
                    break
                }
                default: {
                    result.push({
                        id: item.id,
                        field: item.id,
                        type: item.type,
                        name: item.name,
                        text: item.text,
                        rules: item.rules,
                        value: item.value
                    })
                }
            }
        })

        return result
    }

    serialize = () => {
        return {
            url: this.getUrl,
            fullUrl: this.getFullUrl,
            method: toJS(this.method),
            header: toJS(this.header),
            data: toJS(this.data),
        }
    }
}

export default RequestStore;
