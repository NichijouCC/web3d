
namespace web3d
{
    export class F14EmissionBatch
    {

        type: F14TypeEnum;
        effect: EffectSystem;

        //public Material mat;
        public emission:F14Emission;//
        //-------------------------------
        private mesh:Mesh;
        private mat:Material;

        // private totalVertexCount:number=0;
        // private toltalIndexCount:number=0;

        curParticleCount:number=0;
        curRealVboLen:number=0;
        curVertexcount:number=0;
        curIndexCount:number=0;

        //----------------

        dataForVbo:Float32Array;
        dataForEbo:Uint16Array;
        vertexLength:number;
        //private maxcoun:number;
        public constructor(effect:EffectSystem,element:F14Emission)
        {
            this.type= F14TypeEnum.particlesType;
            this.effect = effect;
            this.emission= element;

            let datamesh= this.emission.baseddata.mesh;
            this.mesh= new Mesh();
            this.mesh.dataType=webGraph.RenderModelEnum.dynamic;
            this.mat= this.emission.baseddata.material;
            //---------------------
            // this.vertexLength=gd3d.render.meshData.calcByteSize(this.effect.VF)/4;

            let maxParticlesCount=this.emission.getMaxParticleCount();
            let particleVertexCount= this.emission.vertexCount;
            let particleIndexCount= this.emission.dataforeboLen;

            this.vertexLength=3+2+4;
            this.dataForVbo=new Float32Array(maxParticlesCount*particleVertexCount*this.vertexLength);
            this.dataForEbo=new Uint16Array(maxParticlesCount*particleIndexCount);

            let attinfo:IVboAttInfo[]=[];
            attinfo.push({attName:webGraph.VertexAttTypeEnum.Position,offsetInBytes:0,strideInBytes:36});
            attinfo.push({attName:webGraph.VertexAttTypeEnum.Position,offsetInBytes:12,strideInBytes:36});
            attinfo.push({attName:webGraph.VertexAttTypeEnum.Position,offsetInBytes:20,strideInBytes:36});
            this.mesh.setInterleavedVertexData(this.dataForVbo,attinfo);

            this.dataForEbo=new Uint16Array(maxParticlesCount*particleIndexCount);
            this.mesh.setIndexData(this.dataForEbo);
            this.mesh.submeshs = [];
            {
                var sm = new subMeshInfo();
                sm.start = 0;
                sm.size = this.dataForEbo.length;
                this.mesh.submeshs.push(sm);
            }
        }

        public render(effectqueue:number)
        {
            if(this.emission.baseddata.simulateInLocalSpace)
            {
                MathD.mat4.copy(this.effect.mvpMat, renderContext.matrixModelViewProject);
            }else
            {
                renderContext.updateModeTrail();
            }
            this.mat.queue=effectqueue;
            //---------------------集合数据
            this.curIndexCount=0;
            this.curVertexcount=0;
            this.curRealVboLen=0;
            // console.log("emissionCount:   "+this.emission.particlelist.length);
            for(let i=0,len=this.emission.particlelist.length;i<len;i++)
            {
                this.emission.particlelist[i].uploadMeshdata();
            }
            //---------------------render    
            this.mesh.refreshInterleavedMeshVbo(this.dataForVbo);
            this.mesh.refreshMeshebo(this.dataForEbo);
            this.mesh.submeshs[0].size=this.curIndexCount;

            //console.log("ebo leng="+this.dataForEbo.length+" vbo leng="+this.dataForVbo.length+" draw size="+this.curIndexCount+"particle count="+this.curVertexcount/this.emission.vertexCount+"max count:"+this.maxcoun);
            renderMgr.draw(this.mesh,this.mat,this.mesh.submeshs[0],DrawTypeEnum.BASE); 
        }

        public dispose()
        {
            this.effect=null;
            this.emission=null;
            this.mesh=null;
            this.mat=null;
            delete this.dataForEbo;
            delete this.dataForVbo;
        }
    
    }
}