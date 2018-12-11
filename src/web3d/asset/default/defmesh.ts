namespace web3d
{
    export class DefMesh
    {
        static initDefaultMesh()
        {
                assetMgr.mapDefaultMesh["quad"]=this.createDefaultMesh("quad");
                assetMgr.mapDefaultMesh["cube"] = this.createDefaultMesh("cube");
                assetMgr.mapDefaultMesh["UI_base"] = this.createDefaultMesh_UIQuad("UI_base");
    
        //     assetmgr.mapDefaultMesh["quad"] = defMesh.createDefaultMesh("circleline", gd3d.render.meshData.genQuad(1.0), assetmgr.glMesh);
        //     assetmgr.mapDefaultMesh["plane"] = defMesh.createDefaultMesh("plane", gd3d.render.meshData.genPlaneCCW(10), assetmgr.glMesh);
        //     assetmgr.mapDefaultMesh["sphere"] = defMesh.createDefaultMesh("sphere", gd3d.render.meshData.genSphereCCW(), assetmgr.glMesh);
        //     assetmgr.mapDefaultMesh["pyramid"] = defMesh.createDefaultMesh("pyramid", gd3d.render.meshData.genPyramid(2,0.5), assetmgr.glMesh);
        //     assetmgr.mapDefaultMesh["cylinder"] = defMesh.createDefaultMesh("cylinder", gd3d.render.meshData.genCylinderCCW(2, 0.5), assetmgr.glMesh);
        //     assetmgr.mapDefaultMesh["circleline"] = defMesh.createDefaultMesh("circleline", gd3d.render.meshData.genCircleLineCCW(1), assetmgr.glMesh);
         }
        private static createDefaultMesh(name: string): Mesh
        {
            switch(name)
            {
                case "quad":
                    let mesh=new Mesh("quad",null,true);
    
                    //---------------------------------------------
                    let pos=[-0.5,-0.5,0,
                                0.5,-0.5,0,
                                0.5,0.5,0,
                                -0.5,0.5,0];
                    let uv=[0,0,1,0,1,1,0,1];
                                
                    mesh.setVertexAttData(webGraph.VertexAttTypeEnum.Position,pos);
                    mesh.setVertexAttData(webGraph.VertexAttTypeEnum.UV0,uv);
    
                    let trisindex=[0,2,1,0,3,2];
                    mesh.setIndexData(trisindex);
    
                    let info=new subMeshInfo();
                    info.start=0;
                    info.size=6;
                    mesh.submeshs.push(info);
                    //------------------------------------------------------
                    mesh.createVbowithAtts();
                    return mesh;
    
                case "cube":
                    let cubemesh=new Mesh("cube",null,true);
                    //---------------------------------------------
                    let cubepos=[0.5, -0.5, 0.5,
                            -0.5, -0.5, 0.5,
                            0.5, 0.5, 0.5,
                            -0.5, 0.5, 0.5,
                            0.5, 0.5, -0.5,
                            -0.5, 0.5, -0.5,
                            0.5, -0.5, -0.5,
                            -0.5, -0.5, -0.5,
                            0.5, 0.5, 0.5,
                            -0.5, 0.5, 0.5,
                            0.5, 0.5, -0.5,
                            -0.5, 0.5, -0.5,
                            0.5, -0.5, -0.5,
                            -0.5, -0.5, 0.5,
                            -0.5, -0.5, -0.5,
                            0.5, -0.5, 0.5,
                            -0.5, -0.5, 0.5,
                            -0.5, 0.5, -0.5,
                            -0.5, -0.5, -0.5,
                            -0.5, 0.5, 0.5,
                            0.5, -0.5, -0.5,
                            0.5, 0.5, 0.5,
                            0.5, -0.5, 0.5,
                            0.5, 0.5, -0.5
                            ];
    
                    let cubeuv=[0.0, 0.0,1.0, 0.0,0.0, 1.0,1.0, 1.0,
                            0.0, 1.0,1.0, 1.0,0.0, 1.0,1.0, 1.0,
                            0.0, 0.0,1.0, 0.0,0.0, 0.0,1.0, 0.0,
                            0.0, 0.0,1.0, 1.0,1.0, 0.0,0.0, 1.0,
                            0.0, 0.0,1.0, 1.0,1.0, 0.0,0.0, 1.0,
                            0.0, 0.0,1.0, 1.0,1.0, 0.0,0.0, 1.0
                            ];
                    cubemesh.setVertexAttData(webGraph.VertexAttTypeEnum.Position,cubepos);
                    cubemesh.setVertexAttData(webGraph.VertexAttTypeEnum.UV0,cubeuv);
    
                    let cubetrisindex=[0,3,1,
                                        0,2,3,
                                        8,5,9,
                                        8,4,5,
                                        10,7,11,
                                        10,6,7,
                                        12,13,14,
                                        12,15,13,
                                        16,17,18,
                                        16,19,17,
                                        20,21,22,
                                        20,23,21];
                    cubemesh.setIndexData(cubetrisindex);
    
                    let cubeinfo=new subMeshInfo();
                    cubeinfo.start=0;
                    cubeinfo.size=36;
                    cubemesh.submeshs.push(cubeinfo);
                    //------------------------------------------------------
                    cubemesh.createVbowithAtts();
                    return cubemesh;
            }
        }
        private static createDefaultMesh_UIQuad(name: string): Mesh
        {
            let mesh: Mesh = new Mesh(name,null,true);
            //---------------------------------------------
            let pos=[ 0, 0,
                      1, 0,
                      0, 1,
                      1, 1];
            let uv=[0,0,1,0,0,1,1,1];
                        
            mesh.setVertexAttData(webGraph.VertexAttTypeEnum.Position,pos,{componentSize:2});
            mesh.setVertexAttData(webGraph.VertexAttTypeEnum.UV0,uv);
    
            let trisindex=[0,2,3,0,3,1];
            mesh.setIndexData(trisindex);
    
            let info=new subMeshInfo();
            info.start=0;
            info.size=6;
            mesh.submeshs.push(info);
            //------------------------------------------------------
            mesh.createVbowithAtts();
            return mesh;
        }
    }
}
