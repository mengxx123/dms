import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './index.less'
import { message, Input, Button } from 'antd'
import storage from '../utils/storage'

const { TextArea } = Input

export default function () {
    const [code, setCode] = useState(`{
    "host": "",
    "user": "",
    "password": ""
}`)

    useEffect(() => {
        console.log('onMouneed', storage.get('dbInfo', ''))
        setCode(storage.get('dbInfo', ''))
    }, [])

    async function connect() {
        let ret = await axios.post('http://localhost:7001/mysql/connect', JSON.parse(code))
        console.log('ret', ret)
        if (ret.status === 200) {
            message.success('连接成功')
        } else {
            message.error('连接失败')
        }
    }

    function save() {
        storage.set('dbInfo', code)
        message.success('保存成功')
    }

    async function showDatabaseList() {
        let ret = await axios.get('http://localhost:7001/mysql/databases')
        console.log('ret', ret)
        if (ret.status === 200) {
            // message.info('连接成功')
            console.log('ret', ret.data)
        } else {
            message.error('连接失败')
        }
    }

    function help() {
        window.open('https://project.yunser.com/products/167b35305d3311eaa6a6a10dd443ff08', '_blank')
    }

    return (
        <div className={styles.normal}>
            <div className="cssLib">

            </div>
            <TextArea className={styles.textarea} value={code} rows={4} onChange={e => setCode(e.target.value)} />
            <Button type="primary" onClick={connect}>连接数据库</Button>
            <Button type="primary" onClick={save}>保存</Button>
            <Button type="primary" onClick={showDatabaseList}>数据库列表</Button>
            <Button type="primary" onClick={help}>帮助</Button>

            <ul className={styles.list}>
                <li>
                    To get started, edit <code>src/pages/index.js</code> and save to reload.
        </li>
                <li>
                    <a href="https://umijs.org/guide/getting-started.html">Getting Started</a>
                </li>
            </ul>
        </div>
    );
}
