<template>
	<div class="video-wrap">
		<!--测试用的-->
		<!--<video ref='video' class="video" @ended="end_video" src="http://test.go.163.com/web/sale_go/20180329_f2e-video/video.mp4" x-webkit-airplay="true" playsinline="true" webkit-playsinline="true" x5-video-player-type="h5" x5-video-player-fullscreen="true"></video>-->
		<video ref='video' class="video" v-on:click="video_android()" @ended="end_video" :src="video_obj.url" x-webkit-airplay="true" playsinline="true" webkit-playsinline="true" x5-video-player-type="h5" x5-video-player-fullscreen="true"></video>
		<!-- 安卓下显示 -->
		<div ref='video_poster' v-if='poster_boo===true' class="video-poster" @click='play'>
			<!-- 默认播放图标 可自行更换 -->
			<div class="play-icon"></div>
			
		</div>
	</div>
</template>

<script>
	export default {
		props: ['video_obj'],
		data() {
			return {
				poster_boo: false,
				show_video: true,
			}
		},
		mounted() {
			document.addEventListener('WeixinJSBridgeReady', () => {
				this.$refs.video.load();
			});
			this.$refs.video.load();
		},
		methods: {
			video_init() {
				const _this = this;
				//只有在微信的ios下才会自动播放，其他全部点击播放
				if((netease.ua.ios && netease.ua.weixin) || (netease.ua.ios && netease.ua.newsapp)) {
					this.$refs.video.play();
					setTimeout(function() {
						_this.$refs.video.play();
					}, 300)
				} else {
					this.poster_boo = true;
				}

			},
			play() {
				this.poster_boo = false;
				this.$refs.video.play();
			},
			end_video() {
				//视频结束
				this.$refs.video.pause();
				this.$emit('video_over');
			},
			video_android() {
				if(netease.ua.android) {
					this.$refs.video.play();
				}
			}
		},
		components: {}
	};
</script>
<style lang="postcss">

</style>