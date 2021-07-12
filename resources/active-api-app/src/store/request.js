import { makeObservable, observable, action, computed, toJS, runInAction } from "mobx";
import set from 'lodash/set'
import unset from 'lodash/unset'
import get from 'lodash/get'
import merge from 'lodash/merge'
import { flattenObject } from '../utils/func'
import config from './config'
import axios from "axios"
import queryString from 'query-string'

class RequestStore {

	url = ""
	method = "GET"
	auth = false
	sendAuth = true
	header = {}
	field = []
	param = {}
	paramStatus = {}
	data = {}
	response = false
	responseTime = 0

	constructor (store) {
		makeObservable(this, {
			url: observable,
			method: observable,
			auth: observable,
			sendAuth: observable,
			header: observable,
			field: observable,
			param: observable,
			paramStatus: observable,
			data: observable,
			response: observable,
			responseTime: observable,

			set: action,
			setDataValue: action,
			addArrayItem: action,
			removeArrayItem: action,
			setParam: action,
			setParamStatus: action,

			dataTemplate: computed,
			fullTemplate: computed,
			table: computed,
			serialize: computed,
			getUrl: computed,
			getFullUrl: computed,
		})
		this.store = store
	}

	set = ({ url, method, auth, header = {}, field, param }) => {
		this.url = url
		this.method = method
		this.auth = auth
		this.header = header
		this.field = field

		this.data = {}

		this.param = {}
		this.paramStatus = {}

		param.map(item => {
			this.param[item] = ''
			this.paramStatus[item] = true
		})

		this.response = false
	}

	getDataValue = (id) => {
		return get(this.data, id)
	}

	setDataValue = (id, value) => {
		if (value === null) {
			return unset(this.data, id)
		}
		return set(this.data, id, value)
	}

	setParam = (param, value) => {
		this.param = { ...this.param, [param]: value }
	}

	setParamStatus = (param, status) => {
		this.paramStatus = { ...this.paramStatus, [param]: status }
	}

	sendRequest = () => {
		this.response = false
		const startTime = Date.now()
		axios({
			url: this.getFullUrl,
			method: this.method,
			headers: this.getHeader,
			data: toJS(this.data)
		}).then(response => {
			config.data.variable.map(vars => {
				if (vars.from.url === this.url) {
					if (vars.data.eval.slice(0, 10) === '@response.') {
						this.store.vars.add([this.store.app.apiGroup, this.store.app.apiVersion, vars.data.id].join('@'), vars.data.eval.slice(10).split('.').reduce((o, i) => o[i], response.data))
					}
				}
			})

			runInAction(() => {
				this.responseTime = Date.now() - startTime
				this.response = response
			})
		}).catch(error => {
			runInAction(() => {
				this.responseTime = Date.now() - startTime
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

	addArrayItem = (item) => {
		const dot = item.key.split('.')
		let template = this.dataTemplate[dot[0]]

		if (!this.data.hasOwnProperty(dot[0])) {
			this.data[dot[0]] = template
		}
		this.data[dot[0]].push(template[0])
	}

	removeArrayItem = (item) => {
		const dot = item.key.split('.')
		if (this.data[dot[0]] && this.data[dot[0]].hasOwnProperty(dot[1])) {
			this.data[dot[0]].splice(dot[1], 1)
		}
	}

	parseFieldByKey = (result, key, parent = false) => {
		const dot = key.split('.')

		if (!result.find(item => item.id === dot[0])) {
			result.push({ id: dot[0], key })
		}

		const item = result.find(item => item.id === dot[0])

		if (dot.length === 1 || (dot[1] !== '*' && dot[1] != parseInt(dot[1]))) {
			item.fillable = true
		}
		console.log('item', item)
	}

	get dataTemplate () {
		let result = {}

		this.field.map(field => {
			let defaultNull = null

			switch (field.type) {
				case 'array': {
					defaultNull = [null]
				}
			}

			field.id = field.id.replace('.*.', '.0.').replace('.*', '.0')
			result = set(result, field.id, defaultNull)
		})

		console.log('data template', result)

		return result
	}

	tablePlaintField (field, key) {
		return {
			...field,
			...this.field.find(item => item.id === key),
			fillable: true
		}
	}

	tableArrayField (field, key, array) {
		const result = []
		array.map((v, k) => {
			result.push({
				...this.field.find(item => item.id === key),
				fillable: true,
				id: field.id + '[' + k + ']',
				key: field.key + '.' + k,
				index: k
			})
		})
		return result
	}

	findFieldDefaults (key) {
		return this.field.find(item => {
			if (item.id === key) {
				return true
			}

			const possibleKey = key.replace(/\.[0-9]+\./, ".0.").replace(/\.[0-9]+$/, ".0")
			if (item.id === possibleKey) {
				return true
			}
		})
	}

	tableRecursiveField (key, additional = {}, overwrite = {}) {
		let result = {
			key,
			id: key,
			...additional,
			...this.findFieldDefaults(key),
			...overwrite,
			fillable: false
		}

		//console.log('field', key, get(this.fullTemplate, key), additional, overwrite)

		if ( // simple field
			get(this.fullTemplate, key) === null ||
			typeof get(this.fullTemplate, key) !== 'object'
		) {
			result.fillable = true
		} else if ( // array like type=array
			Array.isArray(get(this.fullTemplate, key)) &&
			(get(this.fullTemplate, key)[0] === null || typeof get(this.fullTemplate, key)[0] !== 'object')
		) {
			console.log(key, 'array from array')
			result.children = []
			get(this.fullTemplate, key).map((v, k) => {
				result.children.push(this.tableRecursiveField(key + '.' + k, {
					type: 'array',
				}, {
					name: key + '[' + k + ']',
					id: key + '[' + k + ']',
					isArray: true,
					index: k
				}))
			})
		} else if ( // array like field.*
			Object.entries(get(this.fullTemplate, key)).length === 1 &&
			get(this.fullTemplate, key).hasOwnProperty('*')
		) {
			console.log(key, 'array from *')
			result.children = [
				this.tableRecursiveField(key + '.*', {
					type: 'array',
				}, {
					name: key + '[0]',
					id: key + '[0]',
					isArray: true,
					index: 0
				})
			]
		} else { // object
			if (overwrite.isArray) {
				result.type = 'object'
				result.objectWithArray = true
				result.fillable = true
			}
			result.children = []
			Object.entries(get(this.fullTemplate, key)).map(([v, k]) => {
				console.log('object', key, v)
				result.children.push(this.tableRecursiveField(key + '.' + v, {
					id: key + '.' + v,
				}, {
					isArray: v === '*' || parseInt(v) == v
				}))
			})
		}

		//console.log(result)

		return result
	}

	get fullTemplate () {
		return merge({}, this.dataTemplate, toJS(this.data))
	}

	get table () {
		const result = []

		Object.entries(this.fullTemplate).map(([key, value], index) => {
			result.push(this.tableRecursiveField(key))
		})

		/*
		console.log('template', template)
		const tmp = flattenObject(template)

		console.log('field', toJS(this.field))

		Object.entries(tmp).map(([key, value], index) => {
			result.push(this.parseFieldByKey(key))
		})
		*/
		return result
	}

	get table2 () {
		const result = []
		const template = merge({}, this.dataTemplate, toJS(this.data))

		const tmp = flattenObject(template)

		Object.entries(tmp).map(([key, value], index) => {
			const dot = key.split('.')
			const item = { ...this.field.find(item => item.id === dot[0]), key }

			switch (dot.length) {
				case 1: {
					if (item.type === 'array') {
						item.id = item.id + '.0'
						item.key = item.key + '.0'
					}
					item.fillable = true
					result.push(item)
					break
				}
				case 2: {
					if (dot[1] == parseInt(dot[1])) {
						item.id = dot[0] + '[' + parseInt(dot[1]) + ']'
						item.key = dot[0] + '.' + parseInt(dot[1])
						item.index = parseInt(dot[1])
						item.fillable = true

						result.push({ ...item })
					} else {
						if (!result.filter(i => i.id === dot[0]).length) {
							result.push({ ...item, fillable: false, id: dot[0] })
						}
						const original = result.find(i => i.id === dot[0])
						const sattelit = { ...toJS(this.field.find(i => i.id === (dot[0] + '.' + dot[1]))) }

						if (!original.hasOwnProperty('children')) {
							original.children = []
						}

						original.children.push({
							...sattelit,
							id: dot[1],
							key: dot[0] + '.' + dot[1],
							fillable: true,
						})
					}
					break
				}
				case 3: {
					if (!result.filter(i => i.id === dot[0]).length) {
						result.push({ ...item, fillable: false, id: dot[0] })
					}

					const original = result.find(i => i.id === dot[0])
					const sattelit = { ...toJS(this.field.find(i => i.id === (dot[0] + '.0.' + dot[2]))) }

					if (!original.hasOwnProperty('children')) {
						original.children = []
					}

					if (!original.children.hasOwnProperty(dot[1])) {
						original.children[parseInt(dot[1])] = {
							id: dot[0] + '[' + parseInt(dot[1]) + ']',
							key: dot[0] + '.' + parseInt(dot[1]),
							type: 'object',
							objectWithArray: true,
							fillable: true,
							rules: [],
							children: [],
							index: parseInt(dot[1])
						}
					}

					console.log('sattelit', sattelit)

					original.children[parseInt(dot[1])].children.push({
						...sattelit,
						id: dot[2],
						key: dot[0] + '.' + parseInt(dot[1]) + '.' + dot[2],
						fillable: true,
					})
					break
				}

			}
		})
		return result
	}

	get getUrl () {
		let url = this.url

		Object.entries(this.paramStatus).map(([key, item]) => {
			if (item && this.param[key] !== '') {
				url = url.replace('{' + key + '}', this.param[key])
			}
		})

		if (this.method.toLowerCase() === 'get') {
			const query = queryString.stringify(this.data, { arrayFormat: 'bracket' })
			if (query) {
				url = url + '?' + query
			}
		}

		return url
	}

	get getFullUrl () {
		return config.data.info.url + this.getUrl
	}

	get serialize () {
		return {
			url: this.getFullUrl,
			method: this.method,
			header: this.getHeader,
			data: toJS(this.data)
		}
	}

	get getHeader () {
		const result = { ...config.data.info.header }

		if (this.auth && this.sendAuth && this.store.vars.server[[this.store.app.apiGroup, this.store.app.apiVersion, 'token'].join('@')]) {
			result['Authorization'] = 'Bearer ' + this.store.vars.server[[this.store.app.apiGroup, this.store.app.apiVersion, 'token'].join('@')]
		}

		return result
	}
}

export default RequestStore;
