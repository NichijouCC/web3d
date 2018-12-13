namespace web3d
{
    interface IShader
    {
        layer:string;
        queue?:number;
        properties?:string[];
        passes:IPasses;
    }
    interface IPasses
    {
        base?:IpassData[];
        fog?:IpassData[];
        skin?:IpassData[];
        skin_fog?:IpassData[];
        lightmap?:IpassData[];
        lightmap_fog?:IpassData[];
        instance?:IpassData[];
    }
    interface IpassData
    {
        showface?:string;
        vs:string;
        fs:string;
    }
    //instance-fog-lightmap-SKIN
    export enum DrawTypeEnum
    {
        BASE=0,
        SKIN=1,
        LIGHTMAP=2,
        FOG=4,
        INSTANCe=8,

        NOFOG=3,
        NOLIGHTMAP=5,
    }
    export class LoadShader implements IAssetLoader
    {
        private static drawtypeDic:{[type:string]:number}={};
        constructor()
        {
            LoadShader.drawtypeDic["base"]=DrawTypeEnum.BASE;
            LoadShader.drawtypeDic["fog"]=DrawTypeEnum.FOG;
            LoadShader.drawtypeDic["skin"]=DrawTypeEnum.SKIN;
            LoadShader.drawtypeDic["skin_fog"]=DrawTypeEnum.SKIN|DrawTypeEnum.FOG;
            LoadShader.drawtypeDic["lightmap"]=DrawTypeEnum.LIGHTMAP;
            LoadShader.drawtypeDic["lightmap_fog"]=DrawTypeEnum.LIGHTMAP|DrawTypeEnum.FOG;
            LoadShader.drawtypeDic["instance"]=DrawTypeEnum.INSTANCe;
        }
        load(url:string,state:AssetLoadInfo,onFinish:(asset:IAsset,loadinfo: AssetLoadInfo)=>void,onProgress: (downLoadinfo:DownloadInfo) => void=null):IAsset
        {
            let name=AssetMgr.getFileName(url);
            let shader:Shader=new Shader(name,url);
            state.progress=loadText(url,(txt,err)=>{
                if(err)
                {
                    let errorMsg="ERROR: Load shader Error!\n Info: LOAD URL: "+url+"  LOAD MSG:"+err.message;
                    state.err=new Error(errorMsg);
                }else
                {
                    let index=url.lastIndexOf("/")
                    let shaderurl=url.substring(0,index+1);
                    LoadShader.parse(shader,txt as string,shaderurl,(err)=>{
                        if(err)
                        {
                            state.err=err;
                        }else
                        {
                            state.beSucces=true;
                        }
                        if(onFinish)
                        {
                            onFinish(shader,state);
                        } 
                    });
                };
            },(info)=>{
                if(onprogress)
                {
                    onProgress(info);
                }
            });
    
            return shader;
        }
    
        private static parse(shader:Shader,txt:string,shaderUrl:string,onFinish:(err:Error|null)=>void)
        {
            let shaderpass:{ [id: number]:ShaderPass}={};
            let mapUniformDef:{ [key: string]: {type:webGraph.UniformTypeEnum,value:any}}={};
            let shaderlayer:RenderLayerEnum=RenderLayerEnum.Geometry;
    
            let json=JSON.parse(txt);
            if (json.layer)
            {
                let layer = json.layer;
                if (layer == "transparent")
                    shaderlayer = RenderLayerEnum.Transparent;
                else if (layer == "overlay")
                    shaderlayer = RenderLayerEnum.Overlay;
                else if(layer=="Background")
                    shaderlayer=RenderLayerEnum.Background;
                else{
                    shaderlayer = RenderLayerEnum.Geometry;
                } 
            }
            let errr=LoadShader.parseProperties(shader, json.properties,mapUniformDef);
            if(errr!=null&&onFinish!=null) 
            {
                onFinish(errr);
                return;
            }
            let passes = json.passes;
            let taskArr:Promise<any>[]=[];
            for (let key in passes)
            {
                let task=new Promise((resolve,reject)=>{
                    let pass=passes[key];
                    LoadShader.ParseShaderPass(shader,shaderpass,pass,key,shaderUrl,(err,type)=>{
                        if(err)
                        {
                            reject();
                        }else
                        {
                            resolve();
                        }
                    });
                });
                taskArr.push(task);
            }
            Promise.all(taskArr).then(()=>{
                shader.mapUniformDef=mapUniformDef;
                shader.layer=shaderlayer;
                shader.passes=shaderpass;
                if(onFinish)
                {
                    onFinish(null);                    
                }
            },()=>{
                if(onFinish)
                {
                    onFinish(new Error("load failed"));
                }
            });
        }
    
        private static parseProperties(shader:Shader, properties: any,mapUniformDef:{ [key: string]: {type:webGraph.UniformTypeEnum,value:any}}):Error|null
        {
            // mapUniformDef = {};
            for (let index in properties)
            {
                let property = properties[index] as string;
    
                //检测字符串格式有无错误
                let words = property.match(RegexpUtil.floatRegexp);
                if (words == null)
                    words = property.match(RegexpUtil.rangeRegexp);
                if (words == null)
                    words = property.match(RegexpUtil.vector4regexp);
                if (words == null)
                    words = property.match(RegexpUtil.vector3regexp);
                if (words == null)
                    words = property.match(RegexpUtil.vector2regexp);
                if (words == null)
                    words = property.match(RegexpUtil.textureRegexp);
                if (words == null)
                {
                    let errorMsg="ERROR:  parse shader("+shader.name+" )Property json Error! \n"+ " Info:" + property+"check match failed.";
                    console.error(errorMsg);
                    return new Error(errorMsg);
                }
    
                if (words != null && words.length >= 4)
                {
                    let key = words[1];
                    let showName = words[2];
                    let type = words[3].toLowerCase();
    
                    switch (type)
                    {
                        case "float":
                            mapUniformDef[key]={type:webGraph.UniformTypeEnum.FLOAT,value:parseFloat(words[4])};
                            break;
                        case "range":
                            //this.mapUniformDef[key] = { type: type, min: parseFloat(words[4]), max: parseFloat(words[5]), value: parseFloat(words[6]) };
                            mapUniformDef[key] = {type:webGraph.UniformTypeEnum.FLOAT,value:parseFloat(words[6])};
                            break;
                        case "vector2":
                            let vector2 =MathD.vec2.create(parseFloat(words[4]), parseFloat(words[5]));
                            mapUniformDef[key] = {type:webGraph.UniformTypeEnum.FLOAT_VEC2,value:vector2};
                            break;
                        case "vector3":
                            let vector3 = MathD.vec3.create(parseFloat(words[4]), parseFloat(words[5]), parseFloat(words[6]));
                            mapUniformDef[key] = {type:webGraph.UniformTypeEnum.FLOAT_VEC3,value:vector3};
                            break;
                        case "vector4":
                        case "color":
                            let _vector =MathD.vec4.create(parseFloat(words[4]), parseFloat(words[5]), parseFloat(words[6]), parseFloat(words[7]));
                            mapUniformDef[key] = {type:webGraph.UniformTypeEnum.FLOAT_VEC4,value:_vector};
                            break;
                        case "texture":
                            mapUniformDef[key] = {type:webGraph.UniformTypeEnum.TEXTURE,value:assetMgr.getDefaultTexture(words[4])};
                            break;
                        case "cubetexture":
                            mapUniformDef[key] = {type:webGraph.UniformTypeEnum.TEXTURE,value:assetMgr.getDefaultCubeTexture(words[4])};
                            break;
                        default:
                            let errorMsg="ERROR: parse shader("+shader.name+" )Property json Error! \n"+ "Info: unknown type : " + type;
                            console.error(errorMsg);
                            return new Error(errorMsg);
                    }
                }
            }
            return null;
        }
    
        private static ParseShaderPass(shader:Shader,shaderpass:{ [id: number]:ShaderPass},json:any,type:string,shaderFolderUrl:string,OnFinish:(err:Error[]|null,type:string)=>void)
        {
            let pass=new ShaderPass();
            shaderpass[this.drawtypeDic[type]]=pass;
            pass.drawtype=this.drawtypeDic[type];
            let taskCount=json.length;
            let errs:Error[]=[];
    
            let taskArr:Promise<void>[]=[];
            for(let i=0;i<json.length;i++)
            {
                let passJson=json[i];
                let vsurl=shaderFolderUrl+passJson.vs+".vs.glsl";
                let fsurl=shaderFolderUrl+passJson.fs+".fs.glsl";
    
                let vstask=new Promise((resolve,reject)=>{
                    assetMgr.load(vsurl,(asset,state)=>{
                        if(state.beSucces)
                        {
                            resolve();
                        }else
                        {
                            reject();
                        }
                    });
                });
                let fstask=new Promise((resolve,reject)=>{
                    assetMgr.load(fsurl,(asset,state)=>{
                        if(state.beSucces)
                        {
                            resolve();
                        }else
                        {
                            reject();
                        }
                    });
                });
    
                let protask=Promise.all([vstask,fstask]).then(()=>{
                    let vsStr=assetMgr.load(vsurl) as TextAsset;
                    let fsStr=assetMgr.load(fsurl) as TextAsset;
                    let program=this.compileShaderPass(passJson,shader.name,type,vsStr.content as string,fsStr.content as string);
                    if(program==null)
                    {
                        let errorMsg="Error: compile shader("+shader.name+"/"+type+"/"+i+") failed.";
                        // console.error(errorMsg);
                        errs.push(new Error(errorMsg));
                    }else
                    {
                        pass.program[i]=program;
                    }
                });
                taskArr.push(protask);
            }
            Promise.all(taskArr).then(()=>{
                OnFinish(null,type);
            });
        }
        private static compileShaderPass(json:any,shaderName:string,type:string,vsStr:string,fsStr:string):webGraph.ShaderProgram|null
        {
            let drawtype:number=this.drawtypeDic[type];
            if(type=="base")
            {
                
            }else if(type=="fog")
            {
                vsStr="#define FOG \n"+vsStr;
                fsStr="#define FOG \n"+fsStr;
            }else if(type=="skin")
            {
                vsStr="#define SKIN \n"+vsStr;
                fsStr="#define SKIN \n"+fsStr;   
            }else if(type=="skin_fog")
            {
                vsStr="#define SKIN \n"+"#define FOG \n"+vsStr;
                fsStr="#define SKIN \n"+"#define FOG \n"+fsStr;  
            }else if(type=="lightmap")
            {
                vsStr="#define LIGHTMAP \n"+vsStr;
                fsStr="#define LIGHTMAP \n"+fsStr;     
            }else if(type=="lightmap_fog")
            {
                vsStr="#define LIGHTMAP \n"+"#define FOG \n"+vsStr;
                fsStr="#define LIGHTMAP \n"+"#define FOG \n"+fsStr;    
            }else if(type=="instance")
            {
                vsStr="#define INSTANCE \n"+vsStr;
                fsStr="#define INSTANCE \n"+fsStr;    
            }
            let vsname=shaderName+"_"+type;
            let fsname=shaderName+"_"+type;
            let vsshader=assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS,vsname,vsStr);
            let fsshader=assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.FS,fsname,fsStr);
            let program=assetMgr.shaderMgr.CreatProgram(vsname,fsname,type);
            program.state=this.parseShaderState(json,shaderName,type);
            return program;
        }
        private static parseShaderState(json:any,shaderName:string,passType:string,index:number=0):webGraph.StateOption
        {
            let passOp=new webGraph.StateOption();
            if(json.showface!=null)
            {
                if(json.showface=="ccw")
                {
                    passOp.cullingFace=webGraph.CullingFaceEnum.CCW;
                }else if(json.showface=="cw")
                {
                    passOp.cullingFace=webGraph.CullingFaceEnum.CW;
                }else if(json.showface=="all")
                {
                    passOp.cullingFace=webGraph.CullingFaceEnum.ALL;
                }
            }
            if(json.blendmode)
            {
                passOp.enableBlend=true;
                let blendmode:string=json.blendmode;
                if(blendmode=="custom")
                {
                    passOp.blend=webGraph.BlendModeEnum.custom;
                    let src=this.getblendfunc(json.source,shaderName,passType,index);
                    let dst=this.getblendfunc(json.destination,shaderName,passType,index);
                    if(src!=null&&dst!=null)
                    {
                        let detailop=new webGraph.blendOption(src,dst)
                        passOp.setBlend(webGraph.BlendModeEnum.custom,detailop);
                    }
    
                }else
                {
                    if(blendmode=="add")
                    {
                        passOp.setBlend(webGraph.BlendModeEnum.Add);
                    }else if(blendmode=="addpre")
                    {
                        passOp.setBlend(webGraph.BlendModeEnum.Add_PreMultiply);
                    }else if(blendmode="blend")
                    {
                        passOp.setBlend(webGraph.BlendModeEnum.Blend);
                    }else if(blendmode="blendpre")
                    {
                        passOp.setBlend(webGraph.BlendModeEnum.Blend_PreMultiply);
                    }
                }
            }
            else
            {
                 passOp.enableBlend=false;
            }
            if(json.ztest!=null)
            {
                passOp.Ztest=json.ztest;
                if(json.ztestmethod!=null)
                {
                    switch(json.ztestmethod)
                    {
                        case "greater":
                            passOp.ZtestMethod =webGraph.GLConstants.GREATER;
                            break;
                        case "gequal":
                            passOp.ZtestMethod =webGraph.GLConstants.GEQUAL;
                            break;
                        case "less":
                            passOp.ZtestMethod =webGraph.GLConstants.LESS;
                            break;
                        case "equal":
                           passOp.ZtestMethod =webGraph.GLConstants.EQUAL;
                            break;
                        case "notequal":
                           passOp.ZtestMethod =webGraph.GLConstants.NOTEQUAL;
                            break;
                        case "always":
                            passOp.ZtestMethod =webGraph.GLConstants.ALWAYS;
                            break;
                        case "never":
                            passOp.ZtestMethod =webGraph.GLConstants.NEVER;
                            break;
                        case "lequal":
                        default:
                            passOp.ZtestMethod =webGraph.GLConstants.LEQUAL;
                            break;
                    }
                }
            }
            if(json.zwrite!=null)
            {
                passOp.Zwrite=json.zwrite;
            }

            if(json.stencil!=null)
            {
                passOp.stencilTest=true;
                let node=json.stencil;
                if(node.ref)
                {
                    passOp.refValue=node.ref;
                }
                if(node.comp)
                {
                    passOp.stencilFuc=this.getStencilFuc(node.comp);
                }
                if(node.fail)
                {
                    passOp.sFail=this.getStencilOP(node.fail);
                }
                if(node.pass)
                {
                    passOp.sPass=this.getStencilOP(node.pass);
                }
                if(node.zfail)
                {
                    passOp.sZfail=this.getStencilOP(node.zfail);
                }
            }
            if(json.colormask!=null)
            {
                passOp.enablaColormask=true;
                let maskstr:string=json.colormask;
                if(maskstr.includes("r"))
                {
                    passOp.colorMask.r=false;
                }
                if(maskstr.includes("g"))
                {
                    passOp.colorMask.g=false;
                }
                if(maskstr.includes("b"))
                {
                    passOp.colorMask.b=false;
                }
                if(maskstr.includes("a"))
                {
                    passOp.colorMask.a=false;
                }
            }
            if(json.cleardepth!=null)
            {
                passOp.clearDepth=json.cleardepth;
            }
            return passOp;
        }
        
        private static getStencilFuc(type:string):number
        {
            switch(type.toUpperCase())
            {
                case "NEVER":
                    return webGraph.GLConstants.NEVER;
                case "LESS":
                    return webGraph.GLConstants.LESS;
                case "EQUAL":
                    return webGraph.GLConstants.EQUAL;
                case "LEQUAL":
                    return webGraph.GLConstants.LEQUAL;
                case "GREATER":
                    return webGraph.GLConstants.GREATER;
                case "NOTEQUAL":
                    return webGraph.GLConstants.NOTEQUAL;
                case "GEQUAL":
                    return webGraph.GLConstants.GEQUAL;
                case "ALWAYS":
                    return webGraph.GLConstants.ALWAYS;
                default:
                    console.error("stencilfunc setting  Not right. info:"+type);
                    return webGraph.GLConstants.NEVER;
            }
        }

        private static getStencilOP(type:string):number
        {
            switch(type.toUpperCase())
            {
                case "KEEP":
                    return webGraph.GLConstants.KEEP;
                case "REPLACE":
                    return webGraph.GLConstants.REPLACE;
                case "ZERO":
                    return webGraph.GLConstants.ZERO;
                case "INCR":
                    return webGraph.GLConstants.INCR;
                case "INCR_WRAP":
                    return webGraph.GLConstants.INCR_WRAP;
                case "DECR":
                    return webGraph.GLConstants.DECR;
                case "DECR_WRAP":
                    return webGraph.GLConstants.DECR_WRAP;
                case "INVERT":
                    return webGraph.GLConstants.INVERT;
                default:
                    console.error("stencilop setting Not right. info:"+type);
                    return webGraph.GLConstants.KEEP;

            }
        }


        private static getblendfunc(func:string,shaderName:string,passType:string,index:number=0):number|null
        {
            if(func=="one")
            {
                return webGraph.GLConstants.ONE;
            }else if(func=="srcalpha"){
                return webGraph.GLConstants.SRC_ALPHA;
            }else if(func=="srccolor")
            {
                return webGraph.GLConstants.SRC_COLOR;
            }else if(func=="dstcolor"){
                return webGraph.GLConstants.DST_COLOR;
            }else if(func=="dstalpha"){
                return webGraph.GLConstants.DST_ALPHA;
            }
            else{
                console.error("ERROR: parse shader("+shaderName+"/"+passType+"/"+index+") blend func defined error.\n"+" Info: func name:"+func);
                return null;
            } 
        }
    
    }
    
    const _loadShader=new LoadShader();
    AssetMgr.RegisterAssetLoader(".shader.json",()=>{return _loadShader;});
}
