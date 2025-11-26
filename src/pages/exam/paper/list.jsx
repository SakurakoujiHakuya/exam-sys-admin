import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Pagination, message, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as examPaperApi from '@/api/examPaper';
import * as subjectApi from '@/api/subject';
import { formatEnum } from '@/store/slices/enumItemSlice';

const ExamPaperList = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [total, setTotal] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [subjectFilter, setSubjectFilter] = useState([]);
    const [queryParam, setQueryParam] = useState({
        id: null,
        level: null,
        subjectId: null,
        pageIndex: 1,
        pageSize: 10
    });

    const levelEnum = useSelector(state => state.enumItem.user.levelEnum);

    useEffect(() => {
        initSubject();
        search();
    }, []);

    const initSubject = () => {
        subjectApi.list().then(res => {
            if (res.code === 1) {
                setSubjects(res.response);
            }
        });
    };

    const search = (page = 1, size = 10) => {
        setLoading(true);
        const params = { ...queryParam, pageIndex: page, pageSize: size };
        examPaperApi.pageList(params).then(res => {
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

    const deletePaper = (id) => {
        examPaperApi.deletePaper(id).then(res => {
            if (res.code === 1) {
                message.success(res.message);
                search(queryParam.pageIndex, queryParam.pageSize);
            } else {
                message.error(res.message);
            }
        });
    };

    const levelChange = (value) => {
        form.setFieldsValue({ subjectId: null });
        if (value) {
            setSubjectFilter(subjects.filter(data => data.level === value));
        } else {
            setSubjectFilter([]);
        }
    };

    const subjectFormatter = (subjectId) => {
        const subject = subjects.find(item => item.id === subjectId);
        return subject ? `${subject.name} ( ${subject.levelName} )` : '';
    };

    const columns = [
        { title: 'Id', dataIndex: 'id', width: 90 },
        {
            title: '学科',
            dataIndex: 'subjectId',
            width: 120,
            render: (text) => subjectFormatter(text)
        },
        { title: '名称', dataIndex: 'name' },
        { title: '创建时间', dataIndex: 'createTime', width: 160 },
        {
            title: '操作',
            width: 160,
            render: (_, record) => (
                <>
                    <Button size="small" onClick={() => navigate(`/exam/paper/edit?id=${record.id}`)} style={{ marginRight: 8 }}>编辑</Button>
                    <Popconfirm title="确定删除吗?" onConfirm={() => deletePaper(record.id)}>
                        <Button size="small" danger>删除</Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    return (
        <div className="app-container">
            <Form form={form} layout="inline" onFinish={onFinish} style={{ marginBottom: 16 }}>
                <Form.Item name="id" label="题目ID">
                    <Input allowClear />
                </Form.Item>
                <Form.Item name="level" label="年级">
                    <Select placeholder="年级" onChange={levelChange} allowClear style={{ width: 120 }}>
                        {levelEnum.map(item => (
                            <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="subjectId" label="学科">
                    <Select placeholder="学科" allowClear style={{ width: 160 }}>
                        {subjectFilter.map(item => (
                            <Select.Option key={item.id} value={item.id}>{`${item.name} ( ${item.levelName} )`}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button type="primary" onClick={() => navigate('/exam/paper/edit')} style={{ marginLeft: 8 }}>添加</Button>
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

export default ExamPaperList;
