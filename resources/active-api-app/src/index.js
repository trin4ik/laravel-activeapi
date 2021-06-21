import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'
import './app.scss'
import Router from "./nav/Router";
import dayjs from "dayjs"
import 'dayjs/locale/ru'
import Store from "./store"
import { Provider } from "mobx-react"
import { loadConfig } from './store/config'

(async () => {
    dayjs.locale('ru')

    await loadConfig()

    ReactDOM.render(
        <React.StrictMode>
            <Provider store={new Store()}>
                <Router />
            </Provider>
        </React.StrictMode>,
        document.getElementById('root')
    )
})()
