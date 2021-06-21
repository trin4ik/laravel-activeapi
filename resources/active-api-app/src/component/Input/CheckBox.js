import React from 'react'
import { inject, observer } from 'mobx-react'

import { Switch } from "antd"

const InputCheckBox = ({ store, record }) => {

	return (
		<div className={"form"}>
			<Switch defaultChecked={store.request.getDataValue(record.key)}
					onChange={checked => store.request.setDataValue(record.key, checked ? '' : null)}/>
		</div>
	)
}

export default inject('store')(observer(InputCheckBox))
