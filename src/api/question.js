import { post } from '@/utils/request'

export const pageList = query => post('/api/admin/question/page', query)
export const edit = query => post('/api/admin/question/edit', query)
export const select = id => post('/api/admin/question/select/' + id)
export const deleteQuestion = id => post('/api/admin/question/delete/' + id)
