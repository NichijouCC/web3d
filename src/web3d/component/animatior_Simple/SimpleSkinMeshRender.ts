namespace web3d
{
     /**
     * skinMesh的渲染组件
     */
    @NodeComponent
    export class SimpleSkinMeshRender implements IRender
    {
        static type:string="SimpleSkinMeshRender";

        gameObject: GameObject;
        mask: LayerMask= LayerMask.default;
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
        bones:Transform[]=[];
        /**
         * inverse bindpose
         * mesh空间变换到骨骼空间
         */
        //bindposes:mat4[]=[];
        @Attribute
        bonesname:string[]=[];
        bindPlayer:SimpleAnimator;
        private bonesRotPos:Float32Array;

        inverseBindmatrixs:MathD.mat4[]=[];
        Start()
        {
            // let names="Bip001 Neck,Bip001 Neck1,Bip001 Spine1,Bip001 Head,Bone004,Bip001 Xtra09,Bip001 Spine,Bip001 L UpperArm,Bip001 L Clavicle,Bip001 Pelvis,Bip001 L Thigh,Bip001 R Clavicle,Bip001 R UpperArm,Bip001 R Thigh,Bip001 Xtra01,Bone001,Bone002,Bone003,Bone005,Bip001 L Forearm,Bip001 L Hand,Bip001 L Finger0,Bip001 L Finger01,Bip001 L Calf,Bip001 L HorseLink,Bip001 L Foot,Bip001 L Toe0,Bip001 L Toe01,Bip001 R Forearm,Bip001 R Hand,Bip001 R Finger0,Bip001 R Finger01,Bip001 R Calf,Bip001 R HorseLink,Bip001 R Foot,Bip001 R Toe0,Bip001 R Toe01,Bip001 Xtra15,Bip001 Xtra13,Bip001 Xtra14,Bip001 Xtra16,Bip001 Xtra11,Bip001 Xtra12,Bip001 Xtra18,Bip001 Xtra10,Bip001 Xtra07,Bip001 Xtra05,Bip001 Xtra06,Bip001 Xtra03,Bip001 Xtra08,Bip001 Xtra04,Bip001 Xtra17,Bip001 Xtra02";
            // this.bonesname=names.split(",");
            this.bonesRotPos=new Float32Array(this.bonesname.length*Aniclip.perBoneDataLen);
        }
        Update()
        {
        }
        //private testMesh:Mesh=new Mesh();
        Render()
        {  
            
            renderContext.curRender=this;
            for (let i = 0; i < this.mesh.submeshs.length; i++)
            {
                let sm = this.mesh.submeshs[i];
                let usemat = this.materials[i];
                //usemat=usemat||assetMgr.getDefaultMaterial("deferror");
                
                if(this.bindPlayer&&this.bindPlayer.clipFrame)
                {
                    renderContext.updateModel(this.bindPlayer.gameObject.transform);
                    this.bindPlayer.RefreshSkinBoneData(this.bonesname,this.bonesRotPos);
                    //this.refreshBonesRotPos();
                    renderMgr.draw(this.mesh,usemat,sm,DrawTypeEnum.SKIN);
                }else
                {
                    renderContext.updateModel(this.gameObject.transform);
                    renderMgr.draw(this.mesh,usemat,sm,DrawTypeEnum.BASE);
                }
                //mesh.glMesh.unbindebo(i);
            }
            //mesh.glMesh.unbindvbo();
        }
        BeRenderable(): boolean {
            if(this.mesh==null||this.mesh.glMesh==null) return false;
            return true;
        }

        BeInstantiable():boolean
        {
            return this.materials[0].beActiveInstance;
        }
        // addToRenderList(): void {
        //     if(this.mesh==null||this.mesh.glMesh==null) return;
        //     renderMgr.renderlistall.addRenderer(this);
        // }
        Dispose()
        {
            this.materials.length=0;
        }

        Clone()
        { 

        }

        get bouningSphere(): BoundingSphere
        {
            return  this.mesh.getBoundingSphere();
        }
    }
}
