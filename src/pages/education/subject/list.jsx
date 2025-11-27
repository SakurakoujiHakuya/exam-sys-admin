import React, { useState, useEffect } from 'react';
import { Table, Form, Select, Button, Space, Popconfirm, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { pageList, deleteSubject } from '@/api/subject';

const SubjectList = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const levelEnum = useSelector(state => state.enumItem.user.levelEnum);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true
    });

    const fetchData = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const res = await pageList({
                pageIndex: page,
                pageSize: size,
                level: values.level
            });
            if (res.code === 1) {
                setData(res.response.list);
                setPagination(prev => ({
                    ...prev,
                    current: res.response.pageNum,
                    total: res.response.total
                }));
            } else {
                message.error(res.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, []);

    const handleTableChange = (pagination) => {
        setPagination(pagination);
        fetchData(pagination.current, pagination.pageSize);
    };

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, current: 1 }));
        fetchData(1, pagination.pageSize);
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteSubject(id);
            if (res.code === 1) {
                message.success(res.message);
                fetchData(pagination.current, pagination.pageSize);
            } else {
                message.error(res.message);
            }
        } catch (error) {
            message.error('删除失败');
        }
    };

    const columns = [
        { title: 'Id', dataIndex: 'id', key: 'id' },
        { title: '学科', dataIndex: 'name', key: 'name' },
        { title: '年级', dataIndex: 'levelName', key: 'levelName' },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" onClick={() => navigate(`/education/subject/edit?id=${record.id}`)}>编辑</Button>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <Button size="small" danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="app-container">
            <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
                <Form.Item name="level" label="年级">
                    <Select placeholder="年级" style={{ width: 120 }} allowClear>
                        {levelEnum.map(item => (
                            <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={() => navigate('/education/subject/edit')}>添加</Button>
                </Form.Item>
            </Form>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                bordered
            />
        </div>
    );
};

export default SubjectList;
