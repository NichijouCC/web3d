// namespace web3d
// {
//     export class F14RefElementBatch implements F14Basebatch
//     {
//         type: F14TypeEnum;
//         effect: EffectSystem;
//         private element:RefElement;
//         public constructor(effect:EffectSystem,element:RefElement)
//         {
//             this.type = F14TypeEnum.RefType;
//             this.effect = effect;
//             this.element = element;
//         }
//         unRender()
//         {
//             //this.element.RefEffect.unRender();
//         }
//         getElementCount()
//         {
//             return this.element.RefEffect.getElementCount();
//         }
//         render(context: renderContext, assetmgr: assetMgr, camera: camera, Effqueue: number)
//         {
//             //this.element.RefEffect.render();
//             if (this.element.drawActive)
//             {
//                 this.element.RefEffect.render(context,assetmgr,camera,Effqueue);
//             }
//             else
//             {
//                 //this.element.RefEffect.unRender();
//             }
//         }
//         dispose()
//         {
//             this.effect=null;
//             this.element=null;
//         }
//     }
// }