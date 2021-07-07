import React, { useState, useEffect } from 'react'
import config from '../store/config'
import { Link, useLocation, useParams } from "react-router-dom";
import { LockOutlined, ArrowRightOutlined, UnlockOutlined, SendOutlined } from '@ant-design/icons'
import { inject, observer } from "mobx-react"
import { Input, Switch, Tooltip, Tabs, Button } from "antd"
import ActionRequest from "./action/ActionRequest"
import ActionExport from "./action/ActionExport"
import ActionResponse from "./action/ActionResponse"
import Cube from "../component/Cube"

import showdown from 'showdown'
import parse from 'html-react-parser'

const converter = new showdown.Converter({
	literalMidWordUnderscores: true
})

const Action = ({ store }) => {

	const location = useLocation()
	const param = useParams()

	const [controller, setController] = useState(false)
	const [action, setAction] = useState(false)
	const [fullUrl, setFullUrl] = useState(false)
	const [sendRequestLoad, setSendRequestLoad] = useState(false)
	const [tabState, setTabState] = useState('request')

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [])

	useEffect(() => {
		if (store.request.response) {
			setTabState('response')
			setSendRequestLoad(false)
		}
	}, [store.request.response])

	useEffect(() => {
		if (param.controller) {
			const controller = config.controllerList(store.app.apiGroup, store.app.apiVersion).filter(item => item.id === param.controller);
			if (controller.length) {
				if (param.action) {
					if (controller[0].action.filter(item => item.id === param.action).length) {
						loadAction(param);
					}
				}
			}
		}
	}, [location])

	const loadAction = ({ controller, action }) => {
		const controllerData = config.controllerList(store.app.apiGroup, store.app.apiVersion).filter(item => item.id === controller)[0];
		const actionData = controllerData.action.filter(item => item.id === action)[0];

		store.router.setAction(action)
		store.router.setController(controller)

		setTabState('request')
		setAction(actionData)
		setController(controllerData)

		store.request.set(actionData)
	}

	//header: {...config.info.header, ...(store.vars.server.token ? {'Authorization': 'Bearer ' + store.vars.server.token} : {})},

	const onKeyDown = (e) => {
		if (e.ctrlKey && e.keyCode === 13) {
			sendRequest()
		}
	}

	const sendRequest = () => {
		store.request.sendRequest()
		setSendRequestLoad(true)
	}

	const responseTitle = () => {
		const status = store.request.response.status
		const statusColor = status < 400 ? "success" : status < 500 ? "warning" : "error"

		return (
			<div className={"response-tab-header"}>
                <span className={"title"}>
                    Ответ
                </span>
				{
					store.request.response && (
						<Cube value={status} color={statusColor}/>
					)
				}
			</div>
		)
	}

	return (
		<>
			{
				action && (
					<>
						<h1>
							<Link
								to={"/" + [store.app.apiGroup, store.app.apiVersion, store.router.controller].join('/')}>
								{controller.name}
							</Link>
							<div className={"icon"}>
								<ArrowRightOutlined/>
							</div>
							<div>
								{action.name}
							</div>
						</h1>
						{
							action.text && (
								<div className={"quote"}>
									{parse(converter.makeHtml(action.text))}
								</div>
							)
						}
						<div className={"request-info"}>
							<div className={"method method-" + action.method.toLowerCase()}>{action.method}</div>
							<div className={"url"}>
								<Tooltip placement="topLeft" title={action.auth && "Требуется авторизация"}>
									<Input className={"auth-" + action.auth}
										   value={fullUrl ? store.request.getFullUrl : store.request.getUrl}
										   editable={"false"}
										   prefix={action.auth ? <LockOutlined/> : <UnlockOutlined/>}/>
								</Tooltip>
							</div>
							<div className={"add-base"} onClick={() => setFullUrl(checked => !checked)}>
								<Switch size={"small"} checked={fullUrl}/>
								<span>Полный url</span>
							</div>
						</div>
						<div className={"request"}>
							<Tabs activeKey={tabState} onChange={key => setTabState(key)} className={"tabs"}
								  tabBarExtraContent={<Button size={"default"} onClick={sendRequest}
															  icon={<SendOutlined/>} size={"small"} type={"primary"}
															  loading={sendRequestLoad}>Отправить
									  (Ctrl+Enter)</Button>}>
								<Tabs.TabPane tab="Запрос" key="request">
									<ActionRequest action={action}/>
								</Tabs.TabPane>
								<Tabs.TabPane tab="Экспорт" key="export">
									<ActionExport/>
								</Tabs.TabPane>
								<Tabs.TabPane tab={responseTitle()} key="response" disabled={!store.request.response}>
									<ActionResponse/>
								</Tabs.TabPane>
							</Tabs>
						</div>
					</>
				)
			}
		</>
	)
}

export default inject('store')(observer(Action))
