import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Tag, Popconfirm, message, Space } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as userApi from '@/api/user';
import { formatEnum } from '@/store/slices/enumItemSlice';

const UserStudentList = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [queryParams, setQueryParams] = useState({
        userName: '',
        role: 1, // Student role
        pageIndex: 1,
        pageSize: 10
    });

    const { sexEnum, statusEnum, statusTag, statusBtn, levelEnum } = useSelector(state => state.enumItem.user);

    const fetchData = () => {
        setLoading(true);
        userApi.getUserPageList(queryParams).then(res => {
            if (res.code === 1) {
                setData(res.response.list);
                setTotal(res.response.total);
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchData();
    }, [queryParams]);

    const onSearch = (values) => {
        setQueryParams({
            ...queryParams,
            ...values,
            pageIndex: 1
        });
    };

    const changeStatus = (row) => {
        userApi.changeStatus(row.id).then(res => {
            if (res.code === 1) {
                message.success(res.message);
                fetchData();
            } else {
                message.error(res.message);
            }
        });
    };

    const deleteUser = (row) => {
        userApi.deleteUser(row.id).then(res => {
            if (res.code === 1) {
                message.success(res.message);
                fetchData();
            } else {
                message.error(res.message);
            }
        });
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '真实姓名',
            dataIndex: 'realName',
            key: 'realName',
        },
        {
            title: '学级',
            dataIndex: 'userLevel',
            key: 'userLevel',
            render: (text) => formatEnum(levelEnum, text)
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            render: (text) => formatEnum(sexEnum, text)
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 200
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (text) => {
                const tagType = formatEnum(statusTag, text);
                const statusText = formatEnum(statusEnum, text);
                return <Tag color={tagType === 'danger' ? 'error' : tagType}>{statusText}</Tag>;
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 270,
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" onClick={() => changeStatus(record)}>
                        {formatEnum(statusBtn, record.status)}
                    </Button>
                    <Button size="small" onClick={() => navigate(`/user/student/edit?id=${record.id}`)}>
                        编辑
                    </Button>
                    <Button size="small" onClick={() => navigate(`/log/user/list?userId=${record.id}`)}>
                        日志
                    </Button>
                    <Popconfirm title="确定删除吗?" onConfirm={() => deleteUser(record)}>
                        <Button size="small" danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="app-container">
            <Form
                form={form}
                layout="inline"
                onFinish={onSearch}
                initialValues={{ userName: '' }}
                className="search-form"
            >
                <Form.Item name="userName" label="用户名">
                    <Input placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={() => navigate('/user/student/edit')}>添加</Button>
                </Form.Item>
            </Form>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: queryParams.pageIndex,
                    pageSize: queryParams.pageSize,
                    total: total,
                    onChange: (page, pageSize) => {
                        setQueryParams({
                            ...queryParams,
                            pageIndex: page,
                            pageSize: pageSize
                        });
                    }
                }}
            />
        </div>
    );
};

export default UserStudentList;
