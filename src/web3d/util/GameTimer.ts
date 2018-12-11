namespace web3d
{
/**
     * The game time class.
     */
    export class GameTimer {

        //#region 全局time 管控
        private static beginTime:number;
        private static lastTimer:number;
        private static totalTime:number;
        private static deltaTime:number;
        static get Time()
        {
            return this.totalTime*0.001;
        }
        static get DeltaTime()
        {
            return this.deltaTime* this.TimeScale*0.001;
        }
        static get StartTime()
        {
            return this.beginTime*0.001;
        }
        static TimeScale:number=1.0;
        private static IntervalLoop:any;
        private static update()
        {
            let now = Date.now();
            this.deltaTime = now - this.lastTimer;
            this.totalTime = now - this.beginTime;
            this.lastTimer = now;

            let realDetal=this.deltaTime*this.TimeScale*0.001;

            if(this.OnUpdate)
            {
                this.OnUpdate(realDetal);
            }
            for(let i=0,len=this.updateList.length;i<len;i++)
            {
                let func= this.updateList[i];
                func(realDetal);
            }
        }


        public static Init()
        {
            this.beginTime=Date.now();
            this.frameUpdate();
        }

        static OnUpdate:(delta:number)=>void;
        private static updateList:Function[]=[];
        static addListenToTimerUpdate(func:(delta:number)=>void)
        {
            this.updateList.push(func);
        }
        static removeListenToTimerUpdate(func:()=>void)
        {
            this.updateList.forEach((item)=>{
                if(item==func)
                {
                    let index=this.updateList.indexOf(func);
                    this.updateList.splice(index,1);
                    return;
                }
            })
        }
        static removeAllListener()
        {
            this.updateList.length=0;
        }

        static FPS:number=60;
        private static _lastFrameRate:number;
        private static frameUpdate()
        {
            if(this.FPS!=this._lastFrameRate)//----------帧率被修改
            {
                this.FPS=Math.min(this.FPS,60);
                this.FPS=Math.max(this.FPS,0);
                if(this.IntervalLoop!=null)
                {
                    clearInterval(this.IntervalLoop);
                    this.IntervalLoop=null;
                }
                this._lastFrameRate=this.FPS;
            }
            if(this.FPS==60)
            {
                this.update();
                requestAnimationFrame(this.frameUpdate.bind(this));
            }else
            {
                if(this.IntervalLoop==null)
                {
                    this.IntervalLoop=setInterval(()=>{
                        this.update();
                        this.frameUpdate();
                    },1000/this.FPS);
                }
            }
        }

    }

}    