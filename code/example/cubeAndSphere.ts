namespace gltf
{
    export class CubesAndSpheres implements IState
    {
        transList:web3d.Transform[]=[];
        init()
        {
            // let cube=web3d.assetMgr.load("resource/prefab/cube/resources/cube.mesh.bin") as web3d.Mesh;
            // let sphere=web3d.assetMgr.load("resource/mesh/sphere.mesh.bin") as web3d.Mesh;
            // let quad=web3d.assetMgr.getDefaultMesh("quad");
            // let quad2=web3d.assetMgr.load("resource/mesh/quad.mesh.bin") as web3d.Mesh;
            let tex1=web3d.assetMgr.load("resource/texture/def1.png") as web3d.Texture;
            let tex2=web3d.assetMgr.load("resource/texture/def2.png") as web3d.Texture;
            let tex3=web3d.assetMgr.load("resource/mat/2.jpg") as web3d.Texture;            
            
            let mat0=web3d.assetMgr.load("resource/mat/diff.mat.json") as web3d.Material;

            let shader=web3d.assetMgr.getShader("def") as web3d.Shader;
            let mat1=new web3d.Material();
            mat1.setShader(shader);
            mat1.setTexture("_MainTex",tex1);
            mat1.setVector4("_MainColor",MathD.vec4.create(0.9,0.5,0.5,1))

            let shader1=web3d.assetMgr.load("resource/shader/diffuse.shader.json") as web3d.Shader;
            let mat2=new web3d.Material();
            mat2.setShader(shader1);
            mat2.setTexture("_MainTex",tex3);
            mat2.setVector4("_MainColor",MathD.vec4.create(0.5,0.5,0.9,1));

            let promiseArr:Promise<web3d.IAsset>[]=[];
            Promise.all([web3d.assetMgr.loadAsync("resource/glTF/Cube/Cube.gltf"),
                        web3d.assetMgr.loadAsync("resource/glTF/Sphere/Sphere.gltf")])
                    .then(([cube,sphere])=>{
                        let cubePrefab=cube as web3d.glTFBundle;
                        let spherePrefab=sphere as web3d.glTFBundle;

                        for(let k=0;k<20;k++)
                        {
                            for(let i=-10;i<=10;i++)
                            {
                                for(let j=-10;j<=10;j++)
                                {
                                    let becube=Math.random()>0.5;
                                    let obj=becube?cubePrefab.Instantiate():spherePrefab.Instantiate();
                                    let render:web3d.MeshRender[]=obj.gameObject.getComponentsInChildren("MeshRender") as web3d.MeshRender[];
                                    render[0].material=Math.random()>0.5?mat1:mat2;;
                                    
                                    web3d.curScene.addChild(obj);
                                    obj.localPosition[0]=i*2;
                                    obj.localPosition[1]=j*2;
                                    obj.localPosition[2]=-k*2;

                                    this.transList.push(obj);
                                }
                            }
                        }

                    });
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