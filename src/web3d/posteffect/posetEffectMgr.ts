namespace web3d
{
    export class PostEffectMgr
    {
        private static baseTex:RenderTexture;
        private static _depthTex:RenderTexture;
        static get depthTex():RenderTexture
        {
            if(this._depthTex==null)
            {
                this._depthTex=new RenderTexture(GameScreen.Width,GameScreen.Height);
                this.renderSceneTobaseTex();
            }
            return this._depthTex;
        }

        private static tempt1:RenderTexture[]=[];
        private static endmat:Material;

        private static lastRenderTex:RenderTexture;
        private static beInit:boolean=false;
        static render(effects:IPostEffect[])
        {
            if(!this.beInit)
            {
                this.beInit=true;
                this.baseTex=new RenderTexture(GameScreen.Width,GameScreen.Height);
                this.tempt1.push(new RenderTexture(GameScreen.Width,GameScreen.Height));
                this.tempt1.push(new RenderTexture(GameScreen.Width,GameScreen.Height));

                let shader=assetMgr.load("resource/shader/posteffect/bassPosteffect.shader.json") as Shader;
                this.endmat=new Material();
                this.endmat.setShader(shader);
            }
            this.renderSceneTobaseTex();
            this.lastRenderTex=this.baseTex;
            for(let i=0,len=effects.length;i<len;i++)
            {
                effects[i].OnBeforeRender(this.lastRenderTex);
                effects[i].OnRender(this.tempt1[i%2]);
                this.lastRenderTex=effects[i].renderTarget;
            }
            this.OnPostEffectEndRender();
        }

        static renderSceneTobaseTex()
        {
            this.baseTex.fbo.attach();
            webgl.clearColor(0.3, 0.3, 0.3, 1);
            webgl.clearDepth(1.0);
            webgl.clear(webgl.COLOR_BUFFER_BIT |webgl.DEPTH_BUFFER_BIT);
            renderContext.curCamera.viewPort(this.baseTex);
            renderMgr.renderOnce();
        }

        static renderSceneToDepthTex()
        {

        }

        static OnPostEffectEndRender()
        {
            webgl.bindFramebuffer(webgl.FRAMEBUFFER,null);
            //webgl.viewport(0,0,app.canvaswidth,app.canvasheight);
            renderContext.curCamera.viewPort();

            webgl.depthMask(true);
            webgl.clearColor(0, 0, 0, 1);
            webgl.clearDepth(1.0);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

            let mesh=assetMgr.getDefaultMesh("quad");
            this.endmat.setTexture("_MainTex",this.lastRenderTex);
            renderMgr.draw(mesh,this.endmat,mesh.submeshs[0],DrawTypeEnum.BASE);
        }
    }
    export interface IPostEffect
    {
        renderTarget:RenderTexture;
        mat:Material;
        OnBeforeRender(srcTex:RenderTexture);
        OnRender(dstTex:RenderTexture);
    }
    export class BassPostEffect implements IPostEffect
    {
        renderTarget:RenderTexture;//postEffect产生的图片.
        mat:Material=new Material();
        OnBeforeRender(srcTex:RenderTexture)
        {
            //其他可以用的 rendertexture
            // PostEffectMgr.baseTex;
            // PostEffectMgr.depthTex;
            this.mat.setTexture("_MainTex",srcTex);
        }

        OnRender(dstTex:RenderTexture)
        {
            if(this.renderTarget==null)
            {
                this.renderTarget=dstTex;
            }

            this.renderTarget.fbo.attach();
            renderContext.curCamera.viewPort(this.renderTarget);
            webgl.depthMask(true);
            webgl.clearColor(1, 1, 1, 1);
            webgl.clearDepth(1.0);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            let mesh=assetMgr.getDefaultMesh("quad");
            renderMgr.draw(mesh,this.mat,mesh.submeshs[0],DrawTypeEnum.BASE);
        }

        // OnEndDraw()
        // {
        //     webgl.viewport(0,0,app.canvaswidth,app.canvasheight);
        //     webgl.depthMask(true);//zwrite 會影響clear depth，這個查了好一陣
        //     webgl.clearColor(0, 0, 0, 0);
        //     webgl.clearDepth(1.0);

        //     webgl.bindFramebuffer(webgl.FRAMEBUFFER,null);
        //     let mesh=assetMgr.getDefaultMesh("quad");
        //     let mat=assetMgr.getDefaultMaterial("def");
        //     mat.setTexture("_MainTex",this.renderTex);
        //     renderMgr.draw(mesh,mat,mesh.submesh[0].size,mesh.submesh[0].start,DrawTypeEnum.BASE);
        // }
    }


}
