import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { index } from '@/api/dashboard';

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        index().then(res => {
            if (res.code === 1) {
                setData(res.response);
            }
        });
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic title="试卷总数" value={data.examPaperCount} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="题目总数" value={data.questionCount} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="总答卷数" value={data.doExamPaperCount} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="总题数" value={data.doQuestionCount} />
                    </Card>
                </Col>
            </Row>
            <div style={{ marginTop: 20 }}>
                <Card title="活跃度">
                    {/* Chart placeholder */}
                    <div>Chart goes here</div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
