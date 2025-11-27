import React, { useState, useEffect } from 'react';
import { Table, Form, Select, Button, message } from 'antd';
import { page } from '@/api/examPaperAnwser';
import { list as subjectList } from '@/api/subject';

const AnswerList = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true
    });

    useEffect(() => {
        // Fetch subjects
        subjectList().then(res => {
            if (res.code === 1) {
                setSubjects(res.response);
            }
        });
        fetchData(pagination.current, pagination.pageSize);
    }, []);

    const fetchData = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const res = await page({
                pageIndex: page,
                pageSize: size,
                subjectId: values.subjectId
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

    const handleTableChange = (pagination) => {
        setPagination(pagination);
        fetchData(pagination.current, pagination.pageSize);
    };

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, current: 1 }));
        fetchData(1, pagination.pageSize);
    };

    const columns = [
        { title: 'Id', dataIndex: 'id', key: 'id', width: 100 },
        { title: '试卷名称', dataIndex: 'paperName', key: 'paperName' },
        { title: '用户名称', dataIndex: 'userName', key: 'userName' },
        {
            title: '得分',
            key: 'score',
            width: 100,
            render: (_, record) => `${record.userScore} / ${record.paperScore}`
        },
        {
            title: '题目对错',
            key: 'questionCorrect',
            width: 100,
            render: (_, record) => `${record.questionCorrect} / ${record.questionCount}`
        },
        { title: '耗时', dataIndex: 'doTime', key: 'doTime', width: 100 },
        { title: '提交时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
    ];

    return (
        <div className="app-container">
            <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
                <Form.Item name="subjectId" label="学科">
                    <Select placeholder="学科" style={{ width: 120 }} allowClear>
                        {subjects.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
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

export default AnswerList;
