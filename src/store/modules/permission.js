import { asyncRoutes, constantRoutes } from '@/router'
import router from '../../router';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) { // route是路由的配置目前带父级有3个，roles是权限

    if (roles instanceof Array) {
        var role = roles
    } else {
        var role = JSON.parse(roles)
    }
    if (route.path) {

        // let a = false;

        // for (var b = 0; b < role.length; b++) {
        //     console.log(8, role[b]);
        //     if (route.path == role[b].path) {
        //         a = true;
        //         break;
        //     }
        // }
        // return a;
        // return true
        return role.some(value => route.path == value.path); // route.path.includes(value.path)
    } else {
        return true
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []
    routes.forEach(route => {
        const tmp = {...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })
    for (var i = 0; i < res.length; i++) {
        if (res[i].children) {
            if (res[i].children.length == 0) {
                res.splice(i, 1)
            }
        }
    }
    return res
}

const permission = {
    state: {
        routes: [],
        addRoutes: []
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { roles } = data
                let accessedRoutes
                    // if (roles.includes('admin')) {
                    //     accessedRoutes = asyncRoutes
                    // } else {
                    //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
                    // }

                accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
                commit('SET_ROUTES', accessedRoutes)
                resolve(accessedRoutes)
            })
        }
    }
}

export default permission