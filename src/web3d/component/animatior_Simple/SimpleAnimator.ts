namespace web3d
{
    export enum PlayStateEnum
    {
        Play,
        Stop,
        Pause
    }
    export class LastClipData
    {
        Aniclip:Aniclip;
        lerpStartFrame:number;
        // set(Aniclip:Aniclip,curFrame:number)
        // {
        //     this.Aniclip=Aniclip;
        //     this.curFrame=curFrame+1;
        //     this.restFrame=this.Aniclip.frames.length-(this.curFrame+1);
        // }
        restFrame:number;
    
        constructor(Aniclip:Aniclip,curFrame:number)
        {
            this.Aniclip=Aniclip;
            this.lerpStartFrame=curFrame+1;
            this.restFrame=this.Aniclip.frames.length-(this.lerpStartFrame+1);
        }
    }
    
    export const compSimpleAnimator:string="SimpleAnimator";
    
    @NodeComponent
    export class SimpleAnimator implements INodeComponent
    {
        static type:string="SimpleAnimator";
    
        gameObject: GameObject;
    
        @Attribute
        Aniclips:Aniclip[]=[];
    
        private lastclipData:LastClipData;
        curAniclip:Aniclip;
        playRate:number=1;
        FPS:number=30;
    
        clipFrame:Frame;
    
        autoPlay:boolean=true;
        Start() {
            if(this.gameObject.transform.children.length>0)
            {
                let childs=this.gameObject.transform.children;
                for(let key in childs)
                {
                    let render=childs[key].gameObject.getComponent<SimpleSkinMeshRender>("SimpleSkinMeshRender");
                    if(render)
                    {
                        render.bindPlayer=this;
                    }
                }
            }
            if(this.autoPlay)
            {
                this.playAniclipByIndex(0);
            }
        }
        Update() {
            if(this.curAniclip==null) return;
            if(!this.enableTimeFlow) return;
            if(this.curAniclip.frames==null) return; 
    
            this.timer+=GameTimer.DeltaTime*this.playRate;
            this.curFrame=(this.timer*this.FPS)|0;
            if(!this.curAniclip.beLoop&&this.curFrame>=this.curAniclip.frames.length)
            {
                //-----------------onfinish
                this.enableTimeFlow=false;
                return;
            }
            this.curFrame=this.curFrame%this.curAniclip.frames.length;
            this.clipFrame=this.curAniclip.frames[this.curFrame];
        }
        Dispose() {
    
        }
        Clone() {
    
        }
        private timer:number=0;
        private curFrame:number=0;
        private PlayState:PlayStateEnum=PlayStateEnum.Stop;
        private enableTimeFlow:boolean=false;
        private beMixed:boolean=true;
    
        playAniclipByIndex(index:number)
        {
            let clip=this.Aniclips[index];
            if(clip!=null)
            {
                this.play(clip);
            }
        }
    
        play(clip:Aniclip,mixTime:number=0,mix:boolean=false,speed:number=1)
        {
            if(this.playRate==PlayStateEnum.Play)
            {
                this.lastclipData=new LastClipData(this.curAniclip,this.curFrame);
            }
            this.curAniclip=clip;
            this.beMixed=mix;
            this.FPS=this.curAniclip.fps;            
            this.playRate=speed;
            this.PlayState=PlayStateEnum.Play;
            this.enableTimeFlow=true;
        }
        pause()
        {
            if(this.PlayState==PlayStateEnum.Pause)
            {
                this.PlayState=PlayStateEnum.Play;
                this.enableTimeFlow=true;
            }else
            {
                this.PlayState=PlayStateEnum.Pause;
                this.enableTimeFlow=false;
            }
        }
        stop()
        {
            this.reset();
            this.PlayState=PlayStateEnum.Stop;
            this.enableTimeFlow=false;
        }
        private reset()
        {
            this.timer=0;
        }
        /**
         * 没有融合，直接取关键帧数据
         */
        private mixrot=MathD.quat.create();
        private mixpos=MathD.vec3.create();
        private temrot=MathD.quat.create();
        private tempos=MathD.vec3.create();
        private temLastRot=MathD.quat.create();
        private temLastpos=MathD.vec3.create();
        RefreshSkinBoneData(bonesname:string[],bonesRotPos:Float32Array)
        {
            if(this.beMixed&&this.lastclipData!=null)
            {
                for(let i=0,len=bonesname.length;i<len;i++)
                {
                    let name=bonesname[i];
                    let boneIndex=this.curAniclip.bones[name];
                    if(this.lastclipData.restFrame>this.curFrame  )
                    {//mix
                        this.temrot[0]=this.clipFrame.bonesMixMat[boneIndex*Aniclip.perBoneDataLen+0];
                        this.temrot[1]=this.clipFrame.bonesMixMat[boneIndex*Aniclip.perBoneDataLen+1];
                        this.temrot[2]=this.clipFrame.bonesMixMat[boneIndex*Aniclip.perBoneDataLen+2];
                        this.temrot[3]=this.clipFrame.bonesMixMat[boneIndex*Aniclip.perBoneDataLen+3];
                        this.tempos[0]=this.clipFrame.bonesMixMat[boneIndex*Aniclip.perBoneDataLen+4];
                        this.tempos[1]=this.clipFrame.bonesMixMat[boneIndex*Aniclip.perBoneDataLen+5];
                        this.tempos[2]=this.clipFrame.bonesMixMat[boneIndex*Aniclip.perBoneDataLen+6];
    
                        this.temLastRot[0]=this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame+this.curFrame].bonesMixMat[boneIndex*Aniclip.perBoneDataLen+0];
                        this.temLastRot[1]=this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame+this.curFrame].bonesMixMat[boneIndex*Aniclip.perBoneDataLen+1];
                        this.temLastRot[2]=this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame+this.curFrame].bonesMixMat[boneIndex*Aniclip.perBoneDataLen+2];
                        this.temLastRot[3]=this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame+this.curFrame].bonesMixMat[boneIndex*Aniclip.perBoneDataLen+3];
                        this.temLastpos[0]=this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame+this.curFrame].bonesMixMat[boneIndex*Aniclip.perBoneDataLen+4];
                        this.temLastpos[1]=this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame+this.curFrame].bonesMixMat[boneIndex*Aniclip.perBoneDataLen+5];
                        this.temLastpos[2]=this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame+this.curFrame].bonesMixMat[boneIndex*Aniclip.perBoneDataLen+6];
                        
                        let lerp=(this.curFrame+1)/this.lastclipData.restFrame;
                        MathD.vec3.lerp(this.temLastpos,this.tempos,lerp,this.mixpos);
                        MathD.quat.slerp(this.temLastRot,this.temrot,lerp,this.mixrot);
                        for(let k=0;k<4;k++)
                        {
                            bonesRotPos[i*Aniclip.perBoneDataLen+k]=this.mixrot[k];
                        }
                        for(let k=0;k<3;k++)
                        {
                            bonesRotPos[i*Aniclip.perBoneDataLen+k+3]=this.mixpos[k];
                        }
                    }else
                    {//not mix
                        for(let k=0;k<Aniclip.perBoneDataLen;k++)
                        {
                            bonesRotPos[i*Aniclip.perBoneDataLen+k]=this.clipFrame.bonesMixMat[boneIndex*Aniclip.perBoneDataLen+k];
                        }
                    }
                }
            }else
            {
                for(let i=0,len=bonesname.length;i<len;i++)
                {
                    let name=bonesname[i];
                    let boneIndex=this.curAniclip.bones[name];
                    for(let k=0;k<Aniclip.perBoneDataLen;k++)
                    {
                        bonesRotPos[i*Aniclip.perBoneDataLen+k]=this.clipFrame.bonesMixMat[boneIndex*Aniclip.perBoneDataLen+k];
                    }
                }
            }
    
        }
    
    }
}
