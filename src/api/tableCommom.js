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
export function addCommonFun(query) {
    return requestTest({
        url: 'document',
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

export function updateCommonFun(query) {
    return requestTest({
        url: 'modifydocument',
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

export function deleteCommonFun(query) {
    return requestTest({
        url: 'deldocument',
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