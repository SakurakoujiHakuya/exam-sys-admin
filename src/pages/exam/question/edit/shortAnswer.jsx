import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, message, InputNumber } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as questionApi from '@/api/question';
import * as subjectApi from '@/api/subject';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ShortAnswer = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [subjectFilter, setSubjectFilter] = useState([]);

    const levelEnum = useSelector(state => state.enumItem.user.levelEnum);

    useEffect(() => {
        initSubject();
        if (id) {
            setLoading(true);
            questionApi.select(id).then(res => {
                if (res.code === 1) {
                    const data = res.response;
                    form.setFieldsValue(data);
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
            questionType: 5 // Short Answer
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

                <Form.Item name="correct" label="标答" rules={[{ required: true, message: '请输入标答' }]}>
                    <ReactQuill theme="snow" />
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
                    <Button type="primary" htmlType="submit" loading={loading}>提交</Button>
                    <Button onClick={() => navigate('/exam/question/list')} style={{ marginLeft: 8 }}>取消</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ShortAnswer;
