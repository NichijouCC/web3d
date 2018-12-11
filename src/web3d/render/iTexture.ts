namespace web3d
{
    export interface ITextrue
    {
        glTexture:WebGLTexture;
        width: number;
        height: number;
    }
    
    export class RenderTexture implements ITextrue {
        width: number;
        height: number;
        glTexture: webGraph.Texture2D;
        fbo:webGraph.FrameBuffer;
        constructor(width: number, height: number)
        {
            this.width=width;
            this.height=height;
            // let texop=textureOption.getDefFboTextureOp(width,height);
            // this.glTexture=new Texture2D(texop);
            let fboOp=webGraph.FboOption.getDefColorDepthComboOP(width,height);
            this.fbo=new webGraph.FrameBuffer(fboOp);
            this.glTexture=this.fbo.colorTextures[0];
        }
    
        // static draw(src:RenderTexture,dst:RenderTexture,mat:Material)
        // {
        //     if(src==null&&dst!=null)
        //     {//draw scene into dst
        //         webgl.viewport(0,0,dst.width,dst.height);
        //         dst.fbo.attach();
        //         renderMgr.renderOnce();
        //     }else if(src!=null&&dst!=null)
        //     {//process src into dst texture
        //         webgl.viewport(0,0,dst.width,dst.height);
        //         dst.fbo.attach();
        //         let mesh=assetMgr.getDefaultMesh("quad");
        //         mat.setTexture("_MainTex",src);
        //         renderMgr.draw(mesh,mat,mesh.submesh[0].size,mesh.submesh[0].start,DrawTypeEnum.BASE);
        //     }else if(src!=null&&dst==null)
        //     {//draw into canvas
        //         webgl.bindFramebuffer(webgl.FRAMEBUFFER,null);
        //         let mesh=assetMgr.getDefaultMesh("quad");
        //         mat.setTexture("_MainTex",src);
        //         renderMgr.draw(mesh,mat,mesh.submesh[0].size,mesh.submesh[0].start,DrawTypeEnum.BASE);
        //     }
        // }
    }
}
