///// <reference path="../lib/gl-matrix.d.ts" />
//import * as glMatrix from 'gl-matrix'

namespace dome{
    export class loadSeriesCube implements IState
    {

        transList:web3d.Transform[]=[];

        loadmesh()
        {

        }
        test()
        {
            // let cube=web3d.assetMgr.load("resource/prefab/cube/resources/cube.mesh.bin") as web3d.Mesh;
            // let sphere=web3d.assetMgr.load("resource/mesh/sphere.mesh.bin") as web3d.Mesh;
            // let quad=web3d.assetMgr.getDefaultMesh("quad");
            // let quad2=web3d.assetMgr.load("resource/mesh/quad.mesh.bin") as web3d.Mesh;
            let tex1=web3d.assetMgr.load("resource/texture/def1.jpg") as web3d.Texture;
            let tex2=web3d.assetMgr.load("resource/texture/def2.png") as web3d.Texture;
            let tex3=web3d.assetMgr.load("resource/mat/2.imgdes.json") as web3d.Texture;            
            
            let mat0=web3d.assetMgr.load("resource/mat/diff.mat.json") as web3d.Material;
            //let mat0=web3d.assetMgr.load("resource/prefab/Cube1/resources/NewMaterial.mat.json") as web3d.Material;
            //let mat=web3d.assetMgr.getDefaultMaterial("def");

            let shader=web3d.assetMgr.getShader("def") as web3d.Shader;
            let mat1=new web3d.Material();
            mat1.setShader(shader);
            mat1.setTexture("_MainTex",tex1);
            mat1.setVector4("_MainColor",MathD.vec4.create(1,1,1,1))

            //let shader1=web3d.assetMgr.load("resource/shader/diffuse.shader.json") as web3d.Shader;
            // let mat2=new web3d.Material();
            // mat2.setShader(shader1);
            // mat2.setTexture("_MainTex",tex3);
            // mat2.setVector4("_MainColor",MathD.vec4.create(1,1,1,1));
            for(let k=0;k<10;k++)
            {
                for(let i=-10;i<=10;i++)
                {
                    for(let j=-10;j<=10;j++)
                    {
                        let obj=new web3d.GameObject();
                        let meshf:web3d.MeshFilter=obj.addComponent<web3d.MeshFilter>("MeshFilter");
                        let becube=Math.random()>0.5;
                        //meshf.mesh=becube?cube:quad2;
                        meshf.mesh=web3d.assetMgr.getDefaultMesh("cube");
                        let render:web3d.MeshRender=obj.addComponent<web3d.MeshRender>("MeshRender");
                        //render.material=Math.random()>0.5?mat1:mat2;
                        render.material=mat1;
                        
                        web3d.curScene.addChild(obj.transform);
                        obj.transform.localPosition[0]=i*2;
                        obj.transform.localPosition[1]=j*2;
                        obj.transform.localPosition[2]=-k*2;
                        this.transList.push(obj.transform);
                    }
                }
            }


            let camobj=new web3d.GameObject();
            
            let cam=camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2]=50;
            // let eff=new web3d.Blur();
            // cam.addPostEffect(eff);
            
            // tran2.localTranslate.y=10;
            // tran2.lookatPoint(new mathD.Vector3());
            camobj.transform.markDirty();

            //let ss=glMatrix.mat4.create();

            this.trans=camobj.transform;
        }

        start() 
        {
            this.test();
        }


        trans:web3d.Transform;
        time:number=0;
        update(delta: number) {
            this.time+=delta;
            // for(let i=0;i<this.transList.length;i++)
            // {
            //     let tran=this.transList[i];
            //     MathD.quat.AxisAngle(MathD.vec3.UP,this.time,tran.localRotation);
            //     tran.markDirty();
            // }

        }

    }
}