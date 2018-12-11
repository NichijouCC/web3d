namespace web3d
{
        //马赛克
        export class Mosaic extends BassPostEffect implements IPostEffect{
            renderTarget:RenderTexture;
            constructor()
            {
                super();
                this.renderTarget=new RenderTexture(GameScreen.Width,GameScreen.Height);
                let shader=assetMgr.load("resource/shader/posteffect/mosaic.shader.json") as Shader;
                this.mat.setShader(shader);
            }

        }
}