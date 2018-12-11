namespace web3d
{
    export interface IAssetLoader
    {
        load(url: string,state:AssetLoadInfo,onFinish: (asset:IAsset,state: AssetLoadInfo) => void,onProgress:(progress:{loaded:number,total:number})=>void):IAsset;
    }
    
    export class BundleInfo {
        name: string;
        url: string;
        /**
         * asset name ->url
         */
        mapNamed: { [resName: string]: string } = {};
    
        constructor(name: string, url: string) {
            this.name = name;
            this.url = url;
        }
    }
    
    export class ABTreeParse
    {
        constructor(name:string,url:string)
        {
            this.bundleInfo=new BundleInfo(name,url);
            // this.bundleInfo.name=name;
            // this.bundleInfo.url=url;
            assetMgr.loadMapBundle[name]=this.bundleInfo;
        }
        protected bundleInfo:BundleInfo;
    
        protected objDIC:{[id:number]:{json:any,obj:GameObject}}={};
        protected tranDIC:{[id:number]:{json:any,obj:Transform}}={};
        protected assetDIC:{[id:number]:{json:any,obj:IAsset|null}}={};
    
        protected json:any;
        protected prefabNode:any;
        protected sceneNode:any;
        
        protected resDir:string="";
        protected totalAssetTask:number=0;
    
        protected loadAllAsset()
        {
            for(let key in this.assetDIC)
            {
                let hashId=parseInt(key);
                let url=this.assetDIC[key].json.URL;
                this.assetDIC[key].obj=assetMgr.load(this.resDir+url);
                //--------------bundleinfo
                this.bundleInfo.mapNamed[AssetMgr.getFileName(this.resDir+url)]=this.resDir+url;
            }
        }
        /**
         * 初步解析存进dic
         * @param json 
         */
        protected deserialize(json:any)
        {
            let objs = json.gameobjects;
            let trans = json.transforms;
            let assets = json.web3dassets;
            for (let key in objs) {
                let objjson=objs[key];
                if(objjson.type!="GameObject") continue;
                let gameobj=createInstanceByName(objjson.type);
                let realid=parseInt(key);
                
                this.objDIC[realid]={json:objjson,obj:gameobj};
            }
            for(let key in trans)
            {
                let tranJson=trans[key];
                if(tranJson.type!="Transform") continue;
                let tranobj=createInstanceByName(tranJson.type);
                let realid=parseInt(key);
                
                this.tranDIC[realid]={json:tranJson,obj:tranobj};
            }
            for(let key in assets)
            {
                this.totalAssetTask++;
    
                let assetjson=assets[key];
                let realid=parseInt(key);
                this.assetDIC[realid]={json:assetjson,obj:null};
            }
        }
        /**
         * 反序列化场景树
         */
        protected parseObjTree()
        {
            // for(let key in this.assetDIC)
            // {
            //     this.deserializeObj(this.assetDIC[key].json,this.assetDIC[key].obj);
            // }
            for(let key in this.tranDIC)
            {
                this.deserializeObj(this.tranDIC[key].json,this.tranDIC[key].obj,false);
            }
            for(let key in this.objDIC)
            {
                this.deserializeObj(this.objDIC[key].json,this.objDIC[key].obj,false);
            }
            for(let key in this.tranDIC)
            {
                this.deserializeObj(this.tranDIC[key].json,this.tranDIC[key].obj,true);
            }
            for(let key in this.objDIC)
            {
                this.deserializeObj(this.objDIC[key].json,this.objDIC[key].obj,true);
            }
        }
    
        protected deserializeObj(json:any,obj:any,deltWithIdType:boolean)
        {
            let type=json.type;
            let value=json.value;
    
            // let obj=createInstanceByName(type);
            for(let key in value)
            {
                let jsonValue=value[key];
                if(jsonValue.type==null)
                {
                    obj[key]=jsonValue;
                }else
                {
                    let atttype=jsonValue.type;
                    if(jsonValue.id)
                    {//
                        if(deltWithIdType)
                        {
                            if(atttype=="GameObject")
                            {
                                obj[key]=this.objDIC[jsonValue.id].obj;
                            }else if(atttype=="Transform")
                            {
                                obj[key]=this.tranDIC[jsonValue.id].obj;
                            }else if(BeAssetType(atttype))
                            {
                                obj[key]=this.assetDIC[jsonValue.id].obj;
                            }else
                            {
                                console.error("what type("+atttype+") with id Not Considered!!");
                            }
                        }else
                        {
                            continue;
                        }
                    }else
                    {
                        switch(atttype)
                        {
                            case "Array":
                                for(let i=0;i<jsonValue.value.length;i++)
                                {
                                    let item=jsonValue.value[i];
                                    if(item.id)
                                    {
                                        if(deltWithIdType)
                                        {
                                            if(item.type=="GameObject")
                                            {
                                                obj[key][i]=this.objDIC[item.id].obj;
                                            }else if(item.type=="Transform")
                                            {
                                                if(obj instanceof Transform)
                                                {
                                                    let child=this.tranDIC[item.id].obj;
                                                    obj.addChild(child);
                                                }else
                                                {
                                                    obj[key][i]=this.tranDIC[item.id].obj;
                                                }
                                                //obj[key][i]=this.tranDIC[item.id].obj;
                                            }else if(BeAssetType(item.type))
                                            {
                                                obj[key][i]=this.assetDIC[item.id].obj;
                                            }else
                                            {
                                                console.error("what type("+item.type+") with id Not Considered!!");
                                            }
                                        }else
                                        {
                                            continue;
                                        }
                                    }else
                                    {
                                        if(obj instanceof GameObject&&BeCompoentType(item.type))
                                        {
                                            if(deltWithIdType){
                                                
                                                this.deserializeObj(jsonValue.value[i],(obj as any)[key][i],deltWithIdType);
                                            }else
                                            {
                                                let func=getClassFunctionByName(item.type);
                                                let comp=(obj as GameObject).addComponent(item.type);
                                                this.deserializeObj(jsonValue.value[i],comp,deltWithIdType);
                                            }
                                        }else
                                        {
                                            if(deltWithIdType){
                                                this.deserializeObj(jsonValue.value[i],obj[key][i],deltWithIdType);
                                            }else
                                            {
                                                if(item.type)
                                                {
                                                    let value=createInstanceByName(item.type);
                                                    this.deserializeObj(jsonValue.value[i],value,deltWithIdType);
                                                    obj[key][i]=value;
                                                }else
                                                {
                                                    obj[key][i]=item;
                                                }
                                                
                                            }
                                        }
                                    }
                                }
                                break;
                            case "vec2":
                            case "vec3":
                            case "vec4":
                            case "quat":
                            case "mat4":
                            case "mat3":
                            case "mat2":
                            case "mat2d":
                            case "color":
                            case "rect":
                                if(deltWithIdType) continue;
                                let value=createInstanceByName(atttype);
                                let vstr:string=jsonValue.value;
                                let arr=vstr.split(",");
                                for(let i=0;i<arr.length;i++)
                                {
                                    value[i]=Number(arr[i]);
                                }
                                obj[key]=value;
                                break;
                            // case "Transform":
                            //     obj[key]=this.tranDIC[jsonValue.id];
                            //     break;
                            // case "GameObject":
                            //     obj[key]=this.objDIC[jsonValue.id];
                            //     break;
                            // case "Mesh":
                            // case "Material":
                            // case "Texture2D":
                            //     obj[key]=this.assetDIC[jsonValue.id];
    
                            default:
                                // if(obj[key]==null)
                                // {
                                //     obj[key]=createInstanceByName(atttype);
                                // }
                                if(deltWithIdType){
                                    this.deserializeObj(jsonValue.value,obj[key],deltWithIdType);
                                }else
                                {
                                    let _value=createInstanceByName(atttype);
                                    this.deserializeObj(jsonValue.value,_value,deltWithIdType);
                                    obj[key]=_value;
                                }
                                break;
                        }
                    }
    
                }
            }
        }
        
    }
    
    
}
