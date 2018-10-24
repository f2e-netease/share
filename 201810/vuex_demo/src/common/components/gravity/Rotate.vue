<template>
    <div class="perspective-view">
        <div class="carmera" :style="{transform:c_rotate}">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    const gravity = {};
    deviceorientation();
    function deviceorientation() {
        const speed = navigator.userAgent.search(/iPhone/i)>=0?10:5;
        let init_gamma = null;
        let init_beta = null;
        let rotate_end = null;
        if(window.DeviceOrientationEvent){
            window.addEventListener('deviceorientation', (event)=>{
                if(init_gamma===null){
                    init_gamma = event.gamma;
                    init_beta = event.beta;
                    rotate_end ={x:0,y:0};
                    speed_down();
                    return;
                }
                rotate_end.x = event.beta-init_beta;
                rotate_end.y = event.gamma-init_gamma;
            },false);
        }
        function speed_down() {
            Object.keys(gravity).forEach(item=>{
                const _this = gravity[item];
                const rotateLimit = _this.rotateLimit||[-20,20];
                const myRotateEnd = {
                    x:Math.min(Math.max(rotate_end.x,rotateLimit[0]),rotateLimit[1]),
                    y:Math.min(Math.max(rotate_end.y,rotateLimit[0]),rotateLimit[1]),
                };
                if(!_this.disableRotateX){
                    _this.rotate.x += (myRotateEnd.x-_this.rotate.x)/speed;
                }
                _this.rotate.y += (myRotateEnd.y - _this.rotate.y) / speed;
                _this.$emit('rotateWatch',_this.rotate.y/rotateLimit[1]);
            });
            requestAnimationFrame(speed_down);
        }
    }
    export default {
        props:['rotateLimit','disableRotateX','disableRotateY'],
        data(){
            return{
                rotate:{x:0,y:0},
            }
        },
        watch:{
        },
        computed:{
            c_rotate(){
                return `rotateX(${-this.rotate.x}deg) rotateY(${this.disableRotateY?0:this.rotate.y}deg)`;
            },
        },
        methods:{
        },
        created(){
            gravity[this._uid] = this;
        },
        beforeDestroy(){
            delete gravity[this._uid];
        }
    }
</script>
<style lang="postcss" scoped>
    .perspective-view{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        perspective: 800px;
        .carmera{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
        }
    }
</style>