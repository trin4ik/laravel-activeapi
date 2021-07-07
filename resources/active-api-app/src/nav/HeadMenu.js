import React from 'react'
import { inject, observer } from 'mobx-react'
import cn from 'classnames'
import { Menu, Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import Icon from "../component/Icon"
import config from "../store/config"

const HeadMenu = ({ store }) => {

	const menuGroupRender = () => {
		return (
			<Menu>
				{
					config.groupList().map((item, key) => (
						<Menu.Item key={key}>
							<a onClick={() => store.app.setApiGroup(item)}>{item}</a>
						</Menu.Item>
					))
				}
			</Menu>
		)
	}
	const menuVersionRender = () => {
		return (
			<Menu>
				{
					config.versionList(store.app.apiGroup).map((item, key) => (
						<Menu.Item key={key}>
							<a onClick={() => store.app.setApiVersion(item)}>{item}</a>
						</Menu.Item>
					))
				}
			</Menu>
		)
	}

	return (
		<div className={"head-menu"}>
			<div className={"api-group"}>
				<span>Group: </span>
				<Dropdown overlay={menuGroupRender} trigger={['click']}>
					<a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
						{store.app.apiGroup} <DownOutlined/>
					</a>
				</Dropdown>
			</div>
			<div className={"api-version"}>
				<span>Version: </span>
				<Dropdown overlay={menuVersionRender} trigger={['click']}>
					<a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
						{store.app.apiVersion} <DownOutlined/>
					</a>
				</Dropdown>
			</div>
			<div className={"search"}/>
			{/*
			<div className={cn(["dn", { night: store.app.nightTheme }])} onClick={() => store.app.changeDay()}>
				<div className={"day"}>
					<Icon name={['fas', 'moon']} color={"#333"}/>
				</div>
				<div className={"night"}>
					<Icon name={['fas', 'sun']} color={"#fff"}/>
				</div>
			</div>*/}
		</div>
	)
}

export default inject('store')(observer(HeadMenu))
