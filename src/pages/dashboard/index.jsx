import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Carousel } from 'antd';
import ReactECharts from 'echarts-for-react';
import { index } from '@/api/dashboard';
import './index.scss';

// Import images
import ylq from '@/assets/ex_stu/ylq.jpg';
import zzx from '@/assets/ex_stu/zzx.jpg';
import hdx from '@/assets/ex_stu/hdx.jpg';
import cl from '@/assets/ex_stu/cl.jpg';
import yl from '@/assets/ex_stu/yl.jpg';

const Dashboard = () => {
    const [data, setData] = useState({
        examPaperCount: 0,
        questionCount: 0,
        doExamPaperCount: 0,
        doQuestionCount: 0,
        mothDayText: [],
        mothDayUserActionValue: []
    });
    const [loading, setLoading] = useState(false);

    const excellentStudents = [
        { name: '余联擎', avatar: ylq, description: '勤奋刻苦，成绩优异，多次获得奖学金。' },
        { name: '周子闲', avatar: zzx, description: '积极参加各类竞赛，并取得优异成绩。' },
        { name: '黄笛轩', avatar: hdx, description: '乐于助人，团结同学，是老师的得力助手。' },
        { name: '蔡乐', avatar: cl, description: '不断挑战自我，超越自我，实现自己的梦想。' },
        { name: '杨磊', avatar: yl, description: '全方位发展，艺术达人。' }
    ];

    useEffect(() => {
        setLoading(true);
        index().then(res => {
            if (res.code === 1) {
                setData(res.response);
            }
            setLoading(false);
        });
    }, []);

    const getOption = () => {
        return {
            title: {
                text: '用户活跃度',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}日{c}度'
            },
            xAxis: {
                type: 'category',
                data: data.mothDayText
            },
            grid: {
                left: 10,
                right: 10,
                bottom: 20,
                top: 30,
                containLabel: true
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data.mothDayUserActionValue,
                type: 'line'
            }]
        };
    };

    return (
        <div className="dashboard-container">
            <Row gutter={40} className="panel-group">
                <Col xs={12} sm={12} lg={6} className="card-panel-col">
                    <div className="card-panel">
                        <div className="card-panel-icon-wrapper icon-people">
                            {/* Replaced svg-icon with text or antd icon if available, using text for now as per Vue code's intent */}
                            <span className="card-panel-icon">📄</span>
                        </div>
                        <div className="card-panel-description">
                            <div className="card-panel-text">试卷总数</div>
                            <Statistic value={data.examPaperCount} className="card-panel-num" />
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={12} lg={6} className="card-panel-col">
                    <div className="card-panel">
                        <div className="card-panel-icon-wrapper icon-message">
                            <span className="card-panel-icon">❓</span>
                        </div>
                        <div className="card-panel-description">
                            <div className="card-panel-text">题目总数</div>
                            <Statistic value={data.questionCount} className="card-panel-num" />
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={12} lg={6} className="card-panel-col">
                    <div className="card-panel">
                        <div className="card-panel-icon-wrapper icon-shopping">
                            <span className="card-panel-icon">📝</span>
                        </div>
                        <div className="card-panel-description">
                            <div className="card-panel-text">答卷总数</div>
                            <Statistic value={data.doExamPaperCount} className="card-panel-num" />
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={12} lg={6} className="card-panel-col">
                    <div className="card-panel">
                        <div className="card-panel-icon-wrapper icon-money">
                            <span className="card-panel-icon">✅</span>
                        </div>
                        <div className="card-panel-description">
                            <div className="card-panel-text">答题总数</div>
                            <Statistic value={data.doQuestionCount} className="card-panel-num" />
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="student-show">
                <h3 className="student-show-title">优秀学员展示</h3>
                <Carousel autoplay autoplaySpeed={5000} arrows style={{ height: '220px', background: '#f7f9fc', borderRadius: '8px' }}>
                    {excellentStudents.map(item => (
                        <div key={item.name}>
                            <div className="student-show-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px' }}>
                                <img src={item.avatar} className="student-avatar" alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '15px' }} />
                                <div className="student-info" style={{ textAlign: 'center', color: '#666' }}>
                                    <p className="student-name" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{item.name}</p>
                                    <p className="student-description" style={{ fontSize: '14px', padding: '0 20px' }}>{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </Row>

            <Row className="echarts-line" style={{ marginTop: '32px' }}>
                <Card bordered={false}>
                    <ReactECharts option={getOption()} style={{ height: '500px', width: '100%' }} />
                </Card>
            </Row>
        </div>
    );
};

export default Dashboard;
