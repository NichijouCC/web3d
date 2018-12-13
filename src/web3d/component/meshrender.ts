///<reference path="../../mathD/vec4.ts" />

namespace web3d
{
     /**
     * mesh的渲染组件
     */
    @NodeComponent
    export class MeshRender implements IRender
    {
        static type:string="MeshRender";

        mask: LayerMask=LayerMask.default;
        gameObject: GameObject;

        private _layer: RenderLayerEnum=RenderLayerEnum.Geometry;
        get layer()
        {
            if(this.materials[0]!=null)
            {
                return this.materials[0].layer;
            }else
            {
                return RenderLayerEnum.Geometry;
            }
        }
        private _queue: number = 0;
        get queue()
        {
            if(this.materials[0]!=null)
            {
                return this.materials[0].queue;
            }else
            {
                return 0;
            }
        }

        @Attribute
        materials: Material[]=[];

        public set material(value:Material|Material[])
        {
            if(value==null)
            {
                this.materials.length=0;
                return;
            }
            if(value instanceof Array)
            {
                this.materials.length=0;
                this.materials=value;
            }
            else
            {
                this.materials[0]=value;
            }
        }

        @Attribute
        lightmapIndex: number = -1;

        @Attribute
        lightmapTilingOffset: MathD.vec4= MathD.vec4.create(1, 1, 0, 0);
        private localDrawType:DrawTypeEnum=DrawTypeEnum.BASE;
        Start()
        {

        }

        Update()
        {

            // this.addToRenderList();
        }
        Render()
        {  
            let mesh = (this.gameObject.comps[MeshFilter.type] as MeshFilter).mesh;
            renderContext.curRender=this;
            renderContext.updateModel(this.gameObject.transform);
            renderContext.lightmapIndex=this.lightmapIndex;
            renderContext.lightmapTilingOffset=this.lightmapTilingOffset;
            for (let i = 0; i < mesh.submeshs.length; i++)
            {
                let sm = mesh.submeshs[i];
                let usemat = this.materials[i];

                renderMgr.draw(mesh,usemat,sm,this.lightmapIndex>=0?DrawTypeEnum.LIGHTMAP:DrawTypeEnum.BASE);
                //usemat=usemat||assetMgr.getDefaultMaterial("deferror");
                //renderMgr.draw(mesh,usemat,sm.size,sm.start,DrawTypeEnum.BASE);
            }
        }

        BeInstantiable():boolean
        {
            if(this.materials[0]==null) return false;
            return this.materials[0].beActiveInstance;
        }

        BeRenderable():boolean
        {
            if(this.gameObject.comps[MeshFilter.type]==null) return false;
            let mesh = (this.gameObject.comps[MeshFilter.type] as MeshFilter).mesh;
            if(mesh==null||mesh.glMesh==null) return false;
            if(this.materials[0]==null||this.materials[0].getShader()==null) return false;
            return true;
        }
        
        get bouningSphere(): BoundingSphere
        {
            return  (this.gameObject.comps[MeshFilter.type] as MeshFilter).mesh.getBoundingSphere();
        }

        Dispose()
        {
            this.materials.length=0;
        }

        Clone()
        { 

        }
    }

}
