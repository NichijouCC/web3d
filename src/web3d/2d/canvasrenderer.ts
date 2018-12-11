
//     /**
//      * 3DUI的容器类</p>
//      * 3d组件</p>
//      * 与overlay(2DUI)相对应。
//      */
//     @reflect.nodeRender
//     @reflect.nodeComponent
//     @reflect.nodeCanvasRendererCollider
//     export class canvasRenderer implements IRenderer, ICollider
//     {
//         /**
//          * @private
//          */
//         constructor()
//         {
//             this.canvas = new canvas();
//             this.canvas.is2dUI = false;
//         }

//         //renderLayer: CullingMask = CullingMask.default;
//         get renderLayer() {return this.gameObject.layer;}
//         set renderLayer(layer:number){
//             this.gameObject.layer = layer;
//         }

//         /**
//          * @private
//          */
//         subTran: transform;

//         /**
//          * @private
//          */
//         getBound()
//         {
//             return null;
//         }

//         /**
//          * @private
//          */
//         intersectsTransform(tran: transform): boolean
//         {
//             return false;
//         }
        
//         /**
//          * @public
//          * @language zh_CN
//          * @classdesc
//          * layer类型
//          * @version egret-gd3d 1.0
//          */
//         layer: RenderLayerEnum = RenderLayerEnum.Common;

//         /**
//          * @private
//          */
//         queue: number = 0;
        
//         gameObject: gameObject;
//         @gd3d.reflect.Field("canvas")
//         canvas: canvas;
//         inputmgr: inputMgr;
//         //绑定这个canvas 从哪个camera 响应事件
//         cameraTouch: camera;

//         /**
//          * @private
//          */
//         start()
//         {
//             this.canvas.scene = this.gameObject.getScene();
//             this.canvas.parentTrans=this.gameObject.transform;
//             this.inputmgr = this.gameObject.getScene().app.getInputMgr();
//         }

//         onPlay()
//         {

//         }
        
//         /**
//          * @public
//          * @language zh_CN
//          * @classdesc
//          * 添加2d子节点
//          * @version egret-gd3d 1.0
//          */
//         addChild(node: Transform2D)
//         {
//             this.canvas.addChild(node);
//         }

//         /**
//          * @public
//          * @language zh_CN
//          * @classdesc
//          * 移除2d子节点
//          * @version egret-gd3d 1.0
//          */
//         removeChild(node: Transform2D)
//         {
//             this.canvas.removeChild(node);
//         }

//         /**
//          * @public
//          * @language zh_CN
//          * @classdesc
//          * 获取所有2d子节点
//          * @version egret-gd3d 1.0
//          */
//         getChildren(): Transform2D[]
//         {
//             return this.canvas.getChildren();
//         }

//         /**
//          * @public
//          * @language zh_CN
//          * @classdesc
//          * 获取2d子节点的数量
//          * @version egret-gd3d 1.0
//          */
//         getChildCount(): number
//         {
//             return this.canvas.getChildCount();
//         }

//         /**
//          * @public
//          * @language zh_CN
//          * @classdesc
//          * 获取2d子节点
//          * @param index 索引
//          * @version egret-gd3d 1.0
//          */
//         getChild(index: number): Transform2D
//         {
//             return this.canvas.getChild(index);
//         }

//         /**
//          * @private
//          */
//         update(delta: number)
//         {
//             let asp = this.canvas.pixelWidth / this.canvas.pixelHeight;
//             this.gameObject.transform.localScale.x = this.gameObject.transform.localScale.y * asp;


//             if (this.cameraTouch != null)//需要用户代码 或者在编辑器里面绑定使用哪个camera（即设置此变量）,否则不会主动响应事件否则不会主动响应事件
//             {
//                 let scene = this.gameObject.getScene();
//                 let tempv2 = math.pool.new_vector2(this.inputmgr.point.x,this.inputmgr.point.y);
//                 let ray = this.cameraTouch.creatRayByScreen(tempv2, scene.app);
//                 let outModel = math.pool.new_vector2();
//                 let bool = this.pickModelPos(ray,outModel);
//                 if (bool)
//                 {
//                     this.canvas.update(delta, this.inputmgr.point.touch, outModel.x, outModel.y);
//                 }
//                 else
//                 {
//                     this.canvas.update(delta, false, 0, 0);
//                 }

//                 math.pool.delete_vector2(tempv2);
//                 math.pool.delete_vector2(outModel);
//             }
//             else
//             {
//                 this.canvas.update(delta, false, 0, 0);
//             }
//         }

//         /**
//          * @public
//          * @language zh_CN
//          * @classdesc
//          * 射线碰撞 获取 Model坐标点
//          * @param ray 射线
//          * @param outModel Pos out获取到的Model坐标
//          * @version egret-gd3d 1.0
//          */
//         pickModelPos(ray:gd3d.framework.ray,outModelPos:math.vector2):boolean{
//             let result = false;
//             if(!ray || !outModelPos) return result;
//             let scene = this.gameObject.getScene();
//             let tempInfo = math.pool.new_pickInfo();
//             let bool = ray.intersectPlaneTransform(this.gameObject.transform,tempInfo);
//             if (bool && tempInfo.pickedtran == this.gameObject.transform)//pick 到自己
//             {
//                 var mat = this.gameObject.transform.getWorldMatrix();
//                 var matinv = math.pool.new_matrix();
//                 math.matrixInverse(mat, matinv);
//                 var outv = math.pool.new_vector3();
//                 math.matrixTransformVector3(tempInfo.hitposition, matinv, outv);
//                 outModelPos.x = outv.x;
//                 outModelPos.y = outv.y;
//                 result = true;

//                 math.pool.delete_matrix(matinv);
//                 math.pool.delete_vector3(outv);
//             }
//             return result;
//         }

//         /**
//          * @public
//          * @language zh_CN
//          * @classdesc
//          * 射线拣选 全部 Transform2D
//          * @param ray 射线
//          * @version egret-gd3d 1.0
//          */
//         pickAll2d(ray:gd3d.framework.ray):Transform2D[]{
//             let result :Transform2D[];
//             let outv = math.pool.new_vector2();
//             let bool =  this.pickModelPos(ray,outv);
//             if (bool){
//                 result = [];
//                 this.dopick2d(outv, this.canvas.getRoot(),result,true);
//             }
            
//             math.pool.delete_vector2(outv);
//             return result;
//         }

//         /**
//          * @public
//          * @language zh_CN
//          * @classdesc
//          * 射线拣选Transform2D
//          * @param ray 射线
//          * @version egret-gd3d 1.0
//          */
//         pick2d(ray:gd3d.framework.ray):Transform2D
//         {
//             let result :Transform2D;
//             let outv = math.pool.new_vector2();
//             let bool =  this.pickModelPos(ray,outv);
//             if (bool){
//                 let temparr = []
//                 this.dopick2d(outv, this.canvas.getRoot(),temparr);
//                 if(temparr && temparr[0])
//                     result = temparr[0];
//             }

//             math.pool.delete_vector2(outv);
//             return result;
//         }

//         private cupTans2ds:Transform2D[] = [];
//         /**
//          * Model坐标来拣选Transform2D (从下至上递归)
//          */
//         private dopick2d(ModelPos:math.vector2, tran:Transform2D,outPicks:Transform2D[],isAll = false){
//             if(!ModelPos || !tran || !outPicks)   return;
//             if(tran.children && tran.children.length>0){
//                 for(var i = tran.children.length - 1;i >= 0 ;i--){
//                     this.dopick2d(ModelPos,tran.children[i],outPicks,isAll);
//                 }
//             }
            
//             if(tran.ContainsCanvasPoint(ModelPos)){
//                 outPicks.push(tran);
//                 if(!isAll)   
//                     return;
//             }
//         }

//         /**
//          * @public
//          * @language zh_CN
//          * @classdesc
//          * 屏幕空间坐标 转到 canvas坐标
//          * @version egret-gd3d 1.0
//          */
//         calScreenPosToCanvasPos(camera:framework.camera,screenPos: gd3d.math.vector2, outCanvasPos: gd3d.math.vector2)
//         {
//             if(!camera || !screenPos || !outCanvasPos) return;
//             let ray = camera.creatRayByScreen(screenPos,this.gameObject.getScene().app);
//             let ModelPos = gd3d.math.pool.new_vector2();
//             this.pickModelPos(ray,ModelPos);
//             this.canvas.ModelPosToCanvasPos(ModelPos,outCanvasPos);

//             gd3d.math.pool.delete_vector2(ModelPos);
//         }

//         /**
//          * @public
//          * @language zh_CN
//          * @classdesc
//          * canvas坐标 转到 世界空间坐标
//          * @param from Transform2D世界坐标
//          * @param out 返回结果v2
//          * @version egret-gd3d 1.0
//          */
//         calCanvasPosToWorldPos(from:math.vector2,out:math.vector3){
//             if(!this.canvas || !from || !out) return;
//             let ModelPos = math.pool.new_vector3();
//             ModelPos.x = (from.x / this.canvas.pixelWidth) * 2 - 1;
//             ModelPos.y = (from.y / this.canvas.pixelHeight) * -2 + 1;
//             let m_mtx = this.gameObject.transform.getWorldMatrix();
//             math.matrixTransformVector3(ModelPos,m_mtx,out);
//             out.z = this.gameObject.transform.getWorldTranslate().z;
//             gd3d.math.pool.delete_vector3(ModelPos);
//         }

//         /**
//          * @private
//          */
//         render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera)
//         {
//            // if (!(camera.CullingMask & this.renderLayer)) return;
//             context.updateModel(this.gameObject.transform);
//             this.canvas.render(context, assetmgr);
//         }

//         /**
//          * @private
//          */
//         remove()
//         {

//         }
//         /**
//          * @private
//          */
//         clone()
//         {
            
//         }
//     }
// }