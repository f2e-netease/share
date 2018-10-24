<template>
	<div class="vl">
        <video class="video" :poster="videoArr[vUrl].img" :src="videoArr[vUrl].url" preload="auto" x-webkit-airplay playsinline webkit-playsinline  x5-video-player-type="h5" x5-video-player-fullscreen="true" controls></video> 
        <div class="vlist">
            <ul>
                <li class="vlistItem" :class="{active:vUrl==index}" v-for="(item,index) of videoArr" v-if="item.img!=''" :key="index" @click="setVurl(index)" :style="{backgroundImage: 'url(' + item.img + ')'}" ></li>
            </ul>
        </div>
	</div>
</template>
<script>

export default {
    props: ['videoArr'],
	data(){
        return{
            vUrl:0,
        }
	},
	methods:{
		setVurl(value){
            this.vUrl = value;
        },
	}
}

</script>
<style lang="postcss">
.vl{
    width: 570rpx;
    margin:0 auto;
    /* 视频框设置 */
    .video{
        width: 570rpx;
        height: 372rpx;
    }
    .vlist{
        width: 570rpx;
        ul{
            height: 90rpx;
            overflow-x:auto;
            overflow-y: hidden;
            white-space: nowrap; 
            width: 100%; 
            .vlistItem{
                /* 缩略图列表设置 */
                display: inline-block;
                list-style-type:none;
                width: 137rpx;
                height: 90rpx;
                background-size: 100% 100%;
                margin-right:10rpx;
                &.active{
                    /* 选中样式 */
                    border:1rpx solid #fff;
                }
            }
        }
    }
}
</style>