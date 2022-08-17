import mokeRequest from '@/utils/mokeRequest'
const state = {
    list:{}
}
const mutations = {
    GETDATA(state,value){
        state.list=value
    }
}
const actions = {
    async getData({commit}) {
        let result = await mokeRequest.get('/home/list');
       if(result.code===20000){
        commit('GETDATA',result.data)
       }
    }
}
const getters = {}
export default {
    state,
    mutations,
    actions,
    getters
}