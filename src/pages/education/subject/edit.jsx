import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { edit, select } from '@/api/subject';
import { formatEnum } from '@/store/slices/enumItemSlice';

const SubjectEdit = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const levelEnum = useSelector(state => state.enumItem.user.levelEnum);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            select(id).then(res => {
                if (res.code === 1) {
                    form.setFieldsValue(res.response);
                } else {
                    message.error(res.message);
                }
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const levelName = formatEnum(levelEnum, values.level);
            const params = {
                ...values,
                id: id,
                levelName: levelName
            };
            const res = await edit(params);
            if (res.code === 1) {
                message.success(res.message);
                navigate('/education/subject/list');
            } else {
                message.error(res.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <div className="app-container">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ level: 1 }}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    name="name"
                    label="学科"
                    rules={[{ required: true, message: '请输入学科名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="level"
                    label="年级"
                    rules={[{ required: true, message: '请选择年级' }]}
                >
                    <Select placeholder="年级">
                        {levelEnum.map(item => (
                            <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                        提交
                    </Button>
                    <Button onClick={onReset}>重置</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SubjectEdit;
