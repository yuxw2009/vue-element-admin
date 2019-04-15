import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'
const user = {
    state: {
        user: '',
        status: '',
        code: '',
        token: getToken(),
        name: '',
        avatar: 'http://static.pudaowater.com/static/images/1_14.png',
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: []
        }
    },

    mutations: {
        SET_CODE: (state, code) => {
            state.code = code
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting
        },
        SET_STATUS: (state, status) => {
            state.status = status
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },
    actions: {
        // 用户名登录
        LoginByUsername({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                loginByUsername(username, userInfo.password).then(response => {
                    if (response.data.status == 'ok') {
                        const data = response.data
                            // data.result.right = [{
                            //         path: '/customerManager'
                            //     }, {
                            //         path: '/customerManager/equipmentManage'
                            //     },
                            //     {
                            //         path: '/systemManager/accountManage'
                            //     },
                            //     {
                            //         path: '/systemManager'
                            //     }
                            // ]
                        var len = data.result.right.length
                        if (len == 0) {
                            this.$message('这是一条消息提示')
                        } else {
                            Cookies.set('userData', data.result)
                            commit('SET_TOKEN', data.result.right)
                            setToken(data.result.right)
                            resolve()
                        }
                    } else {
                        alert(response.data.reason)
                        return false
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户信息
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                if (state.token) { // 验证返回的roles是否是一个非空数组
                    commit('SET_ROLES', state.token)
                } else {
                    reject('getInfo: roles must be a non-null array!')
                }
                resolve(state.token)
            })
        },
        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        },

        // 动态修改权限
        ChangeRoles({ commit, dispatch }, role) {
            return new Promise(resolve => {
                commit('SET_TOKEN', role)
                setToken(role)
                getUserInfo(role).then(response => {
                    const data = response.data
                    resolve()
                })
            })
        }
    }
}

export default user