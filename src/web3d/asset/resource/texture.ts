///<reference path="../../../graph/platform/textureOp.ts" />

namespace web3d
{
    @GameAsset 
    export class Texture extends Web3dAsset implements ITextrue
    {
        imageData:Uint8Array|HTMLImageElement|HTMLCanvasElement;
        width: number=0;
        height: number=0;
    
        samplerInfo:webGraph.TextureOption=new webGraph.TextureOption();
        constructor(assetName: string|null = null,url:string|null=null,bedef:boolean=false)
        {
            super(assetName,url,bedef);
            if(!bedef)
            {
                // this.glTexture=assetMgr.getDefaultTexture("grid").glTexture;
            }
            this.type="Texture";
        }
        glTexture: webGraph.Texture2D;
    
        applyToGLTarget()
        {
            // if(this.glTexture)
            // {
            //     this.glTexture.attach();
            //     this.glTexture.bufferData(this.imageData,this.samplerInfo);
            // }else
            // {
            //     this.glTexture=new Texture2D(this.imageData,this.samplerInfo);
            // }
            
            this.glTexture=new webGraph.Texture2D(this.imageData,this.samplerInfo);
        }
    
        dispose()
        {
            if(this.beDefaultAsset) return;
            this.glTexture.dispose();
        }
    
    
    }
}
