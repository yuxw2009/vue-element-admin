import request from '@/utils/request'

export function getDevicesList() {
    return request({
        // baseURL: 'http://priv.x9water.com:18080',
        url: 'api/nhome/get_online_devices_verinfo',
        method: 'get'
    })
}