import { post } from '@/utils/request'

export const login = query => Promise.resolve({
    code: 1,
    message: "成功",
    response: {
        id: null,
        userUuid: null,
        userName: query.userName,
        password: null,
        realName: null,
        age: null,
        sex: null,
        birthDay: null,
        userLevel: null,
        phone: null,
        role: null,
        status: null,
        imagePath: null,
        createTime: null,
        modifyTime: null,
        lastActiveTime: null,
        deleted: null,
        wxOpenId: null
    }
})

export const logout = query => post(`/api/user/logout`, query)
