import React from 'react'
import { inject, observer } from 'mobx-react'

import { Input } from "antd"
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'

const InputObject = ({store, record}) => {

	const add = <div className={"add-array"} onClick={event => store.request.addArrayItem(record)}>
		<PlusCircleOutlined/> Добавить</div>
	const remove = <div className={"remove-array"} onClick={event => store.request.removeArrayItem(record)}>
		<DeleteOutlined/> Удалить</div>

	return (
		<div className={"form"}>
			{record.index ? remove : add}
		</div>
	)
}

export default inject('store')(observer(InputObject))
