# 骨骼项目

 - Game.js 为项目入口包含了所有逻辑（人物和其他元素），皮肤设置也在里面
 - Bone.js 为骨骼逻辑，只用骨骼的话可以单独引用它
    - boneData.js 骨骼数据
 - Event.js 为元素拖拽缩放等逻辑
 - Screen.js 跟屏幕自适应有关系，也包含了导出base64逻辑   
 
## 用法

 - Game.js ,用时要考虑性能问题，我建议单例模式
    - 该js中的资源命名全部以`pixi_`开头
    ```javascript
    const game = new Game({
        //自适应设置 设置大小 以及旋转角度
        
        // 可以传width/height获取大小
        // 也可以传 texture(会调用图片的width/height)
        texture:PIXI.loader.resources['pixi_screen_00'].texture,
        
        // 支持横屏 横屏时rotation传Math.PI/2
        rotation:Math.PI/2
    });
    //当vue的dom生成之后，运行追加canvas逻辑
    //afterMounted
    game.init(this.$refs.canvasParent);
    ```
    
 - Bone.js 
 
    ```javascript
    const person = new PIXI.Container();
    this.setBody(person);
    ```
    
 - Event.js 
    ```javascript
    this.setHover(selectObj);
    this.setMove(target,selectObj);//target 点击的元素,selectObj 要移动的元素
    this.setBorderContainer(selectObj);
    ```