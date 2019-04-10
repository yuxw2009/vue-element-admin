import request from '@/utils/request'

export function loginByUsername(username, password) {
  return request({
    // url: '/login/login',
    baseURL: 'http://priv.x9water.com:18080/',
    url: '/api/oam/user_permissions/login',
    method: 'post',
    data: JSON.stringify({ username: ['new_oam', username], 'password': password })

  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}