<template>
    <Rotate :rotateLimit="rotateLimit" :disableRotateX="disableX" :disableRotateY="disableY" @rotateWatch="rotateWatch">
        <slot :rotatePercent="2">{{rotatePercent}}</slot>
    </Rotate>
</template>
<script>
    import Rotate from '../Rotate';
    export default {
        props:['rotateLimit','disableRotateX','disableRotateY'],
        data(){
            return{
                rotatePercent:0,
                disableX:this.disableRotateX===false?false:true,
                disableY:this.disableRotateY===false?false:true,
            }
        },
        watch:{
        },
        computed:{
        },
        methods:{
            rotateWatch(value){
                this.rotatePercent = value;
            }
        },
        created(){
        },
        components:{
            Rotate
        }
    }
</script>
<style lang="postcss">

</style>