namespace webGraph
{
    export enum ClearType
    {
        COLOR=GLConstants.COLOR_BUFFER_BIT,
        DEPTH=GLConstants.DEPTH_BUFFER_BIT,
        ColorAndDepth=GLConstants.COLOR_BUFFER_BIT|GLConstants.DEPTH_BUFFER_BIT
    }
    
    export class RenderStateMgr
    {

        static currentOP:StateOption;

        private showface:CullingFaceEnum=null;
    
        private Zwrite:boolean=null;
        private Ztest:boolean=null;
        private ztestFunc:number=null;
    
        private stencilTest:boolean=null;
    
        private enableBlend:boolean=null;
        private blendEquation:number=null;
        private src:number=null;
        private dest:number=null;
    
        private enableColorMask:boolean=false;
    
        applyRenderState(state:StateOption)
        {
            RenderStateMgr.currentOP=state;
            let PassOption=state;

            if(PassOption.enablaColormask!=this.enableColorMask)
            {
                this.enableColorMask=PassOption.enablaColormask;
                if(PassOption.enablaColormask)
                {
                    rendingWebgl.colorMask(PassOption.colorMask.r,PassOption.colorMask.g,PassOption.colorMask.b,PassOption.colorMask.a);
                }else
                {
                    rendingWebgl.colorMask(true,true,true,true);
                }
            }else
            {
                if(PassOption.enablaColormask)
                {
                    rendingWebgl.colorMask(PassOption.colorMask.r,PassOption.colorMask.g,PassOption.colorMask.b,PassOption.colorMask.a);
                }
            }
            //-----------------culling face---------------------------------
            if(PassOption.cullingFace!=this.showface)
            {
                if(PassOption.cullingFace==CullingFaceEnum.ALL)
                {
                    rendingWebgl.disable(GLConstants.CULL_FACE);
                }else
                {
                    rendingWebgl.enable(GLConstants.CULL_FACE);
                    if(PassOption.cullingFace==CullingFaceEnum.CCW)
                    {
                        rendingWebgl.frontFace(rendingWebgl.CCW);
                    }else
                    {
                        rendingWebgl.frontFace(rendingWebgl.CW);
                    }
                    rendingWebgl.cullFace(rendingWebgl.BACK);
                }
                this.showface=PassOption.cullingFace;
            }
            //------------------stencilTest
            if(PassOption.stencilTest!=this.stencilTest)
            {
                this.stencilTest=PassOption.stencilTest;
                if(PassOption.stencilTest)
                {
                    rendingWebgl.enable(rendingWebgl.STENCIL_TEST);
                    rendingWebgl.stencilFunc(PassOption.stencilFuc,PassOption.refValue,0xFF);
                    rendingWebgl.stencilOp(PassOption.sFail,PassOption.sZfail,PassOption.sPass);
                }else
                {
                    rendingWebgl.disable(rendingWebgl.STENCIL_TEST);
                }
            }else
            {
                if(PassOption.stencilTest)
                {
                    rendingWebgl.enable(rendingWebgl.STENCIL_TEST);
                    rendingWebgl.stencilFunc(PassOption.stencilFuc,PassOption.refValue,0xFF);
                    rendingWebgl.stencilOp(PassOption.sFail,PassOption.sZfail,PassOption.sPass);
                }
            }

            //------------------zwrite------------------------------------
            if(PassOption.Zwrite!=this.Zwrite)
            {
                if(PassOption.Zwrite)
                {
                    rendingWebgl.depthMask(true);
                }else
                {
                    rendingWebgl.depthMask(false);
                }
                this.Zwrite=PassOption.Zwrite;
            }
            //--------------------ztest-------------------------------
            if(PassOption.Ztest!=this.Ztest)
            {
                if(PassOption.Ztest)
                {
                    rendingWebgl.enable(GLConstants.DEPTH_TEST);
                    if(PassOption.ZtestMethod!=this.ztestFunc)
                    {
                        rendingWebgl.depthFunc(PassOption.ZtestMethod);
                        this.ztestFunc=PassOption.ZtestMethod;
                    }
                }else
                {
                    rendingWebgl.disable(GLConstants.DEPTH_TEST);
                }
                this.Ztest=PassOption.Ztest;
            }else
            {
                if(this.Ztest)
                {
                    if(this.ztestFunc!=PassOption.ZtestMethod)
                    {
                        rendingWebgl.depthFunc(PassOption.ZtestMethod);
                        this.ztestFunc=PassOption.ZtestMethod;
                    }
                }
            }
            //-----------------------blend---------------------------------------
            if(PassOption.enableBlend!=this.enableBlend)
            {
                if(PassOption.enableBlend)
                {
                    rendingWebgl.enable(GLConstants.BLEND);
                    if(PassOption.blendEquation!=this.blendEquation)
                    {
                        rendingWebgl.blendEquation(PassOption.blendEquation);
                        this.blendEquation=PassOption.blendEquation;
                    }
                    if(PassOption.Src!=this.src||PassOption.Dest!=this.dest)
                    {
                        rendingWebgl.blendFunc(PassOption.Src,PassOption.Dest);
                        this.src=PassOption.Src;
                        this.dest=PassOption.Dest;
                    }
                }
                else
                {
                    rendingWebgl.disable(GLConstants.BLEND);
                }
                this.enableBlend=PassOption.enableBlend;
            }else
            {
                if(this.enableBlend)
                {
                    if(PassOption.blendEquation!=this.blendEquation)
                    {
                        rendingWebgl.blendEquation(PassOption.blendEquation);
                        this.blendEquation=PassOption.blendEquation;
                    }
                    if(PassOption.Src!=this.src||PassOption.Dest!=this.dest)
                    {
                        rendingWebgl.blendFunc(PassOption.Src,PassOption.Dest);
                        this.src=PassOption.Src;
                        this.dest=PassOption.Dest;
                    }
                }
            }

        }
    }
}
