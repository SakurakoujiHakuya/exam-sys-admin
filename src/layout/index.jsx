import React, { useState, useRef, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    HomeOutlined,
    TeamOutlined,
    FileTextOutlined,
    ReadOutlined,
    MessageOutlined,
    ProfileOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation, useOutlet } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import './index.scss';
import { useSelector, useDispatch } from 'react-redux';
import { clearLogin } from '@/store/slices/userSlice';
import { logout } from '@/api/login';
import BreadcrumbComponent from '@/components/Breadcrumb';
import TagsView from '@/components/TagsView';
import logo from '@/assets/logo.png';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.user);

    const handleLogout = () => {
        logout().then(() => {
            dispatch(clearLogin());
            navigate('/login');
        });
    };

    const menuItems = [
        {
            key: '/dashboard',
            icon: <HomeOutlined />,
            label: '主页',
            onClick: () => navigate('/dashboard')
        },
        {
            key: '/user',
            icon: <TeamOutlined />,
            label: '用户管理',
            children: [
                { key: '/user/student/list', label: '学生列表', onClick: () => navigate('/user/student/list') },
                { key: '/user/admin/list', label: '管理员列表', onClick: () => navigate('/user/admin/list') }
            ]
        },
        {
            key: '/exam',
            icon: <FileTextOutlined />,
            label: '卷题管理',
            children: [
                { key: '/exam/paper/list', label: '试卷列表', onClick: () => navigate('/exam/paper/list') },
                { key: '/exam/question/list', label: '题目列表', onClick: () => navigate('/exam/question/list') }
            ]
        },
        {
            key: '/task',
            icon: <ProfileOutlined />,
            label: '任务管理',
            children: [
                { key: '/task/list', label: '任务列表', onClick: () => navigate('/task/list') }
            ]
        },
        {
            key: '/education',
            icon: <ReadOutlined />,
            label: '教育管理',
            children: [
                { key: '/education/subject/list', label: '学科列表', onClick: () => navigate('/education/subject/list') }
            ]
        },
        {
            key: '/answer',
            icon: <FileTextOutlined />,
            label: '成绩管理',
            children: [
                { key: '/answer/list', label: '答卷列表', onClick: () => navigate('/answer/list') }
            ]
        },
        {
            key: '/message',
            icon: <MessageOutlined />,
            label: '消息中心',
            children: [
                { key: '/message/list', label: '消息列表', onClick: () => navigate('/message/list') },
                { key: '/message/send', label: '消息发送', onClick: () => navigate('/message/send') }
            ]
        }
    ];

    const userMenuItems = [
        { key: 'profile', label: '个人简介' },
        { key: 'logout', label: '退出登录' }
    ];

    const handleUserMenuClick = ({ key }) => {
        if (key === 'profile') {
            navigate('/profile/index');
            return;
        }
        if (key === 'logout') {
            handleLogout();
        }
    };

    const nodeRefs = useRef({});
    const locationKey = location.pathname;
    const currentNodeRef = nodeRefs.current[locationKey] ?? (nodeRefs.current[locationKey] = React.createRef());
    const currentOutlet = useOutlet();

    const [showExpandedLogo, setShowExpandedLogo] = useState(!collapsed);

    useEffect(() => {
        if (!collapsed) {
            const timer = setTimeout(() => {
                setShowExpandedLogo(true);
            }, 100); // Wait for sidebar transition
            return () => clearTimeout(timer);
        } else {
            setShowExpandedLogo(false);
        }
    }, [collapsed]);

    return (

        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1001,
                    backgroundColor: '#fff', // Changed to white
                    boxShadow: '2px 0 6px rgba(0,21,41,.35)' // Add shadow for separation
                }}
                width={210}
            >
                <div className="logo" style={{
                    height: '50px',
                    background: '#d9ecff', // Match Logo.vue background
                    color: '#304156', // Match Logo.vue text color
                    fontSize: '16px',
                    fontWeight: '700',
                    borderBottom: '1px solid #c0d9f0', // Match Logo.vue border
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {collapsed ? (
                        <img src={logo} alt="logo" style={{ width: '32px', height: '32px' }} />
                    ) : (
                        showExpandedLogo && (
                            <div className="fade-in" style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={logo} alt="logo" style={{ width: '50px', height: '44px', marginRight: '12px' }} />
                                <span>考试管理系统</span>
                            </div>
                        )
                    )}
                </div>
                <Menu
                    theme="light" // Changed to light theme
                    mode="inline"
                    defaultSelectedKeys={[location.pathname]}
                    defaultOpenKeys={['/' + location.pathname.split('/')[1]]}
                    items={menuItems}
                    style={{ backgroundColor: '#fff', borderRight: 0, marginTop: 0 }} // Changed to white, remove border and margin
                />
            </Sider>
            <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 210, transition: 'margin-left 0.2s' }}>
                <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 9, width: `calc(100% - ${collapsed ? 80 : 210}px)`, transition: 'width 0.2s' }}>
                    <Header className="site-layout-background" style={{ padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px', height: '50px', lineHeight: '50px', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                                style: { padding: '0 24px', fontSize: '18px', cursor: 'pointer' }
                            })}
                            <BreadcrumbComponent />
                        </div>
                        <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }}>
                            <span className="avatar-item" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <Avatar icon={<UserOutlined />} src={userInfo?.imagePath} size="small" style={{ marginRight: '8px' }} />
                                <span>{userInfo?.userName || 'Admin'}</span>
                            </span>
                        </Dropdown>
                    </Header>
                    <TagsView />
                </div>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '84px 0 0 0', // Header (50) + TagsView (34)
                        padding: 0,
                        minHeight: 'calc(100vh - 84px)',
                        background: '#f0f2f5',
                        overflow: 'hidden'
                    }}
                >
                    <SwitchTransition mode="out-in">
                        <CSSTransition
                            key={locationKey}
                            nodeRef={currentNodeRef}
                            classNames="fade-transform"
                            timeout={500}
                        >
                            <div ref={currentNodeRef} style={{ height: '100%' }}>
                                {currentOutlet}
                            </div>
                        </CSSTransition>
                    </SwitchTransition>
                </Content>
            </Layout>
        </Layout>
    );

};

export default MainLayout;
