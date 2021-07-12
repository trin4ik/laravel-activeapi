import React, { useState, useEffect } from 'react'
import config from '../store/config'
import { Link, useLocation, useParams } from "react-router-dom";
import { LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { inject, observer } from "mobx-react"

import showdown from 'showdown'
import parse from 'html-react-parser'

const converter = new showdown.Converter({
	literalMidWordUnderscores: true
})

const Controller = ({ store }) => {

	const location = useLocation()
	const param = useParams()

	const [data, setData] = useState(false)

	useEffect(() => {
		store.app.setApiGroup(param.group)
		store.app.setApiVersion(param.version)
		store.router.setAction(false)
		if (param.controller) {
			if (config.controllerList(param.group, param.version).filter(item => item.id === param.controller).length) {
				store.router.setController(param.controller)
				setData(config.controllerList(param.group, param.version).filter(item => item.id === param.controller)[0])
			}
		}
	}, [location])

	return (
		<>
			{
				data && (
					<>
						<div className={"controller-info"}>
							<h1>{data.name}</h1>
							{
								data.text && (
									<span className={"quote"}>
                                        {parse(converter.makeHtml(data.text.trim()))}
                                    </span>
								)
							}
						</div>
						<div className={"controller-action"}>
							{
								data.action.map(item => (
									<Link
										to={'/' + [param.group, param.version, store.router.controller, item.id].join('/')}
										className={"item"}
										key={"action-" + item.id}
									>
										<div className={"name"}>{item.name}</div>
										<div
											className={"method method-" + item.method.toLowerCase()}>{item.method}</div>
										<div className={"auth auth-" + item.auth}>{item.auth ? <LockOutlined/> :
											<UnlockOutlined/>}</div>
										<div className={"url"}>{item.url}</div>
									</Link>
								))
							}
						</div>
					</>
				)
			}
		</>
	)
}

export default inject('store')(observer(Controller))
