import request from '@/utils/request'

export function loginByUsername(username, password) {
  return request({
    // url: '/user/login',
    url: '/api/oam/user_permissions/login',
    method: 'post',
    // 'Content-Type': "application/json",
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

