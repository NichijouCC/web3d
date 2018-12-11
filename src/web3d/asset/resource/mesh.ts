namespace web3d
{
    @GameAsset
    export class Mesh extends Web3dAsset
    {
        constructor(name:string|null=null,url:string|null=null,bedef:boolean=false)
        {
            super(name,url,bedef);
            this.type="Mesh";
        }
    
        glMesh: GlMesh|null=null;
        // vertexCount:number;
        dataType:webGraph.RenderModelEnum=webGraph.RenderModelEnum.static;
        //pos.uv0/uv1/color/colorex/BlendIndex4/BlendWeight4/Normal/Tangent/
        // VertexAttDic:{[attType:string]:webGraph.VertexAttribute}={};
        vertexAttData:{[attType:string]:vertexAttInfo}={};
        //三角形索引
        trisindex: Uint16Array|Uint32Array;
        submeshs: subMeshInfo[] = [];
    
        getVertexData(type:webGraph.VertexAttTypeEnum):vertexAttInfo|null
        {
            return this.vertexAttData[type];
        }
        //-------------------------vbo data  赋值每个att的 data
        setVertexAttData(type:webGraph.VertexAttTypeEnum,arr:Array<number>|Float32Array|Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array,attInfo?:webGraph.IAttinfo)
        {
            let viewArr =arr instanceof Array? new Float32Array(arr):arr;
            this.vertexAttData[type]=new vertexAttInfo(type,viewArr,attInfo);
        }
        createVbowithAtts()
        {
            if(this.glMesh==null)
            {
                this.glMesh=new GlMesh();
            }
            this.glMesh.declareVboWithAtts(this.vertexAttData,this.dataType);
        }
        refreshMeshVboWithAtt(type:webGraph.VertexAttTypeEnum,vbodata:Float32Array)
        {
            this.vertexAttData[type].view=vbodata;
            this.glMesh.refreshVboWithAtt(this.vertexAttData[type]);
        }
        //-------------------------vbo data 赋值 interleaved data
        setInterleavedVertexData(vbodata:Float32Array,attInfo?:IVboAttInfo[])
        {
            if(this.glMesh==null)
            {
                this.glMesh=new GlMesh();
            }
            this.glMesh.declareVboWithInterleavedData(vbodata,attInfo,this.dataType);
        }
        refreshInterleavedMeshVbo(vbodata:Float32Array)
        {
            this.glMesh.refreshVboWithInterleavedData(vbodata);
        }
        
        //-----------------------ebo data
        setIndexData(arr:Array<number>|Uint16Array|Uint32Array)
        {
            if(arr instanceof Array)
            {
                this.trisindex=new Uint16Array(arr);
            }else
            {
                this.trisindex=arr;
            }
            if(this.glMesh==null)
            {
                this.glMesh=new GlMesh();
            }
            this.glMesh.declareEboWithData(this.trisindex);
        }
        refreshMeshebo(ebodata:Uint16Array)
        {
            this.glMesh.refreshEboWithData(ebodata);
        }
        getIndexData()
        {
            return this.trisindex;
        }
        
        private _boundingAABB:AABB;
        getBoudingBox():AABB
        {
            if(this._boundingAABB==null)
            {
                this._boundingAABB=new AABB().setFromMesh(this);
            }
            return this._boundingAABB;
        }
        private _boundingSphere:BoundingSphere;
        getBoundingSphere():BoundingSphere
        {
            if(this._boundingSphere==null)
            {
                this._boundingSphere=new BoundingSphere().setFromMesh(this,this.getBoudingBox().centerPoint);
            }
            return this._boundingSphere;
        }

        // /**
        //  * 准备好数据 vertexdata indexdata 产生新的buffer对象
        //  */
        // applyToGLTarget()
        // {
        //     if(this.glMesh)
        //     {
        //         this.glMesh.dispose();
        //     }
        //     this.glMesh=new GlMesh(this.VertexAttDic,this.trisindex,this.dataType);
        // }

        dispose()
        {
            if(this.beDefaultAsset) return;
            if(this.glMesh)
            {
                this.glMesh.dispose();
            }
            // this.originaldata = null;
            delete this.submeshs;
        }
    }
    export class subMeshInfo
    {
        start: number=0;
        size: number=0;
        beUseEbo:boolean=true;
        renderType:webGraph.PrimitiveRenderEnum=webGraph.PrimitiveRenderEnum.Triangles;
    }
    export interface IVboAttInfo
    {
        attName:webGraph.VertexAttTypeEnum;
        offsetInBytes:number;
        strideInBytes:number;
    }

    export class vertexAttInfo implements webGraph.IAttinfo
    {
        componentSize:number;
        componentDataType:number;
        normalize:boolean;

        type:webGraph.VertexAttTypeEnum;

        view:Float32Array|Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array;

        /**
         * typeByte*componentSize(例如:float3=4 * 3)
         */
        byteSize:number;
        /**
         * arraybufferview 中元素的byte间隔
         */
        viewByteStride?:number;

        //data:any[]=[];
        get data():any[]
        {
            return webGraph.GetDataArr(this.view,this.viewByteStride||this.byteSize,this.componentSize);
        }
        // count:number;
        get count():number
        {
            return this.view.length/this.componentSize;
        }

        constructor(type:webGraph.VertexAttTypeEnum,view:Float32Array|Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array,attInfo?:webGraph.IAttinfo)
        {
            this.type=type;
            this.view=view;
            
            if(attInfo!=null)
            {
                this.componentSize=attInfo.componentSize||webGraph.getCompnentSizeByVertexType(this.type);
                this.componentDataType=attInfo.componentDataType||webGraph.GLConstants.FLOAT;
                this.normalize=attInfo.normalize||false;
                this.viewByteStride=attInfo.viewByteStride||(this.view.BYTES_PER_ELEMENT*this.componentSize);
            }else
            {
                this.componentSize=webGraph.getCompnentSizeByVertexType(this.type);
                this.componentDataType=webGraph.GLConstants.FLOAT;
                this.normalize=false;
                this.viewByteStride=this.view.BYTES_PER_ELEMENT*this.componentSize;
            }
            this.byteSize=this.view.BYTES_PER_ELEMENT*this.componentSize;
            
        }
    }
}
