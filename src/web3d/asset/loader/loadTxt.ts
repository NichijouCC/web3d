namespace web3d
{
    export class LoadTxt implements IAssetLoader
    {
        load(url: string,state:AssetLoadInfo,onFinish: (asset:IAsset,state: AssetLoadInfo) => void,onProgress: (info:DownloadInfo) => void=null): IAsset {
            let name=AssetMgr.getFileName(url);
            let text=new TextAsset(name,url);
    
            state.progress=loadText(url,(txt,err)=>{
                if(err)
                {
                    let errorMsg="ERROR:Load Txt/json Error!\n  Info: LOAD URL: "+url+"  LOAD MSG:"+err.message;
                    state.err=new Error(errorMsg)
                }else
                {
                    LoadTxt.Parse(text,txt);
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
        private static Parse(text:TextAsset,txt:string): void
        {
            text.content=txt;
        }
    }
    const _loadtxt:LoadTxt=new LoadTxt();
    AssetMgr.RegisterAssetLoader(".vs.glsl",()=>_loadtxt);
    AssetMgr.RegisterAssetLoader(".fs.glsl",()=>_loadtxt);
    AssetMgr.RegisterAssetLoader(".txt",()=>_loadtxt);
}

