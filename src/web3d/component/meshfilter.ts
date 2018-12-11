namespace web3d
{
    @NodeComponent
    export class MeshFilter implements INodeComponent
    {
        static type:string="MeshFilter";
    
        gameObject: GameObject;
    
        Start()
        {
    
        }
        Update()
        {
    
        }
        @Attribute
        mesh: Mesh;
        
        Dispose()
        {
            // if(this.mesh)
            //     this.mesh.unuse(true);
        }
        Clone()
        {
    
        }
    }
}
