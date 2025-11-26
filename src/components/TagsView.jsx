import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addVisitedView, delVisitedView, delOthersVisitedViews, delAllVisitedViews } from '@/store/slices/tagsViewSlice';
import { CloseOutlined } from '@ant-design/icons';
import './index.scss';

const TagsView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const visitedViews = useSelector(state => state.tagsView.visitedViews);
    const scrollPaneRef = useRef(null);

    // Map paths to titles (simplified for now, ideally should come from route config)
    const routeTitles = {
        '/dashboard': '主页',
        '/user/student/list': '学生列表',
        '/user/student/edit': '学生编辑',
        '/user/admin/list': '管理员列表',
        '/user/admin/edit': '管理员编辑',
        '/exam/paper/list': '试卷列表',
        '/exam/question/list': '题目列表',
        '/task/list': '任务列表',
        '/education/subject/list': '学科列表',
        '/answer/list': '成绩列表',
        '/message/list': '消息列表',
        '/message/send': '发送消息',
        '/profile/index': '个人中心'
    };

    useEffect(() => {
        const title = routeTitles[location.pathname] || 'Unknown';
        if (title !== 'Unknown') {
            dispatch(addVisitedView({
                path: location.pathname,
                title: title,
                query: location.search
            }));
        }
    }, [location, dispatch]);

    const isActive = (path) => {
        return path === location.pathname;
    };

    const closeSelectedTag = (e, tag) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(delVisitedView(tag));
        if (isActive(tag.path)) {
            const lastView = visitedViews[visitedViews.length - 2];
            if (lastView) {
                navigate(lastView.path);
            } else {
                navigate('/');
            }
        }
    };

    return (
        <div className="tags-view-container">
            <div className="tags-view-wrapper" ref={scrollPaneRef}>
                {visitedViews.map(tag => (
                    <Link
                        key={tag.path}
                        to={tag.path + (tag.query || '')}
                        className={`tags-view-item ${isActive(tag.path) ? 'active' : ''}`}
                    >
                        {tag.title}
                        {!['/dashboard'].includes(tag.path) && (
                            <span className="close-icon" onClick={(e) => closeSelectedTag(e, tag)}>
                                <CloseOutlined style={{ fontSize: '10px', marginLeft: '5px' }} />
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TagsView;
