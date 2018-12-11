///<reference path="../lib/jsloader.d.ts" />
namespace dome {

    export class PBR implements IState {

        start() {
            this.load();
        }
        update(delta: number) {

        }
        load() {
            //-------------loadshader
            let mat=new web3d.Material();
            let shader=web3d.assetMgr.load("resource/shader/pbr_UI.shader.json") as web3d.Shader;
            mat.setShader(shader);
            //let mat = web3d.assetMgr.load("resource/mat/pbr.mat.json") as web3d.Material;
            //let diffmat=web3d.assetMgr.load("resource/mat/diff.mat.json") as web3d.Material;
            //--------------loadImag
            let rolename = "Cerberus_LP";
            let baseTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_A.png") as web3d.Texture;
            let normalTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_N.png") as web3d.Texture;
            //let normalTex=web3d.assetMgr.load("resource/pbr/metal_002_normalnormal.png") as web3d.Texture;
            let metalTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_M.png") as web3d.Texture;
            let roughnessTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_R.png") as web3d.Texture;
            let brdfTex = web3d.assetMgr.load("resource/texture/brdfLUT.imgdes.json") as web3d.Texture;
            let e_cubeDiff: web3d.CubeTexture = new web3d.CubeTexture();
            let e_diffuseArr = [];
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_right_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_left_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_top_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_bottom_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_front_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_back_0.jpg");
            e_cubeDiff.groupCubeTexture(e_diffuseArr);

            let env_speTex = new web3d.CubeTexture();
            for(let i=0;i<10;i++)
            {
                let urlarr=[];
                urlarr.push("resource/texture/papermill/specular/specular_right_"+i+".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_left_"+i+".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_top_"+i+".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_bottom_"+i+".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_front_"+i+".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_back_"+i+".jpg");
                env_speTex.groupMipmapCubeTexture(urlarr,i,9);
            }
            mat.setTexture("u_BaseColorSampler", baseTex);
            mat.setTexture("u_NormalSampler", normalTex);
            mat.setTexture("u_metalSampler", metalTex);
            mat.setTexture("u_roughnessSampler", roughnessTex);
            mat.setTexture("u_brdfLUT", brdfTex);
            mat.setCubeTexture("u_DiffuseEnvSampler", e_cubeDiff);
            mat.setCubeTexture("u_SpecularEnvSampler", env_speTex);
            //--------------loadmesh
           // let cube = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus00_Fixed.mesh.bin") as web3d.Mesh;
            //---------------loadmat
            //cube=web3d.assetMgr.load("resource/mesh/sphere.mesh.bin") as web3d.Mesh;

            // let obj = new web3d.GameObject();
            // MathD.quat.FromEuler(-90, 0, 0, obj.transform.localRotation);
            // obj.transform.localScale = MathD.vec3.create(3, 3, 3);
            // let meshf = obj.addComponent(web3d.MeshFilter) as web3d.MeshFilter;
            // let meshr = obj.addComponent(web3d.MeshRender) as web3d.MeshRender;

            // meshf.mesh = cube;
            // meshr.material = mat;

            let url="resource/glTF/Cerberus_LP/glTF/Cerberus_LP.gltf";
            web3d.assetMgr.load(url,(prefab)=>{
                let pre=prefab as web3d.glTFBundle;
                let gun=pre.Instantiate();
                let renders=gun.gameObject.getComponentsInChildren("MeshRender") as web3d.MeshRender[];
                renders[0].material=mat;
                web3d.curScene.addChild(gun);
            });

            

            let camobj = new web3d.GameObject();
            let cam = camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = -10;
            camobj.transform.markDirty();

            web3d.curScene.enableSkyBox();
            let e_Diff: web3d.CubeTexture = new web3d.CubeTexture();
            let e_DiffArr = [];
            e_DiffArr.push("resource/texture/papermill/environment/environment_right_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_left_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_top_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_bottom_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_front_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_back_0.jpg");
            e_Diff.groupCubeTexture(e_DiffArr);
            web3d.SkyBox.setSkyCubeTexture(e_Diff);
        }
    }
}