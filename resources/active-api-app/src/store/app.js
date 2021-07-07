import { action, makeObservable, observable } from "mobx"
import config from "./config";

class AppStore {

	version = 0.1
	nightTheme = false
	notification = []
	apiGroup = null
	apiVersion = null

	constructor (store) {
		makeObservable(this, {
			version: observable,
			nightTheme: observable,
			notification: observable,
			apiGroup: observable,
			apiVersion: observable,
			addNotify: action,
			setApiGroup: action,
			setApiVersion: action,
			changeDay: action
		})
		this.apiGroup = config.groupList()
		if (this.apiGroup.length) {
			this.apiVersion = config.versionList(this.apiGroup[0])
		}
		this.store = store
	}

	addNotify = (text) => {
		this.notification = [...this.notification, text]
	}
	removeNotifyByText = (text) => {
		this.notification = this.notification.filter(item => item !== text)
	}
	changeDay = () => {
		this.nightTheme = !this.nightTheme
	}

	setApiGroup = (group) => {
		this.apiGroup = group
	}

	setApiVersion = (version) => {
		this.apiVersion = version
	}
}

export default AppStore
