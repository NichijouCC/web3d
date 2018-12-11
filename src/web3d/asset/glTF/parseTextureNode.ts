namespace web3d
{
    export class ParseTextureNode
    {
        static parse(index:number,loader:LoadGlTF):Promise<Texture|null> 
        {
            let bundle=loader.bundle;
            if(bundle.textrueNodeCache[index])
            {
                return Promise.resolve(bundle.textrueNodeCache[index]);
            }else
            {
                if(bundle.gltf.textures==null) return null;
                let node=bundle.gltf.textures[index];
                if(bundle.gltf.images==null) return null;
                let imageNode=bundle.gltf.images[node.source];
                let asset:Texture;
                if(imageNode.uri!=null)
                {
                    asset=loader.loadDependAsset(bundle.rootURL+"/"+imageNode.uri) as Texture;
                    if(node.sampler!=null)
                    {
                        let samplerinfo=bundle.gltf.samplers[node.sampler];
                        if(samplerinfo.wrapS!=null)
                        {
                            asset.samplerInfo.wrap_s=samplerinfo.wrapS;
                        }
                        if(samplerinfo.wrapT)
                        {
                            asset.samplerInfo.wrap_s=samplerinfo.wrapT;
                        }
                        if(samplerinfo.magFilter)
                        {
                            asset.samplerInfo.max_filter=samplerinfo.magFilter;
                        }
                        if(samplerinfo.minFilter)
                        {
                            asset.samplerInfo.min_filter=samplerinfo.minFilter;
                        }
                    }
                    bundle.textrueNodeCache[index]=asset;

                    return Promise.resolve(asset);
                }else
                {
                    return  ParseBufferViewNode.parse(imageNode.bufferView,loader).then((viewnode)=>{
                       let bob=new Blob([viewnode.view], { type: imageNode.mimeType });
                       web3d.loadImg(bob,()=>{},null);
                    //    let url = URL.createObjectURL(bob);
                    //    asset= loader.loadDependAsset(url,null,".png") as Texture;

                        asset=new Texture();
                        // asset.imageData=viewnode.view as Uint8Array;
                        
                       if(node.sampler!=null)
                       {
                           let samplerinfo=bundle.gltf.samplers[node.sampler];
                           if(samplerinfo.wrapS!=null)
                           {
                               asset.samplerInfo.wrap_s=samplerinfo.wrapS;
                           }
                           if(samplerinfo.wrapT)
                           {
                               asset.samplerInfo.wrap_s=samplerinfo.wrapT;
                           }
                           if(samplerinfo.magFilter)
                           {
                               asset.samplerInfo.max_filter=samplerinfo.magFilter;
                           }
                           if(samplerinfo.minFilter)
                           {
                               asset.samplerInfo.min_filter=samplerinfo.minFilter;
                           }
                       }
                       asset.applyToGLTarget();
                    //    bundle.textrueNodeCache[index]=asset;

                       return asset;
                    });
                }
                // let asset=assetMgr.load(bundle.rootURL+"/"+uri.uri) as Texture;

            }
    
        }
    }
}
