namespace web3d
{
    export interface EffectSystem
    {
        layers:EffectLayer[];
        delayTime:number;
        setData(data:F14EffectData);
    }
    @NodeComponent
    export class EffectSystem implements IRender
    {
        static readonly ClassName:string="EffectSystem";
        materials: Material[];
        gameObject: GameObject;
        layer: RenderLayerEnum=RenderLayerEnum.Transparent;
        mask: LayerMask=LayerMask.default;
        queue: number=10;

        delayTime:number=0;

        private fps:number=30;
        data:F14EffectData;
        layers:EffectLayer[] =[];
        //--------------------------------------------------------------------
        // public VF:number=gd3d.render.VertexFormatMask.Position | render.VertexFormatMask.Color | render.VertexFormatMask.UV0;

        private elements:LayerElement[] =[];
        // private renderBatch:F14Basebatch[] =[];

        /**
         * 从play开始的总时间
         */
        private allTime:number=0;
        /**
         * alltime - delaytime
         */
        private totalTime:number=0;
        private loopCount:number=0;

        private totalFrame:number=0;
        /**
         * 每次循环内部 frame index
         */
        onceFrame:number;

        private renderActive:boolean=false;
        mvpMat:MathD.mat4=MathD.mat4.create();
        Start() {
        }
        Update()
        {
            if(this.data==null)
            {
                this.renderActive=false;
                return;
            }
            if(this.enabletimeFlow)
            {
                this.renderActive=true;

                this.allTime+=GameTimer.DeltaTime*this.playRate;
                this.totalTime=this.allTime-this.delayTime;
                if(this.totalTime<=0)
                {
                    this.renderActive=false;
                    return;
                }
                this.totalFrame=this.totalTime*this.fps;
                if(!this.data.beloop&&this.totalFrame>this.data.lifeTime)
                {
                    this.renderActive=false;
                    this.enabletimeFlow=false;
                    //this.stop();
                    if(this.onFinish)
                    {
                        this.onFinish();
                    }
                    return;
                }
                this.onceFrame = this.totalFrame % this.data.lifeTime;
                // this.onceFrame=Math.floor(this.onceFrame);
                let newLoopCount=Math.floor(this.totalFrame/this.data.lifeTime);
                if(newLoopCount!=this.loopCount)
                {
                    this.loopCount=newLoopCount;
                    this.OnEndOnceLoop();
                }

                for (let i = 0; i < this.elements.length; i++)
                {
                    this.elements[i].update(GameTimer.DeltaTime, this.onceFrame, this.fps);
                }
            }
        }
        private OnEndOnceLoop()
        {
            for (let i = 0; i < this.elements.length; i++)
            {
                this.elements[i].OnEndOnceLoop();
            }
        }
        renderCamera:Camera;
        Render()
        {         
            if(!this.renderActive||!this.enableDraw) return;
            let curCount = 0;
            // context.updateModel(this.root);
            renderContext.updateModel(this.gameObject.transform);
            this.renderCamera=renderContext.curCamera;
            MathD.mat4.copy(renderContext.matrixModelViewProject,this.mvpMat);
            // for (let i = 0; i < this.renderBatch.length; i++)
            // {
            //     this.renderBatch[i].render(context,assetmgr,camera,Effqueue+curCount);
            //     curCount += this.renderBatch[i].getElementCount();
            // }
            for(let i=0;i<this.layers.length;i++)
            {
                this.layers[i].render();
            }
        }

        BeRenderable(): boolean {
            return this.renderActive;
        }

        BeInstantiable(): boolean {
            return false;
        }

        Clone() {
            
        }
        Dispose() {
            
        }
        setData(data:F14EffectData)
        {
            this.data = data;
            for (let i = 0,count=this.data.layers.length; i < count; i++)
            {
                let layerdata:F14LayerData = this.data.layers[i];
                this.addF14layer(layerdata.type,layerdata);
            }
            // for(let i=0;i<this.renderBatch.length;i++)
            // {
            //     if(this.renderBatch[i].type==F14TypeEnum.SingleMeshType)
            //     {
            //         (this.renderBatch[i] as F14SingleMeshBath).OnEndCollectElement();
            //     } 
            // }
        }

        private addF14layer(type:F14TypeEnum, layerdata:F14LayerData):EffectLayer
        {
            let layer = new EffectLayer(this,layerdata);
            let element;
            if (type==F14TypeEnum.SingleMeshType)
            {
                element = new SingleMesh(this, layer);
            }
            else if(type==F14TypeEnum.particlesType)
            {
                element = new F14Emission(this, layer);
            }else
            {
                // element = new RefElement(this,layer);
            }
            layer.element = element;
            this.layers.push(layer);
            this.elements.push(element);
            return layer;
        }  
        private playRate:number=1.0;
        private playState:PlayStateEnum=PlayStateEnum.Stop;
        //private active:boolean=false;
        private enabletimeFlow=false;
        private enableDraw=false;
        private onFinish:any;

        private OnPlayEnd()
        {
            this.stop();
            if(this.onFinish!=null)
            {
                this.onFinish();
            }
        }
        public play(PlayRate:number=1.0,onFinish:()=>void=null)
        {
            if(this.allTime>0)
            {
                this.reset();
            }
            this.enabletimeFlow=true;
            this.enableDraw=true;
            this.playRate=PlayRate;
            if(onFinish)
            {
                this.onFinish=onFinish;
            }
            this.playState=PlayStateEnum.Play;
        }
        public stop()
        {
            this.enabletimeFlow=false;
            this.enableDraw=false;
            this.reset();
            this.playState=PlayStateEnum.Stop;
        }
        public pause()
        {
            this.enableDraw=true;
            this.enabletimeFlow=false;
            this.playState=PlayStateEnum.Pause;
        }
        private reset()
        {
            this.allTime=0;
            for(let key in this.elements)
            {
                this.elements[key].reset();
            }
        }

        get bouningSphere(): BoundingSphere
        {
            return  null;
        }
    }

}