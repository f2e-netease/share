/* 
    使用
    1.对sound.config进行配置然后直接new
    2.提供play 传入精灵id即可播放
*/
import {Howl} from 'howler';
import soundConfig from './sound.config';
const readyList=[];
const sound = new Howl(Object.assign(soundConfig,{
    onend: function(id) {
        delete playingList[id];
    }
}));
const playingList={};
function playSound(key){
    //重复播放过滤
    if(playingList[playingList[key]])return;
    playingList[key] = sound.play(key);
    playingList[playingList[key]] = key;
}
sound.ready=false;
netease.autoPlay(()=>{
    sound.ready = true;
    if(readyList.length){
        const readyTime = (new Date()).getTime();
        while(readyList.length){
            const soundItem = readyList.shift();
            //时间检测 间隔太久不播放
            if(readyTime-soundItem.time<500){
                playSound(soundItem.soundId);
            }
        }
    }else{
        sound.play('init');
    }
});
export default {
    play(key){
        //播放精灵
        if(key in sound._sprite){
            if(sound.ready){
                playSound(key);
            }else{
                readyList.push({
                    soundId:key,
                    time:(new Date()).getTime(),
                });
            }
        }else{
            console.log(`没有音效(${key})`);
        }
    }
};



