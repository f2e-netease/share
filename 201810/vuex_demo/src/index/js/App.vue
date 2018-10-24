<template>
    <div class="app">
        <h3>{{count}}</h3>
        <button @click="change">更改</button>
    </div>
</template>
<script>
    // state
    export default {
        data(){
            return{
            }
        },
        computed:{
            count(){
                return this.$store.state.count;
            }
        }
    };


    //mapState辅助函数
    // import { mapState } from 'vuex';
    // export default {
    //     data(){
    //         return{
    //         }
    //     },
    //     computed:{
    //         //  this.count 映射为 this.$store.state.count
    //         ...mapState(['count'])
    //     }
    // };


    //Getter
    // export default {
    //     data(){
    //         return{

    //         }
    //     },
    //     computed:{
    //         count(){
    //             return this.$store.getters.count;
    //         }
    //     }
    // };


    // mapGetters辅助函数
    // import { mapGetters } from 'vuex';
    // export default {
    //     data(){
    //         return{
    //         }
    //     },
    //     computed:{
    //         ...mapGetters([
    //             'count',   // 把 `this.count` 映射为 `this.$store.getters.count`
    //         ])
    //     }
    // };


    // mutation
    // import { mapState } from 'vuex';
    // export default {
    //     data(){
    //         return{
    //         }
    //     },
    //     computed:{
    //        ...mapState(['count'])
    //     },
    //     methods:{
    //         change(){
    //             this.$store.commit('increment',{
    //                 amount: 10
    //             })
    //         }
    //     }
    // };

    // mapMutations辅助函数
    // import { mapState,mapMutations } from 'vuex';
    // export default {
    //     data(){
    //         return{
    //         }
    //     },
    //     computed:{
    //        ...mapState(['count'])  
    //     },
    //     methods:{
    //         ...mapMutations(['increment']), // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
    //         change(){
    //             this.increment({ amount: 10})
    //         }
    //     }
    // };


    // Action
    // import { mapState} from 'vuex';
    // export default {
    //     data(){
    //         return{
    //         }
    //     },
    //     computed:{
    //        ...mapState(['count'])
    //     },
    //     methods:{
    //         change(){
    //             this.$store.dispatch('increment',{ amount: 10})
    //         }
    //     }
    // };

    //  mapActions
    // import { mapState,mapActions } from 'vuex';
    // export default {
    //     data(){
    //         return{
    //         }
    //     },
    //     computed:{
    //        ...mapState(['count'])
    //     },
    //     methods:{
    //         ...mapActions([
    //             'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
    //         ]),
    //         change(){
    //             this.increment({ amount: 10})
    //         }
    //     }
    // };


    // Module
    // import { mapState,mapGetters,mapMutations } from 'vuex';
    // export default {
    //     data(){
    //         return{
    //         }
    //     },
    //     computed:{
    //         count(){
    //             return this.$store.state.moduleA.count;
    //         }
    //         // ...mapState({
    //         //    count:(state) => state.moduleA.count
    //         // }),
    //         // ...mapState({
    //         //    count:(state) => state.moduleA.count
    //         // }),

    //         // ...mapGetters([
    //         //     'count'
    //         // ])
    //     },
    //     methods:{
    //         ...mapMutations(['increment']),
    //         change(){
    //             this.increment({ amount: 10})
    //         }
    //     }
    // };

</script>

<style lang="postcss" scoped>
    h3{
        font-size: 40px;
        text-align: center;
    }
</style>