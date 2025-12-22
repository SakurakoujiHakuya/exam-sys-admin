import React, { useState, useEffect } from 'react';
import { Form, Input,InputNumber, Button, Select, DatePicker, message, Card, Spin, Space } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as userApi from '@/api/user';
import dayjs from 'dayjs';

const { Option } = Select;

const UserStudentEdit = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const { sexEnum, statusEnum, levelEnum } = useSelector(state => state.enumItem.user);

    useEffect(() => {
        if (id && parseInt(id) !== 0) {
            setFormLoading(true);
            userApi.selectUser(id).then(res => {
                const data = res.response;
                // Convert birthDay to dayjs object for DatePicker
                if (data.birthDay) {
                    data.birthDay = dayjs(data.birthDay);
                }
                form.setFieldsValue(data);
                setFormLoading(false);
            }).catch(() => {
                setFormLoading(false);
            });
        }
    }, [id, form]);

    const onFinish = (values) => {
        setLoading(true);
        const submitData = {
            ...values,
            id: id,
            role: 1, // Student role
            birthDay: values.birthDay ? values.birthDay.format('YYYY-MM-DD') : null
        };

        userApi.createUser(submitData).then(res => {
            if (res.code === 1) {
                message.success(res.message);
                navigate('/user/student/list');
            } else {
                message.error(res.message);
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <div className="app-container">
            <Card title={id ? "编辑学生" : "添加学生"} bordered={false}>
                <Spin spinning={formLoading}>
                    <Form
                        form={form}
                        layout="horizontal"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        onFinish={onFinish}
                        initialValues={{
                            status: 1,
                            sex: '',
                            role: 1
                        }}
                    >
                        <Form.Item
                            name="userName"
                            label="用户名"
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="密码"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="realName"
                            label="真实姓名"
                            rules={[{ required: true, message: '请输入真实姓名' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="age" label="年龄">
                            <InputNumber min={1} max={24}/>
                        </Form.Item>
                        <Form.Item name="sex" label="性别">
                            <Select placeholder="性别" allowClear>
                                {sexEnum.map(item => (
                                    <Option key={item.key} value={item.key}>{item.value}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="birthDay" label="出生日期">
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="phone" label="手机">
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="userLevel"
                            label="年级"
                            rules={[{ required: true, message: '请选择年级' }]}
                        >
                            <Select placeholder="年级">
                                {levelEnum.map(item => (
                                    <Option key={item.key} value={item.key}>{item.value}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="状态"
                            rules={[{ required: true, message: '请选择状态' }]}
                        >
                            <Select placeholder="状态">
                                {statusEnum.map(item => (
                                    <Option key={item.key} value={item.key}>{item.value}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
                            <Space>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    提交
                                </Button>
                                <Button onClick={onReset}>重置</Button>
                                <Button onClick={() => navigate('/user/student/list')}>返回</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};

export default UserStudentEdit;
