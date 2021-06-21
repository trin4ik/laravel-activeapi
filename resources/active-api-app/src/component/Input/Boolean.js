import React from 'react'
import { inject, observer } from 'mobx-react'

import { Radio } from "antd"

const InputBoolean = ({ store, record }) => {

	return (
		<div className={"form"}>
			<Radio.Group buttonStyle="solid"
						 onChange={event => store.request.setDataValue(record.key, event.target.value)}
						 defaultValue={store.request.getDataValue(record.key)}>
				<Radio.Button value={null}>null</Radio.Button>
				<Radio.Button value={false}>false</Radio.Button>
				<Radio.Button value={true}>true</Radio.Button>
			</Radio.Group>
		</div>
	)
}

export default inject('store')(observer(InputBoolean))
