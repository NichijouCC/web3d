namespace Render
{
    export class GpuInstance implements IState
    {
        transList:web3d.Transform[]=[];
        init()
        {
            let tex1=web3d.assetMgr.load("resource/texture/def1.png") as web3d.Texture;
            let tex2=web3d.assetMgr.load("resource/texture/def2.png") as web3d.Texture;
            // let tex3=web3d.assetMgr.load("resource/mat/2.jpg") as web3d.Texture;
            
            let mat0=web3d.assetMgr.load("resource/mat/diff.mat.json") as web3d.Material;

            let shader=web3d.assetMgr.getShader("def") as web3d.Shader;
            let mat1=new web3d.Material();
            mat1.setShader(shader);
            mat1.setTexture("_MainTex",tex1);
            mat1.setVector4("_MainColor",MathD.vec4.create(0.9,0.5,0.5,1));

            let shader1=web3d.assetMgr.load("resource/shader/diffuse.shader.json") as web3d.Shader;
            let mat2=new web3d.Material();
            mat2.setShader(shader1);
            mat2.setTexture("_MainTex",tex1);
            mat2.setVector4("_MainColor",MathD.vec4.create(0.9,0.5,0.5,1));
            mat2.ToggleInstance();

            let mat3=new web3d.Material();
            mat3.setShader(shader1);
            mat3.setTexture("_MainTex",tex1);
            mat3.setVector4("_MainColor",MathD.vec4.create(0.5,0.5,0.9,1));
            mat3.ToggleInstance();

            for(let k=0;k<20;k++)
            {
                for(let i=-10;i<=10;i++)  
                {
                    for(let j=-10;j<=10;j++)
                    {
                        // let becube=Math.random()>0.5;
                        // let obj=becube?cubePrefab.Instantiate():spherePrefab.Instantiate();
                        let obj=new web3d.GameObject();
                        let meshf=obj.addComponent<web3d.MeshFilter>("MeshFilter");
                        let meshr=obj.addComponent<web3d.MeshRender>("MeshRender");

                        meshf.mesh=web3d.assetMgr.getDefaultMesh("cube");
                        meshr.material=Math.random()>0.5?mat2:mat3;
                        // let render:web3d.MeshRender[]=obj.gameObject.getComponentsInChildren(web3d.MeshRender) as web3d.MeshRender[];
                        // render[0].material=mat2;;
                        
                        web3d.curScene.addChild(obj.transform);
                        obj.transform.localPosition[0]=i*2;
                        obj.transform.localPosition[1]=j*2;
                        obj.transform.localPosition[2]=k*2;

                        let scale=MathD.random(0.3,1.3);
                        obj.transform.localScale=MathD.vec3.create(scale,scale,scale);

                        this.transList.push(obj.transform);
                    }
                }
            }

            let camobj=new web3d.GameObject();
            camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2]=50;
            camobj.transform.markDirty();

            this.camTrans=camobj.transform;
        }

        start() 
        {
            this.init();
        }


        camTrans:web3d.Transform;
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

    }
    
}