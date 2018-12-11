namespace web3d
{
    export class ParseBufferNode
    {
        static parse(index:number,loader:LoadGlTF):Promise<ArrayBuffer>
        {
            let bundle=loader.bundle;
            if(bundle.bufferNodeCache[index])
            {
                return Promise.resolve(bundle.bufferNodeCache[index]);
            }else
            {
                let buffer=bundle.gltf.buffers[index];
    
                return new Promise<ArrayBuffer>((resolve,reject)=>{
                    loader.loadDependAsset(bundle.rootURL+"/"+buffer.uri,(asset,state)=>{
                        if(state.beSucces)
                        {
                            let abuffer=(asset as BinAsset).content;
                            //---------------add to cache
                            bundle.bufferNodeCache[index]=abuffer;
                            resolve(abuffer);
                        }else
                        {
                            console.error("ERROR: Failed to load gltf mesh bin. URL:"+state.url);
                            reject("ERROR: Failed to load gltf mesh bin. URL:"+state.url);
                        }
                    });
                });
            }
        }
    }
}
