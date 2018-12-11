// namespace web3d
// {
//     export class RefElement implements LayerElement
//     {

//         type: F14TypeEnum;
//         layer: EffectLayer;
//         drawActive: boolean;
//         public baseddata: F14RefBaseData;
//         //-----------------life from to---------------------
//         public startFrame: number;
//         public endFrame: number;

//         public effect: EffectSystem;
//         public constructor(effect: EffectSystem, layer: EffectLayer)
//         {

//             this.type = F14TypeEnum.RefType;
//             this.effect = effect;
//             this.baseddata = layer.baseData as F14RefBaseData;
//             this.layer = layer;
//             let f14Dat: f14eff = (sceneMgr.app.getAssetMgr().getAssetByName(this.baseddata.refdataName) as f14eff);
//             if (!f14Dat)
//                 return;
//             this.refreshStartEndFrame();

//             this.RefEffect = new EffectSystem();
//             this.RefEffect._root = new transform();
//             this.RefEffect.enableDraw = true;
//             this.RefEffect.gameObject = this.RefEffect._root.gameObject;
//             //this.RefEffect.root.parent=this.effect.gameObject.transform;
//             let data = layer.data.elementdata as F14RefBaseData;
//             MathD.vec3.copy(data.localPos, this.RefEffect._root.localTranslate);
//             MathD.vec3.copy(data.localScale, this.RefEffect._root.localScale);
//             MathD.quat.FromEuler(data.localEuler.x, data.localEuler.y, data.localEuler.z, this.RefEffect._root.localRotate);
//             this.RefEffect._root.markDirty();

//             this.RefEffect.beref = true;
//             this.baseddata.refData = f14Dat.data;
//             this.RefEffect.setData(this.baseddata.refData);
//             //this.RefEffect.batchRoot = effect.player.transform;
//         }
//         public RefEffect: EffectSystem;

//         //---------------------------------------reset-----------------------------------------------
//         public reset()
//         {
//             this.RefEffect.reset();
//         }
//         //------------------------------------update----------------------------------------------
//         private refreshStartEndFrame()
//         {
//             if (this.layer.frameList.length == 0)
//             {
//                 this.startFrame = 0;
//             }
//             else
//             {
//                 this.startFrame = this.layer.frameList[0];
//             }
//             if (this.layer.frameList.length > 1)
//             {
//                 this.endFrame = this.layer.frameList[this.layer.frameList.length - 1];
//             }
//             else
//             {
//                 this.endFrame = this.effect.data.lifeTime;
//             }
//         }
//         update(deltaTime: number, frame: number, fps: number)
//         {
//             if (this.RefEffect && this.RefEffect._root.parent == null)
//             {
//                 this.effect.gameObject.transform.addChild(this.RefEffect._root);
//                 //this.RefEffect._root.parent=this.effect.gameObject.transform;
//                 this.RefEffect._root.markDirty();
//                 this.RefEffect._root.updateWorldTran();
//             }

//             if (this.layer.frameList.length == 0)
//             {
//                 this.drawActive = false;
//                 return;
//             }
//             if (this.effect.data.beloop)
//             {
//                 frame = this.effect.onceFrame;
//             }
//             if (frame < this.startFrame || frame > this.endFrame)
//             {
//                 this.drawActive = false;
//                 this.RefEffect["playState"] = PlayStateEnum.beReady;
//                 return;
//             }
//             else
//             {
//                 this.drawActive = true;
//                 //this.RefEffect["playState"]=PlayStateEnum.play;
//                 this.RefEffect.enabletimeFlow = true;
//             }
//             this.RefEffect.update(deltaTime);
//         }

//         OnEndOnceLoop()
//         {

//         }

//         dispose()
//         {
//             this.baseddata = null;
//             this.RefEffect.remove();
//             this.RefEffect = null;
//         }
//     }
// }