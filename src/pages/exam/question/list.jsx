import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Pagination, message, Popconfirm, Popover } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as questionApi from '@/api/question';
import * as subjectApi from '@/api/subject';
import { formatEnum } from '@/store/slices/enumItemSlice';

const QuestionList = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [total, setTotal] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [subjectFilter, setSubjectFilter] = useState([]);
    const [queryParam, setQueryParam] = useState({
        id: null,
        questionType: null,
        level: null,
        subjectId: null,
        pageIndex: 1,
        pageSize: 10
    });

    const levelEnum = useSelector(state => state.enumItem.user.levelEnum);
    const questionTypeEnum = useSelector(state => state.enumItem.exam.question.typeEnum);
    const editUrlEnum = useSelector(state => state.enumItem.exam.question.editUrlEnum);

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
        questionApi.pageList(params).then(res => {
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

    const deleteQuestion = (id) => {
        questionApi.deleteQuestion(id).then(res => {
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

    const editQuestion = (record) => {
        const urlItem = editUrlEnum.find(item => item.key === record.questionType);
        if (urlItem) {
            navigate(`${urlItem.value}?id=${record.id}`);
        }
    };

    const columns = [
        { title: 'Id', dataIndex: 'id', width: 90 },
        {
            title: '学科',
            dataIndex: 'subjectId',
            width: 120,
            render: (text) => subjectFormatter(text)
        },
        {
            title: '题型',
            dataIndex: 'questionType',
            width: 70,
            render: (text) => formatEnum(questionTypeEnum, text)
        },
        { title: '题干', dataIndex: 'shortTitle', ellipsis: true },
        { title: '分数', dataIndex: 'score', width: 60 },
        { title: '难度', dataIndex: 'difficult', width: 60 },
        { title: '创建时间', dataIndex: 'createTime', width: 160 },
        {
            title: '操作',
            width: 220,
            render: (_, record) => (
                <>
                    <Button size="small" onClick={() => editQuestion(record)} style={{ marginRight: 8 }}>编辑</Button>
                    <Popconfirm title="确定删除吗?" onConfirm={() => deleteQuestion(record.id)}>
                        <Button size="small" danger>删除</Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    const addContent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {editUrlEnum.map(item => (
                <Button key={item.key} type="dashed" onClick={() => navigate(item.value)}>
                    {item.name}
                </Button>
            ))}
        </div>
    );

    return (
        <div className="app-container">
            <Form form={form} layout="inline" onFinish={onFinish} style={{ marginBottom: 16 }}>
                <Form.Item name="id" label="题目ID">
                    <Input allowClear style={{ width: 100 }} />
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
                <Form.Item name="questionType" label="题型">
                    <Select placeholder="题型" allowClear style={{ width: 120 }}>
                        {questionTypeEnum.map(item => (
                            <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Popover content={addContent} title="选择题型" trigger="click">
                        <Button type="primary" style={{ marginLeft: 8 }}>添加</Button>
                    </Popover>
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

export default QuestionList;
