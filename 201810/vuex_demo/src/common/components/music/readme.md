# 音乐模块


 - vue背景音乐模块
 
## 用法
 - props: 
     - `src <str>`: 传入音乐文件 
        - 逻辑完整所以不用做打开音乐等逻辑，样式和动画需自行设置
        
     - 例子:
     
       ```html
        <template>
           <Music src="../assets/song.mp3"/>
        </template>
        <script >
           import Music from 'Components/Music/App';
           export default {
               components:{
                   Music,
               }
           }
        </script>
       ```
       