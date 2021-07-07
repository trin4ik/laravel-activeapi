import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, message, Radio, Button } from "antd"
import { CopyOutlined } from '@ant-design/icons'
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component"
import Highlight from "../../component/Highlight"

const ActionResponse = ({ store }) => {

	const [textarea, setTextarea] = useState(null)
	const [respState, setRespState] = useState("pretty")

	useEffect(() => {
		if (store.request.response && store.request.response.data) {
			setTextarea(JSON.stringify(store.request.response.data, null, 4))
		} else {
			setTextarea(JSON.stringify(store.request.response, null, 4))
		}

	}, [respState, store.request.response])

	const copyHandler = () => {
		store.app.addNotify('Данные скопированы')
	}

	return (
		<>
			<div className={"request-response"}>
				<div className={"request-data"}>
					<div className={"request-tabs"}>
						<Radio.Group value={respState} buttonStyle={"solid"}
									 onChange={event => setRespState(event.target.value)}>
							<Radio.Button value={"pretty"}>
								<span>Pretty</span>
							</Radio.Button>
						</Radio.Group>
						<div className={"request-copy"}>
							<CopyToClipboard text={textarea} onCopy={copyHandler}>
								<Button size={"small"} icon={<CopyOutlined/>}>
									Скопировать
								</Button>
							</CopyToClipboard>
						</div>
					</div>
					<Highlight language={"json"}>
						{textarea}
					</Highlight>
				</div>
				<div className={"response-info"}>
					<div className={"list-key-value"}>
						<div className={"row"}>
							<div className={"key"}>Время выполнения</div>
							<div className={"value"}>{store.request.responseTime / 1000} сек.</div>
						</div>
						<div className={"row"}>
							<div className={"key"}>Ответ</div>
							<div
								className={"value"}>{store.request.response.status} {store.request.response.statusText}</div>
						</div>
						{
							store.request.response.headers && Object.entries(store.request.response.headers).length && (
								<div className={"row"}>
									<div className={"key"}>Заголовки</div>
									<div className={"value"}>
										{
											Object.entries(store.request.response.headers).map(value => (
												<div>{value[0].charAt(0).toUpperCase() + value[0].slice(1)}: {value[1]}</div>
											))
										}
									</div>
								</div>
							)
						}
					</div>
				</div>
			</div>
		</>
	)
}

export default inject('store')(observer(ActionResponse));
