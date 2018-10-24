<template>
    <span>
        <select :name="name" class="nexus" :class="name" v-model="selectVal" ref="select">
            <option :value="index?item:''" :key='index' :disabled="!index" v-for="(item,index) of optionData">{{!index?placeholder:item.split('|###|')[0]}}</option>
        </select>
        <slot></slot>
    </span>
</template>
<script>
    function getOption(nexusData,current,nexus) {
        const option = [''];
        nexusData.forEach(item=>{
            if(!option.includes(item[current])){
                if(!nexus){
                    option.push(item[current]);
                }else if(item[nexus.name]===nexus.value){
                    option.push(item[current]);
                }
            }
        });
        return option;
    }
	export default{
		props: ['name','bind','nexusData','placeholder'],
		data(){
			return{
                selectVal:'',
			}
        },
        created(){
		    this.watchParent();
        },
        watch:{
            selectVal(val){
                const selectData={};
                let currentSelect = this.rootSelect;
                while(true){
                    selectData[currentSelect.$props.name]=currentSelect.selectVal;
                    if(!currentSelect.$children.length)break;
                    currentSelect = currentSelect.$children[0];
                }
                this.rootSelect.$emit('getSelectData',selectData);
            }
        },
        computed: {
            rootSelect(){
                let rootSelect = this;
                while (rootSelect.$parent) {
                    if(!rootSelect.$parent.$refs.select){
                        return rootSelect;
                    }
                    rootSelect = rootSelect.$parent;
                }
            },
            c_nexusData(){
                return this.rootSelect.$props.nexusData||this.rootSelect.$parent.nexusData||[];
            },
            optionData(){
                if(this.$parent.$refs.select){
                    return getOption(this.c_nexusData,this.bind,{
                        name:this.$parent.$props.bind,
                        value:this.$parent.$data.selectVal
                    });
                }else{
                    return getOption(this.c_nexusData,this.bind);
                }
            }
        },
		methods: {
            watchParent(){
                if(this.$parent.$refs.select){
                    this.$parent.$watch('selectVal',()=>{
                        this.selectVal = '';
                    })
                }
            }
        }
    }
</script>
<style lang="postcss">
    .nexus{
        position: relative;
        display: block;
        width: 100%;
        box-sizing: border-box;
    }
</style>
