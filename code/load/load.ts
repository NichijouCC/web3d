
namespace dome{
    export class loaditem implements IState
    {
        load()
        {
            //-------------loadshader
            let shader=web3d.assetMgr.load("resource/shader/diffuse.shader.json") as web3d.Shader;
            

            //--------------loadImag
            let tex1=web3d.assetMgr.load("resource/texture/2.jpg") as web3d.Texture;

            //--------------loadmesh
            let cube=web3d.assetMgr.load("resource/mesh/quad.mesh.bin") as web3d.Mesh;

            let quad=web3d.assetMgr.getDefaultMesh("quad");
            //---------------loadmat
            let mat=web3d.assetMgr.load("resource/mat/diff.mat.json") as web3d.Material;


            //-------------------------
            let obj=new web3d.GameObject();
            let meshf:web3d.MeshFilter=obj.addComponent<web3d.MeshFilter>("MeshFilter");
            meshf.mesh=quad;
            let render:web3d.MeshRender=obj.addComponent<web3d.MeshRender>("MeshRender");

            let shader1=web3d.assetMgr.load("resource/shader/diffuse.shader.json") as web3d.Shader;
            let mat2=new web3d.Material();
            mat2.setShader(shader1);
            mat2.setTexture("_MainTex",tex1);
            mat2.setVector4("_MainColor",MathD.vec4.create(1,1,1,1));

            render.material=mat2;
            web3d.curScene.addChild(obj.transform);


            //-------------
            let camobj=new web3d.GameObject();
            let cam=camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            camobj.transform.localPosition[2]=-50;
            web3d.curScene.addChild(camobj.transform);
        }


        start() 
        {
            this.load();


        }
        update(delta: number) 
        {


        }

    }
}