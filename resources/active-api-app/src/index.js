import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'
import './app.scss'
import Router from "./nav/Router";
import dayjs from "dayjs"
import 'dayjs/locale/ru'
import Store from "./store"
import { Provider } from "mobx-react"
import config, { loadConfig } from "./store/config"

(async () => {
	dayjs.locale('ru')

	await loadConfig()
	const store = await new Store()

	const group = config.groupList()[0]
	const version = config.versionList(group)[0]

	store.app.setApiGroup(group)
	store.app.setApiVersion(version)

	ReactDOM.render(
		<React.StrictMode>
			<Provider store={store}>
				<Router/>
			</Provider>
		</React.StrictMode>,
		document.getElementById('root')
	)
})()
