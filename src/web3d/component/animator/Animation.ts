namespace web3d
{
    @NodeComponent
    export class Animation implements INodeComponent
    {
        static type:string="Animator";
        gameObject: GameObject;
    
        beAutoPlay:boolean=true;
    
        private animations:AnimationClip[]=[];
        private animationDic:{[name:string]:AnimationClip}={};
        addClip(newAnimation:AnimationClip)
        {
            let name=newAnimation.name;
            this.animationDic[name]=newAnimation;
            this.animations.push(newAnimation);
        }
    
        playAnimationByName(name:string,timeScale:number=1)
        {
            let animation=this.animationDic[name];
            if(animation)
            {
                this.play(animation,timeScale);
            }else
            {
                console.error(" animation :"+name +" not exist!");
            }
        }

        setFrame(name:string,frame:number)
        {
            if(this.animationDic[name]==null) return;
            this.curAni=this.animationDic[name];
            this.curFrame=Math.floor(this.curAni.totalFrame*frame);
        }
    
        curAni:AnimationClip;
        timer:number=0;
        private lastFrame:number=0;
        private curFrame:number=0;
        private playRate:number=1;
    
        private PlayState:PlayStateEnum=PlayStateEnum.Stop;
        private enableTimeFlow:boolean=false;
        private beMixed:boolean=false;
        play(animation:AnimationClip,timeScale:number=1)
        {
            if(animation==null) return;
            this.playRate=timeScale;
            this.curAni=animation;
            this.PlayState=PlayStateEnum.Play;
            this.enableTimeFlow=true;
    
            this.timerInit();
        }
        private timerInit()
        {
            this.timer=0;
            this.curFrame=0;
            this.lastFrame=-1;
        }
    
        Start() {
            if(this.beAutoPlay&&this.animations.length>0)
            {
                this.play(this.animations[0]);
            }
        }
    
        // /**
        //  * mesh空间->骨骼空间->Root空间
        //  */
        // jointMatrix:{[name:string]:mat4}={};
    
        private pathDic:Map<AnimationCurve,Transform>=new Map();
        Update() {
            // if(!this.enableTimeFlow) return;
            if(!this.curAni) return;

            if(this.enableTimeFlow)
            {
                this.timer+=GameTimer.DeltaTime*this.playRate;
                this.curFrame=(this.timer*AnimationClip.FPS)|0;
                if(this.curFrame>this.curAni.totalFrame)
                {
                    if(this.curAni.beLoop)
                    {
                        this.curFrame=this.curFrame%this.curAni.totalFrame;
                    }else
                    {
                        this.enableTimeFlow=false;
                        this.curFrame=this.curAni.totalFrame;
                    }
                }
            }
    
            if(this.curFrame!=this.lastFrame)
            {//当前帧改变了，刷新frameData
                this.lastFrame=this.curFrame;
                // this.needRefreshBone.length=0;
                for(let i=0,len=this.curAni.channels.length;i<len;i++)
                {
                    let channel=this.curAni.channels[i];
                    let transTarget:Transform;
                    if(this.pathDic.has(channel))
                    {
                        transTarget=this.pathDic.get(channel);
                    }else
                    {
                        transTarget=this.gameObject.transform.findPath(channel.path);
                        this.pathDic.set(channel,transTarget);
                    }
                    if(transTarget==null) {
                        continue;
                    };
                    if(this.curFrame<channel.startFrame||this.curFrame>channel.endFrame) continue;
                    let startIndex=((channel.keys.length-1)*this.curFrame/channel.endFrame)|0;
                    while(channel.keys[startIndex]>this.curFrame&&startIndex>0)
                    {  
                        startIndex--;
                    }
                    let endIndex=startIndex+1;
                    if(endIndex>channel.keys.length-1)
                    {
                       let target=channel.value[channel.keys.length-1];
                       channel.lerpFunc(target,target,0,transTarget);
                       transTarget.markDirty();
                    }else
                    {
                        while(channel.keys[endIndex]<=this.curFrame&&endIndex<channel.keys.length-1)
                        {
                            endIndex++;
                        }
                        let lerp=(this.curFrame-channel.keys[startIndex])/(channel.keys[endIndex]-channel.keys[startIndex]);
                        channel.lerpFunc(channel.value[startIndex],channel.value[endIndex],lerp,transTarget);
                        transTarget.markDirty();
                    }
                }
                
            }
        }
        Dispose() {
            
        }
        Clone() {
            
        }
    }
}

