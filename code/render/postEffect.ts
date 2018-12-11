///// <reference path="../lib/gl-matrix.d.ts" />
//import * as glMatrix from 'gl-matrix'

namespace Render{
    declare var dat: any;
    export class postEffect implements IState
    {
        cam:web3d.Camera;
        transList:web3d.Transform[]=[];
        test()
        {
            let tex1=web3d.assetMgr.load("resource/texture/def1.png") as web3d.Texture;
            let tex2=web3d.assetMgr.load("resource/texture/def2.png") as web3d.Texture;         
            
            let mat0=web3d.assetMgr.load("resource/mat/diff.mat.json") as web3d.Material;

            let shader1=web3d.assetMgr.load("resource/shader/diffuse.shader.json") as web3d.Shader;
            let mat2=new web3d.Material();
            mat2.setShader(shader1);
            mat2.setTexture("_MainTex",tex1);
            mat2.setVector4("_MainColor",MathD.vec4.create(1,1,1,1));
            for(let i=-10;i<=10;i++)
            {
                for(let j=-10;j<=10;j++)
                {
                    let obj=new web3d.GameObject();
                    let meshf:web3d.MeshFilter=obj.addComponent<web3d.MeshFilter>("MeshFilter");
                    meshf.mesh=web3d.assetMgr.getDefaultMesh("cube");
                    let render:web3d.MeshRender=obj.addComponent<web3d.MeshRender>("MeshRender");
                    render.material=Math.random()>0.5?mat0:mat2;
                    
                    web3d.curScene.addChild(obj.transform);
                    obj.transform.localPosition[0]=i*2;
                    obj.transform.localPosition[1]=j*2;
                    this.transList.push(obj.transform);
                }
            }
            let camobj=new web3d.GameObject();
            this.trans=camobj.transform;
            let cam=camobj.addComponent("Camera") as web3d.Camera;
            this.cam=cam;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2]=50;
            let eff=new web3d.Blur();


            //----------------------postEffect
            cam.addPostEffect(eff);
            camobj.transform.markDirty();
            
        }

        start() 
        {
            this.test();
            this.uiShow();
        }


        trans:web3d.Transform;
        time:number=0;
        update(delta: number) {
            this.time+=delta;
            for(let i=0;i<this.transList.length;i++)
            {
                let tran=this.transList[i];
                MathD.quat.AxisAngle(MathD.vec3.UP,this.time,tran.localRotation);
                tran.markDirty();
            }

        }


        private effectAtt:{type:string}={type:"高斯模糊"};
        private effectDic:{[type:string]:web3d.IPostEffect}={};
        private uiShow()
        {
            let gui = new dat.GUI();
            let controller=gui.add(this.effectAtt, 'type',['高斯模糊','马赛克']);
            controller.onChange((value)=>{
                switch(value)
                {
                    case "高斯模糊":
                        this.cam.clearPostEffect();
                        if(this.effectDic[value]==null)
                        {
                            this.effectDic[value]=new web3d.Blur();
                        }
                        this.cam.addPostEffect(this.effectDic[value]);
                        break;
                    case "马赛克":
                        this.cam.clearPostEffect();
                        if(this.effectDic[value]==null)
                        {
                            this.effectDic[value]=new web3d.Mosaic();
                        }
                        this.cam.addPostEffect(this.effectDic[value]);
                        break;
                }
            });
        }
    }
}