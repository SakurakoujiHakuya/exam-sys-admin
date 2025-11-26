import { post } from '@/utils/request'

export const getUserPageList = query => Promise.resolve({
    code: 1,
    message: "成功",
    response: {
        total: 7,
        list: [
            {
                id: 100,
                userUuid: "fd31ab62-c32f-433c-8dc4-c07e653d390a",
                userName: "余联擎",
                realName: "余联擎",
                age: null,
                role: 1,
                sex: 1,
                birthDay: "",
                phone: "13800000000",
                lastActiveTime: "2021-06-21 20:01:26",
                createTime: "2025-07-21 20:01:26",
                modifyTime: "2021-06-21 20:01:35",
                status: 1,
                userLevel: 1,
                imagePath: null
            },
            {
                id: 101,
                userUuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                userName: "蔡乐",
                realName: "蔡乐",
                age: 22,
                role: 2,
                sex: 1,
                birthDay: "2003-05-12",
                phone: "13800000001",
                lastActiveTime: "2021-07-01 10:11:12",
                createTime: "2025-07-21 09:00:00",
                modifyTime: "2021-07-01 10:11:12",
                status: 1,
                userLevel: 2,
                imagePath: null
            },
            {
                id: 102,
                userUuid: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
                userName: "周子闲",
                realName: "周子闲",
                age: 18,
                role: 1,
                sex: 1,
                birthDay: "2007-09-21",
                phone: "13900000002",
                lastActiveTime: "2021-08-15 15:30:00",
                createTime: "2025-07-22 08:00:00",
                modifyTime: "2021-08-15 15:30:00",
                status: 1,
                userLevel: 3,
                imagePath: null
            },
            {
                id: 103,
                userUuid: "c3d4e5f6-a7b8-9012-cdef-345678901234",
                userName: "杨磊",
                realName: "杨磊",
                age: 25,
                role: 3,
                sex: 1,
                birthDay: "2000-01-01",
                phone: "13700000003",
                lastActiveTime: "2021-09-10 12:00:00",
                createTime: "2025-07-21 12:00:00",
                modifyTime: "2021-09-10 12:00:00",
                status: 1,
                userLevel: 4,
                imagePath: null
            },
            {
                id: 104,
                userUuid: "d4e5f6a7-b890-1234-cdef-456789012345",
                userName: "黄笛轩",
                realName: "黄笛轩",
                age: 30,
                role: 2,
                sex: 1,
                birthDay: "1995-03-15",
                phone: "13600000004",
                lastActiveTime: "2021-10-01 08:00:00",
                createTime: "2025-07-22 08:00:00",
                modifyTime: "2021-10-01 08:00:00",
                status: 1,
                userLevel: 2,
                imagePath: null
            },
            {
                id: 105,
                userUuid: "e5f6a7b8-9012-3456-def0-567890123456",
                userName: "张三",
                realName: "张三",
                age: 28,
                role: 1,
                sex: 2,
                birthDay: "1997-12-25",
                phone: "13500000005",
                lastActiveTime: "2021-11-11 11:11:11",
                createTime: "2025-07-23 10:00:00",
                modifyTime: "2021-11-11 11:11:11",
                status: 2,
                userLevel: 1,
                imagePath: null
            },
            {
                id: 106,
                userUuid: "f6a7b890-1234-5678-ef01-678901234567",
                userName: "李四",
                realName: "李四",
                age: 35,
                role: 3,
                sex: 2,
                birthDay: "1990-07-07",
                phone: "13400000006",
                lastActiveTime: "2021-12-12 12:12:12",
                createTime: "2025-07-23 09:00:00",
                modifyTime: "2021-12-12 12:12:12",
                status: 2,
                userLevel: 4,
                imagePath: null
            }
        ]
    }
})

export const getUserEventPageList = query => post('/api/admin/user/event/page/list', query)
export const createUser = query => post('/api/admin/user/edit', query)
export const selectUser = id => post('/api/admin/user/select/' + id)
export const getCurrentUser = () => post('/api/admin/user/current')
export const updateUser = query => post('/api/admin/user/update', query)
export const changeStatus = id => post('/api/admin/user/changeStatus/' + id)
export const deleteUser = id => post('/api/admin/user/delete/' + id)
export const selectByUserName = query => post('/api/admin/user/selectByUserName', query)
