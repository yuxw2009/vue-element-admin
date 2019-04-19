import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import treeTableRouter from './modules/tree-table'
import nestedRouter from './modules/nested'

/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/
export const constantRoutes = [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path*',
            component: () =>
                import ('@/views/redirect/index')
        }]
    },
    {
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/auth-redirect',
        component: () =>
            import ('@/views/login/authredirect'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () =>
            import ('@/views/errorPage/401'),
        hidden: true
    },
    {
        path: '',
        component: Layout

    }

]

export default new Router({
    mode: 'hash', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

export const asyncRoutes = [{
        path: '/systemManager',
        component: Layout,
        redirect: '/permission/index',
        alwaysShow: true, // will always show the root menu
        meta: {
            title: 'SystemConfig',
            icon: 'lock'

        },
        children: [{
                path: '/systemManager/accountManage',
                name: 'AccountManage',
                component: () =>
                    import ('@/views/accountManage'),
                meta: { title: 'accountManage', icon: 'form' }
            },
            {
                path: '/systemManager/tableCommomConfig',
                name: 'tableCommomConfig',
                component: () =>
                    import ('@/views/tableCommomConfig'),
                meta: { title: 'tableCommomConfig', icon: 'form' }
            }


        ]

    },
    {
        path: '/platformMaintenance',
        component: Layout,
        alwaysShow: true, // will always show the root menu\
        meta: { title: 'develmentManager', icon: 'guide', noCache: true },
        children: [{
                path: '/platformMaintenance/develmentManager',
                name: 'AccountManage',
                component: () =>
                    import ('@/views/develmentManager/index'),
                name: 'Guide',
                meta: { title: 'develmentManager', icon: 'guide', noCache: true }

            }

        ]

    },
    {
        path: '/customerManager',
        component: Layout,
        redirect: '/permission/index',
        alwaysShow: true, // will always show the root menu
        meta: {
            title: 'customerInfo',
            icon: 'lock'

        },
        children: [{
                path: '/customerManager/equipmentManage',
                name: 'AccountManage',
                component: () =>
                    import ('@/views/equipmentManage/index'),
                name: 'Guide',
                meta: { title: 'equipmentManage', icon: 'guide', noCache: true }

            }

        ]

    }


]