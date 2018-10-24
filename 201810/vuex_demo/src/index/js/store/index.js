import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);

// state
const store = new Vuex.Store({
    state: {
        count: 1,
    }
})



// Getter
// const store = new Vuex.Store({
//     state: {
//         todos: [
//             {text: '测试1', done: true },
//             {text: '测试2', done: false }
//         ]
//     },
//     getters: {
//         count: state => {
//             return state.todos.filter(todo => todo.done)
//         }
//     }
// })


// mutation
// const store = new Vuex.Store({
//     state: {
//         count: 1
//     },
//     mutations: {
//         increment(state, payload) {
//             state.count += payload.amount
//         }
//     }
// })


//Action
// const store = new Vuex.Store({
//     state: {
//         count: 1
//     },
//     mutations: {
//         increment(state, payload) {
//             // 变更状态
//             state.count += payload.amount
//         }
//     },
//     actions: {
//         increment({commit}, payload) {
//             setTimeout(() => {
//                commit('increment',payload)
//             }, 1000)
//         }
//     }
// })



// Module
// const moduleA = {
//     state: { 
//         count: 0 
//     },
//     mutations: {
//         increment(state, payload) {
//             state.count += payload.amount
//         }
//     },
//     getters: {
//         count: state => state.count
//     },
//     actions: {
//     }
// }
// const store = new Vuex.Store({
//     modules: {
//         moduleA
//     }
// })


export default store;
