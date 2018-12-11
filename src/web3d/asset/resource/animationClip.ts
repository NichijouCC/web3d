namespace web3d
{
    @GameAsset 
    export class AnimationClip extends Web3dAsset
    {
        constructor(name: string|null = null,url:string|null=null)
        {
            super(name,url,false);
            this.type="AnimationClip";
        }
    
        dispose()
        {
    
        }
        static enableScaleAnimation:boolean=false;
        static readonly maxBone:number=55;
        static get perBoneDataLen()
        {
            if(this.enableScaleAnimation)
            {
                return 16;
            }else
            {
                return 8;
            }
        }
        static readonly FPS:number=30;
        beLoop:boolean=true;
        // bones:{[name:string]:number}={};
        channels:AnimationCurve[]=[];
        totalFrame:number=0;
    }

    export interface IAnimationKey {
        /**
         * Frame of the key frame
         */
        frame: number;
        /**
         * Value at the specifies key frame
         */
        value: any;
    }
    export class AnimationCurve
    {
        // trans:Transform;
        path:string[];
        // info:AnimationChannelInfo;
        propertyName:string;
        startFrame:number;
        endFrame:number;
        keys:number[]=[];
        value:any[]=[];
        interPolationType:AnimationInterpolationEnum;
    
        lerpFunc:(from,to,lerp,trans:Transform)=>void;


        addKey(keyframe:number,value:any)
        {
            if(this.keys.indexOf(keyframe)<0)
            {
                this.keys.push(keyframe);
                this.keys.sort();
            }
            let index=this.keys.indexOf(keyframe);
            this.value[index]=value;
        }
    
    }

    // export class AnimationChannelInfo
    // {
    //     attname:string;
    //     startFrame:number;
    //     endFrame:number;
    //     keys:Float32Array;
    //     value:any=[];
    //     interPolationType:AnimationInterpolationEnum;
    
    //     lerpFunc:(from,to,lerp,trans:Transform)=>void;
    // }
    
    export enum AnimationInterpolationEnum {
        /**
         * The animated values are linearly interpolated between keyframes
         */
        LINEAR = "LINEAR",
        /**
         * The animated values remain constant to the output of the first keyframe, until the next keyframe
         */
        STEP = "STEP",
        /**
         * The animation's interpolation is computed using a cubic spline with specified tangents
         */
        CUBICSPLINE = "CUBICSPLINE",
    }
}
