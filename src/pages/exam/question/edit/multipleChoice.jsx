import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, Checkbox, message, InputNumber, Space } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as questionApi from '@/api/question';
import * as subjectApi from '@/api/subject';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import QuestionShow from '../components/Show';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const MultipleChoice = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [subjectFilter, setSubjectFilter] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);

    const [items, setItems] = useState([
        { prefix: 'A', content: '' },
        { prefix: 'B', content: '' },
        { prefix: 'C', content: '' },
        { prefix: 'D', content: '' }
    ]);

    const levelEnum = useSelector(state => state.enumItem.user.levelEnum);

    useEffect(() => {
        initSubject();
        if (id) {
            setLoading(true);
            questionApi.select(id).then(res => {
                if (res.code === 1) {
                    const data = res.response;
                    // correct array needs to be handled if it comes as string or array
                    if (data.correct && typeof data.correct === 'string') {
                        data.correct = data.correct.split(',');
                    }
                    form.setFieldsValue(data);
                    setItems(data.items || []);
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
            if (subjects.length > 0) {
                setSubjectFilter(subjects.filter(data => data.level === value));
            }
        } else {
            setSubjectFilter([]);
        }
    };

    useEffect(() => {
        const level = form.getFieldValue('level');
        if (level && subjects.length > 0) {
            setSubjectFilter(subjects.filter(data => data.level === level));
        }
    }, [subjects]);

    const onFinish = (values) => {
        setLoading(true);
        const submitData = {
            ...values,
            id: id,
            questionType: 2, // Multiple Choice
            items: items,
            correct: values.correct.join(',') // Convert array to comma-separated string
        };

        questionApi.edit(submitData).then(res => {
            if (res.code === 1) {
                message.success(res.message);
                navigate('/exam/question/list');
            } else {
                message.error(res.message);
            }
            setLoading(false);
        });
    };

    const updateItem = (index, content) => {
        const newItems = [...items];
        newItems[index].content = content;
        setItems(newItems);
    };

    const addItem = () => {
        const newItems = [...items];
        const lastPrefix = newItems.length > 0 ? newItems[newItems.length - 1].prefix : '@';
        const newPrefix = String.fromCharCode(lastPrefix.charCodeAt(0) + 1);
        newItems.push({ prefix: newPrefix, content: '' });
        setItems(newItems);
    };

    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        newItems.forEach((item, idx) => {
            item.prefix = String.fromCharCode(65 + idx);
        });
        setItems(newItems);
    };

    const resetForm = () => {
        form.resetFields();
        setItems([
            { prefix: 'A', content: '' },
            { prefix: 'B', content: '' },
            { prefix: 'C', content: '' },
            { prefix: 'D', content: '' }
        ]);
    };

    return (
        <div className="app-container">
            <Form form={form} layout="vertical" onFinish={onFinish}>
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
                <Form.Item name="title" label="题干" rules={[{ required: true, message: '请输入题干' }]}>
                    <ReactQuill theme="snow" />
                </Form.Item>

                <Form.Item label="选项">
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ marginRight: 8, fontWeight: 'bold', width: '20px' }}>{item.prefix}</span>
                            <Input value={item.content} onChange={(e) => updateItem(index, e.target.value)} style={{ marginRight: 8 }} />
                            <Button type="danger" icon={<DeleteOutlined />} onClick={() => removeItem(index)} />
                        </div>
                    ))}
                    <Button type="dashed" onClick={addItem} icon={<PlusOutlined />} style={{ width: '100%' }}>添加选项</Button>
                </Form.Item>

                <Form.Item name="correct" label="正确答案" rules={[{ required: true, message: '请选择正确答案' }]}>
                    <Checkbox.Group>
                        {items.map(item => (
                            <Checkbox key={item.prefix} value={item.prefix}>{item.prefix}</Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item name="analyze" label="解析" rules={[{ required: true, message: '请输入解析' }]}>
                    <ReactQuill theme="snow" />
                </Form.Item>

                <Form.Item name="score" label="分数" rules={[{ required: true, message: '请输入分数' }]}>
                    <InputNumber min={0} precision={1} />
                </Form.Item>

                <Form.Item name="difficult" label="难度" rules={[{ required: true, message: '请输入难度' }]}>
                    <InputNumber min={1} max={5} />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading}>提交</Button>
                        <Button onClick={resetForm}>重置</Button>
                        <Button type="success" onClick={() => setPreviewVisible(true)}>预览</Button>
                        <Button onClick={() => navigate('/exam/question/list')}>取消</Button>
                    </Space>
                </Form.Item>
            </Form>

            <QuestionShow
                visible={previewVisible}
                onClose={() => setPreviewVisible(false)}
                qType={2}
                question={{
                    ...form.getFieldsValue(),
                    items: items
                }}
            />
        </div>
    );
};

export default MultipleChoice;
