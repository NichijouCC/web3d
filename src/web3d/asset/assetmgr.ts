namespace web3d
{
    export enum LoadEnum {
        Success="Success",
        Failed="Failed",
        Loading="Loading",
        None="None"
    }
    export class AssetLoadInfo {
        url: string;
        beSucces: boolean = false;
        private _err:Error;
        set err(err:Error)
        {
            this._err=err;
            console.error(err);
        };
        get err()
        {
            return this._err;
        }
        //value: IAsset | null = null;
    
        constructor(url: string) {
            this.url = url;
        }
    
        progress:DownloadInfo;
    }
    export class DefaultAssetMgr
    {
        //#region -------------------default resource
        initDefAsset() {
            DefTexture.initDefaultTexture();
            DefMesh.initDefaultMesh();
            DefShader.initDefaultShader();
            DefMatrial.initDefaultMat();
        }
        //资源获取方式三，静态资源

        mapDefaultMesh: { [id: string]: Mesh } = {};
        getDefaultMesh(name: string): Mesh {
            return this.mapDefaultMesh[name];
        }
        mapDefaultTexture: { [id: string]: Texture } = {};
        getDefaultTexture(name: string): Texture {
            return this.mapDefaultTexture[name];
        }
        mapDefaultCubeTexture: { [id: string]: CubeTexture } = {};
        getDefaultCubeTexture(name: string): CubeTexture {
            return this.mapDefaultCubeTexture[name];
        }
        mapDefaultMat: { [id: string]: Material } = {};
        getDefaultMaterial(name: string) {
            return this.mapDefaultMat[name];
        }
    }
    
    //<<<<<<<--------new出来的自己管理,如果进行管控,assetmgr必然持有该资源的引用。当用该资源的对象被释放,该对象对该资源的引用也就没了,但是assetmgr持有它的引用，资源也就是没被释放;
    //释放对象的时候我们又不能对资源进行释放，不然其他对象使用该资源就会报错，对于new出的资源,没被使用就会被系统自动释放或者自己释放-------------------->>>>>>>>>
    //<<<<<<<-----------资源的name不作为asset的标识.不然造成一大堆麻烦。如果允许重名资源在assetmgr获取资源的需要通过bundlename /assetname才能正确获取资源,bundlename于asset来说不一定有;
    //new asset的时候还要检查重名资源,允许还是不允许都是麻烦—--->>>>>>>>>>>>>>>>>>>>>>>
    //<<<<<<<---------------资源本身的描述json，不会被作为资源被assetmgr管理起来-->>>
    
    /**
     * 资源都继承web3dAsset 实现IAsset接口,有唯一ID
     * 
     * assetmgr仅仅管理load进来的资源
     * load过的资源再次load不会造成重复加载
     * 所有的资源都是从资源管理器load（url）出来，其他接口全部封闭
     * 资源的来源有三种：new、load、内置资源
     * bundle包不会shared asset,bundle不会相互依赖。即如果多个bundle引用同一个asset,每个包都包含一份该资源.
     * 
     * 
     * 资源释放：
     * gameobject（new或instance的）通过dispose 销毁自己的内存，不销毁引用的asset
     * asset 可以通过dispose 销毁自己的内存。包释放(prefab/scene/gltfbundle)也属于asset的释放,包会释放自己依赖的asset。
     * 
     */

    export class AssetMgr extends DefaultAssetMgr {
    
        shaderMgr:webGraph.ShaderMgr;
        constructor()
        {
            super();
            this.shaderMgr=new webGraph.ShaderMgr();
        }

        static RegisterAssetLoader(extral:string,factory:()=>IAssetLoader)
        {
            // this.ExtendNameDic[extral] = type;
            this.RESLoadDic[extral] = factory;
        }
        //private static ExtendNameDic: { [name: string]: AssetExtralEnum } = {};
        private static RESLoadDic: { [ExtralName: string]: ()=>IAssetLoader } = {};
    
        //-------------------资源加载拓展
        static RegisterAssetExtensionLoader(extral:string,factory:()=>IAssetLoader)
        {
            this.RESExtensionLoadDic[extral] = factory;
        }
        private static RESExtensionLoadDic: { [ExtralName: string]: ()=>IAssetLoader } = {};


        mapShader: { [id: string]: Shader } = {};
        getShader(name: string): Shader {
            return this.mapShader[name];
        }
        //#endregion
        /**
         * 调用load方法就会塞到这里面来
         */
        private loadMap: { [url: string]: { asset: IAsset | null, loadinfo: AssetLoadInfo|null } } = {};
        /**
         * load同一个资源监听回调
         */
        private loadingUrl: { [url: string]: Array<(asset:IAsset|null,loadInfo?: AssetLoadInfo) => void>} = {};//
    
        /**
         * 存放bundle包中所有资源asset
         */
        loadMapBundle: { [bundleName: string]: BundleInfo } = {};
    
        getAssetLoadInfo(url: string):AssetLoadInfo|null
        {
            if(this.loadMap[url])
            {
                return this.loadMap[url].loadinfo;
            }else
            {
                return null
            }
        }
    
        /**
         * 加载资源
         * @param url 地址
         * @param onFinish  load回调]
         */
        load(url: string, onFinish: ((asset:IAsset|null,loadInfo?: AssetLoadInfo) => void) | null = null,onProgress:(progress:DownloadInfo)=>void=null): IAsset | null {
            if (this.loadMap[url]) {
                if(onFinish)
                {
                    switch (this.loadMap[url].asset.loadState) {
                        case LoadEnum.Success:
                        case LoadEnum.Failed:
                            onFinish(this.loadMap[url].asset,this.loadMap[url].loadinfo);
                            break;
                        case LoadEnum.Loading:
                            if (this.loadingUrl[url] == null) {
                                this.loadingUrl[url] = [];
                            }
                            this.loadingUrl[url].push(onFinish);
                            break;
                        default:
                        case LoadEnum.None:
                            console.error("load error 为啥出现这种情况！");
                            break;
                    }
                }
                return this.loadMap[url].asset;
    
            } else {
                let extralType = AssetMgr.getAssetExtralName(url);
                let _state = new AssetLoadInfo(url);
                if (AssetMgr.RESLoadDic[extralType] == null) {
                    let errorMsg = "ERROR: load Asset error. INfo: not have Load Func to handle (" + AssetMgr.getAssetExtralName(url) + ") type File.  load URL:" + url;
                    _state.err=new Error(errorMsg);
                    console.error(errorMsg);
                    this.loadMap[url] = { asset: null, loadinfo: _state };
                    if (onFinish) {
                        onFinish(null,_state);
                    }
                    return null;
                } else {
                    let factory: IAssetLoader = AssetMgr.RESLoadDic[extralType]();
                    let asset = factory.load(url,_state,(asset,state) => {
                        // this.loadMap[url].loadinfo = state;
                        //-------------------------------存进资源存储map
                        if (state.beSucces) {
                            asset.loadState=LoadEnum.Success;
    
                            if(asset.onLoadEnd)
                            {
                                asset.onLoadEnd();
                            }
                            if (factory instanceof LoadShader) {
                                let name = AssetMgr.getFileName(url);
                                this.mapShader[name] = asset as Shader;
                            }
                        } else {
                            asset.loadState=LoadEnum.Failed;
                        }
                        //---------------------loading set null
                        let arr = this.loadingUrl[url];
                        this.loadingUrl[url] = null;
                        delete this.loadingUrl[url];//set loadingUrl null
                        //---------------------回调事件
                        if (onFinish) {
                            onFinish(asset,state);
                        }
                        //------------------监听此资源loadfinish的事件
                        if (arr) {
                            arr.forEach((func) => {
                                func(asset,state);
                            });
                        }
                    },(state)=>{
                        if(onProgress)
                        {
                            onProgress(state);
                        }
                    });
                    asset.loadState=LoadEnum.Loading;
                    // asset.URL = url;
                    //------------------loadmapnamed
                    //this.saveAssetInfo(url, bundleName);
                    this.loadMap[url] = { asset: asset, loadinfo: _state };
                    
                    return asset;
                }
            }
        }
    
        loadAsync(url: string):Promise<IAsset>
        {
            return new Promise((resolve,reject)=>{
                this.load(url,(asset,loadInfo)=>{
                    if(loadInfo.beSucces)
                    {
                        resolve(asset);
                    }else
                    {
                        reject(new Error("Load Failed."));
                    }
                })
            });
        }

        loadTypedAsset(url: string,type:string,onFinish: ((asset:IAsset|null,loadInfo?: AssetLoadInfo) => void) | null = null,onProgress:(progress:DownloadInfo)=>void=null)
        {
            if (this.loadMap[url]) {
                if(onFinish)
                {
                    switch (this.loadMap[url].asset.loadState) {
                        case LoadEnum.Success:
                        case LoadEnum.Failed:
                            onFinish(this.loadMap[url].asset,this.loadMap[url].loadinfo);
                            break;
                        case LoadEnum.Loading:
                            if (this.loadingUrl[url] == null) {
                                this.loadingUrl[url] = [];
                            }
                            this.loadingUrl[url].push(onFinish);
                            break;
                        default:
                        case LoadEnum.None:
                            console.error("load error 为啥出现这种情况！");
                            break;
                    }
                }
                return this.loadMap[url].asset;
    
            } else {
                let extralType = type;
                let _state = new AssetLoadInfo(url);
                if (AssetMgr.RESLoadDic[extralType] == null) {
                    let errorMsg = "ERROR: load Asset error. INfo: not have Load Func to handle (" + AssetMgr.getAssetExtralName(url) + ") type File.  load URL:" + url;
                    _state.err=new Error(errorMsg);
                    console.error(errorMsg);
                    this.loadMap[url] = { asset: null, loadinfo: _state };
                    if (onFinish) {
                        onFinish(null,_state);
                    }
                    return null;
                } else {
                    let factory: IAssetLoader = AssetMgr.RESLoadDic[extralType]();
                    let asset = factory.load(url,_state,(asset,state) => {
                        // this.loadMap[url].loadinfo = state;
                        //-------------------------------存进资源存储map
                        if (state.beSucces) {
                            asset.loadState=LoadEnum.Success;
    
                            if(asset.onLoadEnd)
                            {
                                asset.onLoadEnd();
                            }
                            if (factory instanceof LoadShader) {
                                let name = AssetMgr.getFileName(url);
                                this.mapShader[name] = asset as Shader;
                            }
                        } else {
                            asset.loadState=LoadEnum.Failed;
                        }
                        //---------------------loading set null
                        let arr = this.loadingUrl[url];
                        this.loadingUrl[url] = null;
                        delete this.loadingUrl[url];//set loadingUrl null
                        //---------------------回调事件
                        if (onFinish) {
                            onFinish(asset,state);
                        }
                        //------------------监听此资源loadfinish的事件
                        if (arr) {
                            arr.forEach((func) => {
                                func(asset,state);
                            });
                        }
                    },(state)=>{
                        if(onProgress)
                        {
                            onProgress(state);
                        }
                    });
                    asset.loadState=LoadEnum.Loading;
                    // asset.URL = url;
                    //------------------loadmapnamed
                    //this.saveAssetInfo(url, bundleName);
                    this.loadMap[url] = { asset: asset, loadinfo: _state };
                    
                    return asset;
                }
            }
        }


        // /**
        //  * 
        //  * @param asset 
        //  */
        // disposeAssetBundle(bundleName: string) {
        //     let bundleinfo = this.loadMapBundle[bundleName];
        //     for (let key in bundleinfo.mapNamed) {
        //         let url = bundleinfo.mapNamed[key];
        //         if(this.loadMap[url].asset)
        //         {
        //             (this.loadMap[url].asset as IAsset).dispose();
        //         }
        //         delete this.loadMap[url];
        //     }
        //     delete this.loadMapBundle[bundleName];
        // }
    
        //#endregion
    
        //通过url获取资源的名称
        static getFileName(url: string): string {
            let filei = url.lastIndexOf("/");
            let file = url.substr(filei + 1);
            return file;
        }
        static getFileNameWithoutExtralName(url: string): string {
            let filei = url.lastIndexOf("/");
            let file = url.substr(filei + 1);
    
            let index = file.indexOf(".", 0);
            let name = file.substr(0, index);
            return name;
        }
        // static getAssetExtralType(url: string): AssetExtralEnum {
        //     let index = url.lastIndexOf("/");
        //     let filename = url.substr(index + 1);
        //     index = filename.indexOf(".", 0);
        //     let extname = filename.substr(index);
        //     let type = this.ExtendNameDic[extname];
        //     if (type == null) {
        //         console.warn("Load Asset Failed.type:(" + type + ") not have loader yet");
        //     }
        //     return type;
        // }
        static getAssetExtralName(url: string): string {
            let index = url.lastIndexOf("/");
            let filename = url.substr(index + 1);
            index = filename.indexOf(".", 0);
            let extname = filename.substr(index);
            return extname;
        }
    }
}
