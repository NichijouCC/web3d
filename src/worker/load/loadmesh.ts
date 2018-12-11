
// ///<reference path="../../fundament/core/vertexmask.ts" />
// namespace web3d.io
// {
//     export function calcVertexSize(vf:VertexAttTypeEnum):number
//     {
//         let total=0;
//         if (vf & VertexAttTypeEnum.Position) total += 3;
//         if (vf & VertexAttTypeEnum.UV0) total += 2;
//         if (vf & VertexAttTypeEnum.Color0) total += 4;
//         if (vf & VertexAttTypeEnum.BlendIndex4) total += 4;
//         if (vf & VertexAttTypeEnum.BlendWeight4) total += 4;
//         if (vf & VertexAttTypeEnum.Normal) total += 3;
//         if (vf & VertexAttTypeEnum.Tangent) total += 3;
//         if (vf & VertexAttTypeEnum.UV1) total += 2;
//         if (vf & VertexAttTypeEnum.Color1) total += 4;

//         return total;
//     }

//     export function calcVertexByteSize(vf: VertexAttTypeEnum):number
//     {
//         let total=0;
//         if (vf & VertexAttTypeEnum.Position) total += 12;
//         if (vf & VertexAttTypeEnum.UV0) total += 8;
//         if (vf & VertexAttTypeEnum.Color0) total += 4;
//         if (vf & VertexAttTypeEnum.Normal) total += 12;
//         if (vf & VertexAttTypeEnum.Tangent) total += 12;
//         if (vf & VertexAttTypeEnum.BlendIndex4) total += 16;
//         if (vf & VertexAttTypeEnum.BlendWeight4) total += 16;
//         if (vf & VertexAttTypeEnum.UV1) total += 8;
//         if (vf & VertexAttTypeEnum.Color1) total += 4;

//         return total;
//     }

//     export function loadMeshData(buffer:ArrayBuffer):any
//     {
//         let read: web3d.io.binReader = new web3d.io.binReader(buffer);
//         let namelen=read.readInt();
//         let meshName=read.readStringUtf8FixLength(namelen);
//         let vcount = read.readInt();
//         let vf:number=0;
//         let pos,uv0,color0,normal,uv1,tangent,blendIndex4,blendWeight4;

//         while (true)
//         {
//             let tag = read.readInt();
//             if (tag == 255) break;
//             if (tag == 1)//pos
//             {
//                 vf = vf | VertexAttTypeEnum.Position;
//                 pos=new Float32Array(vcount*3);
//                 for (let i = 0; i < vcount; i++)
//                 {
//                     pos[i*3+0]=read.readSingle();
//                     pos[i*3+1]=read.readSingle();
//                     pos[i*3+2]=read.readSingle();
//                 }
//             }
//             else if (tag == 2)//color
//             {
//                 vf = vf | VertexAttTypeEnum.Color0;
//                 color0=new Uint8Array(vcount*4);
//                 for (let i = 0; i < vcount; i++)
//                 {
//                     color0[i*4+0]=read.readUInt8();
//                     color0[i*4+1]=read.readUInt8();
//                     color0[i*4+2]=read.readUInt8();
//                     color0[i*4+3]=read.readUInt8();
//                 }
//             }
//             else if (tag == 3)//normal
//             {
//                 vf = vf | VertexAttTypeEnum.Normal;
//                 normal=new Float32Array(vcount*3);
//                 for (let i = 0; i < vcount; i++)
//                 {
//                     normal[i*3+0]=read.readSingle();
//                     normal[i*3+1]=read.readSingle();
//                     normal[i*3+2]=read.readSingle();
//                 }
//             }
//             else if (tag == 4)//uv0
//             {
//                 vf = vf | VertexAttTypeEnum.UV0;
//                 uv0=new Float32Array(vcount*2);
//                 for (let i = 0; i < vcount; i++)
//                 {
//                     uv0[i*2+0]=read.readSingle();
//                     uv0[i*2+1]=read.readSingle();
//                 }
//             }
//             else if (tag == 5)//uv2//lightmap
//             {
//                 vf = vf | VertexAttTypeEnum.UV1;
//                 uv1=new Float32Array(vcount*2);
//                 for (let i = 0; i < vcount; i++)
//                 {
//                     uv1[i*2+0]=read.readSingle();
//                     uv1[i*2+1]=read.readSingle();
//                 }
//             }
//             // else if (tag == 6)//uv2
//             // {
//             //     for (let i = 0; i < vcount; i++)
//             //     {
//             //         //meshdata.vec2uvs2[i * 2 + 0] =
//             //         read.readSingle();//u
//             //         //meshdata.vec2uvs2[i * 2 + 1] =
//             //         1 - read.readSingle();//v

//             //     }
//             // }
//             else if (tag == 7)//tangent
//             {
//                 vf = vf | VertexAttTypeEnum.Tangent;
//                 tangent=new Float32Array(vcount*3);
//                 for (let i = 0; i < vcount; i++)
//                 {
//                     let x = read.readSingle();
//                     let y = read.readSingle();
//                     let z = read.readSingle();
//                     let w = read.readSingle();
//                     tangent[i*3+0]=x / w;
//                     tangent[i*3+1]=y / w;
//                     tangent[i*3+2]=z / w;
//                 }
//             }
//             // else if (tag == 8)//uv3
//             // {
//             //     for (let i = 0; i < vcount; i++)
//             //     {
//             //         //meshdata.vec2uvs2[i * 2 + 0] =
//             //         read.readSingle();//u
//             //         //meshdata.vec2uvs2[i * 2 + 1] =
//             //         1 - read.readSingle();//v

//             //     }
//             // }
//             else if (tag == 17)//skinwidget;
//             {
//                 vf = vf | VertexAttTypeEnum.BlendIndex4;
//                 vf = vf | VertexAttTypeEnum.BlendWeight4;
//                 blendIndex4=new Float32Array(vcount*4);
//                 blendWeight4=new Float32Array(vcount*4);
                
//                 for (let i = 0; i < vcount; i++)
//                 {
//                     blendIndex4[i*4+0]=read.readUInt32();
//                     blendIndex4[i*4+1]=read.readUInt32();
//                     blendIndex4[i*4+2]=read.readUInt32();
//                     blendIndex4[i*4+3]=read.readUInt32();

//                     blendWeight4[i*4+0]=read.readSingle();
//                     blendWeight4[i*4+1]=read.readSingle();
//                     blendWeight4[i*4+2]=read.readSingle();
//                     blendWeight4[i*4+3]=read.readSingle();
//                 }
//             }
//             else
//             {
//                 throw "notwrite" + tag;
//             }
//         }

//         let subcount = read.readInt();
//         let trisindex = [];
//         let submesh = [];
//         for (let i = 0; i < subcount; i++)
//         {
//             let tv = read.readInt();//代表之前submesh中的drawstyle
//             let sublen = read.readInt();
//             submesh.push({start:trisindex.length,size:sublen,matIndex:i});
//             for (let j = 0; j < sublen; j++)
//             {
//                 let index = read.readInt();
//                 trisindex.push(index);
//             }
//         }
//         //------------------------整合一起发送----------------------------------------
//         let vertexByteSize=calcVertexByteSize(vf);
//         let vertex4byteSize=vertexByteSize/4;
//         let VboData=new ArrayBuffer(vertexByteSize*vcount);//
//         let float32View = new Float32Array(VboData);
//         let uint8View = new Uint8Array(VboData);

//         let offset=0;
//         if(vf&VertexAttTypeEnum.Position)
//         {
//             for(let i=0;i<vcount;i++)
//             {
//                 float32View[i*vertex4byteSize+0]=pos[i*3+0];
//                 float32View[i*vertex4byteSize+1]=pos[i*3+1];
//                 float32View[i*vertex4byteSize+2]=pos[i*3+2];
//             }
//             offset+=3;
//         }
//         if(vf&VertexAttTypeEnum.UV0)
//         {
//             for(let i=0;i<vcount;i++)
//             {
//                 float32View[i*vertex4byteSize+offset+0]=uv0[i*2+0];
//                 float32View[i*vertex4byteSize+offset+1]=uv0[i*2+1];
//             }          
//             offset+=2;
//         }
//         if(vf&VertexAttTypeEnum.Color0)
//         {
//             for(let i=0;i<vcount;i++)
//             {
//                 uint8View[i*vertexByteSize+offset*4+0]=color0[i*4+0];
//                 uint8View[i*vertexByteSize+offset*4+1]=color0[i*4+1];
//                 uint8View[i*vertexByteSize+offset*4+2]=color0[i*4+2];
//                 uint8View[i*vertexByteSize+offset*4+3]=color0[i*4+3];
//             }
//             offset+=1;
//         }
//         if(vf&VertexAttTypeEnum.BlendIndex4)
//         {
//             for(let i=0;i<vcount;i++)
//             {
//                 float32View[i*vertex4byteSize+offset+0]=blendIndex4[i*4+0];
//                 float32View[i*vertex4byteSize+offset+1]=blendIndex4[i*4+1];
//                 float32View[i*vertex4byteSize+offset+2]=blendIndex4[i*4+2];
//                 float32View[i*vertex4byteSize+offset+3]=blendIndex4[i*4+3];
//             }
//             offset+=4;
//         }
//         if(vf&VertexAttTypeEnum.BlendWeight4)
//         {
//             for(let i=0;i<vcount;i++)
//             {
//                 float32View[i*vertex4byteSize+offset+0]=blendWeight4[i*4+0];
//                 float32View[i*vertex4byteSize+offset+1]=blendWeight4[i*4+1];
//                 float32View[i*vertex4byteSize+offset+2]=blendWeight4[i*4+2];
//                 float32View[i*vertex4byteSize+offset+3]=blendWeight4[i*4+3];
//             }
//             offset+=4;
//         }
//         if(vf&VertexAttTypeEnum.Normal)
//         {
//             for(let i=0;i<vcount;i++)
//             {
//                 float32View[i*vertex4byteSize+offset+0]=normal[i*3+0];
//                 float32View[i*vertex4byteSize+offset+1]=normal[i*3+1];
//                 float32View[i*vertex4byteSize+offset+2]=normal[i*3+2];
//             }
//             offset+=3;
//         }
//         if(vf&VertexAttTypeEnum.Tangent)
//         {
//             for(let i=0;i<vcount;i++)
//             {
//                 float32View[i*vertex4byteSize+offset+0]=tangent[i*3+0];
//                 float32View[i*vertex4byteSize+offset+1]=tangent[i*3+1];
//                 float32View[i*vertex4byteSize+offset+2]=tangent[i*3+2];
//             }
//             offset+=3;
//         }
//         if(vf&VertexAttTypeEnum.UV1)
//         {
//             for(let i=0;i<vcount;i++)
//             {
//                 float32View[i*vertex4byteSize+offset+0]=uv1[i*2+0];
//                 float32View[i*vertex4byteSize+offset+1]=uv1[i*2+1];
//             }
//             offset+=2;
//         }
//         pos=uv0=color0=normal=uv1=tangent=blendIndex4=blendWeight4=null;//清空

//         let indexArr=new Uint16Array(trisindex.length);
//         for(let i=0;i<trisindex.length;i++)
//         {
//             indexArr[i]=trisindex[i];
//         }
//         trisindex.length=0;//清空
//         trisindex=null;


//         return {
//             name:meshName,
//             vertexFormate:vf,
//             submeshinfo:submesh,
//             vboarr:float32View,
//             eboarr:indexArr
//         }
//     }
// }


// //---------------------------顶点数据不存-------------------------------------------
//         // let read=new web3d.io.binReader(buffer);
//         // let meshname=read.readStringAnsi();
//         // read.position=read.position+24;

//         // let vcount=read.readUInt32();
//         // let vertexformat=read.readDouble();//目前没有
//         // let vertexByteSize=calcVertexByteSize(vertexformat);
//         // let byte4Size=vertexByteSize/4;

//         // let meshdata=new ArrayBuffer(vertexByteSize*vcount);//
//         // let float32View = new Float32Array(meshdata);
//         // let uint8View = new Uint8Array(meshdata);

//         // let vertexInfo=[];
//         // let byte4Offeset=0;//4字节
//         // if (vertexformat& VertexFormatMask.Position)
//         // {
//         //     let tag = read.readUInt32();
//         //     if(tag!=VertexFormatMask.Position)
//         //     {
//         //         console.log("worker loadmesh error! tag: position!");
//         //     }

//         //     for (let i = 0; i < vcount; i++)
//         //     {
//         //         float32View[i*byte4Size+0]=read.readSingle();
//         //         float32View[i*byte4Size+1]=read.readSingle();
//         //         float32View[i*byte4Size+2]=read.readSingle();      
//         //     }
//         //     vertexInfo.push({type:VertexFormatMask.Position,stride:vertexByteSize,offset:0});
//         //     byte4Offeset+=3;
//         // }
//         // if(vertexformat&VertexFormatMask.UV0)
//         // {
//         //     let tag = read.readUInt32();
//         //     if(tag!=VertexFormatMask.UV0)
//         //     {
//         //         console.log("worker loadmesh error! tag: uv0!");
//         //     }
//         //     for (let i = 0; i < vcount; i++)
//         //     {
//         //         float32View[i*byte4Size+byte4Offeset+0]=read.readSingle();
//         //         float32View[i*byte4Size+byte4Offeset+1]=read.readSingle();
//         //     }
//         //     vertexInfo.push({type:VertexFormatMask.UV0,stride:vertexByteSize,offset:0});
//         //     byte4Offeset+=2;            
//         // }
//         // if(vertexformat&VertexFormatMask.Color0)
//         // {
//         //     let tag = read.readUInt32();
//         //     if(tag!=VertexFormatMask.Color0)
//         //     {
//         //         console.log("worker loadmesh error! tag: color0!");
//         //     }
//         //     for (let i = 0; i < vcount; i++)
//         //     {
//         //         uint8View[i*vertexByteSize+byte4Offeset*4+0]=read.readUInt8();
//         //         uint8View[i*vertexByteSize+byte4Offeset*4+1]=read.readUInt8();
//         //         uint8View[i*vertexByteSize+byte4Offeset*4+2]=read.readUInt8();
//         //         uint8View[i*vertexByteSize+byte4Offeset*4+3]=read.readUInt8();
//         //     }
//         //     byte4Offeset+=1; 
//         // }
//         // if(vertexformat&VertexFormatMask.BlendIndex4)
//         // {
//         //     let tag = read.readUInt32();
//         //     if(tag!=VertexFormatMask.BlendIndex4)
//         //     {
//         //         console.log("worker loadmesh error! tag: blendindex!");
//         //     }
//         //     for (let i = 0; i < vcount; i++)
//         //     {
//         //         float32View[i*byte4Size+byte4Offeset+0]=read.readSingle();
//         //         float32View[i*byte4Size+byte4Offeset+1]=read.readSingle();
//         //         float32View[i*byte4Size+byte4Offeset+2]=read.readSingle();
//         //         float32View[i*byte4Size+byte4Offeset+3]=read.readSingle();
//         //     }
//         //     byte4Offeset+=4;             
//         // }
//         // if(vertexformat&VertexFormatMask.BlendWeight4)
//         // {
//         //     let tag = read.readUInt32();
//         //     if(tag!=VertexFormatMask.BlendWeight4)
//         //     {
//         //         console.log("worker loadmesh error! tag: blendweight!");
//         //     }
//         //     for (let i = 0; i < vcount; i++)
//         //     {
//         //         float32View[i*byte4Size+byte4Offeset+0]=read.readSingle();
//         //         float32View[i*byte4Size+byte4Offeset+1]=read.readSingle();
//         //         float32View[i*byte4Size+byte4Offeset+2]=read.readSingle();
//         //         float32View[i*byte4Size+byte4Offeset+3]=read.readSingle();
//         //     }
//         //     byte4Offeset+=4;                         
//         // }
//         // if(vertexformat&VertexFormatMask.Normal)
//         // {
//         //     let tag = read.readUInt32();
//         //     if(tag!=VertexFormatMask.Normal)
//         //     {
//         //         console.log("worker loadmesh error! tag: normal!");
//         //     }
//         //     for (let i = 0; i < vcount; i++)
//         //     {
//         //         float32View[i*byte4Size+byte4Offeset+0]=read.readSingle();
//         //         float32View[i*byte4Size+byte4Offeset+1]=read.readSingle();
//         //         float32View[i*byte4Size+byte4Offeset+2]=read.readSingle();
//         //     }
//         //     byte4Offeset+=3;  
//         // }
//         // if(vertexformat&VertexFormatMask.Tangent)
//         // {
//         //     let tag = read.readUInt32();
//         //     if(tag!=VertexFormatMask.Tangent)
//         //     {
//         //         console.log("worker loadmesh error! tag: Tangent!");
//         //     }
//         //     for (let i = 0; i < vcount; i++)
//         //     {
//         //         float32View[i*byte4Size+byte4Offeset+0]=read.readSingle();
//         //         float32View[i*byte4Size+byte4Offeset+1]=read.readSingle();
//         //         float32View[i*byte4Size+byte4Offeset+2]=read.readSingle();
//         //     }
//         //     byte4Offeset+=3;  
//         // }
//         // if(vertexformat&VertexFormatMask.UV1)
//         // {
//         //     let tag = read.readUInt32();
//         //     if(tag!=VertexFormatMask.UV1)
//         //     {
//         //         console.log("worker loadmesh error! tag: UV1!");
//         //     }
//         //     for (let i = 0; i < vcount; i++)
//         //     {
//         //         float32View[i*byte4Size+byte4Offeset+0]=read.readSingle();
//         //         float32View[i*byte4Size+byte4Offeset+1]=read.readSingle();
//         //     }
//         //     byte4Offeset+=2;  
//         // }
//         // if(vertexformat&VertexFormatMask.Color1)
//         // {
//         //     let tag = read.readUInt32();
//         //     if(tag!=VertexFormatMask.Color1)
//         //     {
//         //         console.log("worker loadmesh error! tag: Color1!");
//         //     }
//         //     for (let i = 0; i < vcount; i++)
//         //     {
//         //         float32View[i*vertexByteSize+byte4Offeset*4+0]=read.readUInt8();
//         //         float32View[i*vertexByteSize+byte4Offeset*4+1]=read.readUInt8();
//         //         float32View[i*vertexByteSize+byte4Offeset*4+2]=read.readUInt8();
//         //         float32View[i*vertexByteSize+byte4Offeset*4+3]=read.readUInt8();
//         //     }
//         //     byte4Offeset+=1;  
//         // }

//         // //-----------------submesh-------------------------
//         // let indexCount=read.readUInt32();//索引数量
//         // let trisindex=new Uint32Array(indexCount);
//         // for(let i=0;i<indexCount;i++)
//         // {
//         //     trisindex[i]=read.readUInt32();
//         // }
//         // //-------------------索引-----------------------
//         // let submesh=[];
//         // let subcount = read.readUInt8();
//         // for (let i = 0; i < subcount; i++)
//         // {
//         //     let _start =read.readUInt32();
//         //     let _size = read.readUInt32();
            
//         //     let _submeshinfo={
//         //         start:_start,
//         //         size:_size,
//         //         matindex:i
//         //     };
//         //     submesh.push(_submeshinfo);
//         // }