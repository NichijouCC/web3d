///<reference path="../graph/webGraph.ts" />

namespace web3d
{
    export declare var webgl: WebGLRenderingContext;
    export declare var assetMgr:AssetMgr;
    // export declare let shaderMgr:ShaderMgr;
    export declare var renderContext:RenderContext;
    export declare var renderContext2d:RenderContext2d;
    
    export declare var renderMgr:Rendermgr;
    
    export declare var app:application;
    
    export declare var sceneMgr:SceneMgr;
    
    export class GlobalMgr
    {
    
        constructor(_app:application)
        {
            app=_app;
            //curScene=app.Scene;
            this.initAllSingleton(null);
            
        }
        //-------------全局单例-----------------------
        public initAllSingleton(Onfinish:()=>void)
        {
            webgl=app.webgl;
            webGraph.Graph.init(app.webgl);
    
            // shaderMgr=new ShaderMgr();
            renderContext=new RenderContext();
            renderContext2d=new RenderContext2d();
            renderMgr=new Rendermgr();
            assetMgr=new AssetMgr();
            sceneMgr=new SceneMgr();
            
    
    
            ShaderVariant.registAutoUniform();
            Input.init();
            assetMgr.initDefAsset();
            SkyBox.init();
    
            
            // assetMgr.load("resource/shader/shader.assetbundle.json",(state)=>{
            //     if(Onfinish!=null)
            //     {
            //         if(state.errs)
            //         {
            //             state.deBugError();
            //         }
            //         Onfinish();
            //     }
            // });
        }
    
    }
}
