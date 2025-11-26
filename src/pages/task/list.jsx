import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Table, Pagination, message, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as taskApi from '@/api/task';
import { formatEnum } from '@/store/slices/enumItemSlice';

const TaskList = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [total, setTotal] = useState(0);
    const [queryParam, setQueryParam] = useState({
        gradeLevel: null,
        pageIndex: 1,
        pageSize: 10
    });

    const levelEnum = useSelector(state => state.enumItem.user.levelEnum);

    useEffect(() => {
        search();
    }, []);

    const search = (page = 1, size = 10) => {
        setLoading(true);
        const params = { ...queryParam, pageIndex: page, pageSize: size };
        taskApi.pageList(params).then(res => {
            if (res.code === 1) {
                setTableData(res.response.list);
                setTotal(res.response.total);
                setQueryParam(params);
            }
            setLoading(false);
        });
    };

    const onFinish = (values) => {
        setQueryParam({ ...queryParam, ...values, pageIndex: 1 });
        search(1, queryParam.pageSize);
    };

    const deleteTask = (id) => {
        taskApi.deleteTask(id).then(res => {
            if (res.code === 1) {
                message.success(res.message);
                search(queryParam.pageIndex, queryParam.pageSize);
            } else {
                message.error(res.message);
            }
        });
    };

    const columns = [
        { title: 'Id', dataIndex: 'id', width: 100 },
        { title: '标题', dataIndex: 'title' },
        {
            title: '学级',
            dataIndex: 'gradeLevel',
            render: (text) => formatEnum(levelEnum, text)
        },
        { title: '发送人', dataIndex: 'createUserName', width: 100 },
        { title: '创建时间', dataIndex: 'createTime', width: 160 },
        {
            title: '操作',
            width: 160,
            render: (_, record) => (
                <>
                    <Button size="small" onClick={() => navigate(`/task/edit?id=${record.id}`)} style={{ marginRight: 8 }}>编辑</Button>
                    <Popconfirm title="确定删除吗?" onConfirm={() => deleteTask(record.id)}>
                        <Button size="small" danger>删除</Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    return (
        <div className="app-container">
            <Form form={form} layout="inline" onFinish={onFinish} style={{ marginBottom: 16 }}>
                <Form.Item name="gradeLevel" label="年级">
                    <Select placeholder="年级" allowClear style={{ width: 120 }}>
                        {levelEnum.map(item => (
                            <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button type="primary" onClick={() => navigate('/task/edit')} style={{ marginLeft: 8 }}>添加</Button>
                </Form.Item>
            </Form>

            <Table
                loading={loading}
                columns={columns}
                dataSource={tableData}
                rowKey="id"
                pagination={false}
                bordered
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Pagination
                    total={total}
                    current={queryParam.pageIndex}
                    pageSize={queryParam.pageSize}
                    onChange={(page, pageSize) => search(page, pageSize)}
                    showSizeChanger
                    showQuickJumper
                />
            </div>
        </div>
    );
};

export default TaskList;
