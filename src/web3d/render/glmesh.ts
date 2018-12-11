namespace web3d
{
    export class GlMesh implements webGraph.BaseMesh
    {
        submeshs: webGraph.IMeshInfo[];
        
        // mesh:Mesh;
        /**
         * 顶点总量
         */
        vertexCount:number;
        /**
         * 一个顶点的byte总量
         */
        vertexByteSize:number;

        /**
         * 数据类型//static/dynamic
         */
        renderModel:number=webGraph.rendingWebgl.STATIC_DRAW;
        /**
         * 顶点数据长度（byte为单位）
         */
        perVertexSize:number;
    
        vbo: webGraph.VertexBuffer;
        ebo:webGraph.ElementBuffer;
        // vao:Graphs.VAO;
        vaoDic:{[key:number]:webGraph.VAO}={};
        /**
         * vertex attribute 数据记录
         * use for enable/disable vertex attribute
         */
        VertexAttDic:{[attType:string]:webGraph.VertexAttribute}={};
        // InterleavedVbo:ArrayBuffer;
        // constructor(VertexAttDic?:{[attType:string]:webGraph.VertexAttribute},triIndex?:Uint16Array|Uint32Array,model:webGraph.RenderModelEnum=webGraph.RenderModelEnum.static)
        // {
        //     this.renderModel=model;

        //     if(VertexAttDic!=null)
        //     {
        //         this.VertexAttDic=VertexAttDic;
        //         //------------------------创建buffer
        //         //-------创建属性交叉的vbo
        //         this.createInterleavedVbo(this.VertexAttDic,this.renderModel);
        //     }
        //     // else
        //     // {//------为每个属性创建单独的vbo
        //     //     this.createIndividualVbo(this.VertexAttDic,this.renderModel);
        //     // }
        //     //--------generateEbo
        //     if(triIndex!=null)
        //     {
        //         this.ebo=new webGraph.ElementBuffer();
        //         this.ebo.bufferData(triIndex);
        //     }
        // }

        declareVboWithAtts(vertexInfos:{[attType:string]:vertexAttInfo},model:webGraph.RenderModelEnum=webGraph.RenderModelEnum.static)
        {
            this.vertexByteSize=0;
            for(let key in vertexInfos)
            {
                this.vertexByteSize+=vertexInfos[key].byteSize;
            }
            this.vertexCount=vertexInfos[webGraph.VertexAttTypeEnum.Position].count;

            let vbo=new webGraph.VertexBuffer(model);
            vbo.bufferData(this.vertexByteSize*this.vertexCount);
            let offset:number=0;
            for(let key in vertexInfos)
            {
                let att=vertexInfos[key];
                vbo.bufferSubData(att.view,offset);
                this.VertexAttDic[key]=webGraph.VertexAttribute.createByType(key as any,vertexInfos[key]);
                this.VertexAttDic[key].offsetInBytes=offset;
                this.VertexAttDic[key].strideInBytes=att.byteSize;
                this.VertexAttDic[key].vbo=vbo;
                offset+=att.byteSize*att.count;
            }
            if(this.vbo!=null)
            {
                this.vbo.dispose();
            }
            this.vbo=vbo;
        }
        refreshVboWithAtt(att:vertexAttInfo)
        {
            this.vbo.bufferSubData(att.view,this.VertexAttDic[att.type].offsetInBytes);
        }

        declareVboWithInterleavedData(vbodata:Float32Array,attInfo:IVboAttInfo[],model:webGraph.RenderModelEnum=webGraph.RenderModelEnum.static)
        {
            let vbo=new webGraph.VertexBuffer(model);
            vbo.bufferData(vbodata);
            for(let key in attInfo)
            {
                let att=attInfo[key];
                this.VertexAttDic[att.attName]=webGraph.VertexAttribute.createByType(key as any);
                this.VertexAttDic[att.attName].offsetInBytes=att.offsetInBytes;
                this.VertexAttDic[att.attName].strideInBytes=att.strideInBytes;
                this.VertexAttDic[att.attName].vbo=vbo;
            }
            if(this.vbo!=null)
            {
                this.vbo.dispose();
            }
            this.vbo=vbo;
        }
        refreshVboWithInterleavedData(vbodata:Float32Array)
        {
            this.vbo.bufferData(vbodata);
        }

        declareEboWithData(ebodata:Uint16Array|Uint32Array)
        {
            if(this.ebo!=null)
            {
                this.ebo.dispose();
            }
            this.ebo=new webGraph.ElementBuffer();
            this.ebo.bufferData(ebodata);
        }
        refreshEboWithData(ebodata:Uint16Array|Uint32Array)
        {
            this.ebo.bufferData(ebodata);
        }

        dispose()
        {
            
        }
        
    }
}

