<template>
    <transition name="fade">
        <div v-if="show" class="loading-contain">
            <div class="loading">
                <span class="loading-img"></span>
                <span class="loading-num">{{progress}}%</span>
            </div>
        </div>
    </transition>
</template>
<script>
    const imgData={};
    export default {
        props: ['assets','pixiAssets'],
        data(){
            return{
                show:true,
                loadNum:0,
                totalNum:0,
            }
        },
        watch:{
            progress(val){
                if(val===100){
                    this.show=false;
                    this.$emit('complete',imgData);
                }
            }
        },
        computed:{
            progress(){
                if(!this.totalNum)return 0;
                return Math.floor(this.loadNum/this.totalNum*100);
            }
        },
        methods:{
            loadImg(){
                this.assets.keys().forEach(item=>{
                    // if(this.assets(item).search(/^data:/)>=0){
                    //     this.loadNum++;
                    //     return;
                    // }
                    const img = new Image();
                    if(img.decode){
                        img.src = this.assets(item);
                        img.decode().then(()=>{
                            imgData[item.match(/([^\/]+)\.(png|jpg)/)[0]]=img;
                            this.loadNum++;
                        });
                    }else{
                        img.onload = img.onerror =()=>{
                            imgData[item.match(/([^\/]+)\.(png|jpg)/)[0]]=img;
                            this.loadNum++;
                        };
                        img.src = this.assets(item);
                    }
                });
            },
            loadPixi(){
                this.pixiAssets.keys().forEach(item=>{
                    window.PIXI.loader.add(item.match(/([^\/]+)\.(png|jpg)/)[0],this.pixiAssets(item),()=>{
                        this.loadNum++;
                    });
                });
                window.PIXI.loader.load();
            }
        },
        created(){
            if(this.assets&&this.assets.keys){
                this.totalNum = this.assets.keys().length;
                this.loadImg();
            }
            if(window.PIXI&&this.pixiAssets&&this.pixiAssets.keys){
                this.totalNum += this.pixiAssets.keys().length;
                this.loadPixi();
            }
            if(this.totalNum===0){
                this.show=false;
                this.$emit('complete');
            }
        }
    }
</script>
<style lang="postcss">
    .loading-contain{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #000;
        .loading{
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1rem;
            height: 1.2rem;
            transform: translate(-50%,-50%);
            color: #ffffff;
            text-align: center;
            .loading-img{
                position: absolute;
                top: 50%;left: 50%;
                width: .6rem;
                height: .6rem;
                margin-left: -.3rem;
                margin-top: -.3rem;
                background: url(./loading.png) no-repeat center;
                animation: rotate_ani 1s linear infinite;
            }
            .loading-num{
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
            }
        }
    }
    @keyframes rotate_ani {
        100%{
            transform:rotateZ(360deg);
        }
    }
</style>