import axios from './config.axios';
import urlData from './config.url';
if (!window.CustomEvent) {
    window.CustomEvent = function(type, config) {
        config = Object.assign({ bubbles: false, cancelable: false, detail: undefined},config);
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, config.bubbles, config.cancelable, config.detail);
        return e;
    };
    window.CustomEvent.prototype = window.Event.prototype;    
}
if(window.HTMLInputElement&&window.HTMLElement){
    const filterEvent = new CustomEvent("filter");
    window.HTMLInputElement.prototype.addEventListener = function(type,...arg){
        if(type==='filter'){
            this.onblur = function(e){
                if(this.value){
                    axios.post(urlData.mgcInfo, {data: this.value}).then(({data}) => {
                        //doSomething
                        if(data.retCode==1&data.retData){
                            alert('输入的内容包含敏感词呦~，换一个试试~');
                            this.value ='';
                            return;
                        }
                        this.dispatchEvent(filterEvent);
                    }).catch(()=>{
                        this.dispatchEvent(filterEvent);
                    });
                }            
            };
        }
        window.HTMLElement.prototype.addEventListener.call(this,type,...arg);
    }
    if(window.HTMLTextAreaElement)window.HTMLTextAreaElement.prototype.addEventListener = window.HTMLInputElement.prototype.addEventListener;
}