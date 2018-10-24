# gravity模块

 - vue重力感应相关模块
    - Rotate 重力旋转
    - Light 重力扫光
 
## 用法

### 1. Rotate.vue
- props: 
    - `rotateLimit <Array>`: 旋转角度限制 [最小值,最大值]，默认[-20,20]
    - `disableRotateX <Boolean>`: 是否禁止x轴旋转，默认`false`
    - `disableRotateY <Boolean>`: 是否禁止y轴旋转，默认`false`
- 需要重新设置组件宽高定位，不设置则默认全屏
- 透视元素样式需自行设置`translateZ`
- 例子:

  ```html
    <templete>
      <Rotate class="title" :rotateLimit="[-20,20]">
          <div class="el-0"></div>
          <div class="el-1"></div>
          <div class="el-2"></div>
      </Rotate>
    </templete>
    <script>
       import Rotate from 'Components/gravity/Rotate';
       export default {
          //...
          components:{
             Rotate
          }  
       }
    </script>
    <style lang="postcss">
      .title{
          position: absolute;
          width: 200rpx;
          height: 200rpx;
        .el-0{
              position: absolute;
              transform:translateZ(100px);
        }
        .el-1{
              position: absolute;
              transform:translateZ(200px);
        }
        .el-1{
              position: absolute;
              transform:translateZ(300px);
        }
      }
    </style>
  ```
      
### 2. Light.js
- props: 
    - `rotateLimit <Array>`: 旋转角度限制 [最小值,最大值]，默认[-20,20]
    - `disableRotateX <Boolean>`: 是否禁止x轴旋转，默认`true`
    - `disableRotateY <Boolean>`: 是否禁止y轴旋转，默认`true`
- 需要重新设置组件宽高定位，不设置则默认全屏
- 例子:

    ```html
    <templete>
      <Light class="title" :rotateLimit="[-20,20]">
          <LightItem class="el-0"></LightItem>
      </Light>
    </templete>
    <script>
       import {Light,LightItem} from 'Components/gravity/Light';
       export default {
          //...
          components:{
             Light,LightItem
          }  
       }
    </script>
    <style lang="postcss">
      .title{
          position: absolute;
          width: 200rpx;
          height: 200rpx;
        .el-0{
              position: absolute;
              background: url("../assets/1.jpg") no-repeat center;
        }
      }
    </style>
    ```
    