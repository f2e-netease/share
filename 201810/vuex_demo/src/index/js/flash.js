/* 
用法
    1.html中引用createJS
    2.flash 导出的js中会引用全局变量 AdobeAn ，所以在html中 注册AdobeAn  -> var AdobeAn
    3.本js中引用 flash导出的js
    4.用法
        import Flash from './flash';
        //...
        new Flash(canvas,assets);//因为要修正图片路径 所以要传assets资源
    5.提供onReady方法，会在stage生成后执行
*/
import './game';//flash 导出的js
let screen = null;
const focalLength = 528.25;
export default class Flash{
    static getProjectionMatrix(totalDepth,lib){
        const projectionCenter = { x : lib.properties.width/2, y : lib.properties.height/2 };
        const scale = (totalDepth + focalLength)/focalLength;
        const scaleMat = new window.createjs.Matrix2D;
        scaleMat.a = 1/scale;
        scaleMat.d = 1/scale;
        let projMat = new window.createjs.Matrix2D;
        projMat.tx = -projectionCenter.x;
        projMat.ty = -projectionCenter.y;
        projMat = projMat.prependMatrix(scaleMat);
        projMat.tx += projectionCenter.x;
        projMat.ty += projectionCenter.y;
        return projMat;
    }
    constructor(canvas,assets,options){
        this.options = options||{};
        this.composition = window.AdobeAn.compositions[Object.keys(window.AdobeAn.compositions)[0]];
        this.lib = this.composition.getLibrary();
        this.lib.properties.manifest.forEach(item=>{
            if(typeof assets ==='object'){
                item.src = assets[item.id].src;
            }else{
                const keys = assets.keys();
                if(keys.includes(`./${item.id}.png`)){
                    item.src = assets(`./${item.id}.png`);
                }else if(keys.includes(`./${item.id}.jpg`)){
                    item.src = assets(`./${item.id}.jpg`);
                }
            }
        });
        this.canvas = canvas;
        this.canvas.width = this.screen.screenWidth;
        this.canvas.style.backgroundColor = this.lib.properties.color;
        this.canvas.height = Math.max(Math.min(this.screen.screenHeight,1200),950);
        if((new Image()).decode){
            const loader = {
                getResult(id){
                    return this.loadedResults[id]||null;
                },
                loadedItem:[],
                loadedResults:{},
            };
            this.lib.properties.manifest.forEach(item=>{
                const image = new Image();
                const canvas = document.createElement('canvas');
                image.src = item.src;
                image.decode().then(()=>{
                    canvas.width = image.naturalWidth;
                    canvas.width = image.naturalHeight;
                    loader.loadedResults[item.id] = image;
                    loader.loadedItem.push(item.id);
                    if(loader.loadedItem.length === this.lib.properties.manifest.length){
                        this.createStage(loader);
                    }
                });
            });
        }else{
            const loader = new createjs.LoadQueue(false);
            loader.addEventListener("fileload", evt=>{
                const images=this.composition.getImages();
                if (evt && (evt.item.type == "image")) { images[evt.item.id] = evt.result; }
            });
            loader.addEventListener("complete", evt=>{
                this.createStage(evt.target);
            });
            loader.loadManifest(this.lib.properties.manifest);
        }
    }
    createStage(evt){
        const spriteSheet = this.composition.getSpriteSheet();
        const queue = evt.target;
        const ssMetadata = this.lib.ssMetadata;
        for(let i=0; i<ssMetadata.length; i++) {
            spriteSheet[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
        }
        this.exportRoot = new this.lib.game();
        this.composition.getStage = ()=> { return this.exportRoot.getStage();};
        this.exportRoot.___sortFunction___ = (obj1,obj2)=>{
		    return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
        };
        this.stage = new this.lib.Stage(this.canvas);
        this.stage.y = (this.canvas.height-this.screen.stageHeight)/2;
        window.AdobeAn.compositionLoaded(this.lib.properties.id);
        
        this.stage.addChild(this.exportRoot);
        window.createjs.Ticker.timingMode = window.createjs.Ticker.RAF_SYNCHED;
        window.createjs.Ticker.setFPS(this.lib.properties.fps);
        window.createjs.Ticker.addEventListener("tick", this.stage);
        this.onReady&&this.onReady();
        // 透视功能
        // this.stage.addEventListener("tick", ()=>{
        //     this.setCameraMatrix();
        // });
    }
    setCameraMatrix(){
        const cameraInstance = this.exportRoot.___camera___instance;
        if(cameraInstance !== undefined && cameraInstance.pinToObject !== undefined)
        {
            cameraInstance.x = cameraInstance.pinToObject.x + cameraInstance.pinToObject.pinOffsetX;
            cameraInstance.y = cameraInstance.pinToObject.y + cameraInstance.pinToObject.pinOffsetY;
            if(cameraInstance.pinToObject.parent !== undefined && cameraInstance.pinToObject.parent.depth !== undefined)
                cameraInstance.depth = cameraInstance.pinToObject.parent.depth + cameraInstance.pinToObject.pinOffsetZ;
        }
        for(let child in this.exportRoot.children)
        {
            const layerObj = this.exportRoot.children[child];
            if(layerObj == cameraInstance)
                continue;
                if(layerObj.currentFrame != layerObj.parent.currentFrame)
                {
                    layerObj.gotoAndPlay(layerObj.parent.currentFrame);
                }
            const matToApply = new window.createjs.Matrix2D;
            let cameraMat = new window.createjs.Matrix2D;
            let totalDepth = layerObj.layerDepth ? layerObj.layerDepth : 0;
            let cameraDepth = 0;
            if(cameraInstance && !layerObj.isAttachedToCamera)
            {
                const stageCenter = { 'x' : this.lib.properties.width/2, 'y' : this.lib.properties.height/2 };
                const mat = cameraInstance.getMatrix();
                mat.tx -= stageCenter.x;
                mat.ty -= stageCenter.y;
                cameraMat = mat.invert();
                cameraMat.prependTransform(stageCenter.x, stageCenter.y, 1, 1, 0, 0, 0, 0, 0);
                cameraMat.appendTransform(-stageCenter.x, -stageCenter.y, 1, 1, 0, 0, 0, 0, 0);
                if(cameraInstance.depth)
                    cameraDepth = cameraInstance.depth;
            }
            if(layerObj.depth)
            {
                totalDepth = layerObj.depth;
            }
            //Offset by camera depth
            totalDepth -= cameraDepth;
            if(totalDepth < -focalLength)
            {
                matToApply.a = 0;
                matToApply.d = 0;
            }
            else
            {
                if(layerObj.layerDepth)
                {
                    const sizeLockedMat = App.getProjectionMatrix(layerObj.layerDepth,this.lib);
                    if(sizeLockedMat)
                    {
                        sizeLockedMat.invert();
                        matToApply.prependMatrix(sizeLockedMat);
                    }
                }
                matToApply.prependMatrix(cameraMat);
                const projMat = App.getProjectionMatrix(totalDepth,this.lib);
                if(projMat)
                {
                    matToApply.prependMatrix(projMat);
                }
            }
            layerObj.transformMatrix = matToApply;
        }
    }
    get screen(){
        if(!screen){
            screen = {
                innerWidth:window.innerWidth,
                innerHeight:window.innerHeight,
                stageWidth:this.lib.properties.width,
                stageHeight:this.lib.properties.height,
            };
            screen.stageScale = screen.innerWidth/screen.stageWidth;
            screen.screenWidth = screen.innerWidth/screen.stageScale;
            screen.screenHeight = screen.innerHeight/screen.stageScale;
            screen = Object.freeze(screen);
        }
        return screen;
    }
}