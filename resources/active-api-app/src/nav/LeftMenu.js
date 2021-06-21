import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { config } from '../store/config'
import dayjs from "dayjs"
import { RightOutlined } from '@ant-design/icons'
import { inject, observer } from "mobx-react"
import Logo from "./Logo";

const LeftMenu = ({ store }) => {

	return (
		<>
			<Logo/>
			<ul className={"left-menu"}>
				<li className={"item item-info"}>
					<Link to={"/"} className={store.router.home ? "active" : ''}>Информация</Link>
					<div className={"generation"}>
						{
							dayjs(config.info.generated_at * 1000).format("D MMMM, HH:mm")
						}
					</div>
				</li>
				{
					/*config.controller.map(controller => (
						<li className={"item item-info"} key={"left-menu-item-" + controller.id}>
							<Link to={"/" + controller.id} className={store.router.controller === controller.id ? "active" : ""}>{controller.name}</Link>
							{
								store.router.controller === controller.id && (
									<div className={"action-list"}>
										{
											controller.action.map(action => (
												<div className={"item"} key={"left-menu-item-" + controller.id + "-" + action.id}>
													<div className={"icon"}>
														<RightOutlined />
													</div>
													<Link to={"/" + controller.id + "/" + action.id} className={[...["name", store.router.action === action.id && "active"]].join(" ")}>
														{action.name}
													</Link>
												</div>
											))
										}
									</div>
								)
							}
						</li>
					))*/
				}
			</ul>
		</>
	)
}

export default inject('store')(observer(LeftMenu))
