namespace web3d
{
    export class ParseMaterialNode
    {
        static parse(index:number,loader:LoadGlTF):Promise<Material|null> 
        {
            let bundle=loader.bundle;
            if(bundle.materialNodeCache[index])
            {
                return Promise.resolve(bundle.materialNodeCache[index]);
            }else
            {
                if(bundle.gltf.materials==null)
                {
                    return Promise.resolve(null);
                }
                let node=bundle.gltf.materials[index];
                let mat=new Material(node.name);
                mat.queue=node.queue||0;
                if(!glTFBundle.BeUsePBRMaterial)
                {
                    let shaderName=node.shader;
                    if(shaderName!=null&&shaderName!="Standard")
                    {
                        let shader=assetMgr.load("resource/shader/"+shaderName+".shader.json") as Shader;
                        mat.setShader(shader);
                        let tex=ParseTextureNode.parse(node.pbrMetallicRoughness.baseColorTexture.index,loader).then((tex)=>{
                            mat.setTexture("_MainTex",tex);
                        });
                        return Promise.resolve(mat);
                    }
                    else if(node.pbrMetallicRoughness)
                    {
                        if(node.pbrMetallicRoughness.baseColorTexture)
                        {
                            let shader=assetMgr.load("resource/shader/diffuse.shader.json") as Shader;
                            mat.setShader(shader);
                            let tex=ParseTextureNode.parse(node.pbrMetallicRoughness.baseColorTexture.index,loader).then((tex)=>{
                                mat.setTexture("_MainTex",tex);
                            });
        
                            return Promise.resolve(mat);
                        }else
                        {
                            let shader=assetMgr.load("resource/shader/color.shader.json") as Shader;
                            mat.setShader(shader);
                            if(node.pbrMetallicRoughness.baseColorFactor)
                            {
                                let color=node.pbrMetallicRoughness.baseColorFactor;
                                mat.setColor("_MainColor",MathD.color.create(color[0],color[1],color[2],color[3]));
                            }
                            return Promise.resolve(mat);
                        }

                    }else
                    {
                        mat.setShader(assetMgr.getShader("def"));
                        return Promise.resolve(mat);
                    }
                }
    
                //-------------loadshader
                let pbrShader =assetMgr.load("resource/shader/pbr_glTF.shader.json") as Shader;
                mat.setShader(pbrShader);
                if(node.pbrMetallicRoughness)
                {
                    let nodeMR=node.pbrMetallicRoughness;
                    if(nodeMR.baseColorFactor)
                    {
                        let baseColorFactor=MathD.vec4.create();
                        MathD.vec4.copy(nodeMR.baseColorFactor,baseColorFactor);
                        mat.setVector4("u_BaseColorFactor",baseColorFactor);
                    }
                    if(nodeMR.metallicFactor)
                    {
                        mat.setFloat("u_metalFactor",nodeMR.metallicFactor);
                    }
                    if(nodeMR.roughnessFactor)
                    {
                        mat.setFloat("u_roughnessFactor",nodeMR.roughnessFactor);
                    }
                    if(nodeMR.baseColorTexture)
                    {
                        let tex=ParseTextureNode.parse(nodeMR.baseColorTexture.index,loader).then((tex)=>{
                            mat.setTexture("u_BaseColorSampler",tex);
                        });
                    }
                    if(nodeMR.metallicRoughnessTexture)
                    {
                        let tex=ParseTextureNode.parse(nodeMR.metallicRoughnessTexture.index,loader).then((tex)=>{
                            mat.setTexture("u_MetallicRoughnessSampler",tex);
                        });
                    }
                }
                if(node.normalTexture)
                {
                    let nodet=node.normalTexture;
                    let tex=ParseTextureNode.parse(nodet.index,loader).then((tex)=>{
                        mat.setTexture("u_NormalSampler",tex);
                    });
                    // mat.setTexture("u_NormalSampler",tex);
                    if(nodet.scale)
                    {
                        mat.setFloat("u_NormalScale",nodet.scale);
                    }
                }
                if(node.emissiveTexture)
                {
                    let nodet=node.emissiveTexture;
                    let tex=ParseTextureNode.parse(nodet.index,loader).then((tex)=>{
                        mat.setTexture("u_EmissiveSampler",tex);
                    });;
                }
                if(node.emissiveFactor)
                {
                    let ve3=MathD.vec3.create();
                    MathD.vec3.copy(node.emissiveFactor,ve3);
                    mat.setVector3("u_EmissiveFactor",ve3);
                }
                if(node.occlusionTexture)
                {
                    let nodet=node.occlusionTexture;
                    if(nodet.strength)
                    {
                        mat.setFloat("u_OcclusionStrength",nodet.strength);
                    }
                    
                }
    
                let brdfTex = assetMgr.load("resource/texture/brdfLUT.imgdes.json") as Texture;
                mat.setTexture("u_brdfLUT", brdfTex);
    
                let e_cubeDiff: CubeTexture = new CubeTexture();
                let e_diffuseArr:string[] = [];
                e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_right_0.jpg");
                e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_left_0.jpg");
                e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_top_0.jpg");
                e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_bottom_0.jpg");
                e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_front_0.jpg");
                e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_back_0.jpg");
                e_cubeDiff.groupCubeTexture(e_diffuseArr);
    
                let env_speTex = new CubeTexture();
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
                mat.setCubeTexture("u_DiffuseEnvSampler", e_cubeDiff);
                mat.setCubeTexture("u_SpecularEnvSampler", env_speTex);
    
                return Promise.resolve(mat);
            }
        }
    }
}
