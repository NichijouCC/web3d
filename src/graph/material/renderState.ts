/// <reference path="../common/common.ts" />
namespace webGraph
{
    export enum CullingFaceEnum
    {
        ALL,
        CCW,
        CW,
    }
    
    export enum BlendModeEnum
    {
        Blend,
        Blend_PreMultiply,
        Add,
        Add_PreMultiply,
        custom
    }
    
    export class blendOption
    {
        blendEquation:number;
        Src: number;
        Dest: number;
    
        constructor(src:number=GLConstants.SRC_ALPHA,dest:number=GLConstants.ONE,blendEquation:number=GLConstants.FUNC_ADD)
        {
            this.blendEquation=blendEquation;
            this.Src=src;
            this.Dest=dest;
        }
    }
    
    export class StateOption
    {
        cullingFace:CullingFaceEnum=CullingFaceEnum.ALL;
        Ztest:boolean=true;
        ZtestMethod:number=GLConstants.LEQUAL;
        Zwrite:boolean=true;
        
        enableBlend:boolean=false;
        blend:BlendModeEnum=BlendModeEnum.Add;
    
        blendEquation:number=GLConstants.FUNC_ADD;
        Src: number=GLConstants.SRC_ALPHA;
        Dest: number=GLConstants.ONE;
        
        stencilTest:boolean=false;
        refValue:number=1;
        stencilFuc:number=GLConstants.ALWAYS;
        sZfail:number=GLConstants.KEEP;
        sPass:number=GLConstants.REPLACE;
        sFail:number=GLConstants.KEEP;
        // SrcAlpha: number=GLConstants.SRC_ALPHA;
        // DestALpha: number=GLConstants.ONE;
        
        enablaColormask:boolean=false;
        colorMask:{r:boolean,g:boolean,b:boolean,a:boolean}={r:true,g:true,b:true,a:true};

        /**
         * clear depth after one draw call 
         */
        clearDepth:boolean=false;
        setCullingFace(cullingFace:CullingFaceEnum)
        {
            this.cullingFace=cullingFace;
        }
    
        setZstate(Ztest:boolean=null,Zwrite:boolean=null,ZtestMethod:number=GLConstants.LEQUAL)
        {
            if(Ztest!=null)
            {
                this.Ztest=Ztest;
            }
            if(Zwrite!=null)
            {
                this.Zwrite=Zwrite;
            }
            this.ZtestMethod=ZtestMethod;
        }
    
        setBlend(blend:BlendModeEnum,detailOp:blendOption=null)
        {
            this.enableBlend=true;
            this.blend=blend;
            if(blend==BlendModeEnum.Add)
            {
                //就是def state
                this.Src=GLConstants.SRC_ALPHA;
                this.Dest=GLConstants.ONE;
            }
            else if(blend==BlendModeEnum.Add_PreMultiply)
            {
                this.Src=GLConstants.ONE;
                this.Dest=GLConstants.ONE_MINUS_SRC_ALPHA;
            }
            else if(blend==BlendModeEnum.Blend)
            {
                this.Src=GLConstants.SRC_ALPHA;
                this.Dest=GLConstants.ONE_MINUS_SRC_ALPHA;
            }
            else if(blend==BlendModeEnum.Blend_PreMultiply)
            {
                this.Src=GLConstants.ONE;
                this.Dest=GLConstants.ONE_MINUS_SRC_ALPHA;
            }
            else if(blend==BlendModeEnum.custom&&detailOp!=null)
            {
                this.blendEquation=detailOp.blendEquation;
                this.Src=detailOp.Src;
                this.Dest=detailOp.Dest;
            }
        }

        setStencilFuc(stencil:boolean,refValue:number=1,stencilFuc:number=GLConstants.ALWAYS)
        {
            this.stencilTest=stencil;
            this.refValue=refValue;
            this.stencilFuc=stencilFuc;
        }
        setStencilOP(spass:number,sFail:number=GLConstants.KEEP,sZfail:number=GLConstants.KEEP)
        {
            this.sPass=spass;
            this.sFail=sFail;
            this.sZfail=sZfail;
        }
    
    }  
    
    export enum DrawModeEnum
    {
        VboTri,
        VboLine,
        EboTri,
        EboLine,
    }
}
