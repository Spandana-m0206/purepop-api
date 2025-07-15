const {newEnforcer}=require('casbin')
const path=require('path')

let enforcerInstance=null;

async function getCasbinEnforcer(){
    if(!enforcerInstance){
        const modelPath =path.resolve(__dirname,'../casbin/model.conf');
        const policyPath=path.resolve(__dirname,'../casbin/policy.csv');
        enforcerInstance =await newEnforcer(modelPath,policyPath);
    }
    return enforcerInstance;
}
module.exports=getCasbinEnforcer;