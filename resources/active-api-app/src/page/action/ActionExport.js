import React, {useState, useEffect} from 'react'
import {inject, observer} from 'mobx-react'
import {Input, Radio, Button, message} from "antd"
import { CopyOutlined } from '@ant-design/icons'
import Cube from "../../component/Cube"
import Export from "../../utils/export"
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import Highlight from 'react-highlight.js'
import 'highlight.js/styles/github.css'

const exportType = [
	{
		id: "fetch",
		name: "fetch",
		cube: "JS",
		lang: "javascript"
	},
	{
		id: "curl",
		name: "cURL",
		cube: "#",
		lang: "bash"
	}
]

const ActionExport = ({store}) => {

	const [textarea, setTextarea] = useState('')
	const [langState, setLangState] = useState(exportType[0].id)

	useEffect(() => {
		if (store.request.url) {
			setTextarea(Export.convert(langState, store.request.serialize))
		}
	}, [langState, store.request.serialize])

	const copyHandler = () => {
		store.app.addNotify('Данные скопированы')
	}

	return (
		<>
			<div className={"request-export"}>
				<div className={"request-tabs"}>
					<Radio.Group value={langState} buttonStyle={"solid"} onChange={event => setLangState(event.target.value)}>
						{
							exportType.map(item => (
								<Radio.Button value={item.id} key={"export-lang-" + item.id}>
									<Cube value={item.cube} />
									<span>{item.name}</span>
								</Radio.Button>
							))
						}
					</Radio.Group>
					<div className={"request-copy"}>
						<CopyToClipboard text={textarea} onCopy={copyHandler}>
							<Button size={"small"} icon={<CopyOutlined />}>
								Скопировать
							</Button>
						</CopyToClipboard>
					</div>
				</div>
				<Highlight language={exportType.filter(item => item.id === langState)[0].lang}>
					{textarea}
				</Highlight>
			</div>
        </>
	)
}

export default inject('store')(observer(ActionExport));
