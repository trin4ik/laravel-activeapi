import React, { useState, useEffect } from 'react'
import {
	Switch,
	Route,
	Link,
	HashRouter
} from "react-router-dom";
import LeftMenu from "./LeftMenu";
import Welcome from "../page/Welcome";
import Controller from "../page/Controller";
import Action from "../page/Action";
import { inject, observer } from "mobx-react";
import { message } from "antd";
import useSound from 'use-sound'

import notifySound from '../asserts/sound/1.mp3'
import HeadMenu from "./HeadMenu";
import cn from 'classnames'

const Router = ({ store }) => {

	const [playNotify] = useSound(notifySound);

	useEffect(() => {
		store.app.notification.map(item => {
			message.success(item, 5)
			playNotify()
			store.app.removeNotifyByText(item)
		});
	}, [store.app.notification])

	return (
		<HashRouter>
			<div className={cn(['app', { 'day': store.app.nightTheme }])}>
				<div className={"panel"}>
					<LeftMenu/>
				</div>
				<div className={"content"}>
					<HeadMenu/>
					<div className={"page"}>
						{/*<Switch>
                        <Route path="/" exact component={Welcome} />
                        <Route path="/:controller" exact component={Controller} />
                        <Route path="/:controller/:action" exact component={Action} />
                    </Switch>*/}
					</div>
				</div>
			</div>
		</HashRouter>
	)
}

export default inject('store')(observer(Router));
