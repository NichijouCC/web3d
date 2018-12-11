// namespace web3d
// {
//     export class loadMeshData
//     {
//         vertexFormate:number=0;
//         VertexAttDic:{[attType:number]:VertexAttribute};
//         eboarr:Uint16Array;
//         vboarr:Float32Array;
//         submeshinfo:subMeshInfo[];
//     }

//     export class LoadMesh implements IAssetLoader
//     {
//         load(url: string,state:AssetLoadInfo, onFinish: (asset:IAsset,state: AssetLoadInfo) => void,onProgress:(loadInfo:DownloadInfo)=>void=null): IAsset {
//             let name=AssetMgr.getFileName(url);            
//             let mesh:Mesh=new framework.Mesh(name);


//             webworker.inc.Load({type:"loadMeshData",url:url},(data)=>{
//                 if(data.iserror)
//                 {
//                     let errorMsg="ERROR:Load Mesh Error!\n  Info: LOAD URL: "+url+"  LOAD MSG:"+data.errorcontent;
//                     console.error(errorMsg);
//                     state.err=new Error(errorMsg);

//                 }else
//                 {
//                     LoadMesh.Parse(mesh,data);
//                     state.beSucces=true;
//                 }
//                 if(onFinish)
//                 {
//                     onFinish(mesh,state);
//                 }
//             });
//             return mesh;
//         }
//         static Parse(mesh:Mesh,data:loadMeshData,keepOrigeData=true)
//         {
//             let meshdata:MeshData = new MeshData();
//             meshdata.originVF=data.vertexFormate;
//             meshdata.eboArr=data.eboarr;
//             meshdata.vboArr=data.vboarr;
            
//             let info=data.submeshinfo;
//             for(let i=0;i<info.length;i++)
//             {
//                 let sub=new subMeshInfo();
//                 sub.start=info[i].start;
//                 sub.size=info[i].size;
//                 sub.matIndex=info[i].matIndex;
//                 mesh.submesh.push(sub);
//             }
//             /**
//              * 如果没有vertexattdic ，glmesh会默认按照pos、uv、color处理数据
//              */
//             meshdata.VertexAttDic=data.VertexAttDic;
//             mesh.originaldata=meshdata;

//             mesh.glMesh = new GlMesh(mesh.originaldata);
            
//             if(!keepOrigeData)
//             {
//                 //mesh.originaldata=null;
//                 return;
//             } 
//             //----------------------解析出pos、uv等数据
//             let vf=meshdata.originVF;
//             let vertexByteCount=MeshData.calcVertexByteSize(vf);
//             let vertex4ByteCount=vertexByteCount/4;
//             let vcount=meshdata.vboArr.byteLength/vertexByteCount;

//             let float32view=meshdata.vboArr;
//             let uint8view=new Uint8Array(float32view.buffer);

//             if(meshdata.VertexAttDic)
//             {
                
//             }
//             let offset=0;
//             if(vf&VertexAttTypeEnum.Position)
//             {
//                 meshdata.pos=[];
//                 for(let i=0;i<vcount;i++)
//                 {
//                     let positon=vec3.create(float32view[i*vertex4ByteCount+0],float32view[i*vertex4ByteCount+1],float32view[i*vertex4ByteCount+2]);
//                     meshdata.pos.push(positon);
//                 }
//                 offset+=3;
//             }
//             if(vf&VertexAttTypeEnum.UV0)
//             {
//                 meshdata.uv=[];
//                 for(let i=0;i<vcount;i++)
//                 {
//                     let uv=vec2.create(float32view[i*vertex4ByteCount+offset+0],float32view[i*vertex4ByteCount+offset+1]);
//                     meshdata.uv.push(uv);
//                 }
//                 offset+=2;                
//             }
//             if(vf&VertexAttTypeEnum.Color0)
//             {
//                 meshdata.color=[];
//                 for(let i=0;i<vcount;i++)
//                 {
//                     let color=color.create(uint8view[i*vertexByteCount+offset*4+0]/255,uint8view[i*vertexByteCount+offset*4+1]/255,uint8view[i*vertexByteCount+offset*4+2]/255,uint8view[i*vertexByteCount+offset*4+3]/255);
//                     meshdata.color.push(color);
//                 }
//                 offset+=1;
//             }
//             if(vf&VertexAttTypeEnum.BlendIndex4)
//             {
//                 meshdata.blendIndex=[];
//                 for(let i=0;i<vcount;i++)
//                 {
//                     let blend=vec4.create(float32view[i*vertex4ByteCount+offset+0],float32view[i*vertex4ByteCount+offset+1],float32view[i*vertex4ByteCount+offset+2],float32view[i*vertex4ByteCount+offset+3]);
//                     meshdata.blendIndex.push(blend);
//                 }
//                 offset+=4;                
//             }
//             if(vf&VertexAttTypeEnum.BlendWeight4)
//             {
//                 meshdata.blendWeight=[];
//                 for(let i=0;i<vcount;i++)
//                 {
//                     let weight=vec4.create(float32view[i*vertex4ByteCount+offset+0],float32view[i*vertex4ByteCount+offset+1],float32view[i*vertex4ByteCount+offset+2],float32view[i*vertex4ByteCount+offset+3]);
//                     meshdata.blendWeight.push(weight);
//                 }
//                 offset+=4;                
//             }
//             if(vf&VertexAttTypeEnum.Normal)
//             {
//                 meshdata.normal=[];
//                 for(let i=0;i<vcount;i++)
//                 {
//                     let normal=vec3.create(float32view[i*vertex4ByteCount+offset+0],float32view[i*vertex4ByteCount+offset+1],float32view[i*vertex4ByteCount+offset+2]);
//                     meshdata.normal.push(normal);
//                 }
//                 offset+=3;                                
//             }
//             if(vf&VertexAttTypeEnum.Tangent)
//             {
//                 meshdata.tangent=[];
//                 for(let i=0;i<vcount;i++)
//                 {
//                     let tangent=vec3.create(float32view[i*vertex4ByteCount+offset+0],float32view[i*vertex4ByteCount+offset+1],float32view[i*vertex4ByteCount+offset+2]);
//                     meshdata.tangent.push(tangent);
//                 }
//                 offset+=3;                                
//             }
//             if(vf&VertexAttTypeEnum.UV1)
//             {
//                 meshdata.uv1=[];
//                 for(let i=0;i<vcount;i++)
//                 {
//                     let uv1=vec2.create(float32view[i*vertex4ByteCount+offset+0],float32view[i*vertex4ByteCount+offset+1]);
//                     meshdata.uv1.push(uv1);
//                 }
//                 offset+=2;                                                
//             }
//         }
//     }
//     const _loadmesh=new LoadMesh();
//     AssetMgr.RegisterAssetLoader(".mesh.bin",()=>{return _loadmesh;});

// }