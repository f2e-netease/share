/* 
用法
    1.用法请看flash.js
    2.提供onUpdate方法，会在更新帧时调用
    3.默认y轴滑动，想要修改,添加第三个参数
        new Flash(canvas,assets,{
            direction: 'x'
        })
*/
import Flash from "./flash";
export default class FlashControl extends Flash{
    constructor(...a){
        super(...a);
        const control = a[2]&&a[2].control?a[2].control:{};
        this.options.control = Object.assign({
            direction: 'y'
        }, control);
    }
    createStage(...a){
        super.createStage(...a);
        this.setTimeCtr();
        this.setTouch();
    }
    setTimeCtr(){
        const _this = this;
        this.timeCtr={
            _current:0,
            _timer:null,
            endFrame:0,
            get currentFrame(){
                return this._current;
            },
            set currentFrame(frame){
                if(frame>_this.exportRoot.totalFrames-1){
                    frame = _this.exportRoot.totalFrames-1;
                    this.endFrame = _this.exportRoot.totalFrames-1;
                }else if(frame<0){
                    frame = 0;
                    this.endFrame = 0;
                }
                const c_frame = Math.floor(frame);
                if(_this.exportRoot.currentFrame!=c_frame){
                    _this.exportRoot.gotoAndStop(c_frame);
                }
                this._current = frame;
                _this.onUpdate&&_this.onUpdate(frame);
            }
        };
        const timeCtr = this.timeCtr;
        let oldFrameTime = 0;
        const fps = 1000/60;
        const requestAnimationFrame = window.requestAnimationFrame||window.webkitRequestAnimationFrame;
        const cancelAnimationFrame = window.cancelAnimationFrame||window.webkitCancelAnimationFrame;
        updateTime();
        function updateTime(time){
            let timeScale = 1;
            if(time){
                timeScale = Math.min((time-oldFrameTime)/fps,4);
                oldFrameTime = time;
            }
            if(timeCtr.currentFrame != timeCtr.endFrame){
                const offsetFrame = timeCtr.endFrame-timeCtr.currentFrame;
                if(Math.abs(offsetFrame)<1){
                    timeCtr.currentFrame = timeCtr.endFrame;
                }else{
                    const limitOffset = .5;
                    let c_offsetFrame = offsetFrame/20*timeScale;
                    if(Math.abs(c_offsetFrame)<limitOffset){
                        if(Math.abs(offsetFrame)<limitOffset){
                            c_offsetFrame = offsetFrame;
                        }else{
                            c_offsetFrame = limitOffset*Math.abs(c_offsetFrame)/c_offsetFrame;
                        }
                    }
                    timeCtr.currentFrame += c_offsetFrame;
                }
            }
            requestAnimationFrame(updateTime);
        }
    }
    setTouch(){
        let oldPos = null;
        let touchTimer = null;
        let speedScale = 1;
        const control = this.options.control;
        function resetSpeedScale(){
            clearTimeout(touchTimer);
            speedScale*=1.1;
            touchTimer = setTimeout(() => {
                speedScale = 1;
            }, 300);
        }
        this.canvas.addEventListener('touchstart',(ev)=>{
            if(ev.touches.length>1)return;
            oldPos = {
                x:ev.changedTouches[0].pageX,
                y:ev.changedTouches[0].pageY
            };
            resetSpeedScale();
        });
        this.canvas.addEventListener('touchmove',(ev)=>{
            if(ev.touches.length>1)return;
            const currentPos = {
                x:ev.changedTouches[0].pageX,
                y:ev.changedTouches[0].pageY
            };
            const offset = currentPos[control.direction]-oldPos[control.direction];
            this.timeCtr.endFrame-=offset*2*speedScale;
            oldPos = currentPos;
        }); 
    }
}