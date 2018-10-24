import Screen from './Screen';
const SCALE_MAX = 1.4;
const SCALE_MIN = .4;
export default class Event extends Screen{
    static drawDashLine(line, x1, y1, x2, y2, dashLen=5){
        //画虚线
        const DashNum = Math.floor(Math.hypot(x2 - x1, y2 - y1)/dashLen);
        for (let i = 0; i < DashNum; i++) {
            line[i % 2 == 0 ? 'moveTo' : 'lineTo'](x1 + (x2 - x1) / DashNum * i, y1 + (y2 - y1) / DashNum * i);
        }
    }
    constructor(...arg){
        super(...arg);
        this.currentObject = null;
    }
    setMove(sprite,target){
        //设置拖拽
        const global = this.app.stage;
        target = target || sprite;
        sprite.interactive = true;
        let touchInit = null;
        sprite.on('pointerdown', (event)=>{
            if(!target.parent)return;
            touchInit = target.parent.toLocal(event.data.global,global);
            touchInit.position = {
                x:target.position.x,
                y:target.position.y
            }
        }).on('pointerup', ()=>{
            touchInit = null;
        }).on('pointerupoutside', ()=>{
            touchInit = null;
        }).on('pointermove', (event)=>{
            if(!touchInit)return;
            const touchPos = target.parent.toLocal(event.data.global,global);
            const position={
                x:touchPos.x - touchInit.x + touchInit.position.x,
                y:touchPos.y - touchInit.y + touchInit.position.y
            };
            target.position.x = position.x;
            target.position.y = position.y;
        });
    }
    setHover(sprite){
        //设置触摸放大
        sprite.interactive = true;
        sprite.hoverScale = 1;
        const SCALE_MIN = 1;
        const SCALE_MAX = 1.02;
        let scaleTimer = null;
        sprite.on('pointerdown', ()=>{
            this.selectObj(sprite);
            scale(true);
        }).on('pointerup', ()=>{
            scale(false);
        }).on('pointerupoutside', ()=>{
            scale(false);
        });
        function scale(hover) {
            cancelAnimationFrame(scaleTimer);
            _scale();
            function _scale() {
                if(hover){
                    sprite.hoverScale += .001;
                    if(sprite.hoverScale>=SCALE_MAX){
                        sprite.hoverScale = SCALE_MAX;
                        sprite.scale.set(sprite.hoverScale*sprite.myScale);
                        return;
                    }
                    sprite.scale.set(sprite.hoverScale*sprite.myScale);
                    scaleTimer = requestAnimationFrame(_scale);
                }else{
                    sprite.hoverScale -= .001;
                    if(sprite.hoverScale<=SCALE_MIN){
                        sprite.hoverScale = SCALE_MIN;
                        sprite.scale.set(sprite.hoverScale*sprite.myScale);
                        return;
                    }
                    sprite.scale.set(sprite.hoverScale*sprite.myScale);
                    scaleTimer = requestAnimationFrame(_scale);
                }
            }
        }
    }
    setBorderContainer(sprite,offset={x:10,y:10}){
        //设置虚线框Container
        sprite.border = new PIXI.Container();
        const bounds = sprite.getLocalBounds();
        const offsetX = bounds.width/offset.x;
        const offsetY = bounds.height/offset.y;
        sprite.border.parentBounds = {
            top:bounds.top-offsetY,
            left:bounds.left-offsetX,
            right:bounds.right+offsetX,
            bottom:bounds.bottom+offsetY
        };
        sprite.addChild(sprite.border);
        this.selectObj(sprite);
        this.setBorder(sprite.border);
        this.setRotate(sprite.border);
        this.setClose(sprite.border);
    }
    setBorder(parent){
        //制作虚线框
        const bounds = parent.parentBounds;
        const border = new PIXI.Graphics();
        border.lineStyle(2, 0xffffff, 1);
        Event.drawDashLine(border,bounds.left,bounds.top,bounds.right,bounds.top);
        Event.drawDashLine(border,bounds.right,bounds.top,bounds.right,bounds.bottom);
        Event.drawDashLine(border,bounds.right,bounds.bottom,bounds.left,bounds.bottom);
        Event.drawDashLine(border,bounds.left,bounds.bottom,bounds.left,bounds.top);
        parent.addChild(border);
        border.cacheAsBitmap=true;

    }
    setClose(parent){
        //关闭按钮
        const bounds = parent.parentBounds;
        const body = parent.parent;
        const texture = PIXI.loader.resources[`pixi_close`].texture;
        const close = new PIXI.Sprite(texture);
        close.anchor.x=0;
        close.anchor.y=1;
        close.position.x=bounds.right;
        close.position.y=bounds.top;
        if(close.width<80||close.height<80){
            const width = Math.max(80,close.width);
            const height = Math.max(80,close.height);
            close.hitArea = new PIXI.Rectangle(
                (close.width-width)/2-close.anchor.x*close.width,
                (close.height-height)/2-close.anchor.y*close.height,
                width,
                height
            );
        }

        parent.addChild(close);
        parent.closeBtn = close;

        close.interactive = true;
        close.on('pointerdown', ()=>{
            body.parent.removeChild(body);
            this.selectObj(null);
        });
    }
    setRotate(parent){
        //旋转缩放按钮
        const bounds = parent.parentBounds;
        const body = parent.parent;
        const texture = PIXI.loader.resources[`pixi_rotate`].texture;
        body.myScale = body.scale.x;
        const rotate = new PIXI.Sprite(texture);
        rotate.anchor.set(0);
        rotate.position.x = bounds.right;
        rotate.position.y = bounds.bottom;
        if(rotate.width<80||rotate.height<80){
            const width = Math.max(80,rotate.width);
            const height = Math.max(80,rotate.height);
            rotate.hitArea = new PIXI.Rectangle(
                (rotate.width-width)/2-rotate.anchor.x*rotate.width,
                (rotate.height-height)/2-rotate.anchor.y*rotate.height,
                width,
                height
            );
        }

        parent.addChild(rotate);
        parent.rotateBtn = rotate;

        rotate.interactive = true;
        let touch_data = null;
        rotate.on('pointerdown', (event)=>{
            touch_data = {
                x:event.data.global.x,
                y:event.data.global.y,
                rotation:body.rotation,
                scale:body.myScale
            };
        }).on('pointerup', ()=>{
            touch_data = null;
        }).on('pointerupoutside', ()=>{
            touch_data = null;
        }).on('pointermove', (event)=>{
            if(touch_data){
                const pivot = parent.toGlobal(body.pivot);
                const offsetX = pivot.x-event.data.global.x;
                const offsetY = pivot.y-event.data.global.y;
                const oldOffsetX = pivot.x-touch_data.x;
                const oldOffsetY = pivot.y-touch_data.y;
                //旋转
                body.rotation = touch_data.rotation+Math.atan2(offsetY,offsetX)-Math.atan2(oldOffsetY,oldOffsetX);
                //缩放
                const scale = Math.hypot(offsetX,offsetY)/Math.hypot(oldOffsetX,oldOffsetY);
                body.myScale = Math.min(SCALE_MAX,Math.max(touch_data.scale*scale,SCALE_MIN));
                body.scale.set(body.myScale*body.hoverScale);

                //按钮不缩放
                parent.rotateBtn.scale.set(1/body.myScale);
                parent.closeBtn.scale=parent.rotateBtn.scale;

            }
        });
    }
    selectObj(obj){
        //选择对象; 并且打开border
        obj = obj&&obj.parent?obj:null;
        if(this.currentObject===obj)return;
        if(this.currentObject){
            const border = this.currentObject.border;
            if(border) border.visible = false;
        }
        this.currentObject = obj;
        if(this.currentObject) {
            const parent = this.currentObject.parent;
            const childNum = parent.children.length;
            parent.setChildIndex(this.currentObject,childNum-1);
            const border = this.currentObject.border;
            if(border) border.visible = true;
        }
    }
}