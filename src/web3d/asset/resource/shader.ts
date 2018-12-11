namespace web3d
{
   /**
     * shader bound 
     */
    export class Shader extends Web3dAsset
    {
        constructor(name: string|null = null,url:string|null=null,bedef:boolean=false)
        {
            super(name,url,bedef);
            if(!bedef)
            {
                // let defShader=assetMgr.getShader("def");
                // this.passes=defShader.passes;
                // this.mapUniformDef=defShader.mapUniformDef;
                // this.layer=defShader.layer;
            }
            this.type="Shader";
        }
        dispose()
        {
            return;
        }
        passes: { [id: number]:ShaderPass}={};
        mapUniformDef:{[key: string]:{type:webGraph.UniformTypeEnum,value:any}}={};
        layer: RenderLayerEnum=RenderLayerEnum.Geometry;
        getPass(drawtype:number)
        {
            return this.passes[drawtype];
        }
        //queue: number = 0;
    }
}

