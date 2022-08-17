import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,asyncRoutes,constantRoutes,anyRoutes, } from '@/router'
import router from'@/router'
const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        //权限按钮
        buttons:[],
        //权限名称
        roles:[],
        //路由
        routes:[],
        resultAsyncRoutes:[],
        allRoutes:[]
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    // SET_NAME: (state, name) => {
    //     state.name = name
    // },
    // SET_AVATAR: (state, avatar) => {
    //     state.avatar = avatar
    // }
    //存储用户信息 
    SET_USERINFO(state, userInfo){
        state.name = userInfo.name;
        state.avatar = userInfo.avatar;
        state.buttons=userInfo.buttons;
        state.roles=userInfo.roles;
        state.routes=userInfo.routes;
    },
    // 存储所有的异步路由
    SET_RESULT_ASYNCROUTES:(state,asyncRoutes)=>{
        state.resultAsyncRoutes=asyncRoutes;
        state.allRoutes=constantRoutes.concat(state.resultAsyncRoutes,anyRoutes);
       router.addRoutes(state.allRoutes);
    }
}
//定义一个函数 两个数组进行对比 对比出用户到底显示那些路由
const computedAsyncRoutes=(asyncRoutes,routes)=>{
   return asyncRoutes.filter((item)=>{
        //如果indexOf 不是-1的话 代表有这个路由 那么就返回true
        if(routes.indexOf(item.name)!=-1){
            //如果有children属性  应该递归来对比一下显示那些路由
            if(item.children&&item.children.length){
                item.children=computedAsyncRoutes(item.children,routes);
            }
            return true;
        }
    })
}
const actions = {
    // 用户登录的业务逻辑
    async login({ commit }, userInfo) {
        const { username, password } = userInfo
        let result = await login({ username: username.trim(), password: password });
        if (result.code == 20000) {
            commit('SET_TOKEN', result.data.token);
            setToken(result.data.token)
            return "ok"
        } else {
            return Promise.reject(new Error(result.message))
        }
        // return new{ Promise((resolve, reject) => {
        //   login({ username: username.trim(), password: password }).then(response => {
        //     const { data } = response
        //     commit('SET_TOKEN', data.token)
        //     setToken(data.token)
        //     resolve()
        //   }).catch(error => {
        //     reject(error)
        //   })
        // })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response

                if (!data) {
                    return reject('Verification failed, please Login again.')
                }

                const { name, avatar } = data;
                // commit('SET_NAME', name);
                // commit('SET_AVATAR', avatar);
                //存储用户所有信息
                commit('SET_USERINFO',data);
                // 通过一个函数来计算 对比出那些是需要显示那些路由
                commit('SET_RESULT_ASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
                resolve(data);
            }).catch(error => {
                reject(error);
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}