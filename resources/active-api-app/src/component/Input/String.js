import React from 'react'
import { inject, observer } from 'mobx-react'
import { Input } from "antd"

const InputString = ({ store, record }) => {

	return (
		<div className={"form"}>
			<Input
				value={store.request.getDataValue(record.key)}
				onInput={event => store.request.setDataValue(record.key, event.target.value)}
				placeholder={record.placeholder}
			/>
		</div>
	)
}

export default inject('store')(observer(InputString))
