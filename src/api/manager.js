import request from '@/utils/request'

export function getDevicesList() {
    return request({
        // baseURL: 'http://priv.x9water.com:18080',
        url: 'api/nhome/get_online_devices_verinfo',
        method: 'get'
    })
}

export function getVerList(query) {
    return request({
        // baseURL: 'http://priv.x9water.com:18080',
        url: 'api/nhome/get_version_file_list',
        // headers: {'Content-Type': 'application/json'},
        method: 'post',
        data: query
    })
}
export function uploadFile(query) {
    return request({
        // baseURL: 'http://priv.x9water.com:18080',
        url: 'upload_ver.yaws',
        // headers: {'Content-Type': 'application/json'},
        method: 'post',
        data: query
    })
}
export function downloadFile(query) {
    return request({
        // baseURL: 'http://priv.x9water.com:18080',
        url: 'api/nhome/version/download',
        // headers: {'Content-Type': 'application/json'},
        method: 'post',
        data: query
    })
}

export function stopUpLoad(query) {
    return request({
        // baseURL: 'http://priv.x9water.com:18080',
        url: 'api/nhome/version/download/stop',
        // headers: {'Content-Type': 'application/json'},
        method: 'post',
        data: query
    })
}