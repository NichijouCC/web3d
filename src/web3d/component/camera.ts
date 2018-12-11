namespace web3d
{
    export enum ProjectionEnum
    {
        perspective,
        orthograph
    }
    
    
    @NodeComponent
    export class Camera implements INodeComponent
    {
        static readonly type:string="Camera";
    
        static Current:Camera;
        static Main:Camera;
        constructor()
        {
            if(Camera.Main==null)
            {
                Camera.Main=this;
            }
        }
        gameObject: GameObject;
        private _near: number = 0.01;
        get near(): number
        {
            return this._near;
        }
        set near(val: number)
        {
            if(this.projectionType==ProjectionEnum.perspective&&val<0.01)
            {
                val=0.01;
            }
            if (val >= this.far) val = this.far - 0.01;
            this._near = val;
        }
        private _far: number = 1000;
        get far(): number
        {
            return this._far;
        }
        set far(val: number)
        {
            if (val <= this.near) val = this.near + 0.01;
            this._far = val;
        }
        private _beMainCamera: boolean = false;
        get beMainCamera(): boolean
        {
            return this._beMainCamera;
        }
        set beMainCamera(value:boolean)
        {
            this._beMainCamera=value;
            if(value==true)
            {
                Camera.Main=this;
            }
        }
    
        order: number = 0;//camera 渲染顺序
    
        clearOption_Color: boolean = true;
        clearOption_Depth: boolean = false;
        clearOption_Stencil: boolean = false;
        backgroundColor: MathD.color= MathD.color.create(0.3, 0.3, 0.3, 1);
        dePthValue:number=1.0;
        stencilValue:number=0;


        // clearType:webGraph.ClearType=webGraph.ClearType.ColorAndDepth;
    
        cullingMask: CullingMask = CullingMask.default | CullingMask.ui;
        viewport: MathD.Rect=MathD.Rect.create(0,0,1,1);
        // private viewPortPixel=MathD.Rect.create();
        // get pixelWidth()
        // {
        //     return this.viewPortPixel.width;
        // }
        // get PixelHeight()
        // {
        //     return this.viewPortPixel.height;
        // }
    
        projectionType:ProjectionEnum=ProjectionEnum.perspective;
        //perspective 透视投影
        fov: number = Math.PI * 0.25;//透视投影的fov//verticle field of view
        aspest:number;//宽高比
        /**
         * height
         */
        size:number=2;
        postEffectQueue:IPostEffect[]=[];

        frustum:Frustum=new Frustum();
        addPostEffect(eff:IPostEffect)
        {
            this.postEffectQueue.push(eff);
        }
        clearPostEffect()
        {
            this.postEffectQueue=[];
        }
        Start()
        {
    
        }
        Update()
        {
            // for (let i = 0; i < this.overlays.length; i++)
            // {
            //     if (!this.overlays[i].init)
            //     {
            //         this.overlays[i].start(this);
            //         this.overlays[i].init = true;
            //     }
            //     this.overlays[i].update(delta);
            // }
    
            this.restToDirty();
            // if(this.beMainCamera)
            // {
            //     curScene.mainCamera=this;
            // }
        }
        /**
         * @hidden
         * @param renderTraget 
         */
        viewPort(rendertarget: RenderTexture=null)
        {
            let w,h;
            if(rendertarget==null)
            {
                w=GameScreen.Width;
                h=GameScreen.Height;
            }else
            {
                w = rendertarget.width;
                h = rendertarget.height;
            }
            webGraph.render.viewPort(w*this.viewport[0],h*this.viewport[1],w*this.viewport[2],h*this.viewport[3]);
        }
        /**
         * 清除colorbuffer/depthBuffer/stencilBuffer
         */
        clear()
        {
            // webGraph.render.clear(this.clearType,this.backgroundColor);
            webGraph.render.clears(this.clearOption_Color,this.backgroundColor,this.clearOption_Depth,this.dePthValue,this.clearOption_Stencil,this.stencilValue);
        }
        private _viewMatrix:MathD.mat4=MathD.mat4.create();
        get ViewMatrix():MathD.mat4
        {
            if(this.needComputeViewMat)
            {
                let camworld = this.gameObject.transform.worldMatrix;
                //视矩阵刚好是摄像机世界矩阵的逆
                MathD.mat4.invert(camworld, this._viewMatrix);
                this.needComputeViewMat=false;
            }
            return this._viewMatrix;
        }
        /**
         * 计算相机投影矩阵
         */
        private _Projectmatrix:MathD.mat4=MathD.mat4.create();
        get ProjectMatrix():MathD.mat4
        {
            if(this.needcomputeProjectMat)
            {
                if(this.projectionType==ProjectionEnum.perspective)
                {
                    MathD.mat4.project_PerspectiveLH(this.fov, GameScreen.aspect,this.near, this.far,this._Projectmatrix);
                }else
                {
                    MathD.mat4.project_OrthoLH(this.size * GameScreen.aspect,this.size, this.near, this.far, this._Projectmatrix);
                }
                this.needcomputeProjectMat=false;
            }
            return this._Projectmatrix;
        }
        // private ohMat:MathD.mat4=MathD.mat4.create();
        // getOrthoLH_ProjectMatrix():MathD.mat4
        // {
        //     MathD.mat4.project_OrthoLH(this.PixelHeight * GameScreen.aspect, this.PixelHeight, this.near, this.far, this.ohMat);
        //     return this.ohMat;
        // }
        private _viewProjectMatrix:MathD.mat4=MathD.mat4.create();
        get ViewProjectMatrix():MathD.mat4
        {
            if(this.needcomputeViewProjectMat)
            {
                MathD.mat4.multiply(this.ProjectMatrix, this.ViewMatrix, this._viewProjectMatrix);
                this.needcomputeViewProjectMat=false;
            }
            return this._viewProjectMatrix;
        }
    
        private restToDirty()
        {
            this.needComputeViewMat=true;
            this.needcomputeProjectMat=true;
            this.needcomputeViewProjectMat=true;
        }
        private needComputeViewMat:boolean=true;
        private needcomputeProjectMat:boolean=true;
        private needcomputeViewProjectMat:boolean=true;
    
    
        
        /**
         * 由屏幕坐标得到世界坐标
         */
        screenToWorldPoint(screenPos: MathD.vec3, outWorldPos: MathD.vec3)
        {
            let matinv = MathD.mat4.create();
            MathD.mat4.invert(this.ViewProjectMatrix, matinv);
            //let src1 = MathD.vec3.create(vppos[0], vppos[1], screenPos[2]);
            
            let vppos = MathD.vec2.create(screenPos[0] / GameScreen.Width * 2 - 1, 1 - screenPos[1] / GameScreen.Height * 2);
            outWorldPos[0]=vppos[0];
            outWorldPos[1]=vppos[1];
            outWorldPos[2]=screenPos[2];
    
            MathD.mat4.transformPoint(outWorldPos, matinv,outWorldPos);
            MathD.mat4.recycle(matinv);
            MathD.vec2.recycle(vppos);
        }
        /**
         * 由世界坐标得到屏幕坐标（canvas）
         * (0,0)-----|
         * |         |
         * |         |
         * |------(w,h)
         */
        worldToScreenpos(worldPos: MathD.vec3, outScreenPos: MathD.vec2)
        {
            let ndcPos =MathD.vec3.create();
            MathD.mat4.transformPoint(worldPos, this.ViewProjectMatrix,ndcPos);
            outScreenPos[0] = (ndcPos[0] + 1) * GameScreen.Width / 2;
            outScreenPos[1] = (1 - ndcPos[1]) * GameScreen.Height / 2;
            MathD.vec3.recycle(ndcPos);
        }
        /**
         * 由世界坐标得到window坐标(即窗口大小)
         * 例如:html element 使用
         * @param worldPos 
         * @param outScreenPos 
         */
        calcWindowPosFromWorldPos(worldPos: MathD.vec3, outDocument: MathD.vec2)
        {
            let ndcPos =MathD.vec3.create();
            MathD.mat4.transformPoint(worldPos, this.ViewProjectMatrix,ndcPos);
            outDocument[0] = (ndcPos[0] + 1) * GameScreen.windowWidth / 2;
            outDocument[1] = (1 - ndcPos[1]) * GameScreen.windowHeight / 2;
            MathD.vec3.recycle(ndcPos);
        }
    
        screenPointToRay(screenpos:MathD.vec2):Ray
        {
            let src1 = MathD.vec3.create();
            src1.x = screenpos.x;
            src1.y = screenpos.y;
            src1.z = -1;
            let src2 = MathD.vec3.create();
            src2.x = screenpos.x;
            src2.y = screenpos.y;
            src2.z = 1;
            let dest1 = MathD.vec3.create();
            let dest2 = MathD.vec3.create();
            this.screenToWorldPoint(src1, dest1);
            this.screenToWorldPoint(src2, dest2);
            let dir = MathD.vec3.create();
            MathD.vec3.subtract(dest2, dest1, dir);

            MathD.vec3.normalize(dir, dir);
            let ray=new Ray(dest1,dir);
            return ray;
        }

        Dispose()
        {
    
        }
        Clone()
        {
    
        }
    }
}
