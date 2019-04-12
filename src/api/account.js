import request from '@/utils/request'

// lzy：test in crudPage01
export function getAccountList() {
    return request({
        // baseURL: 'http://priv.x9water.com:18080',
        url: 'api/oam/user_permissions/getall/new_oam',
        method: 'get'
    })
}

export function addAccount(query) {
    return request({
        // baseURL: 'http://priv.x9water.com:18080',
        url: 'api/oam/user_permissions/add',
        // headers: {'Content-Type': 'application/json'},
        method: 'post',
        data: query
    })
}
export function updateFilters(query) {
    return request({
        // baseURL: 'http://priv.x9water.com:18080',
        method: 'post',
        url: 'api/oam/modify_record',
        data: query
    })
}
export function resetPassword(query) {
    return request({
        // baseURL: 'http://priv.x9water.com:18080',
        method: 'post',
        url: 'api/oam/user_permissions/reset_pwd',
        data: query
    })
}
export function menuFilters(query) {
    return request({
        // baseURL: 'http://priv.x9water.com:18080',

        method: 'post',
        url: 'api/oam/modify_record',
        data: query
    })
}

export function isdelAccount(query) {
    return request({
        // baseURL: 'http://priv.x9water.com:18080',
        method: 'post',
        url: 'api/oam/delete_record',
        data: query
    })
}