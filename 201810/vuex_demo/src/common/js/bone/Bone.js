import Event from './Event';
import boneData from './boneData';
export default class Bone extends Event{
    static watchTexture(sprite){
        //为texture添加getter setter 监听宽高变化
        sprite.__texture = sprite._texture;
        Object.defineProperty(sprite,'_texture',{
            set: function (value) {
                const events = this._events;
                this.__texture = value;
                if(events.update){
                    const event = events.update;
                    if(event instanceof Array){
                        for(let i = 0;i<event.length;i++){
                            event[i].fn.call(event[i].context);
                            if(event[i].once){
                                event.splice(i,1);
                                i--;
                            }
                        }
                        if(!event.length){
                            delete events.update;
                        }
                    }else{
                        event.fn.call(event.context);
                        if(event.once){
                            delete events.update;
                        }
                    }
                }
            },
            get: function () {
                return this.__texture;
            }
        });
    }
    static normalizeRadian(radian,limit){
        //标准化弧度
        radian %=Math.PI*2;
        if(radian<-Math.PI){
            radian += 2*Math.PI;
        }else if(radian>Math.PI){
            radian -= 2*Math.PI;
        }
        if(limit){
            if(radian>=Math.PI-limit[1]){
                radian = Math.PI-radian;
            } else if(radian<=-(Math.PI+limit[0])){
                radian = -(Math.PI+radian);
            } else {
                radian = Math.min(
                    Math.max(
                        radian,limit[0]
                    ),limit[1]
                );
            }
        }
        return radian;
    }
    static getRootBone(sprite){
        //获取第一根骨头
        let rootBone,totalLength=0;
        while (!rootBone) {
            totalLength+=sprite.bone.length||0;
            if(!sprite.parent.bone){
                rootBone = sprite;
            }else{
                sprite = sprite.parent;
            }
        }
        return {
            rootBone,totalLength
        };
    }
    constructor(...arg){
        super(...arg);
    }
    setBody(person){
        /*
        * 设置身体主题
        *
        * person:人的root-Container
        * eventInit:骨骼事件添加
        *
        * */
        const _this = this;
        person.body = new PIXI.Sprite();
        person.body.anchor.set(.5);
        Bone.watchTexture(person.body);
        person.addChild(person.body);
        createChild(person ,boneData[person.sex].bones);
        //身子的层级比腿高
        // person.setChildIndex(person.body,2);
        function createChild(sprite,bone) {
            if(bone){
                bone.forEach(item=>{
                    const child = _this.setBone(item.child,person,sprite);
                    child.bone = boneData[person.sex].children[item.child];
                    child.position.x = item.x;
                    child.position.y = item.y;
                    if(child.parent === person){
                        person.body.once('update',()=>{
                            child.position.x -= person.body.width/2;
                            child.position.y -= person.body.height/2;
                        });
                    }
                    createChild(child,item.bones);
                });
            }else{
                //最后一块骨头追加滑动事件
                _this.setBoneTouchEvent(person,sprite);
            }
        }
    }
    setBone(name,person,parent){
        /*
        * 设置身体各个部分的贴图
        *
        * */
        const bone = boneData[person.sex].children[name];
        person[name] = new PIXI.Sprite();
        person[name].pivot.x = bone.pivotX;
        person[name].pivot.y = bone.pivotY;
        parent.addChild(person[name]);
        return person[name];
    }
    setBoneTouchEvent(person,sprite){
        //bone触控
        sprite.interactive = true;
        sprite.interactiveChildren = false;
        let touchFlag = false;
        const {rootBone,totalLength} = Bone.getRootBone(sprite);
        Bone.watchTexture(sprite);
        sprite.once('update',()=>{
            //宽高过小则重置热区
            if(sprite.width<80||sprite.height<80){
                const width = Math.max(80,sprite.width);
                const height = Math.max(80,sprite.height);
                sprite.hitArea = new PIXI.Rectangle(
                    (sprite.width-width)/2-sprite.anchor.x*sprite.width,
                    (sprite.height-height)/2-sprite.anchor.y*sprite.height,
                    width, height);
            }
        });
        sprite.on('pointerdown', ()=>{
            if(rootBone === rootBone.parent.leftLeg||rootBone === rootBone.parent.rightLeg){
                //腿的层级靠后
                rootBone.parent.setChildIndex(rootBone,2);
            }else{
                rootBone.parent.setChildIndex(rootBone,rootBone.parent.children.length-1);
            }
            touchFlag = true;
        }).on('pointerup', ()=>{
            touchFlag = false;
        }).on('pointerupoutside', ()=>{
            touchFlag = false;
        }).on('pointermove', (event)=>{
            if(!touchFlag)return;
            const global = this.app.stage;
            const touchPos = person.toLocal(event.data.global,global);
            const offset={
                x:touchPos.x - rootBone.x,
                y:touchPos.y - rootBone.y
            };
            const touchRotate = Math.atan2(offset.y,offset.x);
            if(sprite.parent.bone){
                //二级骨骼
                const touchLength = Math.hypot(offset.y,offset.x);
                const initRotation = Math.PI - rootBone.bone.offsetRotation + sprite.bone.offsetRotation;
                const position = Math.sign(-rootBone.x);
                if(touchLength>=totalLength){
                    rootBone.rotationDirection = position;
                    if(rootBone.bone.rotationLimit){
                        const offsetRotate = Bone.normalizeRadian(touchRotate-rootBone.bone.offsetRotation);
                        if(
                            position<0&&offsetRotate<=rootBone.bone.rotationLimit[0]||
                            position>0&&offsetRotate>=rootBone.bone.rotationLimit[1]
                        ){
                            rootBone.rotationDirection*=-1;
                        }
                    }
                    rootBone.oldRotation = touchRotate;
                }else if(rootBone.oldRotation){
                    rootBone.rotationDirection = Math.sign(rootBone.oldRotation-touchRotate);
                    rootBone.oldRotation = null;
                }
                if(isNaN(rootBone.rotationDirection)){
                    rootBone.rotationDirection = position;
                }
                //cos(A) = (b^2+C^2-a^2)/(2*b*c)
                const b = sprite.bone.length;
                const c = rootBone.bone.length;
                const a = touchLength;
                const cosA = Math.max(-1,Math.min(1,(Math.pow(b,2)+Math.pow(c,2)-Math.pow(a,2))/(2*b*c)));
                const cosB = Math.max(-1,Math.min(1,(Math.pow(a,2)+Math.pow(c,2)-Math.pow(b,2))/(2*a*c)));
                let A = Math.acos(cosA);
                let B = Math.acos(cosB);

                A *= rootBone.rotationDirection;
                B *= rootBone.rotationDirection;
                const rootRotation = Bone.normalizeRadian(touchRotate + B - rootBone.bone.offsetRotation);
                let rootRotationLimit = Bone.normalizeRadian(touchRotate + B - rootBone.bone.offsetRotation,rootBone.bone.rotationLimit);
                rootBone.rotation = rootRotationLimit;
                if(rootRotation !=rootRotationLimit){
                    const touchPos = rootBone.toLocal(event.data.global,global);
                    const offset={
                        x:touchPos.x - sprite.x,
                        y:touchPos.y - sprite.y
                    };
                    const touchRotate = Math.atan2(offset.y,offset.x);
                    A = touchRotate;
                }
                sprite.rotation = Bone.normalizeRadian(A - initRotation,sprite.bone.rotationLimit);

                //换方向时 手和脚镜像翻转比较自然 所以做了这个功能 还要考虑在哪边
                //注意：手必须是垂直向下的 因为y轴镜像后，不是垂直向下则会引起错位
                if(sprite.rotation*position>0){
                    sprite.rotation-=Math.PI;
                    sprite.scale.y = -1;
                }else{
                    sprite.scale.y = 1;
                }
            }else{
                //一级骨骼
                rootBone.rotation = Bone.normalizeRadian(touchRotate - rootBone.bone.offsetRotation,rootBone.bone.rotationLimit);
            }
        });
    }
}