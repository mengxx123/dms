import {
    Card,
    Form,
    message,
} from 'antd'
import React, { Component, Fragment } from 'react';
import { Table } from 'antd'
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { UserStateType } from '@/models/user';
import { TableListItem, TableListPagination, TableListParams } from '@/types/user.d';
import styles from './index.less';
import http from '../../utils/http'

interface UserListProps extends FormComponentProps {
    dispatch: Dispatch<any>;
    loading: boolean;
    user: UserStateType;
}

interface UserListState {
    table: any,
    formValues: {
        [key: string]: string;
    };
}
/* eslint react/no-multi-comp:0 */
// @connect(
//     ({
//         user,
//         loading,
//     }: {
//         user: UserStateType;
//         loading: {
//             models: {
//                 [key: string]: boolean;
//             };
//         };
//     }) => ({
//         user,
//         loading: loading.models.user,
//     }),
// )
class UserList extends Component<UserListProps, UserListState> {
    state: UserListState = {
        table: {
            list: [],
        },
        formValues: {},
    };


    async componentDidMount() {
        // const { dispatch } = this.props;
        // dispatch({
        //   type: 'user/fetchUserList',
        // });
        let res = await http.get<Array<any>('/mysql/databases')
        if (res.status === 200) {
            // message.info('连接成功')
            console.log('res', res.data)
            this.setState({
                table: {
                    list: res.data.map(item => {
                        return {
                            name: item,
                        }
                    })
                }
            })
        } else {
            message.error('连接失败')
        }
    }






    render() {
        const { table } = this.state

        const columns = [
            {
                title: '数据库名称',
                dataIndex: 'name',
                key: 'name',
                render(value: string) {
                    return <a href={`/databases/${value}`}>{value}</a>
                },
            },
            {
                title: '操作',
                dataIndex: 'op',
                key: 'op',
                // render(value) {
                //     return <a href={`/databases/${value}`}>{value}</a>
                // },
            },
        ]


        return (
            <Fragment>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <Table
                            dataSource={table.list}
                            pagination={false}
                            columns={columns} />
                    </div>
                </Card>
            </Fragment>
        );
    }
}

export default Form.create<UserListProps>()(UserList)
