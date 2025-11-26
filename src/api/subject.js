import { post } from '@/utils/request'

export const list = query => post('/api/admin/education/subject/list')
export const pageList = query => post('/api/admin/education/subject/page', query)
export const edit = query => post('/api/admin/education/subject/edit', query)
export const select = id => post('/api/admin/education/subject/select/' + id)
export const deleteSubject = id => post('/api/admin/education/subject/delete/' + id)
