import {
    Card,
    Form,
    message,
    Tabs,
} from 'antd'
import React, { Component, Fragment } from 'react'
import { Table, Button } from 'antd'
import { Dispatch } from 'redux'
import { FormComponentProps } from 'antd/es/form'
import { UserStateType } from '@/models/user'
import styles from './index.less'
import http from '../../utils/http'
import SqlBox from './SqlBox'

const { TabPane } = Tabs

interface DatabaseDetailProps extends FormComponentProps {
    dispatch: Dispatch<any>;
    loading: boolean;
    user: UserStateType;
}

interface DadabaseDetailState {
    table: any,
    activeKey: string,
    tabs: Array<TabProps>,
    asd: string,
}

interface TabProps {
    title: string,
    key: string,
    defaultSql: string,
}

const tabs : Array<TabProps> = [
    {
        title: 'SQL',
        key: '0',
        defaultSql: '',
    },
    // {
    //     title: 'Tab 1',
    //     key: '1',
    //     defaultSql: 'SELECT * FROM target.user LIMIT 20;'
    // },
]

class DataBaseDetail extends Component<DatabaseDetailProps, DadabaseDetailState> {

    dbName: string = ''

    state: DadabaseDetailState = {
        table: {
            list: [],
        },
        activeKey: tabs[0].key,
        tabs,
        asd: '1',
    };

    async componentDidMount() {

        console.log('props', this.props.match.params.name)
        let dbName = this.props.match.params.name
        this.dbName = dbName
        // const { dispatch } = this.props;
        // dispatch({
        //   type: 'user/fetchUserList',
        // });
        let res = await http.get(`/mysql/databases/${dbName}/tables`)
        if (res.status === 200) {
            // message.info('连接成功')
            console.log('res', res.data)
            this.setState({
                table: {
                    list: res.data
                },
            })
        } else {
            message.error('连接失败')
        }
    }

    render() {
        const { table, tabs, activeKey, asd } = this.state

        console.log('render', this.state)
        let _this = this

        function queryTable(tableName: string) {
            let tabKey = '' + new Date().getTime()
            _this.setState({
                activeKey: tabKey,
                tabs: tabs.concat([{
                    title: tableName,
                    key: tabKey,
                    defaultSql: `SELECT * FROM \`${_this.dbName}\`.\`${tableName}\` LIMIT 20;`
                }]),
            })
        }

        function update() {
            _this.setState({
                asd: '2222'
            })
        }

        const columns = [
            {
                title: '数据库名称',
                dataIndex: 'TABLE_NAME',
                key: 'TABLE_NAME',
                render(value: string) {
                    return <div onClick={e => queryTable(value)}>{value}</div>
                },
            },
        ]

        function handleTabChange(key: string) {
            console.log('set key', key)
            _this.setState({
                // asd: '122323',
                activeKey: key,
            })
        }

        function TabItem(item: TabProps) {
            return (
                <TabPane
                    tab={item.title}
                    key={item.key}
                    closable={true}>
                    <SqlBox defaultSql={item.defaultSql} />
                </TabPane>
            )
        }

        const onEdit = (targetKey: string, action: string) => {
            console.log('targetKey, action', targetKey, action)
            // this[action](targetKey);
            if (action === 'add') {
                let tabKey = '' + new Date().getTime()
                _this.setState({
                    activeKey: tabKey,
                    tabs: tabs.concat([{
                        title: 'SQL',
                        key: tabKey,
                        defaultSql: ''
                    }]),
                })
            }
            if (action === 'remove') {
                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].key === targetKey) {
                        tabs.splice(i, 1)
                        break
                    }
                }
                _this.setState({
                    tabs
                })
            }
        }

        return (
            <Fragment>
                <div className={styles.layout}>
                    <div className={styles.layoutLeft}>
                        <Card bordered={false}>
                            <div className={styles.tableList}>
                                <Table
                                    dataSource={table.list}
                                    pagination={false}
                                    rowKey="TABLE_NAME"
                                    columns={columns} />
                            </div>
                        </Card>
                    </div>
                    <div className={styles.layoutRight}>
                        {asd}
                        <Button type="primary" onClick={update}>更新</Button>
                        <Tabs
                            onEdit={onEdit}
                            activeKey={activeKey}
                            onChange={handleTabChange}
                            type="editable-card">
                            {tabs.map(TabItem)}
                        </Tabs>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Form.create<DatabaseDetailProps>()(DataBaseDetail)
