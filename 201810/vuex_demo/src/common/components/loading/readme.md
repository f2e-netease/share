# loading模块


 - vue加载模块
 
## 用法
 - props: 
     - `assets <require.context>`: 传入加载的资源
     - `pixiAssets <require.context>`: 传入需要pixi加载的资源，不传不进行相应逻辑
     - `complete <function>`: loading完成后调用此函数;
     - 例子:
     
       ```html
       <Loading :assets="loadAssets" :pixiAssets="pixiAssets" @complete="loadComplete"/>
       ```