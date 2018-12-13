// namespace web3d
// {
//     export class RenderList
//     {
//         // items:IRenderItem[]=[];KC
//         items:{[layer:number]:{[queue:number]:IRenderItem[]}}={};
//         sortFunc:{[layer:number]:(a:IRenderItem,b:IRenderItem)=>number}={};
//         private deafultSortFunc:(a:IRenderItem,b:IRenderItem)=>number;
//         constructor()
//         {
//             this.setLayerSortFunc(RenderLayerEnum.Transparent,(a:IRenderItem,b:IRenderItem)=>{

//                 if(a.mat.queue!=b.mat.queue)
//                 {
//                     return b.mat.queue-a.mat.queue;
//                 }else
//                 {
//                     let matrixView = renderContext.matrixView;
                
//                     let ax = a.matrix[12],ay = a.matrix[13],az = a.matrix[14];
//                     let aw = matrixView[3] * ax + matrixView[7] * ay + matrixView[11] * az + matrixView[15];
//                     let aviewz = (matrixView[2] * ax + matrixView[6] * ay + matrixView[10] * az + matrixView[14]) / aw;
    
//                     let bx = b.matrix[12],by = b.matrix[13],bz = b.matrix[14];
//                     let bw = matrixView[3] * bx + matrixView[7] * by + matrixView[11] * bz + matrixView[15];
//                     let bviewz = (matrixView[2] * bx + matrixView[6] * by + matrixView[10] * bz + matrixView[14]) / bw;
    
//                     let out=bviewz- aviewz;
//                     return out;
//                 }
//             });

//             this.deafultSortFunc=(a:IRenderItem,b:IRenderItem)=>{
//                 if(a.mat.queue!=b.mat.queue)
//                 {
//                     return b.mat.queue-a.mat.queue;
//                 }
//                 else if(b.mat.getShader().guid!=a.mat.getShader().guid)
//                 {
//                     return b.mat.getShader().guid-a.mat.getShader().guid;
//                 }
//             }
//         }

//         clear()
//         {
//             this.items=[];
//         }
//         addRenderItem(item:IRenderItem)
//         {
//             if(this.items[item.mat.layer]==null)
//             {
//                 this.items[item.mat.layer]=[];
//             }
//             if(this.items[item.mat.layer][item.mat.queue]==null)
//             {
//                 this.items[item.mat.layer][item.mat.queue]=[];
//             }
//             this.items[item.mat.layer][item.mat.queue].push(item);
//         }

//         setLayerSortFunc(layer:RenderLayerEnum,sortfunc:(a:IRenderItem,b:IRenderItem)=>number)
//         {
//             this.sortFunc[layer]=sortfunc;
//         }

//         sort()
//         {
//             for(let key in this.items)
//             {
//                 let layerArr=this.items[key]
//                 for(let k in layerArr)
//                 {
//                     if(this.sortFunc[key]!=null)
//                     {
//                         layerArr[k].sort((a,b)=>{
//                             return this.sortFunc[key](a,b);
//                         });
//                     }else
//                     {
//                         layerArr[k].sort((a,b)=>{
//                             return this.deafultSortFunc(a,b);
//                         });
//                     }
//                 }
//             }
//         }

//         foreachAllLayer(fuc:(item:IRenderItem)=>void)
//         {
//             this.foreachLayer(RenderLayerEnum.Background,fuc);
//             this.foreachLayer(RenderLayerEnum.Geometry,fuc);
//             this.foreachLayer(RenderLayerEnum.AlphaTest,fuc);
//             this.foreachLayer(RenderLayerEnum.Transparent,fuc);
//             this.foreachLayer(RenderLayerEnum.Overlay,fuc);
//         }

//         foreachLayer(layer:RenderLayerEnum,fuc:(item:IRenderItem)=>void)
//         {
//             let layerarr=this.items[RenderLayerEnum.Background];
//             for(let key in layerarr)
//             {
//                 layerarr[key].forEach((item)=>{
//                     fuc(item);
//                 });
//             }
//         }

//     }
// }