import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getCommonFun } from '@/api/tableCommom'
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
        },
        allroutes: []
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
        },
        SET_ALLROUTES: (state, allroutes) => {
            state.allroutes = allroutes
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
                                //调接口获取mogo接口地址
                                // getCommonFun(JSON.stringify({ "table": "menuConf", "attrs": {} })).then(res => {
                                //     if (res.data.result == 'ok') {
                                //         console.log(22, JSON.stringify(res.data.data))
                                //         commit('SET_ALLROUTES', res.data.data)
                                //         console.log(44, user.state.allroutes)
                                //         Cookies.set('urlAllRouter', JSON.stringify(res.data.data))
                                //         console.log(33, Cookies.get('urlAllRouter'))
                                //             // Cookies.set('urlJurisdiction', res.data.data)
                                //     }

                            //     resolve()
                            // })
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
                    getCommonFun(JSON.stringify({ "table": "menuConf", "attrs": {} })).then(res => {
                        if (res.data.result == 'ok') {
                            commit('SET_ALLROUTES', res.data.data)
                                // Cookies.set('urlAllRouter', JSON.stringify(res.data.data))
                                // Cookies.set('urlJurisdiction', res.data.data)
                        }
                        resolve(state.token)

                    })
                } else {
                    reject('getInfo: roles must be a non-null array!')
                    resolve(state.token)
                }

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