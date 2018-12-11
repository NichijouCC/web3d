/// <reference path="posetEffectMgr.ts" />
namespace web3d
{
        //高斯模糊
        export class Blur extends BassPostEffect implements IPostEffect{
            renderTarget:RenderTexture;
            constructor()
            {
                super();
                this.renderTarget=new RenderTexture(GameScreen.Width,GameScreen.Height);
                let shader=assetMgr.load("resource/shader/posteffect/blur.shader.json") as Shader;
                this.mat.setShader(shader);
            }
    
            
        }
}