<template>
    <div class="light-item" ref="item">
        <span class="light" :style="lightStyle"></span>
        <slot></slot>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                lightStyle:{
                    webkitMask:'',
                    webkitMaskSize:'',
                    backgroundPosition:'',
                },
            };
        },
        watch:{
        },
        computed:{
        },
        methods:{
        },
        created(){
            this.$parent.$parent.$watch('rotatePercent',(val)=>{
                this.lightStyle.backgroundPosition=`${(val-.2)*200}% 0`;
            });
        },
        mounted(){
            const itemStyle = window.getComputedStyle(this.$refs.item);
            this.lightStyle.webkitMask = `${itemStyle.backgroundImage} ${itemStyle.backgroundRepeat} ${itemStyle.backgroundPosition}`;
            this.lightStyle.webkitMaskSize = itemStyle.backgroundSize;
        },
        components:{
        }
    }
</script>
<style lang="postcss" scoped>
    .light-item{
        .light{
            $color:#fff;
            $dark:rgba($color,0);
            $light:rgba($color,.5);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(110deg,$dark 40% ,$light ,$dark 60%);
            background-size: 300% 100%;
        }
    }
</style>