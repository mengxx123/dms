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
        title: 'Tab 1',
        key: '1',
        defaultSql: 'SELECT * FROM target.user LIMIT 20;'
    },
    {
        title: 'Tab 2',
        key: '2',
        defaultSql: '',
    },
]

class DataBaseDetail extends Component<DatabaseDetailProps, DadabaseDetailState> {
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
                }
            })
        } else {
            message.error('连接失败')
        }
    }

    render() {
        const { table, tabs, activeKey, asd } = this.state


        const setState = this.setState

        const update = () => {
            setState({
                asd: '2222'
            })
        }

        return (
            <Fragment>
                <div className={styles.layout}>
                    {asd}
                    <Button type="primary" onClick={e => update()}>更新</Button>
                </div>
            </Fragment>
        );
    }
}

export default Form.create<DatabaseDetailProps>()(DataBaseDetail)
