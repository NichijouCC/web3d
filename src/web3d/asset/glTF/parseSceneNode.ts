namespace web3d
{
    export class ParseSceneNode
    {
        static parse(index:number,bundle:glTFBundle):Transform
        {
            let node=bundle.gltf.nodes[index];
            let trans=new GameObject().transform;
            bundle.nodeDic[index]=trans;
            if(node.name)
            {
                trans.gameObject.name=node.name;
            }else
            {
                trans.gameObject.name="node"+index;
            }
            if(node.matrix)
            {
                trans.setLocalMatrix(node.matrix as any);
            }
            if(node.translation)
            {
                MathD.vec3.copy(node.translation,trans.localPosition);
                trans.markDirty();
            }
            if(node.rotation)
            {
                MathD.quat.copy(node.rotation,trans.localRotation);
                trans.markDirty();
            }
            if(node.scale)
            {
                MathD.vec3.copy(node.scale,trans.localScale);
                trans.markDirty();
            }
            if(node.children)
            {
                for(let i=0;i<node.children.length;i++)
                {
                    let nodeindex=node.children[i];
                    let childtrans=this.parse(nodeindex,bundle);
                    trans.addChild(childtrans);
                }
            }
            if(node.camera!=null)
            {
                let camtrans=ParseCameraNode.parse(node.camera,bundle);
                trans.addChild(camtrans);
            }
    
            if(node.skin!=null&&node.mesh!=null)
            {
                let nodemeshdata:PrimitiveNode[]=bundle.meshNodeCache[node.mesh];
                let skindata=bundle.skinNodeCache[node.skin];
    
                for(let key in nodemeshdata)
                {
                    let data=nodemeshdata[key];
                    //-----------------------------
                    let obj=new GameObject();
                    trans.addChild(obj.transform);
                    let meshr=obj.addComponent<SkinMeshRender>("SkinMeshRender");
                    // let mat=assetMgr.load("resource/mat/diff.mat.json") as Material;
                    // meshr.material=mat;
                    meshr.mesh=data.mesh;
                    meshr.material=data.mat;
    
                    // meshr.joints=skindata.joints;
                    for(let i=0;i<skindata.jointIndexs.length;i++)
                    {
                        let trans=bundle.nodeDic[skindata.jointIndexs[i]];
                        if(trans==null)
                        {
                            console.error("解析gltf 异常！");
                        }
                        meshr.joints.push(trans);
                    }
    
                    meshr.bindPoses=skindata.inverseBindMat;
                    meshr.bindPlayer=bundle.bundleAnimator;
                }
            }else if(node.mesh!=null)
            {
                let nodemeshdata:PrimitiveNode[]=bundle.meshNodeCache[node.mesh];
                for(let key in nodemeshdata)
                {
                    let data=nodemeshdata[key];
                    //-----------------------------
                    let obj=new GameObject();
                    let meshf=obj.addComponent<MeshFilter>("MeshFilter");
                    let meshr=obj.addComponent<MeshRender>("MeshRender");
                    //let mat=assetMgr.load("resource/mat/diff.mat.json") as Material;
                    meshf.mesh=data.mesh;
                    meshr.material=data.mat;
                    //meshr.material=mat;
    
                    trans.addChild(obj.transform);
                }
            }


            //---------------
            if(node.comps)
            {
                for(let key in node.comps)
                {
                    let compNode=node.comps[key];
                    let comp= trans.gameObject.addComponent(compNode["type"]);
                    for(let key in compNode)
                    {
                        let att=compNode[key];
                        if(att instanceof Array)
                        {
                            for(let i=0;i<att.length;i++)
                            {
                                comp[key][i]=att[i];
                            }
                        }else
                        {
                            comp[key]=att;
                        }

                    }
                }
            }

            
            return trans;
        }
    }
}
