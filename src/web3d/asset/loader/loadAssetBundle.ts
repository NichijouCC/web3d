namespace web3d
{
    export class LoadAssetBundle implements IAssetLoader 
    {
    
        load(url: string,state:AssetLoadInfo, onFinish: (asset:IAsset,state: AssetLoadInfo) => void,onProgress:(loadInfo:DownloadInfo)=>void=null): IAsset {
            state.progress=loadText(url,(txt,err)=>{
                if(err)
                {
                    let errorMsg="ERROR: Load AB TXT Error!\n Info: LOAD URL: "+url+"  LOAD MSG:"+err.message;
                    console.error(errorMsg);
                    state.err=new Error(errorMsg);
                }else
                {
                    let json=JSON.parse(txt);
                    let index=url.lastIndexOf("/");
                    //let prefab=Serlizer.deserialize(json);
                }
            },(info)=>{
                if(onprogress)
                {
                    onProgress(info);
                }
            });
            return null;
        }
    }
    const _loadAssetBundle=new LoadAssetBundle();
    AssetMgr.RegisterAssetLoader(".assetbundle.json",()=>_loadAssetBundle);
}
