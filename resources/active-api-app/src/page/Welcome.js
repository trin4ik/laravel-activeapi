import React, { useEffect } from 'react'
import { config } from '../store/config'
import { Input } from 'antd';
import { LockOutlined, ArrowRightOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link, useLocation } from "react-router-dom";
import { inject, observer } from "mobx-react"

const Welcome = ({ store }) => {

    const location = useLocation()

    useEffect(() => {
        store.router.setHome()
    }, [location])

    const removeVarHandler = (id) => {
        store.vars.remove(id)
    }

    return (
        <>
            <h1>{config.info.name}</h1>
            <span className={"quote"}>
				{config.info.text}
			</span>
            <div className={"list-key-value"}>
                <div className={"row"}>
                    <div className={"key"}>URL</div>
                    <div className={"value"}>http://77.244.214.219:8081</div>
                </div>
                <div className={"row"}>
                    <div className={"key"}>Авторизация</div>
                    <div className={"value"}>Authorization: Bearer</div>
                </div>
            </div>
            <h2>Системные переменные</h2>
            <div className={"list-key-value"}>
                {
                    config.variable.map(item => (
                        <div className={"row"} key={"server-variable-" + item.id}>
                            <div className={"key"}>
                                {
                                    item.data.text ? (
                                        <div className={"info"}>
                                            {item.data.text}
                                        </div>
                                    ) : item.data.name
                                }
                            </div>
                            <div className={"value value-var"}>
                                <div className={"input"}>
                                    <Input type={"text"} value={store.vars.server[item.data.id] ? store.vars.server[item.data.id] : item.data.eval} size={"large"} prefix={<LockOutlined />} disabled={true} />
                                    {
                                        store.vars.server[item.data.id] && (
                                            <div class={"remove"} onClick={() => removeVarHandler(item.data.id)}>
                                                <DeleteOutlined />
                                            </div>
                                        )
                                    }
                                </div>
                                <div className={"queries"}>
                                    <div className={"item"}>
                                        <span className={"icon"}><ArrowRightOutlined /></span>
                                        <span className={"text"}><Link to={"/" + item.from.controller + '/' + item.from.action}>{item.from.url}</Link></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default inject('store')(observer(Welcome))
