namespace web3d
{
    export class F14Emission implements LayerElement
    {
        type: F14TypeEnum;
        layer: EffectLayer;
        drawActive: boolean;
        public effect: EffectSystem;

        public baseddata: F14EmissionBaseData;
        // public currentData: F14EmissionBaseData;
        //-------------------------数据------------------------------------
        public particlelist: F14Particle[] = [];
        public deadParticles: F14Particle[] = [];

        batch:F14EmissionBatch;
        //--------------------------------------------------------
        // private frameLife: number = 0;

        private TotalTime: number = 0;
        // private newStartDataTime: number = 0;//改变currentdata的时间
        public curTime: number = 0;//减去dely剩下的
        private beover: boolean = false;
        private numcount: number = 0;

        //--------------------
        localMatrix:MathD.mat4 =MathD.mat4.create();
        private _worldMatrix: MathD.mat4 =MathD.mat4.create();
        private localrot =MathD.quat.create();
        private worldRot =MathD.quat.create();

        vertexCount: number;
        // vertexLength: number;
        dataforvboLen: number;
        dataforeboLen: number;
        meshebo:Uint16Array|Uint32Array;

        colorArr: MathD.color[];
        posArr: MathD.vec3[];
        uvArr: MathD.vec2[];

        public constructor(effect: EffectSystem, layer: EffectLayer)
        {
            this.type = F14TypeEnum.particlesType;
            this.effect = effect;
            this.layer = layer;
            this.baseddata = layer.baseData as F14EmissionBaseData;
            // this.currentData = this.baseddata;

            // this.newStartDataTime = this.baseddata.delayTime;

            this.initByBasedata(this.baseddata);
            this.posArr = this.baseddata.mesh.vertexAttData[webGraph.VertexAttTypeEnum.Position].data;
            this.uvArr=this.baseddata.mesh.vertexAttData[webGraph.VertexAttTypeEnum.UV0].data;
            this.colorArr=this.baseddata.mesh.vertexAttData[webGraph.VertexAttTypeEnum.Color0].data;

            this.vertexCount=this.posArr.length;
            this.dataforvboLen=(3+2+4)*this.vertexCount;
            this.meshebo=this.baseddata.mesh.trisindex;
            this.dataforeboLen=this.meshebo.length;


            // if (this.currentData.mesh.data)
            // {
            //     this.vertexCount = this.currentData.mesh.data.pos.length;
            //     this.posArr = this.currentData.mesh.data.pos;
            //     this.colorArr = this.currentData.mesh.data.color;
            //     this.uvArr = this.currentData.mesh.data.uv;
            //     this.dataforebo = this.currentData.mesh.data.genIndexDataArray();
            //     this.vertexLength = gd3d.render.meshData.calcByteSize(this.effect.VF) / 4;
            //     this.dataforvboLen = this.vertexCount * this.vertexLength;
            // } else
            // {
            //     this.vertexCount = 0;
            //     this.posArr = [];
            //     this.colorArr = [];
            //     this.uvArr = [];
            //     this.dataforebo = new Uint16Array(0);
            // }

            this.batch=new F14EmissionBatch(this.effect,this);
        }

        // private lastFrame: number = 0;
        public update(deltaTime: number, frame: number, fps: number)
        {
            //this.drawActive = true;
            this.TotalTime += deltaTime;

            // this.refreshByFrameData(fps);
            this.updateLife();
            for (let i = 0; i < this.particlelist.length; i++)
            {
                this.particlelist[i].update(deltaTime);
            }
        }
        Render() {
            
        }
        private initByBasedata(data:F14EmissionBaseData)
        {
            MathD.quat.FromEuler(data.rotEuler.x, data.rotEuler.y, data.rotEuler.z, this.localrot);
            MathD.mat4.RTS(data.rotPosition, data.rotScale, this.localrot, this.localMatrix);
        }

        getWorldMatrix(): MathD.mat4
        {
            let mat = this.effect.gameObject.transform.worldMatrix;
            MathD.mat4.multiply(mat, this.localMatrix, this._worldMatrix);
            return this._worldMatrix;
        }
        getWorldRotation(): MathD.quat
        {
            let rot = this.effect.gameObject.transform.worldRotation;
            MathD.quat.multiply(rot, this.localrot, this.worldRot);
            return this.worldRot;
        }

        private updateLife()
        {
            if (this.beover) return;
            this.curTime = this.TotalTime - this.baseddata.delayTime;
            if (this.curTime <= 0) return;
            //--------------update in Livelife-------------------
            this.updateEmission();

            if (this.curTime > this.baseddata.duration)
            {
                if (this.baseddata.beloop)
                {
                    switch (this.baseddata.loopenum)
                    {
                        case LoopEnum.Restart:
                            this.reInit();
                            break;
                        case LoopEnum.TimeContinue:
                            this.beover = true;
                            break;
                    }
                }
                else
                {
                    this.beover = true;
                }
            }
        }
        private reInit()
        {
            // this.newStartDataTime = this.baseddata.delayTime;
            this.beover = false;
            this.TotalTime = 0;
            this.numcount = 0;
            this.burstedIndex=0;
            this.baseddata.rateOverTime.getValue(true);//重新随机
        }

        // private bursts: number[] = [];

        /**
         * 记录当前需要发射粒子 的序号
         */
        private burstedIndex:number=0;
        private updateEmission()
        {
            let needCount = Math.floor(this.baseddata.rateOverTime.getValue() * (this.TotalTime - this.baseddata.delayTime))+1;
            let realcount = needCount - this.numcount;
            if (realcount > 0)
            {
                this.addParticle(realcount);
            }
            this.numcount += realcount;

            if (this.burstedIndex<this.baseddata.bursts.length)
            {
                if(this.baseddata.bursts[this.burstedIndex].time<=this.TotalTime)
                {
                    let count = this.baseddata.bursts[this.burstedIndex].count.getValue(true);
                    this.addParticle(count);
                    this.burstedIndex++;
                }
            }
        }

        private addParticle(count: number = 1)
        {
            for (let i = 0; i < count; i++)
            {
                if (this.deadParticles.length > 0)
                {
                    let pp = this.deadParticles.pop();
                    pp.initByEmissionData(this.baseddata);
                }
                else
                {
                    let pp = new F14Particle(this, this.baseddata);
                    this.particlelist.push(pp);
                }
            }
        }
        //重置，粒子啥的消失
        reset()
        {
            this.reInit();
            //----------------
            for (let i = 0; i < this.particlelist.length; i++)
            {
                if (this.particlelist[i].actived)
                {
                    this.particlelist[i].actived = false;
                    this.deadParticles.push(this.particlelist[i]);
                }
            }
        }

        getMaxParticleCount():number
        {
            let maxrate:number;
            let basrat=this.baseddata.rateOverTime;
            maxrate=basrat.isRandom?basrat._valueLimitMax:basrat._value;
            let liftime=this.baseddata.lifeTime;        
            let maxlife=liftime.isRandom?Math.max(liftime._valueLimitMax,liftime._valueLimitMin):liftime._value;
            if(!this.baseddata.beloop)
            {
                let duration=this.baseddata.duration;
                if(duration<maxlife)
                {
                    maxlife=duration;
                }
            }
            let burstCount:number=0;
            for(let i=0;i<this.baseddata.bursts.length;i++)
            {
                let info=this.baseddata.bursts[i];
                let Count=info.count.isRandom?info.count._valueLimitMax:info.count._value;
                burstCount+=Count;
            }
            return Math.floor(maxrate*maxlife+burstCount+2);
        }

        OnEndOnceLoop()
        {

        }
        dispose()
        {
            this.effect = null;
            this.baseddata = null;

            // delete this.dataforebo;
            delete this.posArr;
            delete this.colorArr;
            delete this.uvArr;

            for (let key in this.particlelist)
            {
                this.particlelist[key].dispose();
            }
            for (let key in this.deadParticles)
            {
                this.deadParticles[key].dispose();
            }
        }
    }

}