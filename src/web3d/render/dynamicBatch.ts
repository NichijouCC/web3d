namespace web3d
{
    export class DynamicBatch
    {
        dataForVbo:Float32Array;
        dataForEbo:Uint16Array;
        curVertexCount:number;
        curVboLen:number;
        curEboLen:number;

        mat:Material;
        mesh:Mesh;

        constructor(mesh:Mesh,mat:Material)
        {
            
        }

    }
}