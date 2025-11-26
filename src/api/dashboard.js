import { post } from '@/utils/request'

export const index = () => Promise.resolve({
    code: 1,
    message: "成功",
    response: {
        examPaperCount: 2413,  //试卷总数
        questionCount: 1025,  //题目总数
        doExamPaperCount: 6148,  //总答卷数
        doQuestionCount: 23945,  //总题数
        mothDayUserActionValue: [  //活跃度
            1, 1, 2, 3, 4, 5,
            3, 4, 5, 6, 7, 8,
            3, 4, 5, 6, 7, 8,
            3, 4, 5, 6, 7, 8,
            1, 1, 2, 3, 4, 5,
            10
        ],
        mothDayDoExamQuestionValue: [  //月做题数
            11, 22, 44, 55, 66, 33,
            44, 11, 44, 55, 66, 33,
            44, 55, 66, 33, 55, 66,
            44, 11, 44, 55, 66, 33,
            44, 55, 44, 55, 66, 77,
            88
        ],
        mothDayText: [  //本月天数
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
        ]
    }
})
