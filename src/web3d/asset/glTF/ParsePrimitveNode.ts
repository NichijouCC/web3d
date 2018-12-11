
namespace web3d
{
    export class PrimitiveNode
    {
        mesh:Mesh;
        mat:Material;
    }

    export class ParsePrimitiveNode
    {
        private static beinit:boolean=false;
        private static _vertexAttDic:{[type:string]:{type:webGraph.VertexAttTypeEnum,location:number}}={};


        static extensionName="KHR_draco_mesh_compression";
        /**
         * 由gltf 的属性名字得到 atttype enum
         */
        static get vertexAttMap():{[type:string]:{type:webGraph.VertexAttTypeEnum,location:number}}
        {
            if(!this.beinit)
            {
                this._vertexAttDic["POSITION"]={type:webGraph.VertexAttTypeEnum.Position,location:webGraph.VertexAttLocationEnum.Position};
                this._vertexAttDic["NORMAL"]={type:webGraph.VertexAttTypeEnum.Normal,location:webGraph.VertexAttLocationEnum.Normal};
                this._vertexAttDic["TEXCOORD_0"]={type:webGraph.VertexAttTypeEnum.UV0,location:webGraph.VertexAttLocationEnum.UV0};
                this._vertexAttDic["TEXCOORD_1"]={type:webGraph.VertexAttTypeEnum.UV1,location:webGraph.VertexAttLocationEnum.UV1};
                this._vertexAttDic["COLOR_0"]={type:webGraph.VertexAttTypeEnum.Color0,location:webGraph.VertexAttLocationEnum.Color0};
                this._vertexAttDic["TANGENT"]={type:webGraph.VertexAttTypeEnum.Tangent,location:webGraph.VertexAttLocationEnum.Tangent};
                this._vertexAttDic["JOINTS_0"]={type:webGraph.VertexAttTypeEnum.BlendIndex4,location:webGraph.VertexAttLocationEnum.BlendIndex4};
                this._vertexAttDic["WEIGHTS_0"]={type:webGraph.VertexAttTypeEnum.BlendWeight4,location:webGraph.VertexAttLocationEnum.BlendWeight4};
                this.beinit=true;
            }
            return this._vertexAttDic;
        }

        static parse(node:IMeshPrimitive,loader:LoadGlTF):Promise<PrimitiveNode>
        {
            const promises=new Array<Promise<any>>();
            let nodedata=new PrimitiveNode();

            promises.push(this.parseMesh(node,loader).then((mesh)=>{
                nodedata.mesh=mesh;
            }));
            promises.push(this.parseMaterial(node,loader).then((mat)=>{
                nodedata.mat=mat;
            }));

            return Promise.all(promises).then(()=>{
                return nodedata;
            });
        }

        static parseMesh(node:IMeshPrimitive,loader:LoadGlTF):Promise<Mesh>
        {
            let promise=loader.getExtensionData(node,this.extensionName)
            if(promise)
            {
                return promise;
            }
            let mesh=new Mesh();
            let attributes=node.attributes;
            let index=node.indices;
            if(index==null) return null;

            let vbopro=this.parseVboData(attributes,mesh,loader);
            let ebopro=this.parseEboData(index,mesh,loader);

            return Promise.all([vbopro,ebopro]).then(()=>{
                mesh.createVbowithAtts();
                return mesh;
            });
        }
        static parseMaterial(node:IMeshPrimitive,loader:LoadGlTF):Promise<Material>
        {
            let matindex=node.material;
            if(matindex!=null)
            {
                return ParseMaterialNode.parse(matindex,loader);
            }else
            {
                return Promise.resolve(null);
            }
        }

        static parseVboData(attributes:{[name:string]:number},mesh:Mesh,loader:LoadGlTF):Promise<void>
        {
            let taskArr:Promise<void>[]=[];
            for(let key in attributes)
            {
                let index=attributes[key];
                taskArr.push(this.parseVertexAtt(index,key,mesh,loader));
            }
            return Promise.all(taskArr).then(()=>{});
        }


        static parseVertexAtt(index:number,type:string,mesh:Mesh,loader:LoadGlTF):Promise<void>
        {
            let attinfo=ParsePrimitiveNode.vertexAttMap[type];
            if(attinfo==null)
            {
                console.error("gltf mesh attribute type not handle yet.");

                return Promise.reject("gltf mesh attribute type not handle yet.");
            }else
            {
                return parseAccessorNode.parse(index,loader).then((node:AccessorNode)=>{
                    if(node==null)
                    {
                        return Promise.reject("loadfailed");
                    }else
                    {
                        // let attData=new webGraph.VertexAttribute();
                        // mesh.VertexAttDic[attinfo.type]=attData;
                        // attData.type=attinfo.type;
                        // attData.location=attinfo.location;
                        // attData.componentDataType=node.componentType;
                        // if(attinfo.type==webGraph.VertexAttTypeEnum.Normal||attinfo.type==webGraph.VertexAttTypeEnum.Tangent)
                        // {
                        //     attData.componentSize=3;
                        // }else
                        // {
                        //     attData.componentSize=node.componentSize;
                        // }
                        // attData.view=node.view;
                        // attData.data=node.data;
                        // attData.byteSize=node.byteSize;
                        // attData.viewByteStride=node.byteStride;
                        // attData.count=node.count;


                        mesh.setVertexAttData(attinfo.type,node.view,{componentSize:node.componentSize,componentDataType:node.componentType,viewByteStride:node.byteStride});
                    }
                })
            }
        }

        static parseEboData(index:number,mesh:Mesh,loader:LoadGlTF):Promise<void>
        {
            return new Promise((resolve,reject)=>{
                parseAccessorNode.parse(index,loader).then((node)=>{
                    if(node)
                    {
                        if(node.view instanceof Uint16Array||node.view instanceof Uint32Array)
                        {
                            mesh.setIndexData(node.view);
                        }else
                        {
                            let trisindex=new Uint16Array(node.count);
                            //-----------todo
                            for(let i=0;i<trisindex.length;i++)
                            {
                                trisindex[i]=node.data[i];
                            }
                            //----------下面复制能行？不确定
                            //mesh.trisindex.set(node.view as any);

                            mesh.setIndexData(trisindex);
                        }
                        //-----------------submesh info
                        let submeshinfo=new subMeshInfo();
                        submeshinfo.size=mesh.trisindex.length;
                        mesh.submeshs=[];
                        mesh.submeshs.push(submeshinfo);
                        resolve();
                    }else
                    {
                        reject();
                    }
                });
            }
            )
        }
    }
}

    // export interface IbufferData
    // {
    //     bufferView:ArrayBufferView;
    //     bytestride:number;
    //     Viewstride:number;
    //     type:string;
    //     totalcount:number;
    //     componentType:number;
    //     componentSize:number;

    //     url:string;
    //     byteOffset:number;
    //     byteLength:number;
    // }




    // export class meshAttData implements IbufferData
    // {
    //     attType:VertexAttTypeEnum;
    //     attLocation:VertexAttLocationEnum;
    //     bufferView:ArrayBufferView;
    //     bytestride:number=0;
    //     Viewstride:number;
    //     type:string;
    //     totalcount:number;
    //     componentType:number;
    //     componentSize:number;

    //     url:string;
    //     byteOffset:number;
    //     byteLength:number;
    // }

    // export class meshIndexData implements IbufferData
    // {
    //     bufferView:ArrayBufferView;
    //     bytestride:number=0;
    //     Viewstride:number;
    //     type:string;
    //     totalcount:number;
    //     componentType:number;
    //     componentSize:number;

    //     url:string;
    //     byteOffset:number;
    //     byteLength:number;
    // }

