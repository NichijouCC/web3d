// namespace web3d
// {
//     /**
//      * 2d批处理类
//      */
//     export class batcher2D
//     {
//         private mesh: render.glMesh;
//         private drawMode: render.DrawModeEnum;
//         private vboCount: number = 0;
//         private curPass: render.glDrawPass;

//         private eboCount: number = 0;
//         private dataForVbo: Float32Array;
//         private dataForEbo: Uint16Array;

//         /**
//          * @private
//          */
//         initBuffer(webgl: WebGLRenderingContext, vf: render.VertexFormatMask, drawMode: render.DrawModeEnum)
//         {
//             this.mesh = new render.glMesh();
//             this.mesh.initBuffer(webgl, vf, 128, render.MeshTypeEnum.Dynamic);
//             this.dataForVbo = new Float32Array(128);
//             this.drawMode = drawMode;
//             if (drawMode == render.DrawModeEnum.EboLine || drawMode == render.DrawModeEnum.EboTri)
//             {
//                 this.mesh.addIndex(webgl, 128);
//                 this.dataForEbo = new Uint16Array(128);
//             }
//         }

//         /**
//          * @private
//          */
//         begin(webgl: WebGLRenderingContext, pass: render.glDrawPass)
//         {
//             if (this.vboCount > 0)
//                 this.end(webgl);
//             this.curPass = pass;
//         }

//         /**
//          * @private
//          */
//         push(webgl: WebGLRenderingContext, vbodata: number[], ebodata: number[])
//         {
//             if (this.vboCount + vbodata.length > 2048
//                 ||
//                 (ebodata != null && this.eboCount + ebodata.length > 2048))
//             {
//                 this.end(webgl);
//             }

//             if (this.vboCount + vbodata.length > this.dataForVbo.length)
//             {
//                 let narr = new Float32Array(this.dataForVbo.length * 2);
//                 for (var i = 0; i < this.dataForVbo.length; i++)
//                 {
//                     narr[i] = this.dataForVbo[i];
//                 }
//                 this.dataForVbo = narr;
//                 this.mesh.resetVboSize(webgl, this.dataForVbo.length);
//             }
//             for (var i = 0; i < vbodata.length; i++)
//             {
//                 this.dataForVbo[this.vboCount + i] = vbodata[i];
//             }
//             this.vboCount += vbodata.length;

//             if (this.drawMode == render.DrawModeEnum.VboLine || this.drawMode == render.DrawModeEnum.VboTri)
//                 return;

//             if (ebodata != null)
//             {
//                 if (this.eboCount + ebodata.length > this.dataForEbo.length)
//                 {
//                     let narr = new Uint16Array(this.dataForEbo.length * 2);
//                     for (var i = 0; i < this.dataForEbo.length; i++)
//                     {
//                         narr[i] = this.dataForEbo[i];
//                     }
//                     this.dataForEbo = narr;
//                     this.mesh.resetEboSize(webgl, 0, this.dataForEbo.length);
//                 }
//                 for (var i = 0; i < ebodata.length; i++)
//                 {
//                     this.dataForEbo[this.eboCount + i] = ebodata[i];
//                 }
//                 this.eboCount += ebodata.length;
//             }
//         }

//         /**
//          * @private
//          */
//         end(webgl: WebGLRenderingContext)
//         {
//             if (this.vboCount == 0) return;
//             this.mesh.uploadVertexData(webgl, this.dataForVbo);
//             if (this.eboCount > 0){
//                 this.mesh.uploadIndexData(webgl, 0, this.dataForEbo);
//             }

//             var vertexcount = (this.vboCount / (this.mesh.vertexByteSize / 4)) | 0;
//             this.curPass.use(webgl);
//             this.mesh.bind(webgl, this.curPass.program, (this.drawMode == render.DrawModeEnum.EboLine || this.drawMode == render.DrawModeEnum.EboTri) ? 0 : -1);
//             if (this.drawMode == render.DrawModeEnum.EboLine)
//             {
//                 this.mesh.drawElementLines(webgl, 0, this.eboCount);
//             }
//             else if (this.drawMode == render.DrawModeEnum.EboTri)
//             {
//                 this.mesh.drawElementTris(webgl, 0, this.eboCount);
//             }
//             else if (this.drawMode == render.DrawModeEnum.VboLine)
//             {
//                 this.mesh.drawArrayLines(webgl, 0, vertexcount);
//             }
//             else if (this.drawMode == render.DrawModeEnum.VboTri)
//             {
//                 this.mesh.drawArrayTris(webgl, 0, vertexcount);
//             }
//             this.vboCount = 0;
//             this.eboCount = 0;
//         }
//     }
// }