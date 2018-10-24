import Bone from './Bone';
import BoneData from './boneData';
export default class Game extends Bone{
    constructor(...arg){
        super(...arg);
        //输出人物性别
        this.person = {
            sex:null,
        };
        this.setBackground();
    }
    setBackground(id){
        /*
        * 添加背景
        *
        * id:texture编号
        *
        * */
        id = id || '00';
        if(!this.stage.bg){
            const sprite = new PIXI.Sprite();
            this.stage.addChild(sprite);
            this.stage.bg = sprite;
            sprite.type = 'screen';
            sprite.interactive = true;
            sprite.on('pointerdown', ()=>{
                this.selectObj(null);
            });
        }
        const sprite = this.stage.bg;
        sprite.type_id = id;
        const texture = PIXI.loader.resources[`pixi_${sprite.type}_${sprite.type_id}`].texture;
        sprite.texture = texture;
    }
    setPeople(sex,id){
        /*
        * 添加/设置人物
        *
        * sex:性别
        * id:texture编号
        *
        * */
        id = id || 'default';
        const person = new PIXI.Container();
        person.position.x = this.stageScreen.width/2+Math.round(Math.random()*40-20);
        person.position.y = this.stageScreen.height/2.2+Math.round(Math.random()*40-20);
        person.scale.set(.8);
        person.sex = sex;
        person.type = 'person';
        person.type_id = id;
        this.stage.addChild(person);
        this.selectObj(person);
        //设置骨骼
        this.setBody(person);
        //设置皮肤
        this.setHead();
        this.setHair('00');
        this.setFace('00');
        this.setClothes(id);

        //设置滑动以及边框
        this.setHover(person);
        this.setMove(person.body,person);
        this.setBorderContainer(person,{x:3,y:60});
    }
    setHead(id){
        //设置头型
        id = id || 'default';
        if(this.currentObject.type ==='person'){
            const person = this.currentObject;
            const head = person.head;
            head.texture = PIXI.loader.resources[`pixi_head_${person.sex}_${id}`].texture;
        }
    }
    setHair(id){
        //设置头发
        if(this.currentObject.type ==='person'){
            const person = this.currentObject;
            const head = person.head;
            if(!head.hair){
                head.hair = new PIXI.Sprite();
                head.addChild(head.hair);
                switch (person.sex){
                    case 'female':
                        //量的  别问我怎么得出来的
                        head.hair.position.x = -47;
                        head.hair.position.y = -50;
                        break;
                    case 'male':
                        head.hair.position.x = 0;
                        head.hair.position.y = -38;
                        break;
                }
            }
            const sprite = head.hair;
            sprite.type_id = id;
            sprite.texture = PIXI.loader.resources[`pixi_hair_${person.sex}_${id}`].texture;
        }
    }
    setFace(id){
        //设置表情
        if(this.currentObject.type ==='person'){
            const person = this.currentObject;
            const head = person.head;
            if(!head.face){
                head.face = new PIXI.Sprite();
                head.addChild(head.face);
                switch (person.sex){
                    case 'female':
                        //量的  别问我怎么得出来的
                        head.face.position.x = 2;
                        head.face.position.y = 56;
                        break;
                    case 'male':
                        head.face.position.x = 10;
                        head.face.position.y = 47;
                        break;
                }
            }
            const sprite = head.face;
            sprite.type_id = id;
            sprite.texture = PIXI.loader.resources[`pixi_face_${person.sex}_${id}`].texture;
        }
    }
    setClothes(id){
        //设置衣服
        if(this.currentObject.type ==='person'){
            id = id || 'default';
            const person = this.currentObject;
            person.type_id = id;
            const clothes = Object.keys(BoneData.female.children);
            clothes.push('body');
            clothes.forEach(item=>{
                if(item==='head')return;
                const asset = PIXI.loader.resources[`pixi_${item}_${person.sex}_${id}`]||PIXI.loader.resources[`pixi_${item}_${person.sex}_default`];
                person[item].texture = asset.texture;
            });

            //添加覆盖衣服
            if(!person.body_mask){
                const sprite = new PIXI.Sprite();
                sprite.anchor.set(.5);
                person.addChildAt(sprite,3);
                sprite._visible = sprite.visible = false;
                //rotation limit 监测
                Object.defineProperty(sprite,'visible',{
                    set(visible){
                        const leftBone = this.parent.leftLeg.bone;
                        const rightBone = this.parent.rightLeg.bone;
                        if(!leftBone._rotationLimit){
                            leftBone._rotationLimit = leftBone.rotationLimit;
                            rightBone._rotationLimit = rightBone.rotationLimit;
                        }
                        if(visible){
                            leftBone.rotationLimit = leftBone._rotationLimit;
                            rightBone.rotationLimit = rightBone._rotationLimit;
                        }else{
                            leftBone.rotationLimit = rightBone.rotationLimit = null;
                        }
                        this._visible = visible;
                    },
                    get(){
                        return this._visible;
                    },
                });
                person.body_mask = sprite;
            }
            if(PIXI.loader.resources[`pixi_body_${person.sex}_mask_${id}`]){
                person.body_mask.visible = true;
                person.body_mask.texture = PIXI.loader.resources[`pixi_body_${person.sex}_mask_${id}`].texture;
            }else{
                person.body_mask.visible = false;
            }

        }
    }
    setOther(id){
        const other = new PIXI.Container();
        other.position.x = this.stageScreen.width/2+Math.round(Math.random()*20-10);
        other.position.y = this.stageScreen.height/2+Math.round(Math.random()*20-10);
        other.type = 'other';
        other.type_id = id;
        this.stage.addChild(other);

        const sprite = new PIXI.Sprite(PIXI.loader.resources[`pixi_${other.type}_${other.type_id}`].texture);
        sprite.anchor.set(.5);
        other.addChild(sprite);

        this.setHover(other);
        this.setMove(sprite,other);
        this.setBorderContainer(other);
    }
    selectObj(obj){
        this.person.sex = obj&&obj.parent&&obj.sex||'';
        super.selectObj(obj);
    }
    getObjData(){
        //获取数据 埋点用
        const objData = {
            personTotal:{
                female:0,
                male:0
            }
        };
        this.stage.children.forEach(item=>{
            if(!objData[item.type]){
                objData[item.type] = [];
            }
            switch (item.type) {
                case 'person':
                    objData.personTotal[item.sex]++;
                    objData[item.type].push({
                        sex:item.sex,
                        face:item.head.face.type_id,
                        hair:item.head.hair.type_id,
                        type_id:item.type_id,
                    });
                    break;
                case 'screen'://背景只有一个
                    objData[item.type] = item.type_id;
                    break;
                default:
                    objData[item.type].push(item.type_id);
            }
        });
        return objData;
    }
}