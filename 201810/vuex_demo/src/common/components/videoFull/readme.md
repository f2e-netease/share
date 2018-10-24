# 全屏视频模块

 - vue全屏视频模块
 
## 用法
 - props: 
     - `video_obj <Object>`: 视频数据
         - `url <str>`: 视频路径
         - 结构如下
         
            ```javascript
			video_obj: {
			    url: 'http://test.go.163.com/web/sale_go/20180329_f2e-video/video.mp4'
			},
			video_show:true
            ```
     - 例子:
     
       ```html
        <template>
           	<Video ref="videoFull" class="video" :video_obj="video_obj" v-if="video_show===true" v-on:video_over="over_end"> </Video>
        </template>
        <script >
               import Loading from 'Components/loading/App';
               import Video from 'Components/videoFull/Video.vue';
               export default {
                    data(){
                            return{
                                loadAssets:require.context("../assets", true, /\.(png|jpg)$/i),
                        video_show:true, 
                        video_obj:{
                            url:'http://test.go.163.com/web/sale_go/20180329_f2e-video/video.mp4'}
                            }
                    },
            methods:{
                  loadComplete(){
                        //视频在loading后，自动播放
                        this.$refs.videoFull.video_init();
                            },
                          over_end:function(){
                            //视频播放结束
                            }
                        },
                    components:{
                        Loading,Video
                    }
                };
        </script>
		<style lang="postcss" scoped>
			
				/*videoFull  样式自行修改*/

				
				>>> .video-wrap {
					width: 640rpx;
					height: 1240rpx;
					position: absolute;
					margin: auto;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
					background: white;
				}
				
				>>> .video {
					width: 100%;
					height: 100%;
					position: absolute;
					object-fit: fill;
				}
				
				>>> .video-poster {
					width: 100%;
					height: 100%;
					background: url(../assets/poster.jpg) no-repeat center center;
					background-size: 100% 100%;
					position: absolute;
					margin: 0;
					z-index: 500;
				}
				
				>>> .video-poster .play-icon {
					width: 2rem;
					height: 2rem;
					background: url(../assets/play-icon.png) no-repeat center center;
					background-size: cover;
					position: absolute;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
					margin: auto;
					pointer-events: none;
				}
			</style>
       ```