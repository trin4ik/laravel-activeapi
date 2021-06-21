import { action, makeObservable, observable } from "mobx"

class AppStore {

	version = 0.1
	nightTheme = false
	notification = []

	constructor (store) {
		makeObservable(this, {
			version: observable,
			nightTheme: observable,
			notification: observable,
			addNotify: action,
			changeDay: action
		})
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
}

export default AppStore
