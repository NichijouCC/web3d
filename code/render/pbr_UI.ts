///<reference path="../../lib/jsloader.d.ts" />
namespace dome {

    export class pbrAtt
    {
        modelName="sphere";

        BaseColor=[255,255,255];
        metalFactor=1;
        roughnessFactor=1;

        LightColor=[255,255,255];
        LightRotY=0;
        LightRotZ=0;

        Env_diffuseIntensity:number=1;
        Env_SpeculerIntensity:number=1;
        IBL_Intensity:number=1;

        Base_Texture="none";
        BRDF_Texture="none";
        IBL_Texture="none";
    }
    declare var dat: any;
    export class PBR_UI implements IState {

        pbratt:pbrAtt;
        pbrShader:web3d.Shader;
        pbrMat:any;
        start() {
            this.pbratt=new pbrAtt();
            this.load();
            this.showobjType=this.pbratt.modelName;
            this.loadSphere();
        }
        private resetmat(mat:web3d.Material,metalScale:number=1,roughnessScale:number=1)
        {
            mat.setVector4("u_BaseColorFactor",MathD.vec4.create(this.pbratt.BaseColor[0]/255,this.pbratt.BaseColor[1]/255,this.pbratt.BaseColor[2]/255,1.0));
            mat.setFloat("u_metalFactor",this.pbratt.metalFactor*metalScale);
            mat.setFloat("u_roughnessFactor",this.pbratt.roughnessFactor*roughnessScale);
            switch(this.pbratt.Base_Texture)
            {
                case "Main":
                    mat.setVector4("u_ScaleBaseTex",MathD.vec4.create(1.0,0,0,0));
                    break;
                case "Metal":
                    mat.setVector4("u_ScaleBaseTex",MathD.vec4.create(0,1.0,0,0));
                    break;
                case "Roughness":
                    mat.setVector4("u_ScaleBaseTex",MathD.vec4.create(0,0,1.0,0));
                    break;
                case "none":
                default:
                    mat.setVector4("u_ScaleBaseTex",MathD.vec4.create(0,0,0,0));
                    break;
            }
            switch(this.pbratt.BRDF_Texture)
            {
                case "F":
                    mat.setVector4("u_Scalebrdf",MathD.vec4.create(1.0,0,0,0));
                    break;
                case "G":
                    mat.setVector4("u_Scalebrdf",MathD.vec4.create(0,1.0,0,0));
                    break;
                case "D":
                    mat.setVector4("u_Scalebrdf",MathD.vec4.create(0,0,1.0,0));
                    break;
                case "F*G*D/(4.0*NdotL*NdotV)":
                    mat.setVector4("u_Scalebrdf",MathD.vec4.create(0,0,0,1.0));
                    break;
                case "none":
                default:
                    mat.setVector4("u_Scalebrdf",MathD.vec4.create(0,0,0,0));
                    break;
            }
            switch(this.pbratt.IBL_Texture)
            {
                case "preDiffuse":
                    mat.setVector4("u_ScaleIBL",MathD.vec4.create(1.0,0,0,0));
                    break;
                case "preSpeculer":
                    mat.setVector4("u_ScaleIBL",MathD.vec4.create(0,1.0,0,0));
                    break;
                case "Env_diffuse":
                    mat.setVector4("u_ScaleIBL",MathD.vec4.create(0,0,1.0,0));
                    break;
                case "Env_speculer":
                    mat.setVector4("u_ScaleIBL",MathD.vec4.create(0,0,0,1.0));
                    break;
                case "none":
                default:
                    mat.setVector4("u_ScaleIBL",MathD.vec4.create(0,0,0,0));
                    break;
            }
        }
        update(delta: number) {
            if(this.pbrMat)
            {
                if(this.pbrMat instanceof Array&&this.pbrMat.length>1)
                {
                    for(let i=0;i<7;i++)
                    {
                        for(let k=0;k<7;k++)
                        {
                            let mat=this.pbrMat[i*7+k];
                            this.resetmat(mat,i/6.0,k/6.0);
                        }
                    }
                }else if(this.pbrMat instanceof web3d.Material)
                {
                    this.resetmat(this.pbrMat);
                }
            }
            if(this.pbratt.modelName!=this.showobjType)
            {
                switch(this.pbratt.modelName)
                {
                    case "gun":
                        this.loadGun();
                        break;
                    case "sphere":
                        this.loadSphere();
                        break;
                }
                this.showobjType=this.pbratt.modelName;
            }
        }
        
        private uiShow()
        {
            let gui = new dat.GUI();
            gui.add(this.pbratt, 'modelName',['sphere','gun']);

            let baseData=gui.addFolder('baseData');
            baseData.addColor(this.pbratt, 'BaseColor');
            baseData.add(this.pbratt, 'metalFactor', 0,1);
            baseData.add(this.pbratt, 'roughnessFactor', 0, 1);

            let light = gui.addFolder('Light');
            light.addColor(this.pbratt, 'LightColor');
            light.add(this.pbratt, 'LightRotY', 0, 360);
            light.add(this.pbratt, 'LightRotZ', 0, 360);

            let IBL = gui.addFolder('IBL');
            IBL.add(this.pbratt, 'Env_diffuseIntensity', 0, 5);
            IBL.add(this.pbratt, 'Env_diffuseIntensity', 0, 5);
            IBL.add(this.pbratt, 'IBL_Intensity', 0, 5);
            
            gui.add(this.pbratt, 'Base_Texture',["none",'Main', 'Metal', 'Roughness']);
            gui.add(this.pbratt, 'BRDF_Texture',["none",'F', 'G', 'D','F*G*D/(4.0*NdotL*NdotV)']);
            gui.add(this.pbratt, 'IBL_Texture',["none",'preDiffuse', 'preSpeculer','Env_diffuse','Env_speculer']);
        }
        private showobjType:string="sphere";
        private showObj:web3d.GameObject;
        private gunobj:web3d.GameObject;
        private gunmat:web3d.Material;
        loadGun()
        {
            if(this.showObj)
            {
                this.showObj.beVisible=false;
            }
            if(this.gunobj!=null)
            {
                this.gunobj.beVisible=true;
                this.showObj=this.gunobj;
                this.pbrMat=this.gunmat;
                return;
            }
            let mat = new web3d.Material();
            this.gunmat=mat;
            mat.setShader(this.pbrShader);
            this.pbrMat=mat;
            //--------------loadImag
            let rolename = "Cerberus_LP";
            let baseTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_A.png") as web3d.Texture;
            let normalTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_N.png") as web3d.Texture;
            let metalTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_M.png") as web3d.Texture;
            let roughnessTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_R.png") as web3d.Texture;
            let AOTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_AO.png") as web3d.Texture;
            
            mat.setTexture("u_BaseColorSampler", baseTex);
            mat.setTexture("u_NormalSampler", normalTex);
            mat.setTexture("u_metalSampler", metalTex);
            mat.setTexture("u_roughnessSampler", roughnessTex);
            mat.setTexture("u_OcclusionSampler", AOTex);
            mat.setTexture("u_brdfLUT", this.brdfTex);
            mat.setCubeTexture("u_DiffuseEnvSampler", this.env_diffTex);
            mat.setCubeTexture("u_SpecularEnvSampler", this.env_speTex);

            web3d.assetMgr.load("resource/glTF/Cerberus_LP/glTF/Cerberus_LP.gltf",(prefab)=>{
                let pre=prefab as web3d.glTFBundle;
                let gun=pre.Instantiate();
                let renders=gun.gameObject.getComponentsInChildren("MeshRender") as web3d.MeshRender[];
                renders[0].material=mat;
                web3d.curScene.addChild(gun);

                this.gunobj=gun.gameObject;
                this.showObj=gun.gameObject;
            });


        }
        sphereObj:web3d.GameObject;
        matarr:web3d.Material[];
        loadSphere()
        {
            if(this.showObj)
            {
                this.showObj.beVisible=false;
            }
            if(this.sphereObj!=null)
            {
                this.sphereObj.beVisible=true;
                this.showObj=this.sphereObj;
                this.pbrMat=this.matarr;
                return;
            }
            let matarr=[];
            this.matarr=matarr;
            this.pbrMat=matarr;
            //--------------loadImag
            let normalTex = web3d.assetMgr.load("resource/texture/121.png") as web3d.Texture;
            //--------------loadmesh
            //let cube=web3d.assetMgr.load("resource/mesh/sphere.mesh.bin") as web3d.Mesh;
            //--------------------new obj
            let objroot=new web3d.GameObject();
            this.sphereObj=objroot;
            this.showObj=objroot;

            web3d.assetMgr.loadAsync("resource/glTF/Sphere/Sphere.gltf").then((bundle)=>{
                for(let i=-3;i<4;i++)
                {
                    for(let k=-3;k<4;k++)
                    {
                        let mat = new web3d.Material();
                        mat.setShader(this.pbrShader);
                        mat.setTexture("u_brdfLUT", this.brdfTex);
                        mat.setTexture("u_NormalSampler", normalTex);
                        mat.setCubeTexture("u_DiffuseEnvSampler", this.env_diffTex);
                        mat.setCubeTexture("u_SpecularEnvSampler", this.env_speTex);
                        matarr.push(mat);

                        let obj=(bundle as web3d.glTFBundle).Instantiate();
                        let meshr = obj.gameObject.getComponentsInChildren("MeshRender") as web3d.MeshRender[];
                        meshr[0].material = mat;

                        obj.localPosition[0]=k*1.5;
                        obj.localPosition[1]=i*1.5;
                        objroot.transform.addChild(obj);
                    }
                }
            });
            web3d.curScene.addChild(objroot.transform);
        }

        
        brdfTex:web3d.Texture;
        env_diffTex:web3d.CubeTexture;
        env_speTex:web3d.CubeTexture;

        load() {
            web3d.LoadScript("lib/dat.gui.min.js",()=>{
                this.uiShow();
            });
            //-------------loadshader
            this.pbrShader =web3d.assetMgr.load("resource/shader/pbr_UI.shader.json") as web3d.Shader;
            //let shader=web3d.assetMgr.load("resource/shader/pbr.shader.json") as web3d.Shader;
            let brdfTex = web3d.assetMgr.load("resource/texture/brdfLUT.png") as web3d.Texture;
            this.brdfTex=brdfTex;
            
            let e_cubeDiff: web3d.CubeTexture = new web3d.CubeTexture();
            this.env_diffTex=e_cubeDiff;
            let e_diffuseArr = [];
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_right_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_left_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_top_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_bottom_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_front_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_back_0.jpg");
            e_cubeDiff.groupCubeTexture(e_diffuseArr);
            
            let env_speTex = new web3d.CubeTexture();
            this.env_speTex=env_speTex;
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
            let camobj = new web3d.GameObject();
            camobj.name="camera";
            let cam = camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = 10;
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