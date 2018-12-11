
namespace web3d
{
   /**
     *  parentjson 只有在父json为自定义类型且注册过，才存在
    */
   export class Serlizer
   {
       private static root:Transform; 
       static serializeObj(obj: Object, json: any = null, objJson: any = null): any {
           if (json == null) {
               json = {};
           }
           // if(json.root==null)
           // {
           //     json.root=(obj as Transform).insId.getInsID();
           //     this.root=obj as Transform;
           // }
           if (json.gameobjects == null) {
               json.gameobjects = {};
           }
           if (json.transforms == null) {
               json.transforms = {};
           }
           if (json.web3dassets == null) {
               json.web3dassets = {};
           }
           let objs = json.gameobjects;
           let trans = json.transforms;
           let assets = json.web3dassets;
   
           let oobjson;
   
           if (objJson == null) {
               objJson = {};
           }
   
           if(!haveRegClass(obj)) return;
           // let classname = getRegistedClassName(obj);
           // if (classname == null) return;
           let classname=obj.constructor.name;
           objJson["type"] = classname;
   
           if (obj instanceof GameObject) {
               let gameobj = obj as GameObject;
               let id = gameobj.transform.insId.getInsID();
               objJson["id"] = id;
               if (objs[id] == null) {
                   oobjson = {};
                   oobjson["type"] = classname;
                   oobjson["value"] = {};
                   objs[id] = oobjson;
               } else {
                   return;
               }
           }
           else if (obj instanceof Transform) {
               let transobj = obj as Transform;
               let id = transobj.insId.getInsID();
               objJson["id"] = id;
   
               if (trans[id] == null) {
                   oobjson = {};
                   oobjson["type"] = classname;
                   oobjson["value"] = {};
                   trans[id] = oobjson;
               } else {
                   return;
               }
           }
           else if (obj instanceof Web3dAsset) {
               let assetobj = obj as Web3dAsset;
               let id = assetobj.guid;
               objJson["id"] = id;
               if (assets[id] == null) {
                   oobjson = {};
                   oobjson["type"] = classname;
                   let url=obj["URL"];
                   let index=url.lastIndexOf("resources/");
                   oobjson["URL"]=url.substring(index);
                   // oobjson["URL"]=obj["URL"];
                   
                   //oobjson["type"] = "Web3dAsset";
                   //oobjson["value"] = {};
                   assets[id] = oobjson;
                   return;
               } else {
                   return;
               }
           } else {
               oobjson = objJson;
               oobjson["value"] = {};
           }
   
   
           let atts = getAtts(obj);
           for (let i = 0; i < atts.length; i++) {
               let attname = atts[i];
               if(classname=="Transform"&&attname=="parent") continue;
               // let attClass=atts[i].type;
               let attobj = obj[attname];
               if (attobj != null) {
                   if ((typeof (attobj) == "number") || (typeof (attobj) == "boolean")) {
                       oobjson["value"][attname] = attobj;
                   } else if (attobj["__proto__"].constructor.name == "String") {
                       oobjson["value"][attname] = attobj;
                   }
                   else if (attobj["__proto__"].constructor.name == "Array") {
                       oobjson["value"][attname] = {};
                       oobjson["value"][attname].type = "Array";
                       oobjson["value"][attname].value = [];
                       if(attobj.length==0) continue;                    
                       for (let i = 0; i < attobj.length; i++) {
                           if ((typeof (attobj[i]) == "number") || (typeof (attobj[i]) == "boolean")) {
                               //oobjson["value"][attname] = attobj;
                               oobjson["value"][attname].value.push(attobj[i]);
                           } else if (attobj[i]["__proto__"].constructor.name == "String") {
                               //oobjson["value"][attname] = attobj;
                               oobjson["value"][attname].value.push(attobj[i]);
                           }else
                           {
                               let item = {};
                               oobjson["value"][attname].value.push(item);
                               this.serializeObj(attobj[i], json, item);
                           }
                       }
                   }
                   else {
                       if(!haveRegClass(attobj))
                       {
                           oobjson["value"][attname] = null;
                           continue;
                       }
                       let className =attobj.constructor.name;
                       switch (className) {
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
                               oobjson["value"][attname] = {};
                               oobjson["value"][attname].type = className;
                               oobjson["value"][attname].value = attobj.toString();
                               break;
                           case "Transform":
                               oobjson["value"][attname] = {};
                               oobjson["value"][attname].type = className;
                               let id = attobj.insId.getInsID();
                               oobjson["value"][attname].id = id;
                               if (trans[id] == null) {
                                   this.serializeObj(attobj, json);
                               }
                               break;
                           case "GameObject":
                               oobjson["value"][attname] = {};
                               oobjson["value"][attname].type = className;
                               let idg = attobj.transform.insId.getInsID();
                               oobjson["value"][attname].id = idg;
                               if (objs[idg] == null) {
                                   this.serializeObj(attobj, json);
                               }
                               break;
                           default:
                               if (attobj instanceof Web3dAsset) {
                                   oobjson["value"][attname] = {};
                                   //oobjson["value"][attname].type = "Web3dAsset";
                                   oobjson["value"][attname].type =attobj.constructor.name;
                                   let ida = attobj.guid;
                                   oobjson["value"][attname].id = ida;
                                   if(assets[ida]==null)
                                   {
                                       this.serializeObj(attobj, json);
                                   }
                                   break;
                               } else {
                                   oobjson["value"][attname] = {};
                                   //objJson["value"][attname].type=className;
                                   this.serializeObj(attobj, json, oobjson["value"][attname]);
                                   break;
                               }
                       }
                   }
               }
           }
           return json;
       }
   }
}

