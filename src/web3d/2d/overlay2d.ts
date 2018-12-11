
// namespace web3d
// {
//     /**
//      * UI 缩放模式
//      */
//     export enum UIScaleMode{
//         /** 固定像素尺寸*/
//         CONSTANT_PIXEL_SIZE,
//         /**参考屏幕尺寸比例缩放*/
//         SCALE_WITH_SCREEN_SIZE
//     }
//     export interface IOverLay
//     {
//         start(camera: Camera);
//         render(context: RenderContext, assetmgr: AssetMgr, camera: Camera);
//         update(delta: number);
//     }
//     /**
//      * 2DUI的容器类，与canvasrender(3DUI)相对应。
//      */
//     export class Overlay2D implements IOverLay
//     {
//         constructor()
//         {
//             this.canvas = new canvas();
//         }
//         start()
//         {
//         }

//         canvas: canvas;

//         /**
//          * 是否自适应
//          */
//         autoAsp: boolean = true;

//         /**
//          * 屏幕宽高匹配模式 (range 0-1  =0:固定宽  =1:固定高)
//          */
//         screenMatchRate : number = 0;

//         /**
//          * 屏幕匹配参考宽度
//          */
//         matchReference_width = 800;

//         /**
//          * 屏幕匹配参考高度
//          */
//         matchReference_height =600;

//         /**
//          * 缩放模式
//          */
//         scaleMode : UIScaleMode = UIScaleMode.CONSTANT_PIXEL_SIZE;

//         /**
//         * 渲染排序
//         */
//         sortOrder: number = 0;

//         /**
//          * 添加2d子节点
//          */
//         addChild(node: Transform2D)
//         {
//             this.canvas.addChild(node);
//         }

//         /**
//          * 移除2d子节点
//          */
//         removeChild(node: Transform2D)
//         {
//             this.canvas.removeChild(node);
//         }

//         /**
//          * 获取所有的2d子节点
//          */
//         getChildren(): Transform2D[]
//         {
//             return this.canvas.getChildren();
//         }

//         /**
//          * 获取2d子节点的数量
//          */
//         getChildCount(): number
//         {
//             return this.canvas.getChildCount();
//         }

//         /**
//          * 获取2d子节点
//          */
//         getChild(index: number): Transform2D
//         {
//             return this.canvas.getChild(index);
//         }

//         /**
//          * @private
//          */
//         render(context: renderContext, assetmgr: assetMgr, camera: camera)
//         {
//             //if (!this.canvas.getRoot().visible || !this.camera) return;
//             // if (!(camera.CullingMask & this.renderLayer)) return;
            
//             // if (this.autoAsp)
//             // {
//             //     let vp = new gd3d.math.rect();
//             //     this.camera.calcViewPortPixel(assetmgr.app, vp);
//             //     let aspcam = vp.w / vp.h;
//             //     let aspc = this.canvas.pixelWidth / this.canvas.pixelHeight;
//             //     if (aspc != aspcam)
//             //     {
//             //         this.canvas.pixelWidth = this.canvas.pixelHeight * aspcam;
//             //         this.canvas.getRoot().markDirty();
//             //     }
//             // }

//             //let vp = new gd3d.math.rect();
//             //this.camera.calcViewPortPixel(assetmgr.app, vp);
//             switch (this.scaleMode){
//                 case UIScaleMode.CONSTANT_PIXEL_SIZE:
//                     if(this.canvas.pixelWidth == vp.w && this.canvas.pixelHeight == vp.h) break;
//                     this.canvas.pixelWidth = vp.w;
//                     this.canvas.pixelHeight = vp.h;
//                     this.canvas.getRoot().markDirty();
//                 break;
//                 case UIScaleMode.SCALE_WITH_SCREEN_SIZE:
//                     let match = this.screenMatchRate < 0 ? 0: this.screenMatchRate;
//                     match = match>1? 1:match;
//                     let asp = vp.w / vp.h;
//                     let w = math.numberLerp(this.matchReference_width,this.matchReference_height * asp,match);
//                     let h = math.numberLerp(this.matchReference_height,this.matchReference_width / asp, 1 - match );
//                     if (this.canvas.pixelWidth != w || this.canvas.pixelHeight != h)
//                     {
//                         this.canvas.pixelWidth = w;
//                         this.canvas.pixelHeight = h;
//                         this.canvas.getRoot().markDirty();
//                     }
//                 break;
//             }
//             context.updateOverlay();
//             this.canvas.render(context, assetmgr);
//         }

//         private viewPixelrect = new math.rect();
//         /**
//          * @private
//          */
//         update(delta: number)
//         {
//             this.camera.calcViewPortPixel(this.app, this.viewPixelrect);
//             let rect = this.camera.viewport;
//             let real_x = this.inputmgr.point.x - rect.x * this.app.width ;
//             let real_y = this.inputmgr.point.y - rect.y * this.app.height;
//             let sx = (real_x / this.viewPixelrect.w) * 2 - 1;
//             let sy = (real_y / this.viewPixelrect.h) * -2 + 1;
//             //用屏幕空间坐标系丢给canvas

//             //canvas de update 直接集成pointevent处理
//             this.canvas.update(delta, this.inputmgr.point.touch, sx, sy);
//         }
//         /**
//          * 事件检测
//          */
//         pick2d(mx: number, my: number, tolerance: number = 0): Transform2D
//         {
//             if (this.camera == null) return null;
//             var vp = new math.rect();
//             var app = this.camera.calcViewPortPixel(this.app, vp);
//             var sx = (mx / vp.w) * 2 - 1;
//             var sy = (my / vp.h) * -2 + 1;

//             var outv2 = math.pool.new_vector2();
//             outv2.x = sx;
//             outv2.y = sy;
//             var root = this.canvas.getRoot();
//             let trans = this.dopick2d(outv2, root, tolerance);
//             math.pool.delete_vector2(outv2);
//             return trans;
//         }
//         private dopick2d(ModelPos: math.vector2, tran: Transform2D, tolerance: number = 0): Transform2D
//         {
//             if (tran.components != null)
//             {
//                 for (var i = tran.components.length - 1; i >= 0; i--)
//                 {
//                     var comp = tran.components[i];
//                     if (comp != null)
//                         //if (comp.init && comp.comp.transform.ContainsCanvasPoint(outv,tolerance))
//                         if (comp.comp.transform.ContainsCanvasPoint(ModelPos, tolerance))
//                         {
//                             return comp.comp.transform;
//                         }
//                 }
//             }
//             if (tran.children != null)
//             {
//                 for (var i = tran.children.length - 1; i >= 0; i--)
//                 {
//                     var tran2 = this.dopick2d(ModelPos, tran.children[i], tolerance);
//                     if (tran2 != null) return tran2;
//                 }
//             }
//             return null;
//         }
//          /**
//          * 屏幕空间坐标 转到 canvas坐标
//          */
//         calScreenPosToCanvasPos(screenPos: gd3d.math.vector2, outCanvasPos: gd3d.math.vector2)
//         {
//             if(!this.camera || !this.canvas)    return;
//             var vp = new math.rect();
//             this.camera.calcViewPortPixel(this.app, vp);
//             var temt = gd3d.math.pool.new_vector2();
//             temt.x = (screenPos.x / vp.w) * 2 - 1;
//             temt.y = (screenPos.y / vp.h) * -2 + 1;

//             var mat: gd3d.math.matrix3x2 = gd3d.math.pool.new_matrix3x2();
//             gd3d.math.matrix3x2Clone(this.canvas.getRoot().getWorldMatrix(), mat);
//             gd3d.math.matrix3x2Inverse(mat, mat);
//             gd3d.math.matrix3x2TransformVector2(mat, temt, outCanvasPos);
//             gd3d.math.pool.delete_vector2(temt);
//             gd3d.math.pool.delete_matrix3x2(mat);
//         }
//     }

// }