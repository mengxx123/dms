import {
    Badge,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Dropdown,
    Form,
    Icon,
    Input,
    InputNumber,
    Menu,
    Row,
    Select,
    message,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { Table } from 'antd'
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import dayjs from 'dayjs';
import { UserStateType } from '@/models/user';
import StandardTable, { StandardTableColumnProps } from '@/components/StandardTable';
import { TableListItem, TableListPagination, TableListParams } from '@/types/user.d';
import styles from './index.less';
import http from '../../utils/http'

const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

interface UserListProps extends FormComponentProps {
    dispatch: Dispatch<any>;
    loading: boolean;
    user: UserStateType;
}

interface UserListState {
    table: any,
    selectedRows: TableListItem[];
    formValues: {
        [key: string]: string;
    };
}
/* eslint react/no-multi-comp:0 */
@connect(
    ({
        user,
        loading,
    }: {
        user: UserStateType;
        loading: {
            models: {
                [key: string]: boolean;
            };
        };
    }) => ({
        user,
        loading: loading.models.user,
    }),
)
class UserList extends Component<UserListProps, UserListState> {
    state: UserListState = {
        table: {
            list: [],
        },
        selectedRows: [],
        formValues: {},
    };

    columns: StandardTableColumnProps[] = [
        {
            title: '规则名称',
            dataIndex: 'name',
        },
        {
            title: '描述',
            dataIndex: 'desc',
        },
        {
            title: '服务调用次数',
            dataIndex: 'callNo',
            sorter: true,
            align: 'right',
            render: (val: string) => `${val}万`,
        },
        {
            title: '状态',
            dataIndex: 'status',
            filters: [
                {
                    text: status[0],
                    value: '0',
                },
                {
                    text: status[1],
                    value: '1',
                },
                {
                    text: status[2],
                    value: '2',
                },
                {
                    text: status[3],
                    value: '3',
                },
            ],
            render(val: IStatusMapType) {
                return <Badge status={statusMap[val]} text={status[val]} />;
            },
        },
        {
            title: '上次调度时间',
            dataIndex: 'updatedAt',
            sorter: true,
            render: (val: string) => <span>{dayjs(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    {/* <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a> */}
                    <a href="">编辑</a>
                    <Divider type="vertical" />
                    <a href="">配置</a>
                </Fragment>
            ),
        },
    ];

    async componentDidMount() {
        // const { dispatch } = this.props;
        // dispatch({
        //   type: 'user/fetchUserList',
        // });
        let res = await http.get('/mysql/databases')
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

    handleSelectRows = (rows: TableListItem[]) => {
        this.setState({
            selectedRows: rows,
        });
    };

    handleTableChange = (
        pagination: Partial<TableListPagination>,
        filtersArg: Record<keyof TableListItem, string[]>,
        sorter: SorterResult<TableListItem>,
    ) => {
        // console.log('pagination', pagination);
        // console.log('filtersArg', filtersArg);
        // console.log('sorter', sorter);
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});
        console.log('filters', filters);
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params: Partial<TableListParams> = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
            type: 'user/fetchUserList',
            payload: params,
        });
    };

    handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const { dispatch, form } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
                ...fieldsValue,
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'user/fetchUserList',
                payload: values,
            });
        });
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'user/fetchUserList',
            payload: {},
        });
    };

    handleMenuClick = (e: { key: string }) => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;

        if (!selectedRows) return;
        switch (e.key) {
            case 'remove':
                dispatch({
                    type: 'user/removeUser',
                    payload: {
                        key: selectedRows.map(row => row.key),
                    },
                    callback: () => {
                        this.setState({
                            selectedRows: [],
                        });
                    },
                });
                break;
            default:
                break;
        }
    };

    renderSimpleForm() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="规则名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">关闭</Option>
                                    <Option value="1">运行中</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">
                                查询
              </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
              </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        const { table } = this.state

        const columns = [
            {
                title: '数据库名称',
                dataIndex: 'name',
                key: 'name',
                render(value) {
                    return <a href={`/databases/${value}`}>{value}</a>
                },
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
