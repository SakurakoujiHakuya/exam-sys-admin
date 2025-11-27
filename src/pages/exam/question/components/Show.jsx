import React from 'react';
import { Modal, Tag } from 'antd';

const QuestionShow = ({ visible, onClose, qType, question, loading }) => {
    const renderQuestionContent = () => {
        if (!question) return null;

        return (
            <div className="question-show-content">
                <div className="q-title" style={{ marginBottom: '20px' }}>
                    <div dangerouslySetInnerHTML={{ __html: question.title }} />
                </div>

                {/* Single Choice & Multiple Choice */}
                {(qType === 1 || qType === 2) && (
                    <div className="q-content">
                        {question.items && question.items.map(item => (
                            <div key={item.prefix} className="q-item" style={{ display: 'flex', marginBottom: '10px' }}>
                                <span className="q-item-prefix" style={{ marginRight: '10px', fontWeight: 'bold' }}>{item.prefix}.</span>
                                <span className="q-item-content" dangerouslySetInnerHTML={{ __html: item.content }} />
                            </div>
                        ))}
                    </div>
                )}

                {/* True/False */}
                {qType === 3 && (
                    <div className="q-content">
                        {question.items && question.items.map(item => (
                            <div key={item.prefix} className="q-item" style={{ display: 'flex', marginBottom: '10px' }}>
                                <span className="q-item-prefix" style={{ marginRight: '10px', fontWeight: 'bold' }}>{item.prefix}.</span>
                                <span className="q-item-content">{item.content}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Gap Filling */}
                {qType === 4 && (
                    <div className="q-content">
                        {question.items && question.items.map(item => (
                            <div key={item.prefix} className="q-item" style={{ marginBottom: '10px' }}>
                                <span className="q-item-prefix" style={{ marginRight: '10px', fontWeight: 'bold' }}>填空{item.prefix}:</span>
                                <span className="q-item-content" dangerouslySetInnerHTML={{ __html: item.content }} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Short Answer */}
                {qType === 5 && (
                    <div className="q-content">
                        <div dangerouslySetInnerHTML={{ __html: question.correct }} />
                    </div>
                )}

                <div className="q-analyze" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                    <strong>解析：</strong>
                    <div dangerouslySetInnerHTML={{ __html: question.analyze }} />
                </div>

                <div className="q-correct" style={{ marginTop: '10px' }}>
                    <strong>正确答案：</strong>
                    {qType === 2 ? (
                        <span>{Array.isArray(question.correct) ? question.correct.join(',') : question.correct}</span>
                    ) : (
                        <span>{question.correct}</span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Modal
            title="题目预览"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {loading ? <div>Loading...</div> : renderQuestionContent()}
        </Modal>
    );
};

export default QuestionShow;
