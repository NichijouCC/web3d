namespace web3d
{
    export class ParseAnimationNode
    {
        static parse(index:number,loader:LoadGlTF):Promise<void>
        {
            let bundle=loader.bundle;
            let animation=bundle.gltf.animations[index];
            let newAniclip=new AnimationClip(animation.name);
    
            let taskarr:Promise<void>[]=[];
            for(let i=0;i<animation.channels.length;i++)
            {
                let channeltarget=animation.channels[i].target;
                let sampleNode=animation.samplers[animation.channels[i].sampler];
                let channelTask=this.parseChannelData(channeltarget,sampleNode,loader).then((channel)=>{
                    newAniclip.channels.push(channel);
                    if(channel.endFrame>newAniclip.totalFrame)
                    {
                        newAniclip.totalFrame=channel.endFrame;
                    }
                });
                taskarr.push(channelTask);
            }
    
            return Promise.all(taskarr).then(()=>{
                bundle.animationNodeCache[index]=newAniclip;
            });
        }
    
    
    
        private static parseChannelData(channeltarget:IAnimationChannelTarget,sampleNode:IAnimationSampler,loader:LoadGlTF):Promise<AnimationCurve>
        {
            let chan=new AnimationCurve();
            chan.path=loader.getNodePath(loader.bundle.gltf.nodes,channeltarget.node);
    
            chan.propertyName=channeltarget.path;
            chan.interPolationType=sampleNode.interpolation as any;
            switch(channeltarget.path)
            {
                case AnimationChannelTargetPath.ROTATION:
                    chan.propertyName="localRotation";
                    chan.lerpFunc=(from,to,lerp,obj)=>{
                        MathD.quat.lerp(from,to,lerp,obj.localRotation);
                        MathD.quat.normalize(obj.localRotation,obj.localRotation);
                    };
                    break;
                case AnimationChannelTargetPath.SCALE:
                    chan.propertyName="localScale";
                    chan.lerpFunc=(from,to,lerp,obj)=>{
                        MathD.vec3.lerp(from,to,lerp,obj.localScale);
                    };
                    break;
                case AnimationChannelTargetPath.TRANSLATION:
                    chan.propertyName="localPosition";
                    chan.lerpFunc=(from,to,lerp,obj)=>{
                        MathD.vec3.lerp(from,to,lerp,obj.localPosition);
                    };
                    break;
                case AnimationChannelTargetPath.WEIGHTS:
                    chan.lerpFunc=(from,to,lerp, obj)=>{
                        let out=0;
                        lerp(from,to,lerp,out);
                        obj["WEIGHTS"]=out;
                    };
                    console.warn(" animtion weights not handle yet.");
                    break;
                default:
                    console.error("channeltarget.path not conform to animation asset rule！");
                    break;
            }
            
            let task=Promise.all([
                parseAccessorNode.parse(sampleNode.input,loader),
                parseAccessorNode.parse(sampleNode.output,loader)
            ]).then(([inputdata,outputdata])=>{
                let timedata=inputdata.data;
    
                // chan.keys=new Float32Array(timedata.length);
                for(let i=0;i<timedata.length;i++)
                {
                    chan.keys[i]=(timedata[i]*AnimationClip.FPS)|0;//变成frame
                }
                chan.value=outputdata.data;
    
                chan.startFrame=chan.keys[0];
                chan.endFrame=chan.keys[chan.keys.length-1];
                return chan;
            });
            return task;
        }
    }
}
