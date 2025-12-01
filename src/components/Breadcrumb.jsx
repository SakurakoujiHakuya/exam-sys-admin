import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

const BreadcrumbComponent = () => {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);

    const breadcrumbNameMap = {
        '/dashboard': '主页',
        '/user': '用户管理',
        '/user/student': '学生列表',
        '/user/student/list': '学生列表',
        '/user/student/edit': '学生编辑',
        '/user/admin': '管理员列表',
        '/user/admin/list': '管理员列表',
        '/user/admin/edit': '管理员编辑',
        '/exam': '卷题管理',
        '/exam/paper': '试卷列表',
        '/exam/paper/list': '试卷列表',
        '/exam/question': '题目列表',
        '/exam/question/edit': '题目编辑',
        '/exam/question/list': '题目列表',
        '/exam/question/edit/singleChoice': '单选题',
        '/task': '任务管理',
        '/task/list': '任务列表',
        '/education': '教育管理',
        '/education/subject': '学科列表',
        '/education/subject/list': '学科列表',
        '/answer': '成绩管理',
        '/answer/list': '成绩列表',
        '/message': '消息中心',
        '/message/list': '消息列表',
        '/message/send': '发送消息',
        '/profile': '个人中心',
        '/profile/index': '个人中心'
    };

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const title = breadcrumbNameMap[url] || url;
        return {
            key: url,
            // title: <Link to={url}>{title}</Link>,
            title: <span to={url}>{title}</span>,

            titleText: title // Store raw title for filtering
        };
    }).filter((item, index, self) => {
        // Filter out items with the same title as the previous one
        if (index > 0 && item.titleText === self[index - 1].titleText) {
            return false;
        }
        return true;
    });

    const breadcrumbItems = [
        {
            key: 'home',
            title: <Link to="/"><HomeOutlined /> 主页</Link>,
        },
    ].concat(extraBreadcrumbItems);

    // Filter out "主页" if it's already there or if we are on dashboard
    const finalItems = location.pathname === '/dashboard'
        ? [{ key: 'home', title: '主页' }]
        : breadcrumbItems.filter(item => item.key !== '/dashboard');

    return (
        <Breadcrumb items={finalItems} style={{ marginLeft: '10px', float: 'left' }} />
    );
};

export default BreadcrumbComponent;
