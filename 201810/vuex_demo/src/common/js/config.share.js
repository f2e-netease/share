import url from './config.url';
//分享链接 ————> ./config.url
const shareArr = [
    {
        fText:'来不及了，球衣给我！',
        title:'来不及了，球衣给我！',
        desc:'看球赛，没有球衣怎么行？还有大奖等你来拿！'
    },
];
window.shareData=Object.assign(shareArr[Math.floor(Math.random()*shareArr.length)], {
    MsgImg: url.share.replace(/index.html/, 'static/share.jpg'),  //分享图片
    link: url.share,    //分享链接
    callback: function () {
        share_survey(true);
    }
});
NeteaseShareInit();