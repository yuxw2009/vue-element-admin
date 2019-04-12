import requestTest from '@/utils/requestTest'

export function getCommonFun(query) {
    return requestTest({
        url: 'getdocument',
        method: 'post',
        data: query,
        headers: {
            'Content-Type': 'application/json'
        }
        // ,
        // transformRequest: [function(data) {
        //     data = JSON.stringify(data)
        //     return data
        // }]
    })
}
// export function tCommonFun(query) {
//     return requestTest({
//         url: 'document',
//         method: 'post',
//         data: query,
//         headers: {
//             'Content-Type': 'application/json'
//         }
//         // ,
//         // transformRequest: [function(data) {
//         //     data = JSON.stringify(data)
//         //     return data
//         // }]
//     })
//}