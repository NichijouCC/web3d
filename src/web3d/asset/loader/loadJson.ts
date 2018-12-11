namespace web3d
{
    export class LoadJson implements IAssetLoader
    {
        load(url: string,state:AssetLoadInfo, onFinish: (asset:IAsset,state: AssetLoadInfo) => void,onProgress: (info:DownloadInfo) => void=null): IAsset {
            let name=AssetMgr.getFileName(url);
            let text=new JsonAsset(name,url);
    
    
            state.progress=loadJson(url,(json,err)=>{
                if(err)
                {
                    let errorMsg="ERROR:Load json Error!\n  Info: LOAD URL: "+url+"  LOAD MSG:"+err.message;
                    state.err=new Error(errorMsg)
                }else
                {
                    LoadJson.Parse(text,json);
                    state.beSucces=true;
                }
                if(onFinish)
                {
                    onFinish(text,state);
                }
            },(info)=>{
                if(onprogress)
                {
                    onProgress(info);
                }
            });
            
            return text;
        }
        private static Parse(text:JsonAsset,txt:JSON): void
        {
            text.content=txt;
        }
    }
    const _loadjson:LoadJson=new LoadJson();
    
    AssetMgr.RegisterAssetLoader(".json",()=>{return _loadjson});
}
