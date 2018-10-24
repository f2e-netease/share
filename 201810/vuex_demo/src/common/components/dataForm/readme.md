# Form提交模块

 - vue Form提交模块
    - dataForm 提交数据模块
    - nexus 数据联动模块
    - all_cities.json 全国所有城市数据
 
## 用法
- dataForm
    - `nexus` 中的`span`标签是占位用的，无需修改`span`的样式；
    - `nexus` 中的`select`的`className`会自动等于`name`属性的。
    - props: 
        - `nexusData <Array>`: 联动数据，json数据
        - `action <str>`: 后台地址
            - `action`不传则在点击提交的时候运行`submit`方法，并传入`form`请求数据
            - `action`传值则在点击提交并上传至服务器后运行`submit`方法，并传入后台请求后的回调
            - 大白话：意思就是你传`action`就代表请求逻辑交给此组件来完成，否则就是全部交给你。
        - `注：input,select的name属性要与后台一致，提交数据是根据name传值的；`
    - 例子:

      ```html
        <templete>
            <DataForm class="form" :nexusData="nexusData" :action="action" @submit="submit">
                <!--想添加其他数据,如flag则看下一行代码提示-->
                <input type="hidden" name="flag" value="wap">
            
                <input type="text" name="name">
                <input type="tel" name="phone">
                <!--数据联动部分，子集依靠父级联动-->
                <!--bind传入要联动数据的哪个字段-->
                <Nexus name="province" bind="pro" placeholder="请选择省份">
                    <Nexus name="city" bind="city" placeholder="请选择城市">
                        <Nexus name="dealer" bind="shop" placeholder="请选择经销商"/>
                    </Nexus>
                </Nexus>
            </DataForm>
        </templete>
        <script>
           import {DataForm,Nexus} from 'Components/dataForm/Form';
           import urlData from 'Js/config.url';
           export default {
              //...
              data(){
                  return{
                      nexusData:require('./shop.json'),
                      action:urlData.submit,//需要配置后台路径
                  }
              },
              methods:{
                  submit(data,form){
                       if(data.retCode==1){
                           form.reset();
                           console.log("提交成功");
                       }else{
                           console.log(data.retData.error);
                       }
                  }
              },
              components:{
                 DataForm,Nexus
              }  
           }
        </script>
        <style lang="postcss">
          .form{
              position: absolute;
              left: 20rpx;
              width: 600rpx;
              input,>>> select{
                  margin-bottom: 10rpx;
              }
              .submit{
                  //提交按钮
                  color: transparent;
              }
          }
        </style>
      ```
 
- nexus （如果你只想用这个组件的话）
    - `nexus` 中的`span`标签是占位用的，无需修改`span`的样式；
    - `nexus` 中的`select`的`className`会自动等于`name`属性的。
    - props: 
        - `nexusData <Array>`: 联动数据，json数据
        - `注：返回的数据名称会和Nexus的name属性值相同；`
    - function:
        - `getSelectData`:每一次数据联动都会调用此方法并传入联动结果；
    - 例子:
    
        ```html
        <templete>
           <form class="form">
               <!--数据联动部分，子集依靠父级联动-->
               <!--bind传入要联动数据的哪个字段-->
               <Nexus name="province" bind="pro" :nexusData="nexusData" @getSelectData="getSelectData" placeholder="请选择省份">
                   <Nexus name="city" bind="city" placeholder="请选择城市">
                       <Nexus name="dealer" bind="shop" placeholder="请选择经销商"/>
                   </Nexus>
               </Nexus>
           </form>
        </templete>
        <script>
          import {Nexus} from 'Components/dataForm/Form';
          export default {
             //...
             data(){
                 return{
                     nexusData:require('./shop.json'),
                     formData:{
                         province:'',
                         city:'',
                         dealer:'',
                     }
                 }
             },
             methods:{
                 getSelectData(selectData){
                      this.formData.province = selectData.province;
                      this.formData.city = selectData.city;
                      this.formData.dealer = selectData.dealer;
                 }
             },
             components:{
                Nexus
             }  
          }
        </script>
        <style lang="postcss">
         .form{
              .province{
                  position: absolute;
                  left: 20rpx;
                  //...
              }
         }
        </style>
        ``` 
    