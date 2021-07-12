import React, { useEffect } from 'react'
import config from '../store/config'
import { Input } from 'antd';
import { LockOutlined, ArrowRightOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link, useLocation } from "react-router-dom";
import { inject, observer } from "mobx-react"

const Welcome = ({ store }) => {

	const location = useLocation()

	useEffect(() => {
		store.router.setHome()
	}, [location])

	const removeVarHandler = (id) => {
		store.vars.remove(id)
	}

	return (
		<>
			<h1>{config.data.info.name}</h1>
			<span className={"quote"}>
				{config.data.info.text}
			</span>
			<div className={"list-key-value"}>
				<div className={"row"}>
					<div className={"key"}>URL</div>
					<div className={"value"}>{config.data.info.url}</div>
				</div>
				{
					config.data.info.auth.enabled && (
						<div className={"row"}>
							<div className={"key"}>Авторизация</div>
							<div className={"value"}>{config.data.info.auth.description}</div>
						</div>
					)
				}
			</div>
			<h2>Системные переменные</h2>
			<div className={"list-key-value"}>
				{
					config.data.variable.map(item => (
						<div className={"row"}
							 key={"server-variable-" + [item.data.group, item.data.version, item.data.id].join('-')}>
							<div className={"key"}>
								{
									item.data.text ? (
										<div className={"info"}>
											{item.data.text}
										</div>
									) : item.data.name
								}
							</div>
							<div className={"value value-var"}>
								<div className={"input"}>
									<Input type={"text"}
										   value={store.vars.server[[item.data.group, item.data.version, item.data.id].join('@')] ?? item.data.eval}
										   size={"large"} prefix={<LockOutlined/>} disabled={true}/>
									{
										store.vars.server[[item.data.group, item.data.version, item.data.id].join('@')] && (
											<div className={"remove"}
												 onClick={() => removeVarHandler([item.data.group, item.data.version, item.data.id].join('@'))}>
												<DeleteOutlined/>
											</div>
										)
									}
								</div>
								<div className={"queries"}>
									<div className={"item"}>
										<span className={"icon"}><ArrowRightOutlined/></span>
										<span className={"text"}><Link
											to={"/" + [item.data.group, item.data.version, item.from.controller, item.from.action].join('/')}>{item.from.url}</Link></span>
									</div>
								</div>
							</div>
						</div>
					))
				}
			</div>
		</>
	)
}

export default inject('store')(observer(Welcome))
