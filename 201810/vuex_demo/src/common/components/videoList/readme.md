# 视频列表模块

 - vue视频列表模块
 
## 用法
 - props: 
     - `videoArr <Array>`: 视频数据
         - `url <str>`: 视频路径
         - `img <str>`: 视频缩略图路径
         - 结构如下
         
            ```javascript
            videoArr:[
                {
                    url:'http://flv2.bn.netease.com/videolib3/1806/26/Ozecb0135/SD/Ozecb0135-mobile.mp4',
                    img:'http://vimg1.ws.126.net/image/snapshot/2018/6/9/5/VDKAM4E95.jpg',
                }
                //...
            ]
            ```
     - 例子:
     
       ```html
        <template>
            <videoList :videoArr="videoArr"/>
        </template>
        <script>
           import videoList from 'Components/videoList/App';
           import urlData from 'Js/config.url';
           export default {
               data(){
                   return{
                       videoArr:urlData.videoArr,//需要进行配置
                   }
               },
               components:{
                    videoList
               }
           }
        </script>
       ```