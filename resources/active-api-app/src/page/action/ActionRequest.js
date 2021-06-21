import React, { useState, useEffect, useRef } from 'react'
import { inject, observer } from 'mobx-react'
import { Radio, Input, Switch, Table } from "antd"
import { InputArray, InputBoolean, InputCheckBox, InputObject, InputSelect, InputString } from "../../component/Input"

const ActionRequest = ({ store, data, action }) => {

	const [tableScroll, setTableScroll] = useState({})
	const tableRef = useRef(null)

	useEffect(() => {
		if (tableRef) {
			setTableScroll({ y: 'calc(100vh - ' + (tableRef.current.getBoundingClientRect()['top'] + 100) + 'px)' });
		}
	}, [tableRef])

	const tableColumnIdRender = (text) => {
		return <span className={"id"}>{text}</span>
	}
	const tableColumnTypeRender = (text) => {
		return <span className={"type type-" + text}>{text}</span>
	}
	const tableColumnNameRender = (text) => {
		return <span className={"name"}>{text}</span>
	}
	const tableColumnTextRender = (text, record) => {
		return (
			<div className={"description"}>
				<span>{text}</span>
				{
					(record.rules && record.rules.length) ? (
						<div className={"validation"}>
							{
								record.rules.map(item => (
									<span>{item}</span>
								))
							}
						</div>
					) : ''
				}
			</div>
		)
	}
	const tableColumnFormRender = (text, record, index) => {
		if (!record.fillable) return

		if (record.type === 'array' || (record.isArray && !record.objectWithArray)) {
			return <InputArray record={record}/>
		} else if (record.type === 'object' && record.objectWithArray) {
			return <InputObject record={record}/>
		} else if (record.type === 'select') {
			return <InputSelect record={record}/>
		} else if (record.type === 'checkbox') {
			return <InputCheckBox record={record}/>
		} else if (record.type === 'boolean') {
			return <InputBoolean record={record}/>
		} else {
			return <InputString record={record}/>
		}
	}

	const requestColumn = [
		{
			title: 'Параметр',
			dataIndex: 'id',
			key: 'id',
			width: '20%',
			render: tableColumnIdRender,
		},
		{
			title: 'Тип',
			dataIndex: 'type',
			key: 'type',
			width: '10%',
			render: tableColumnTypeRender,
		},
		{
			title: 'Имя',
			dataIndex: 'name',
			key: 'name',
			width: '15%',
			render: tableColumnNameRender,
		},
		{
			title: 'Описание',
			dataIndex: 'text',
			width: '35%',
			key: 'text',
			render: tableColumnTextRender,
		},
		{
			title: 'Форма',
			dataIndex: 'form',
			key: 'form',
			width: '30%',
			render: tableColumnFormRender,
		}
	]

	return (
		<div className={"action-request-tab"}>
			{
				store.request.auth && (
					<div className={"request-auth"}>
						<div className={"title"}>
							Токен авторизации
						</div>
						<div className={"input"}>
							<Input disabled={!store.request.sendAuth}
								   value={store.vars.server.token ? store.vars.server.token : ''}
								   placeholder={"Authorization: Bearer"}/>
						</div>
						<div className={"switch"}>
							<Switch size={"small"} checked={store.request.sendAuth}
									onChange={auth => store.request.sendAuth = auth}/>
						</div>
					</div>
				)
			}
			{
				Object.entries(store.request.param).length ? (
					<div className={"request-param"}>
						{
							Object.entries(store.request.param).map(([item, key]) => (
								<div className={"row"}>
									<div className={"title"}>
										${item}
									</div>
									<div className={"input"}>
										<Input disabled={!store.request.paramStatus[item]}
											   value={store.request.param[item]}
											   onInput={text => store.request.setParam(item, text.currentTarget.value)}/>
									</div>
									<div className={"switch"}>
										<Switch size={"small"} checked={store.request.paramStatus[item]}
												onChange={disabled => store.request.setParamStatus(item, disabled)}/>
									</div>
								</div>
							))
						}
					</div>
				) : ''
			}
			<div className={"request-table-wrapper"} ref={tableRef}>
				<Table expandable={{ defaultExpandAllRows: true }} scroll={tableScroll}
					   rowKey={record => "table-row-" + record.id} size={"small"} pagination={false}
					   className={"request-table"} columns={requestColumn} dataSource={store.request.table}/>
			</div>
		</div>
	)
}

export default inject('store')(observer(ActionRequest));
