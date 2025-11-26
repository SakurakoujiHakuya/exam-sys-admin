import { post } from '@/utils/request'

export const page = query => post('/api/admin/examPaperAnswer/page', query)
