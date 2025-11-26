import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Pagination, message, Modal } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as taskApi from '@/api/task';
import * as examPaperApi from '@/api/examPaper';
import * as subjectApi from '@/api/subject';

const TaskEdit = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [paperItems, setPaperItems] = useState([]);

    // Paper Dialog State
    const [paperModalVisible, setPaperModalVisible] = useState(false);
    const [paperQuery, setPaperQuery] = useState({
        subjectId: null,
        level: null,
        paperType: 6, // Task Paper
        pageIndex: 1,
        pageSize: 5
    });
    const [paperList, setPaperList] = useState([]);
    const [paperTotal, setPaperTotal] = useState(0);
    const [paperLoading, setPaperLoading] = useState(false);
    const [selectedPapers, setSelectedPapers] = useState([]);
    const [paperSubjectFilter, setPaperSubjectFilter] = useState([]);

    const levelEnum = useSelector(state => state.enumItem.user.levelEnum);

    useEffect(() => {
        initSubject();
        if (id) {
            setLoading(true);
            taskApi.select(id).then(res => {
                if (res.code === 1) {
                    const data = res.response;
                    form.setFieldsValue(data);
                    setPaperItems(data.paperItems || []);
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

    const onFinish = (values) => {
        setLoading(true);
        const submitData = { ...values, id: id, paperItems: paperItems };
        taskApi.edit(submitData).then(res => {
            if (res.code === 1) {
                message.success(res.message);
                navigate('/task/list');
            } else {
                message.error(res.message);
            }
            setLoading(false);
        });
    };

    const addPaper = () => {
        const gradeLevel = form.getFieldValue('gradeLevel');
        if (!gradeLevel) {
            message.warning('请先选择年级');
            return;
        }
        setPaperQuery({ ...paperQuery, level: gradeLevel, pageIndex: 1 });
        setPaperSubjectFilter(subjects.filter(data => data.level === gradeLevel));
        setPaperModalVisible(true);
        searchPapers(1, gradeLevel);
    };

    const searchPapers = (page = 1, level = null) => {
        setPaperLoading(true);
        const params = { ...paperQuery, pageIndex: page, level: level || paperQuery.level };
        examPaperApi.taskExamPage(params).then(res => {
            if (res.code === 1) {
                setPaperList(res.response.list);
                setPaperTotal(res.response.total);
                setPaperQuery(params);
            }
            setPaperLoading(false);
        });
    };

    const handlePaperSelect = () => {
        const newItems = [...paperItems];
        selectedPapers.forEach(paper => {
            // Avoid duplicates
            if (!newItems.find(item => item.id === paper.id)) {
                newItems.push(paper);
            }
        });
        setPaperItems(newItems);
        setPaperModalVisible(false);
        setSelectedPapers([]);
    };

    const removePaper = (paperId) => {
        setPaperItems(paperItems.filter(item => item.id !== paperId));
    };

    const subjectFormatter = (subjectId) => {
        const subject = subjects.find(item => item.id === subjectId);
        return subject ? `${subject.name} ( ${subject.levelName} )` : '';
    };

    const paperColumns = [
        { title: 'Id', dataIndex: 'id', width: 90 },
        {
            title: '学科',
            dataIndex: 'subjectId',
            width: 120,
            render: (text) => subjectFormatter(text)
        },
        { title: '名称', dataIndex: 'name' },
        { title: '创建时间', dataIndex: 'createTime', width: 160 }
    ];

    return (
        <div className="app-container">
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="gradeLevel" label="年级" rules={[{ required: true, message: '请选择年级' }]}>
                    <Select placeholder="年级">
                        {levelEnum.map(item => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="试卷">
                    <Table
                        dataSource={paperItems}
                        columns={[
                            ...paperColumns,
                            {
                                title: '操作',
                                width: 160,
                                render: (_, record) => (
                                    <Button type="link" danger onClick={() => removePaper(record.id)}>删除</Button>
                                )
                            }
                        ]}
                        rowKey="id"
                        pagination={false}
                        bordered
                    />
                    <Button type="dashed" onClick={addPaper} style={{ marginTop: 16, width: '100%' }}>+ 添加试卷</Button>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>提交</Button>
                    <Button onClick={() => navigate('/task/list')} style={{ marginLeft: 8 }}>取消</Button>
                </Form.Item>
            </Form>

            <Modal
                title="选择试卷"
                open={paperModalVisible}
                onOk={handlePaperSelect}
                onCancel={() => setPaperModalVisible(false)}
                width={800}
            >
                <Form layout="inline" style={{ marginBottom: 16 }}>
                    <Form.Item label="学科">
                        <Select
                            value={paperQuery.subjectId}
                            onChange={val => setPaperQuery({ ...paperQuery, subjectId: val })}
                            style={{ width: 160 }}
                            allowClear
                        >
                            {paperSubjectFilter.map(item => <Select.Option key={item.id} value={item.id}>{`${item.name} ( ${item.levelName} )`}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={() => searchPapers(1)}>查询</Button>
                    </Form.Item>
                </Form>
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (_, selectedRows) => setSelectedPapers(selectedRows)
                    }}
                    columns={paperColumns}
                    dataSource={paperList}
                    rowKey="id"
                    pagination={false}
                    loading={paperLoading}
                />
                <Pagination
                    total={paperTotal}
                    current={paperQuery.pageIndex}
                    pageSize={paperQuery.pageSize}
                    onChange={(page) => searchPapers(page)}
                    style={{ marginTop: 16, textAlign: 'right' }}
                />
            </Modal>
        </div>
    );
};

export default TaskEdit;
