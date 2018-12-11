namespace web3d
{
    export interface IGlTFExtension
    {
        load(extensionNode:any,loader:LoadGlTF):Promise<any>
    }
    
    export class LoadGlTF implements IAssetLoader
    {
        private url:string;
        bundle:glTFBundle;
        private loadinfo:AssetLoadInfo;
        /**
         * 依赖的资源
         */
        dependLoadInfos:AssetLoadInfo[]=[];
        onProgress:(info:{loaded:number,total:number})=>void;
        onFinish: (asset:IAsset,state: AssetLoadInfo) => void
        load(url: string,state:AssetLoadInfo,onFinish: (asset: IAsset, state: AssetLoadInfo) => void, onProgress: (loadInfo: DownloadInfo) => void): IAsset {
            this.url=url;
            let name=AssetMgr.getFileName(url);
            this.bundle=new glTFBundle(name,url);
            this.loadinfo=state;
            this.loadinfo.progress=new DownloadInfo();
    
            this.onProgress=onProgress;
            this.onFinish=onFinish;
            this.loadAsync().then(
                ()=>{
                    this.loadinfo.beSucces=true;
                    if(this.onFinish)
                    {
                        this.onFinish(this.bundle,this.loadinfo);
                    }
                }
            );
            return this.bundle;
        }
    
        //------------------extensions
        static ExtensionDic:{[type:string]:IGlTFExtension}={};
        static regExtension(type:string,extension:IGlTFExtension)
        {
            this.ExtensionDic[type]=extension;
        }
    
        getExtensionData(node:IProperty,extendname:string):Promise<any>
        {
            if(node.extensions==null) return null;
            let extension=LoadGlTF.ExtensionDic[extendname]
            if(extension==null) return null;
            let info=node.extensions[extendname];
            if(info==null) return null;
            return extension.load(info,this);
        }
        //------------------------------------load bundle asset
        private loadAsync():Promise<void>
        {
            if(this.url.endsWith(".gltf"))
            {
                return this.loadglTFJson().then(()=>{
    
                    let promises:Promise<void>[]=[];
                    promises.push(this.relyOnTransTree());
                    promises.push(this.loadMeshNodes());
                    promises.push(this.loadSkinNodes());
    
                    return Promise.all(promises).then(()=>{
                    });
                })
            }else
            {
                return this.loadglTFBin().then((value:{json:any,chunkbin:Uint8Array[]})=>{
                    this.bundle.gltf=value.json;
                    for(let i=0;i<value.chunkbin.length;i++)
                    {
                        this.bundle.bufferNodeCache[i]=value.chunkbin[i].buffer;
                    }

                    let promises:Promise<void>[]=[];
                    promises.push(this.relyOnTransTree());
                    promises.push(this.loadMeshNodes());
                    promises.push(this.loadSkinNodes());
    
                    return Promise.all(promises).then(()=>{
                    });
                })
            }

        }
    
        private loadglTFJson():Promise<JSON>
        {
            if(this.bundle.gltf)
            {
                return Promise.resolve(this.bundle.gltf as any);
            }else
            {
                return new Promise((resolve,reject)=>{
                    loadJson(this.url,(txt,err)=>{
                        if(err)
                        {
                            let errorMsg="ERROR: Load gltf .gltf file Error!\n Info: LOAD URL: "+this.url+"  LOAD MSG:"+err.message;
                            console.error(errorMsg);
                            reject();
                        }else
                        {
                            this.bundle.gltf=txt as any;
                            resolve(txt);
                        }
                    });
                });
            }
        }

        private loadglTFBin():Promise<{json:JSON,chunkbin:Uint8Array[]}>
        {
            return new Promise((resolve,reject)=>{
                loadArrayBuffer(this.url,(bin,err)=>{
                    if(err)
                    {
                        let errorMsg="ERROR: Load gltf .gltf file Error!\n Info: LOAD URL: "+this.url+"  LOAD MSG:"+err.message;
                        console.error(errorMsg);
                        reject();
                    }else
                    {
                        // this.bundle.gltf=bin as any;
                        const Binary = {
                            Magic: 0x46546C67
                        };
                        let breader:binReader=new binReader(bin);
                        let magic=breader.readUint32();
                        if(magic!==Binary.Magic)
                        {
                            throw new Error("Unexpected magic: " + magic);
                        }
                        let version = breader.readUint32();
                        if(version!=2)
                        {
                            throw new Error("Unsupported version:"+version);
                        }
                        let length = breader.readUint32();
                        if (length !== breader.getLength()) {
                            throw new Error("Length in header does not match actual data length: " + length + " != " + breader.getLength());
                        }

                        let ChunkFormat = {
                            JSON: 0x4E4F534A,
                            BIN: 0x004E4942
                        };
                        // JSON chunk
                        let chunkLength = breader.readUint32();
                        let chunkFormat = breader.readUint32();
                        if (chunkFormat !== ChunkFormat.JSON) {
                            throw new Error("First chunk format is not JSON");
                        }
                        let _json=JSON.parse(breader.readUint8ArrToString(chunkLength));
                        let _chunkbin:Uint8Array[]=[];
                        while(breader.canread()>0)
                        {
                            const chunkLength = breader.readUint32();
                            const chunkFormat = breader.readUint32();
                            switch (chunkFormat) {
                                case ChunkFormat.JSON:
                                    throw new Error("Unexpected JSON chunk");
                                case ChunkFormat.BIN:
                                    _chunkbin.push(breader.readUint8Array(chunkLength));
                                    break;
                                default: 
                                    // ignore unrecognized chunkFormat
                                    breader.skipBytes(chunkLength);
                                    break;
                                
                            }
                        }
                        resolve({json:_json,chunkbin:_chunkbin});
                    }
                });
            });
        }

        private relyOnTransTree():Promise<void>
        {
            this.expandNodeData();
            let promises:Promise<void>[]=[];
            promises.push(this.loadAnimations());//animation的path  需要节点的父节点信息。
    
            return Promise.all(promises).then(()=>{
            });
        }
    
        private expandNodeData()
        {
            let gltf=this.bundle.gltf;
            if(gltf.scenes)
            {
                for(let i=0;i<gltf.scenes.length;i++)
                {
                    let scene=gltf.scenes[i];
                    for(let k=0;k<scene.nodes.length;k++)
                    {
                        this.addNodeparent(gltf,scene.nodes[k]);
                    }
                }
            }
        }
        private addNodeparent(gltf:IGLTF,index:number)
        {
            let node=gltf.nodes[index];
            if(node.name==null)
            {
                node.name="node_"+index;
            }
            if(node.children)
            {
                for(let i=0,len=node.children.length;i<len;i++)
                {
                    let childIndex=node.children[i];
                    let child=gltf.nodes[childIndex];
                    child.parent=index;
                    this.addNodeparent(gltf,childIndex);
                }
            }
        }
    
        getNodePath(nodes:INode[],index:number):string[]
        {
            let node=nodes[index];
            let pathArr:string[]=[];
            while(node!=null)
            {
                pathArr.unshift(node.name);
                if(node.parent!=null)
                {
                    node=nodes[node.parent];
                }else
                {
                    node=null;
                }
            }
            return pathArr;
        }
        private loadAnimations():Promise<void>
        {
            let promises:Promise<any>[]=[];
            let gltf=this.bundle.gltf;
            if(gltf.animations!=null)
            {
                if(gltf.animations.length>0)
                {
                    this.bundle.beContainAnimation=true;
                }
                for(let i=0;i<gltf.animations.length;i++)
                {
                    promises.push(ParseAnimationNode.parse(i,this));
                }
            }
            return Promise.all(promises).then(()=>{
            });
        }
    
        private loadMeshNodes():Promise<void>
        {
            let promises:Promise<any>[]=[];
            let gltf=this.bundle.gltf;
            if(gltf.meshes!=null)
            {
                for(let i=0;i<gltf.meshes.length;i++)
                {
                    promises.push(ParseMeshNode.parse(i,this));
                }
            }
            return Promise.all(promises).then(()=>{
            });
        }
    
        private loadSkinNodes()
        {
            let promises:Promise<any>[]=[];
            let gltf=this.bundle.gltf;
            if(gltf.skins!=null)
            {
                for(let i=0;i<gltf.skins.length;i++)
                {
                    promises.push(ParseSkinNode.parse(i,this));
                }
            }
            return Promise.all(promises).then(()=>{
            });
        }
    
        public loadDependAsset(url:string,onFinish:(asset:IAsset,info:AssetLoadInfo)=>void=null,type:string=null):IAsset
        {
            if(type==null)
            {
                let asset=assetMgr.load(url,onFinish,()=>{
                    this.executeOnprogress();
                });
                let loadinfo=assetMgr.getAssetLoadInfo(url);
                this.dependLoadInfos.push(loadinfo);
                return asset;
            }else
            {
                let asset=assetMgr.loadTypedAsset(url,type,onFinish,()=>{
                    this.executeOnprogress();
                });
                let loadinfo=assetMgr.getAssetLoadInfo(url);
                this.dependLoadInfos.push(loadinfo);
                return asset; 
            }

        }
    
        public executeOnprogress()
        {
            let info=this.loadinfo.progress;
            info.loaded=0;
            info.total=0;
            for(let i=0;i<this.dependLoadInfos.length;i++)
            {
                info.loaded+=this.dependLoadInfos[i].progress.loaded;
                info.total+=this.dependLoadInfos[i].progress.total;
            }
            if(this.onProgress)
            {
                this.onProgress(this.loadinfo.progress);
            }
        }
    }
    
    AssetMgr.RegisterAssetLoader(".gltf",()=>new LoadGlTF());
    AssetMgr.RegisterAssetLoader(".glb",()=>new LoadGlTF());

    
}
