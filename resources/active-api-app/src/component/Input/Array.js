import React from 'react'
import { inject, observer } from 'mobx-react'

import { Input } from "antd"
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'

const InputArray = ({store, record}) => {

	const add = <div className={"add-array"} onClick={event => store.request.addArrayItem(record)}>
		<PlusCircleOutlined/></div>
	const remove = <div className={"remove-array"} onClick={event => store.request.removeArrayItem(record)}>
		<DeleteOutlined/></div>

	return (
		<div className={"form"}>
			<Input value={store.request.getDataValue(record.key)}
				   onInput={event => store.request.setDataValue(record.key, event.target.value)}
				   placeholder={record.placeholder} suffix={record.index === 0 ? add : remove}/>
		</div>
	)
}

export default inject('store')(observer(InputArray))
