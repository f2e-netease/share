import * as PIXI from 'pixi.js';
const scale = 640/window.innerWidth;
export default class Screen {
    static getBlob(imgData){
        //获取blob
        try {
            const base64Arr = imgData.split(',');
            let imgtype = '';
            let base64String = '';
            if(base64Arr.length > 1){
                //去掉头信息
                base64String = base64Arr[1];
                imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':')+1,base64Arr[0].indexOf(';'));
            }
            // 将base64解码
            const bytes = atob(base64String);
            const bytesCode = new ArrayBuffer(bytes.length);
            // 转换为类型化数组
            const byteArray = new Uint8Array(bytesCode);

            // 将base64转换为ascii码
            for (let i = 0; i < bytes.length; i++) {
                byteArray[i] = bytes.charCodeAt(i);
            }
            // 生成Blob对象（文件对象）
            const blob =  new Blob( [bytesCode] , {type : imgtype});
            return URL.createObjectURL(blob);
        }catch (e) {
            return imgData;
        }
    }
    constructor(stage){
        /*
        * stage: 舞台设置
        *    width: 舞台宽度（canvas 背景的宽度，不传则按屏幕宽度）
        *    height: 舞台高度（canvas 背景的高度，不传则按屏幕高度）
        *    rotation: 舞台角度（不传默认是垂直的，需要横向则传 Math.PI/2）
        *
        * */
        this.screen = {
            width:Math.ceil(window.innerWidth*scale),
            height:Math.ceil(window.innerHeight*scale),
        };
        this.stageScreen = stage;
        if(stage.texture){
            this.stageScreen.width = stage.texture.width;
            this.stageScreen.height = stage.texture.height;
        }
        this.initApp();
        this.initStage();
    }
    initApp(){
        this.app = new PIXI.Application(this.screen.width, this.screen.height,{
            autoStart:false,
            forceCanvas:true,
            backgroundColor:0xe6e6e6,
            // resolution:this.screen.scale
        });
    }
    initStage(){
        //stage需要反转
        this.stage = new PIXI.Container();
        this.stage.position.x = this.screen.width/2;
        this.stage.position.y = this.screen.height/2;
        this.stage.pivot.x = this.stageScreen.width/2||this.screen.width/2;
        this.stage.pivot.y = this.stageScreen.height/2||this.screen.height/2;
        this.stage.rotation = this.stageScreen.rotation||0;
        const c_height = Math.sin(this.stage.rotation)*this.stageScreen.width+Math.cos(this.stage.rotation)*this.stageScreen.height;
        const c_width = Math.cos(this.stage.rotation)*this.stageScreen.width+Math.sin(this.stage.rotation)*this.stageScreen.height;
        this.stage.scale.set(Math.max(this.screen.height/c_height,this.screen.width/c_width));
        this.app.stage.addChild(this.stage);
    }
    renderStart(){
        this.app.start();
    }
    renderStop(){
        this.app.render();
        this.app.stop();
    }
    getDataURL(){
        const imgData = this.app.view.toDataURL('image/jpeg');
        //判断是否方向是正确的
        if(!this.stageScreen.rotation){
            return new Promise(resolve => {
                resolve(Screen.getBlob(imgData));
            });
        }else{
            return new Promise(resolve => {
                const img = document.createElement('img');
                img.onload = ()=>{
                    resolve(img);
                };
                img.src = Screen.getBlob(imgData);
            }).then((img)=>{
                return new Promise(resolve => {
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.cos(this.stageScreen.rotation)*this.screen.width+Math.sin(this.stageScreen.rotation)*this.screen.height;
                    canvas.height = Math.sin(this.stageScreen.rotation)*this.screen.width+Math.cos(this.stageScreen.rotation)*this.screen.height;
                    const ctx = canvas.getContext('2d');
                    ctx.rotate(-this.stageScreen.rotation);
                    ctx.drawImage(img,Math.sin(-this.stageScreen.rotation)*this.screen.width,0);
                    resolve(Screen.getBlob(canvas.toDataURL('image/jpeg')));
                });
            })
        }
    }
    init(canvasEle){
        //追加canvas标签
        canvasEle.appendChild(this.app.view);
    }
}