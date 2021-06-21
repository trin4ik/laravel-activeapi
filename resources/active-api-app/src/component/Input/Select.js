import React from 'react'
import { inject, observer } from 'mobx-react'

import { Radio, Select } from "antd"

const InputSelect = ({ store, record }) => {

	if (record.extra?.in?.length && record.extra.in.length > 3) {
		return (
			<div className={"form"}>
				<Select
					defaultValue={store.request.getDataValue(record.key)}
					onChange={value => store.request.setDataValue(record.key, value)}
					style={{ width: 200 }}
				>
					<Select.Option value={null}>null</Select.Option>
					{
						record.extra?.in && record.extra.in.map(item => (
							<Select.Option value={item}>{item}</Select.Option>
						))
					}
				</Select>
			</div>
		)
	}

	return (
		<div className={"form"}>
			<Radio.Group buttonStyle="solid"
						 onChange={event => store.request.setDataValue(record.key, event.target.value)}
						 defaultValue={store.request.getDataValue(record.key)}>
				<Radio.Button value={null}>null</Radio.Button>
				{
					record.extra?.in && record.extra.in.map(item => (
						<Radio.Button value={item}>{item}</Radio.Button>
					))
				}
			</Radio.Group>
		</div>
	)
}

export default inject('store')(observer(InputSelect))
