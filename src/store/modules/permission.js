import Cookies from 'js-cookie'
import { asyncRoutes, constantRoutes } from '@/router'
import router from '../../router';
import { getCommonFun } from '@/api/tableCommom'
// import getters from '../getters'


/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) { // route是路由的配置目前带父级有3个，roles是权限

//     if (roles instanceof Array) {
//         var role = roles
//     } else {
//         var role = JSON.parse(roles)
//     }
//     if (route.true;
//         //         break;
//         //     }
//         // }
//         // return a;
//         // return true
//         return role.some(value => route.path == value.path); // route.path.includes(value.path)
//     } else {
//         return true
//     }
// }

// /**
//  * 递归过滤异步路由表，返回符合用户角色权限的路由表
//  * @param routes asyncRoutes
//  * @param roles
//  */
// export function filterAsyncRoutes(routes, roles) {
//     const res = []
//     routes.forEach(route => {
//         const tmp = {...route }
//         if (hasPermission(roles, tmp)) {
//             if (tmp.children) {
//                 tmp.children = filterAsyncRoutes(tmp.children, roles)
//             }
//             res.push(tmp)
//         }
//     })
//     for (var i = 0; i < res.length; i++) {
//         if (res[i].children) {
//             if (res[i].children.length == 0) {
//                 res.splice(i, 1)
//             }
//         }
//     }
//     return res
// }

function hasPermission(roles, route) { // route是路由的配置目前带父级有3个，roles是权限
    if (roles instanceof Array) {
        var role = roles
    } else {
        var role = JSON.parse(roles)
    }
    if (route.path) {

        return role.some(value => route.path == value.path); // route.path.includes(value.path)
    } else {
        return true
    }
}


const routerMap = {
    'Layout': () =>
        import ('@/views/layout/Layout'),
    '/views/accountManage/index': () =>
        import ('@/views/accountManage/index'),
    '/views/tableCommomConfig/index': () =>
        import ('@/views/tableCommomConfig/index'),
    '/views/equipmentManage/index': () =>
        import ('@/views/equipmentManage/index'),
    '/views/develmentManager/index': () =>
        import ('@/views/develmentManager/index'),
    '/views/deviceManager/index': () =>
        import ('@/views/deviceManager/index'),
    '/views/textManager/index': () =>
        import ('@/views/textManager/index')

}

const urlJurisdiction = []

export function filterAsyncRoutesTwo(routes, roles) {
    const res = []
    routes.forEach(route => {
            const tmp = {...route }
            if (hasPermission(roles, tmp)) {
                if (tmp.children) {
                    tmp.children = filterAsyncRoutesTwo(tmp.children, roles)
                }

                tmp.component = routerMap[tmp.component];

                var obj = {
                    "path": tmp.path,
                    "menuType": tmp.menuType,
                    "tableName": tmp.tableName
                }
                urlJurisdiction.push(obj);
                res.push(tmp)
            }
        })
        // for (var i = 0; i < res.length; i++) {
        //     if (res[i].children) {
        //         if (res[i].children.length == 0) {
        //             res.splice(i, 1)
        //         }
        //     }
        // }

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
                // let accessedRoutes

                // let allRoutes = getters.user.allRoutes; //.user.allRoutes; //.length; // 
                let allRoutes = data.allroutes; //Cookies.get('urlAllRouter')
                // console.log('66666666666666', JSON.parse(allRoutes))
                let accessedRoutes = filterAsyncRoutesTwo(allRoutes, roles)
                Cookies.set('urlJurisdiction', urlJurisdiction)
                commit('SET_ROUTES', accessedRoutes)
                resolve(accessedRoutes)

            })
        }
    }
}

export default permission