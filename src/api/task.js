import { post } from '@/utils/request'

// mock 任务分页接口
export const pageList = query => Promise.resolve({
    code: 1,
    message: '成功',
    response: {
        total: 2,
        list: [
            {
                id: 13,
                title: '中级任务',
                gradeLevel: 1,
                createUserName: 'admin',
                createTime: '2021-01-21 11:50:24',
                deleted: false
            },
            {
                id: 14,
                title: '高级任务',
                gradeLevel: 2,
                createUserName: 'admin',
                createTime: '2021-01-22 10:20:00',
                deleted: false
            }
        ]
    }
})

export const edit = query => post('/api/admin/task/edit', query)
export const select = id => post('/api/admin/task/select/' + id)
export const deleteTask = id => post('/api/admin/task/delete/' + id)
