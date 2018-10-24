const urlData = {
    //分享链接
    share:'{{share_url}}',
    //php接口 链接会检测是不是绝对路径，不是的话自动拼接php公测网路径
    mgcInfo:'common/shareh5.php?act=mgcInfo',//敏感词
    addPicInfo:'2018/0705/siemens/common.php?act=addPicInfo',
};

//php非绝对路径的自动拼全逻辑 不用看
let php_test = `${location.protocol}//test.go.163.com/api/go/`;//测网
let php_release = `${location.protocol}//go.163.com/api/`;//公网
if(location.host.indexOf('s.auto')>=0||location.pathname.indexOf('sale_auto')>=0){
    //auto项目的公共路径
    php_test = `${location.protocol}//test.go.163.com/api/auto/`;//测网
    php_release = `${location.protocol}//s.auto.163.com/api/`;//公网
}
Object.keys(urlData).forEach(item=>{
    if(urlData[item].search(/^http/)<0){
        const php_url = location.host.search(/^(s\.auto|go)\.163/)>=0?php_release:php_test;
        urlData[item] = php_url+urlData[item].replace(/^\//,'');
    }
});
export default urlData;