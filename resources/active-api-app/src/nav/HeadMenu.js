import React from 'react'
import { inject, observer } from 'mobx-react'
import cn from 'classnames'

const HeadMenu = ({ store }) => {

	return (
		<div className={"head-menu"}>
			<div className={"api-group"}>
			</div>
			<div className={"api-version"}></div>
			<div className={"search"}>123</div>
			<div className={cn(["dn", { night: store.app.nightTheme }])} onClick={() => store.app.changeDay()}>
				<div className={"day"}/>
				<div className={"night"}/>
			</div>
		</div>
	)
}

export default inject('store')(observer(HeadMenu))
