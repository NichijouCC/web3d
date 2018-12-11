///<reference path="../util/reflect.ts" />
namespace web3d
{
    export class Boxcollider implements INodeComponent
    {
        static readonly type: string="Boxcollider";
    
        gameObject: GameObject;
        private aabb:AABB=new AABB();
        private colliderObj:GameObject;
        private colliderMesh:Mesh;
        private dirty:boolean=false;
    
        private _center: MathD.vec3=MathD.vec3.create();
        get center(): MathD.vec3
        {
            return this._center;
        }
        set center(value: MathD.vec3)
        {
            this._center=value;
        }
    
        private _size: MathD.vec3=MathD.vec3.create(1,1,1);
        get size(): MathD.vec3
        {
            return this._size;
        }
        set size(value: MathD.vec3)
        {
            this._size=value;
            let tempt=MathD.vec3.create();
            MathD.vec3.scale(this.size,-0.5,tempt);
            this.aabb.setMinPoint(tempt);
            MathD.vec3.scale(this.size,0.5,tempt);
            this.aabb.setMaxPoint(tempt);
            MathD.vec3.recycle(tempt);
            this.dirty=true;
        }
    
        private _visible = false;
        get visible()
        {
            return this._visible;
        }
        set visible(value:boolean)
        {
            this._visible=value;
        }
    
        Start() {
            this.colliderObj=new GameObject();
            this.gameObject.transform.addChild(this.colliderObj.transform);
        }
        Update() {
               //---------------
            if(this._visible)
            {
                let meshf=this.colliderObj.addComponent<MeshFilter>("MeshFilter");
                let meshr=this.colliderObj.addComponent<MeshRender>("MeshRender");
                meshf.mesh=this.colliderMesh;
                MathD.vec3.copy(this._center,this.colliderObj.transform.localPosition);
                
            }
        }
    
        updateAABB()
        {
            this.aabb.applyMatrix(this.colliderObj.transform.worldMatrix);
        }
    
        Dispose() {
            
        }
        Clone() {
            
        }
    
    }
}
