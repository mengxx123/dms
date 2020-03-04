import React, { useState, useEffect } from 'react'
import styles from './index.less'
import { message, Input, Button, Table } from 'antd'
import http from '@/utils/http'

const { TextArea } = Input

export interface Props {
    defaultSql?: string;
}

function SqlBox(props: Props) {
    const [code, setCode] = useState(props.defaultSql)
    const [table, setTable] = useState({
        columns: [],
        list: [],
    })

    useEffect(() => {
        // console.log('onMouneed', storage.get('dbInfo', ''))
        // setCode(storage.get('dbInfo', ''))
    }, [])

    async function run() {
        let res = await http.post('/mysql/execSql', {
            sql: code,
        })
        if (res.status === 200) {
            message.success('执行成功')
            console.log(res)
            let columns = []
            if (res.data[0]) {
                for (let key in res.data[0]) {
                    columns.push({
                        title: key,
                        dataIndex: key,
                        key,
                        render(value: any) {
                            return '' + value
                        },
                    })
                }
            }
            setTable({
                columns,
                list: res.data
            })
        } else {
            message.error('执行失败')
        }
    }

    let columns = [

    ]

    return (
        <div className={styles.normal}>
            <div className="cssLib">
                <Button type="primary" onClick={run}>执行</Button>
            </div>
            <TextArea className={styles.textarea} value={code} rows={4} onChange={e => setCode(e.target.value)} />
            <Table
                dataSource={table.list}
                pagination={false}
                columns={table.columns} />
        </div>
    )
}
export default SqlBox
