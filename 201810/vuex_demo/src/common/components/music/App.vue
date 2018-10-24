<template>
    <div class="music auto_scale" @click.stop="musicCtr" :class="[playing?'playing':'',direction]">
        <span></span>
    </div>
</template>

<script>
    const music = document.createElement('audio');
    let playing = true;
    document.body.appendChild(music);
    music.id = 'audio_mp3';
    music.loop = true;
    export default {
        props:['src','direction'],
        data(){
            return{
                playing:playing,
            }
        },
        watch:{
            playing(val){
                playing = val;
            }
        },
        created(){
            if(this.src&&music.src != this.src){
                music.src = this.src;
                if(this.playing){
                    if(window.netease) window.netease.autoPlay(music.id);
                }
            }
        },
        methods:{
            musicCtr(){
                this.playing = !this.playing;
                if(this.playing){
                    music.play();
                }else{
                    music.pause();
                }
            }
        },
        components:{
        }
    };
</script>

<style lang="postcss" scoped>
    .music{
        position: absolute;
        width: 80rpx;
        height: 80rpx;
        z-index: 1000;
        &.y{
            /* 横版的样式以及动画 */
            span{
                transform:rotateZ(90deg);
            }
            &.playing{
                span{
                    animation: rotate_ani2 5s infinite linear;
                }
            }
        }
        &.playing{
            /* 播放时的动画 */
            span{
                animation: rotate_ani 5s infinite linear;
                background-position: left center;
            }
        }
        span{
            /* 按钮样式 用的是序列帧 */
            position: absolute;
            top: 0;
            left: 0;
            background: url("./assets/music.png#x2") no-repeat right center;
        }
        
    }
    @keyframes rotate_ani {
        100%{
            transform:rotateZ(360deg);
        }
    }
    @keyframes rotate_ani2 {
        100%{
            transform:rotateZ((360+90)deg);
        }
    }
</style> 