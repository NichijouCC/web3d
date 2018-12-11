namespace web3d
{

    /**
     * 正则表达式的工具类，提供一些引擎用到的正则表达式
     */
    export class RegexpUtil
    {
        //shader properties
        public static textureRegexp = /([_0-9a-zA-Z]+)[ ]*\([ ]*'(.+)'[ ]*,[ ]*([0-9a-zA-Z]+)[ ]*\)[ ]*=[ ]*'(.+)'[ ]*\{[ ]*([a-zA-Z]*)[ ]*([a-zA-Z]*)[ ]*\}/;
        public static vector4regexp = /([_0-9a-zA-Z]+)[ ]*\([ ]*'(.+)'[ ]*,[ ]*([0-9a-zA-Z]+)[ ]*\)[ ]*=[ ]*\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)/;
        public static vector3regexp = /([_0-9a-zA-Z]+)[ ]*\([ ]*'(.+)'[ ]*,[ ]*([0-9a-zA-Z]+)[ ]*\)[ ]*=[ ]*\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)/;
        public static vector2regexp = /([_0-9a-zA-Z]+)[ ]*\([ ]*'(.+)'[ ]*,[ ]*([0-9a-zA-Z]+)[ ]*\)[ ]*=[ ]*\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)/;
        
        
        public static floatRegexp = /([_0-9a-zA-Z]+)[ ]*\([ ]*'(.+)'[ ]*,[ ]*([0-9a-zA-Z]+)[ ]*\)[ ]*=[ ]*([0-9.-]+)/;
        public static rangeRegexp = /([_0-9a-zA-Z]+)[ ]*\([ ]*'(.+)'[ ]*,[ ]*([0-9a-zA-Z]+)[ ]*\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)[ ]*\)[ ]*=[ ]*([0-9.-]+)/;

        //material
        public static vector4Regexp = /\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)/;
        public static vector3Regexp=/\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)/;
        public static vector2Regexp=/\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)/;
        //特效解析，[1,2],2,1
        public static vector3FloatOrRangeRegexp = /([0-9.-]+|\[[0-9.-]+,[0-9.-]+\]),([0-9.-]+|\[[0-9.-]+,[0-9.-]+\]),([0-9.-]+|\[[0-9.-]+,[0-9.-]+\])/;

    }

    export class LoadMaterial implements IAssetLoader
    {
        load(url: string, state:AssetLoadInfo,onFinish: (asset:IAsset,state: AssetLoadInfo) => void,onProgress:(loadInfo:DownloadInfo)=>void=null): IAsset {
            let name=AssetMgr.getFileName(url);
            let mat:Material=new Material(name);
            state.progress=loadText(url,(txt,err)=>{
                if(err)
                {
                    let errorMsg="ERROR: Load MAterial Error!\n Info: LOAD URL: "+url+"  LOAD MSG:"+err.message;
                    state.err=new Error(errorMsg);
                }else
                {
                    let matDirPath=url.replace(name,"");
                    let json=JSON.parse(txt as string);
                    LoadMaterial.loadDependAssets(json,matDirPath);
                    LoadMaterial.ParseMatUniform(mat,json,matDirPath);
                    LoadMaterial.Parse(mat,json,(err)=>{
                        if(err)
                        {
                            state.err=err;
                        }else
                        {
                            state.beSucces=true;
                        }
                        if(onFinish)
                        {
                            onFinish(mat,state);
                        }
                    });
                }
            },(info)=>{
                if(onprogress)
                {
                    onProgress(info);
                }
            });
            return mat;
        }
        private static ParseMatUniform(mat:Material,json:any,matDirPath:string)
        {
            let mapUniform = json["mapUniform"];
            for (let i in mapUniform)
            {
                let jsonChild = mapUniform[i];
                let _uniformType = jsonChild["type"];
                switch (_uniformType)
                {
                    case "Float":
                        let _valuef: string = jsonChild["value"];
                        mat.setFloat(i, parseFloat(_valuef));
                        break;
                    case "Vector4":
                        let tempValue = jsonChild["value"];
                        let _values = tempValue.match(RegexpUtil.vector4Regexp);
                        if (_values != null)
                        {
                            let _float4: MathD.vec4 = MathD.vec4.create(parseFloat(_values[1]), parseFloat(_values[2]), parseFloat(_values[3]), parseFloat(_values[4]));
                            mat.setVector4(i, _float4);
                        }else
                        {
                            let errorMsg="ERROR: Material parse json Error! \n Json的mapuniform中的vector4的值与type不相符：" + _values;
                            console.error(errorMsg);
                        }
                        break;
                    case "Vector3":
                        let v3Value = jsonChild["value"];
                        let _v3values = v3Value.match(RegexpUtil.vector3Regexp);
                        if (_v3values != null)
                        {
                            let _float3: MathD.vec3 = MathD.vec3.create(parseFloat(_v3values[1]), parseFloat(_v3values[2]), parseFloat(_v3values[3]));
                            mat.setVector3(i, _float3);
                        }else
                        {
                            let errorMsg="ERROR: Material parse json Error! \n Json的mapuniform中的vector3的值与type不相符：" + _v3values;
                            console.error(errorMsg);
                        }
                        break;
                    case "Texture"://23
                        let _value: string = jsonChild["value"];
                        let _texture: Texture = assetMgr.load(matDirPath+_value) as Texture;
                        mat.setTexture(i, _texture);
                        break;
                    default:
                        let errorMsg="ERROR: Material parse json Error! \n"+"Type：" + jsonChild["type"] + " not handle yet！！";
                        console.error(errorMsg);
                }
            }
        }
        private static Parse(mat:Material,json:any,onFinish:(err:Error|null)=>void)
        {
            let shaderName = json["shader"];
            // if(mat.name=="set_Town_01.mat.json")
            // {
            //     console.log("..");
            // }
            assetMgr.load("resource/shader/"+shaderName,(asset,state)=>{
                if(state.beSucces)
                {
                    let shader=assetMgr.getShader(shaderName);
                    mat.setShader(shader);
                    if(onFinish)
                    {
                        onFinish(null);
                    }
                }else
                {
                    let errorMsg="ERROR: failed to Parase Mat.info: shader("+shaderName+") is null!";
                    console.error(errorMsg);
                    if(onFinish)
                    {
                        onFinish(new Error(errorMsg));
                    }
                }
            })
        };
        private static loadDependAssets(json:any,matPath:string)
        {
            let depends:string[]=json.dependencies;
            for(let key in depends)
            {
                let url=depends[key];
                assetMgr.load(matPath+url);
            }
        }
    }
    const _loadMat=new LoadMaterial();
    AssetMgr.RegisterAssetLoader(".mat.json",()=>{ return _loadMat;});
}
