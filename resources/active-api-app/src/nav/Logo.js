import React from 'react'
import { inject, observer } from 'mobx-react'
import config from '../store/config'

const Logo = ({ store }) => {

	return (
		<div style={{ display: 'flex', height: 70, alignItems: 'center' }}>
			<h1
				style={{
					flex: 1,
					margin: 0,
					paddingLeft: 30,
				}}
			>
				{config.data.info.name}
			</h1>
		</div>
	)
}

export default inject('store')(observer(Logo))
