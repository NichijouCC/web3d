namespace web3d
{
    export class DebugTool
    {
        static createCube():Transform
        {
            let obj=new GameObject();
            let meshf=obj.addComponent<MeshFilter>(MeshFilter.type);
            let meshr=obj.addComponent<MeshRender>(MeshRender.type);
            meshf.mesh=assetMgr.getDefaultMesh("cube");
            meshr.material=assetMgr.getDefaultMaterial("def");
            return obj.transform;
        }

        static drawLine(from:MathD.vec3,to:MathD.vec3):Transform
        {
            let obj=new GameObject();
            let meshf=obj.addComponent<MeshFilter>(MeshFilter.type);
            let meshr=obj.addComponent<MeshRender>(MeshRender.type);
            
            let mesh=new Mesh();
            meshf.mesh=mesh;
            mesh.setVertexAttData(webGraph.VertexAttTypeEnum.Position,[from.x,from.y,from.z,to.x,to.y,to.z]);
            mesh.createVbowithAtts();
            let info=new subMeshInfo();
            info.beUseEbo=false;
            info.renderType=webGraph.PrimitiveRenderEnum.Lines;
            info.size=2;
            mesh.submeshs.push(info);
            meshr.material=assetMgr.getDefaultMaterial("deferror");

            return obj.transform;
        }
    }
}