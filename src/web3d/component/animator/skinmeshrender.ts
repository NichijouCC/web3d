namespace web3d
{
    /**
     * skinMesh的渲染组件
     */
    @NodeComponent
    export class SkinMeshRender implements IRender
    {
        static type:string="SkinMeshRender";

        gameObject: GameObject;
        mask: CullingMask= CullingMask.default;
        layer: RenderLayerEnum=RenderLayerEnum.Geometry;
        queue: number = 0;

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

            this.layer = this.materials[0].layer;
            this.queue = this.materials[0].queue;
        }
        
        @Attribute
        mesh:Mesh;

        joints:Transform[]=[];

        // @Attribute
        // bonesname:string[]=[];
        bindPlayer:Animation;

        private realjointMatrixData:Float32Array;
        private jointMatrixs:MathD.mat4[]=[];

        /**
         * inverse bindpose
         * mesh空间变换到骨骼空间
         */
        bindPoses:MathD.mat4[]=[];
        Start()
        {
            this.realjointMatrixData=new Float32Array(this.joints.length*16);
            for(let i=0;i<this.joints.length;i++)
            {
                this.jointMatrixs[i]=new Float32Array(this.realjointMatrixData.buffer,i*64,16)
            }
        }
        Update()
        {
            this.layer = this.materials[0].layer;
            // this.addToRenderList();
        }
        //private testMesh:Mesh=new Mesh();
        Render()
        {  
            renderContext.curRender=this;  
            for (let i = 0; i < this.mesh.submeshs.length; i++)
            {
                let sm = this.mesh.submeshs[i];
                let usemat = this.materials[i];
                // if(usemat==null) continue;
                //usemat=usemat||assetMgr.getDefaultMaterial("deferror");
            
                if(this.bindPlayer&&this.bindPlayer.curAni)
                {
                    for(let i=0;i<this.joints.length;i++)
                    {
                        MathD.mat4.multiply(this.joints[i].worldMatrix,this.bindPoses[i],this.jointMatrixs[i]);
                    }
                    renderContext.jointMatrixs=this.realjointMatrixData;
                    renderMgr.draw(this.mesh,usemat,sm,DrawTypeEnum.SKIN);
                }else
                {
                    for(let i=0;i<this.joints.length;i++)
                    {
                        MathD.mat4.multiply(this.joints[i].worldMatrix,this.bindPoses[i],this.jointMatrixs[i]);
                    }
                    renderContext.jointMatrixs=this.realjointMatrixData;
                    renderMgr.draw(this.mesh,usemat,sm,DrawTypeEnum.SKIN);

                    // renderContext.updateModel(this.gameObject.transform);
                    // renderMgr.draw(this.mesh,usemat,sm,DrawTypeEnum.BASE);
                }
                

                // for(let i=0;i<this.joints.length;i++)
                // {
                //     let bone=this.joints[i];
                //     if(bone.find("testcube")==null)
                //     {
                //         let obj=new GameObject();
                //         obj.transform.localScale=MathD.vec3.create(0.1,0.1,0.1);
                //         obj.name="testcube";  
                //         let mf=obj.addComponent<MeshFilter>("MeshFilter");
                //         let mr=obj.addComponent<MeshRender>("MeshRender");
                //         mf.mesh=assetMgr.getDefaultMesh("cube");
                //         mr.material=assetMgr.getDefaultMaterial("def");
                //         bone.addChild(obj.transform);
                //     }
                // }



                //mesh.glMesh.unbindebo(i);
            }
            //mesh.glMesh.unbindvbo();
        }
        // addToRenderList(): void {
        //     if(this.gameObject.beVisible==false) return;
        //     if(this.mesh==null||this.mesh.glMesh==null) return;

        //     renderMgr.renderlistall.addRenderer(this);
        // }
        BeRenderable():boolean
        {
            if(this.mesh==null||this.mesh.glMesh==null) return false;

            return true;
        }
        get bouningSphere(): BoundingSphere
        {
            return  this.mesh.getBoundingSphere();
        }
        
        BeInstantiable():boolean
        {
            return this.materials[0].beActiveInstance;
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
 