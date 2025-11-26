import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, DatePicker, Card, Row, Col, message, Modal, Table, Pagination } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as examPaperApi from '@/api/examPaper';
import * as subjectApi from '@/api/subject';
import * as questionApi from '@/api/question';
import { formatEnum } from '@/store/slices/enumItemSlice';
import dayjs from 'dayjs';

const ExamPaperEdit = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [subjectFilter, setSubjectFilter] = useState([]);
    const [titleItems, setTitleItems] = useState([]);

    // Question Dialog State
    const [questionModalVisible, setQuestionModalVisible] = useState(false);
    const [currentTitleIndex, setCurrentTitleIndex] = useState(null);
    const [questionQuery, setQuestionQuery] = useState({
        id: null,
        questionType: null,
        subjectId: null,
        pageIndex: 1,
        pageSize: 5
    });
    const [questionList, setQuestionList] = useState([]);
    const [questionTotal, setQuestionTotal] = useState(0);
    const [questionLoading, setQuestionLoading] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    const levelEnum = useSelector(state => state.enumItem.user.levelEnum);
    const paperTypeEnum = useSelector(state => state.enumItem.exam.examPaper.paperTypeEnum);
    const questionTypeEnum = useSelector(state => state.enumItem.exam.question.typeEnum);

    useEffect(() => {
        initSubject();
        if (id) {
            setLoading(true);
            examPaperApi.select(id).then(res => {
                if (res.code === 1) {
                    const data = res.response;
                    // Format dates if needed
                    if (data.limitDateTime && data.limitDateTime.length === 2) {
                        data.limitDateTime = [dayjs(data.limitDateTime[0]), dayjs(data.limitDateTime[1])];
                    }
                    form.setFieldsValue(data);
                    setTitleItems(data.titleItems || []);
                    // Trigger subject filter
                    if (data.level) {
                        levelChange(data.level, false);
                    }
                }
                setLoading(false);
            });
        }
    }, [id]);

    const initSubject = () => {
        subjectApi.list().then(res => {
            if (res.code === 1) {
                setSubjects(res.response);
            }
        });
    };

    const levelChange = (value, resetSubject = true) => {
        if (resetSubject) {
            form.setFieldsValue({ subjectId: null });
        }
        if (value) {
            // Wait for subjects to be loaded if calling from useEffect
            if (subjects.length > 0) {
                setSubjectFilter(subjects.filter(data => data.level === value));
            } else {
                // Retry or handle async issue? 
                // Actually initSubject is async, so we might need to wait.
                // For simplicity, let's assume subjects are loaded or we filter in render if needed.
                // Better approach: use a ref or effect for filtering when subjects change.
            }
        } else {
            setSubjectFilter([]);
        }
    };

    // Effect to update filter when subjects are loaded
    useEffect(() => {
        const level = form.getFieldValue('level');
        if (level && subjects.length > 0) {
            setSubjectFilter(subjects.filter(data => data.level === level));
        }
    }, [subjects]);


    const onFinish = (values) => {
        setLoading(true);
        const submitData = { ...values, id: id, titleItems: titleItems };

        // Format dates back to string
        if (submitData.limitDateTime && submitData.limitDateTime.length === 2) {
            submitData.limitDateTime = [
                submitData.limitDateTime[0].format('YYYY-MM-DD HH:mm:ss'),
                submitData.limitDateTime[1].format('YYYY-MM-DD HH:mm:ss')
            ];
        }

        examPaperApi.edit(submitData).then(res => {
            if (res.code === 1) {
                message.success(res.message);
                navigate('/exam/paper/list');
            } else {
                message.error(res.message);
            }
            setLoading(false);
        });
    };

    const addTitle = () => {
        setTitleItems([...titleItems, { name: '', questionItems: [] }]);
    };

    const removeTitle = (index) => {
        const newItems = [...titleItems];
        newItems.splice(index, 1);
        setTitleItems(newItems);
    };

    const updateTitleName = (index, name) => {
        const newItems = [...titleItems];
        newItems[index].name = name;
        setTitleItems(newItems);
    };

    const openQuestionModal = (index) => {
        setCurrentTitleIndex(index);
        setQuestionQuery({ ...questionQuery, subjectId: form.getFieldValue('subjectId'), pageIndex: 1 });
        setQuestionModalVisible(true);
        searchQuestions(1);
    };

    const searchQuestions = (page = 1) => {
        setQuestionLoading(true);
        const params = { ...questionQuery, pageIndex: page, subjectId: form.getFieldValue('subjectId') };
        questionApi.pageList(params).then(res => {
            if (res.code === 1) {
                setQuestionList(res.response.list);
                setQuestionTotal(res.response.total);
                setQuestionQuery(params);
            }
            setQuestionLoading(false);
        });
    };

    const handleQuestionSelect = () => {
        const newItems = [...titleItems];
        const currentQuestions = newItems[currentTitleIndex].questionItems;

        // Fetch full question details for selected IDs
        const promises = selectedQuestions.map(qId => questionApi.select(qId));
        Promise.all(promises).then(results => {
            results.forEach(res => {
                if (res.code === 1) {
                    currentQuestions.push(res.response);
                }
            });
            setTitleItems(newItems);
            setQuestionModalVisible(false);
            setSelectedQuestions([]);
        });
    };

    const removeQuestion = (titleIndex, questionIndex) => {
        const newItems = [...titleItems];
        newItems[titleIndex].questionItems.splice(questionIndex, 1);
        setTitleItems(newItems);
    };

    const questionColumns = [
        { title: 'Id', dataIndex: 'id', width: 60 },
        {
            title: '题型',
            dataIndex: 'questionType',
            width: 70,
            render: (text) => formatEnum(questionTypeEnum, text)
        },
        { title: '题干', dataIndex: 'shortTitle', ellipsis: true }
    ];

    return (
        <div className="app-container">
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ paperType: 1 }}>
                <Form.Item name="level" label="年级" rules={[{ required: true, message: '请选择年级' }]}>
                    <Select placeholder="年级" onChange={(val) => levelChange(val)}>
                        {levelEnum.map(item => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item name="subjectId" label="学科" rules={[{ required: true, message: '请选择学科' }]}>
                    <Select placeholder="学科">
                        {subjectFilter.map(item => <Select.Option key={item.id} value={item.id}>{`${item.name} ( ${item.levelName} )`}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item name="paperType" label="试卷类型" rules={[{ required: true, message: '请选择试卷类型' }]}>
                    <Select placeholder="试卷类型">
                        {paperTypeEnum.map(item => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item noStyle shouldUpdate={(prev, current) => prev.paperType !== current.paperType}>
                    {({ getFieldValue }) =>
                        getFieldValue('paperType') === 4 ? (
                            <Form.Item name="limitDateTime" label="时间限制" rules={[{ required: true, message: '请选择时间限制' }]}>
                                <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                        ) : null
                    }
                </Form.Item>
                <Form.Item name="name" label="试卷名称" rules={[{ required: true, message: '请输入试卷名称' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="suggestTime" label="建议时长" rules={[{ required: true, message: '请输入建议时长' }]}>
                    <Input suffix="分钟" />
                </Form.Item>

                {titleItems.map((item, index) => (
                    <Card key={index} title={`标题${index + 1}`} extra={
                        <Button type="link" danger onClick={() => removeTitle(index)}>删除</Button>
                    } style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', marginBottom: 16 }}>
                            <Input value={item.name} onChange={(e) => updateTitleName(index, e.target.value)} placeholder="请输入标题名称" style={{ marginRight: 16 }} />
                            <Button type="primary" onClick={() => openQuestionModal(index)}>添加题目</Button>
                        </div>
                        {item.questionItems.map((q, qIndex) => (
                            <div key={qIndex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '8px 0' }}>
                                <div dangerouslySetInnerHTML={{ __html: q.title }} style={{ flex: 1 }}></div>
                                <Button type="link" danger onClick={() => removeQuestion(index, qIndex)}>删除</Button>
                            </div>
                        ))}
                    </Card>
                ))}

                <Form.Item>
                    <Button type="dashed" onClick={addTitle} block style={{ marginBottom: 16 }}>
                        + 添加标题
                    </Button>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>提交</Button>
                    <Button onClick={() => navigate('/exam/paper/list')} style={{ marginLeft: 8 }}>取消</Button>
                </Form.Item>
            </Form>

            <Modal
                title="选择题目"
                open={questionModalVisible}
                onOk={handleQuestionSelect}
                onCancel={() => setQuestionModalVisible(false)}
                width={800}
            >
                <Form layout="inline" style={{ marginBottom: 16 }}>
                    <Form.Item label="ID">
                        <Input value={questionQuery.id} onChange={e => setQuestionQuery({ ...questionQuery, id: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="题型">
                        <Select value={questionQuery.questionType} onChange={val => setQuestionQuery({ ...questionQuery, questionType: val })} style={{ width: 120 }} allowClear>
                            {questionTypeEnum.map(item => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={() => searchQuestions(1)}>查询</Button>
                    </Form.Item>
                </Form>
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys) => setSelectedQuestions(selectedRowKeys)
                    }}
                    columns={questionColumns}
                    dataSource={questionList}
                    rowKey="id"
                    pagination={false}
                    loading={questionLoading}
                />
                <Pagination
                    total={questionTotal}
                    current={questionQuery.pageIndex}
                    pageSize={questionQuery.pageSize}
                    onChange={(page) => searchQuestions(page)}
                    style={{ marginTop: 16, textAlign: 'right' }}
                />
            </Modal>
        </div>
    );
};

export default ExamPaperEdit;
