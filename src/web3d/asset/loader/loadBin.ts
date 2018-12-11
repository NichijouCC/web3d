namespace web3d
{
    export class LoadBin implements IAssetLoader
    {
        load(url: string,state:AssetLoadInfo, onFinish: (asset:IAsset,state: AssetLoadInfo) => void,onProgress:(loadInfo:DownloadInfo)=>void=null): IAsset {
            let name=AssetMgr.getFileName(url);
            let binas=new BinAsset(name);
    
            state.progress=loadArrayBuffer(url,(bin,err)=>{
                if(err)
                {
                    let errorMsg="ERROR:Load *.bin Error!\n  Info: LOAD URL: "+url+"  LOAD MSG:"+err.message;
                    state.err=new Error(errorMsg);
                }else
                {
                    LoadBin.Parse(binas,bin);
                    state.beSucces=true;
                }
                if(onFinish)
                {
                    onFinish(binas,state);
                }
            },(info)=>{
                if(onprogress)
                {
                    onProgress(info);
                }
            });
            return binas;
        }
        private static Parse(binas:BinAsset,bin:ArrayBuffer): void
        {
            binas.content=bin;
        }
    }
    const _loadbin=new LoadBin();
    AssetMgr.RegisterAssetLoader(".bin",()=>{return _loadbin;});
}
