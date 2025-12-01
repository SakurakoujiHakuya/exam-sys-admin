import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layout';
import Login from '@/pages/login';
import AuthGuard from '@/components/AuthGuard';

// Lazy load components
const Dashboard = lazy(() => import('@/pages/dashboard'));
const UserStudentList = lazy(() => import('@/pages/user/student/list'));
const UserStudentEdit = lazy(() => import('@/pages/user/student/edit'));
const UserAdminList = lazy(() => import('@/pages/user/admin/list'));
const UserAdminEdit = lazy(() => import('@/pages/user/admin/edit'));
const ExamPaperList = lazy(() => import('@/pages/exam/paper/list'));
const ExamPaperEdit = lazy(() => import('@/pages/exam/paper/edit'));
const ExamQuestionList = lazy(() => import('@/pages/exam/question/list'));
const SingleChoice = lazy(() => import('@/pages/exam/question/edit/singleChoice'));
const MultipleChoice = lazy(() => import('@/pages/exam/question/edit/multipleChoice'));
const TrueFalse = lazy(() => import('@/pages/exam/question/edit/trueFalse'));
const GapFilling = lazy(() => import('@/pages/exam/question/edit/gapFilling'));
const ShortAnswer = lazy(() => import('@/pages/exam/question/edit/shortAnswer'));
const TaskList = lazy(() => import('@/pages/task/list'));
const SubjectList = lazy(() => import('@/pages/education/subject/list'));
const SubjectEdit = lazy(() => import('@/pages/education/subject/edit'));
const AnswerList = lazy(() => import('@/pages/answer/list'));
const MessageList = lazy(() => import('@/pages/message/list'));
const MessageSend = lazy(() => import('@/pages/message/send'));
const Profile = lazy(() => import('@/pages/profile'));

const Loading = () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: <AuthGuard><MainLayout /></AuthGuard>,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" replace />
            },
            {
                path: 'dashboard',
                element: <Suspense fallback={<Loading />}><Dashboard /></Suspense>
            },
            {
                path: 'user/student/list',
                element: <Suspense fallback={<Loading />}><UserStudentList /></Suspense>
            },
            {
                path: 'user/student/edit',
                element: <Suspense fallback={<Loading />}><UserStudentEdit /></Suspense>
            },
            {
                path: 'user/admin/list',
                element: <Suspense fallback={<Loading />}><UserAdminList /></Suspense>
            },
            {
                path: 'user/admin/edit',
                element: <Suspense fallback={<Loading />}><UserAdminEdit /></Suspense>
            },
            {
                path: 'exam/paper/list',
                element: <Suspense fallback={<Loading />}><ExamPaperList /></Suspense>
            },
            {
                path: 'exam/paper/edit',
                element: <Suspense fallback={<Loading />}><ExamPaperEdit /></Suspense>
            },
            {
                path: 'exam/question/list',
                element: <Suspense fallback={<Loading />}><ExamQuestionList /></Suspense>
            },
            {
                path: 'exam/question/edit/singleChoice',
                element: <Suspense fallback={<Loading />}><SingleChoice /></Suspense>
            },
            {
                path: 'exam/question/edit/multipleChoice',
                element: <Suspense fallback={<Loading />}><MultipleChoice /></Suspense>
            },
            {
                path: 'exam/question/edit/trueFalse',
                element: <Suspense fallback={<Loading />}><TrueFalse /></Suspense>
            },
            {
                path: 'exam/question/edit/gapFilling',
                element: <Suspense fallback={<Loading />}><GapFilling /></Suspense>
            },
            {
                path: 'exam/question/edit/shortAnswer',
                element: <Suspense fallback={<Loading />}><ShortAnswer /></Suspense>
            },
            {
                path: 'task/list',
                element: <Suspense fallback={<Loading />}><TaskList /></Suspense>
            },
            {
                path: 'education/subject/list',
                element: <Suspense fallback={<Loading />}><SubjectList /></Suspense>
            },
            {
                path: 'education/subject/edit',
                element: <Suspense fallback={<Loading />}><SubjectEdit /></Suspense>
            },
            {
                path: 'answer/list',
                element: <Suspense fallback={<Loading />}><AnswerList /></Suspense>
            },
            {
                path: 'message/list',
                element: <Suspense fallback={<Loading />}><MessageList /></Suspense>
            },
            {
                path: 'message/send',
                element: <Suspense fallback={<Loading />}><MessageSend /></Suspense>
            },
            {
                path: 'profile/index',
                element: <Suspense fallback={<Loading />}><Profile /></Suspense>
            }
        ]
    },
    {
        path: '*',
        element: <div>404 Not Found</div>
    }
]);

export default router;
