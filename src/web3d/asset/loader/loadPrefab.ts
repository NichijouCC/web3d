namespace web3d
{
    export class LoadPrefab implements IAssetLoader {
        load(url: string, state:AssetLoadInfo,onFinish: (asset:IAsset,state: AssetLoadInfo) => void,onProgress:(loadInfo:DownloadInfo)=>void=null): IAsset {
            let name=AssetMgr.getFileName(url);
            let prefa:Prefab=new Prefab(name);
            state.progress=loadText(url,(txt,err)=>{
                if(err)
                {
                    let errorMsg="ERROR: Load AB TXT Error!\n Info: LOAD URL: "+url+"  LOAD MSG:"+err.message;
                    state.err=new Error(errorMsg);
                }else
                {
                    let json=JSON.parse(txt as string);
                    let index=url.lastIndexOf("/");
                    let abbundle=new PrefabTreeParse(name,url);
                    abbundle.loadABAsset(prefa,json,url.substring(0,index+1));
                    if(onFinish)  
                    {
                        state.beSucces=true;
                        onFinish(prefa,state);
                    }
                }
            },(info)=>{
                if(onProgress)
                {
                    onProgress(info);
                }
            });
            return prefa;
        }
    }
    
    
    export class PrefabTreeParse extends ABTreeParse {
    
        constructor(name:string,url:string)
        {
            super(name,url);
        }
    
        private parasePrefabData():Transform|null
        {
            if(this.prefabNode==null||this.prefabNode.root==null) return null;
            let rootid=this.prefabNode.root;
            return this.tranDIC[rootid].obj;
        }
        loadABAsset(prefab:Prefab,abjson:any,resDir:string)
        {
            this.resDir=resDir;
            this.json=abjson;
            this.prefabNode=this.json.prefabData;
            this.deserialize(abjson);
            this.loadAllAsset();
            this.parseObjTree();
            prefab.root=this.parasePrefabData();
        }
    }
    const _loadprefab=new LoadPrefab()
    AssetMgr.RegisterAssetLoader(".prefab.json",()=>_loadprefab);
}

