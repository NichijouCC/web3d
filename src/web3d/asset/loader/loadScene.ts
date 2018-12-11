namespace web3d
{
    export class LoadScene implements IAssetLoader 
    {
        load(url: string,state:AssetLoadInfo, onFinish: (asset:IAsset,state: AssetLoadInfo) => void,onProgress:(loadInfo:DownloadInfo)=>void=null): IAsset {
            let name=AssetMgr.getFileName(url);
            let sceneinfo:SceneInfo=new SceneInfo(name);
            
            state.progress=loadText(url,(txt,err)=>{
                if(err)
                {
                    let errorMsg="ERROR: Load AB TXT Error!\n Info: LOAD URL: "+url+"  LOAD MSG:"+err.message;
                    state.err=new Error(errorMsg);
                }else
                {
                    let json=JSON.parse(txt as string);
                    let index=url.lastIndexOf("/");
                    let abbundle=new SceneTreeParse(name,url);
                    abbundle.loadABAsset(sceneinfo,json,url.substring(0,index+1),()=>{
                        if(onFinish)  
                        {
                            state.beSucces=true;
                            onFinish(sceneinfo,state);
                        }
                    });
                }
            },(info)=>{
                if(onprogress)
                {
                    onProgress(info);
                }
            });
    
            return sceneinfo;
        }
    }
    export class SceneTreeParse extends ABTreeParse {
    
        private ParaseSceneData(sceneinfo:SceneInfo)
        {
            if(this.sceneNode==null||this.sceneNode.root==null) return;
            let rootid=this.sceneNode.root;
            sceneinfo.root=this.tranDIC[rootid].obj;
            if(this.sceneNode.lightMap)
            {
                sceneinfo.useLightmap=true;
                let texid=this.sceneNode.lightMap.id;
                let tex=this.assetDIC[texid].obj as Texture;
                sceneinfo.lightMap.push(tex);
            }
            if(this.sceneNode.fog)
            {
                sceneinfo.useFog=true;
                let info=new FogInfo();
                this.deserializeObj(sceneinfo.fog,info,false);
            }
        }
        loadABAsset(sceneinfo:SceneInfo,abjson:any,resDir:string,onFinish: () => void)
        {
            this.resDir=resDir;
            this.json=abjson;
            this.sceneNode=this.json.sceneData;
            this.deserialize(abjson);
            this.loadAllAsset();
            this.parseObjTree();
            this.ParaseSceneData(sceneinfo);
            if(onFinish)
            {
                onFinish();
            }
        }
    }
    const _loadscene=new LoadScene();
    AssetMgr.RegisterAssetLoader(".scene.json",()=>{return _loadscene;});
}
