namespace web3d
{
    // const formatMetadataKey = Symbol("format");

    // function format(formatString: string) {
    //     return Reflect.metadata(formatMetadataKey, formatString);
    // }

    // function getFormat(target: any, propertyKey: string) {
    //     return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
    // }
    // const RegClassMap: Map<Function, string> = new Map();
    // const RegAttsMap: Map<Function, string[]> = new Map();
    const DataInfo:any={};

    export function Attribute(target: any, _key: string) {
        //let _type = Reflect.getMetadata("design:type", target, _key);
        if (target["_web3d"] == null) target["_web3d"] = {};
        if (target["_web3d"]["atts"] == undefined) target["_web3d"]["atts"] = [];
        target["_web3d"]["atts"].push(_key);
    }
    export function getClassFunctionByName(name:string):Function
    {
        return DataInfo["_web3d"][name]["func"];
    }
    export function Class(constructor: Function,SeralizeName:string) {

        let target = constructor.prototype;
        // let className = target.constructor.name;
        let className=SeralizeName;
        if (target["_web3d"] == null) target["_web3d"] = {};
        target["_web3d"]["class"] = className;
        // RegClassMap.set(constructor, className);
        //注册全局类型标记
        if (DataInfo["_web3d"] == null) DataInfo["_web3d"] = {};
        if (DataInfo["_web3d"][className] == null) DataInfo["_web3d"][className] = {};
        DataInfo["_web3d"][className]["contor"] = target.constructor;
        DataInfo["_web3d"][className]["func"]=constructor;
    }

    export function ClassWithTag(constructor: Function,tagInfo: string) {
        let target = constructor.prototype;
        let className = constructor["type"]?constructor["type"]:target.constructor.name;
        
        if (target["_web3d"] == undefined) target["_web3d"] = {};
        target["_web3d"]["class"] = className;
        // RegClassMap.set(constructor, target.constructor.name);
        
        //注册全局类型标记
        if (DataInfo["_web3d"] == null) DataInfo["_web3d"] = {};
        if (DataInfo["_web3d"][className] == null) DataInfo["_web3d"][className] = {};
        DataInfo["_web3d"][className]["contor"] = target.constructor;
        DataInfo["_web3d"][className]["tag"] = tagInfo;
        DataInfo["_web3d"][className]["func"]=constructor;

    }

    export function createInstanceByName(className: string) {
        let classInfo = DataInfo["_web3d"][className];
        if (classInfo) {
            let ctor = classInfo["contor"];
            return new ctor();
        } else {
            console.error("ERROR: creatInstance by ClassName Failed.\n INFO: Class: " + className + "not reg!");
            return null;
        }
    }
    export function getRegistedClassName(obj: Object): string|null {
        // if (RegClassMap.has(obj.constructor))
        //     return RegClassMap.get(obj.constructor);
        let proto =Object.getPrototypeOf(obj);
        if (proto["_web3d"]) {
            return proto["_web3d"]["class"];
        } else {
            console.error("getRegistedClassName failed",obj);
            return null;
        }

    }
    export function haveRegClass(obj: Object):boolean
    {
        let classname=obj.constructor.name;
        let classInfo = DataInfo["_web3d"][classname];
        return classInfo!=null;
    }

    export function Serialize(name:string) {
    return (target)=>{
        Class(target,name);
    }
    }
    export function NodeComponent(constructorObj: Function) {
        ClassWithTag(constructorObj, "comp");
    }
    export function NodeComponent2d(constructorObj: Function) {
        ClassWithTag(constructorObj, "comp2d");
    }
    export function GameAsset(constructorObj: Function) {
        ClassWithTag(constructorObj, "Asset");
    }
    export function creatComponent(classsName: string) {
        let classInfo = DataInfo["_web3d"][classsName];
        if (classInfo["tag"] == "comp") {
            let ctor = classInfo["contor"];
            return new ctor();
        } else {
            console.error("ERROR: creat component failed.\n INFO: " + classsName + " component" + +" not Exist!")
            return null;
        }
    }
    export function creatComponent2d(classsName: string)
    {
        let classInfo = DataInfo["_web3d"][classsName];
        if (classInfo["tag"] == "comp2d") {
            let ctor = classInfo["contor"];
            return new ctor();
        } else {
            console.error("ERROR: creat component failed.\n INFO: " + classsName + " component" + +" not Exist!")
            return null;
        }
    }
    export function BeCompoentType(type:string):boolean
    {
        let classInfo = DataInfo["_web3d"][type];
        if(classInfo==null) return false;
        let becomp=classInfo["tag"] == "comp";
        return  becomp;
    }
    export function BeAssetType(type:string):boolean
    {
        let classInfo = DataInfo["_web3d"][type];
        if(classInfo==null) return false;
        let becomp=classInfo["tag"] == "Asset";
        return  becomp;
    }

    export function UserCode(constructorObj: Function) {
        ClassWithTag(constructorObj, "usercode");
    }
    export function creatUserCode(classsname: string) {
        let classInfo = DataInfo["_web3d"][classsname];
        if (classInfo["tag"] == "usercode") {
            let ctor = classInfo["contor"];
            return new ctor();
        } else {
            console.error("ERROR: creat usercode failed.\n INFO: " + classsname + " class " + +"is not user-defined class or have not registed.")
            return null;
        }
    }

    export function getAtts(obj: Object):string[]|null
    {
        let proto =Object.getPrototypeOf(obj);
        // let proto = obj["__proto__"];
        if (proto["_web3d"]) {
            return proto["_web3d"]["atts"];
        } else {
            return null;
        }
        //return RegAttsMap.get(obj["__proto__"].constructor);
        // let tarContor=obj["__proto__"].constructor;

        // while(RegAttsMap.has(tarContor))
        // {
        //     let newatts=RegAttsMap.get(tarContor);
        //     for(let item in newatts)
        //     {
        //         atts.push(newatts[item]);
        //     }
        //     tarContor=tarContor["__proto__"].constructor;
        // }
        // return atts;
    }

}
