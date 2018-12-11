namespace web3d
{
    export class LoadAniclip implements IAssetLoader
    {
        load(url: string,state:AssetLoadInfo,onFinish: (asset:IAsset,state: AssetLoadInfo) => void,onProgress:(loadInfo:{loaded:number,total:number})=>void): IAsset {
            let name=AssetMgr.getFileName(url);
            let clip=new Aniclip(name);
            state.progress=loadArrayBuffer(url,(bin,err)=>{
                if(err)
                {
                    let errorMsg="ERROR:Load Anclip Error!\n  Info: LOAD URL: "+url+"  LOAD MSG:"+err.message;
                    state.err=new Error(errorMsg);
                }else
                {
                    LoadAniclip.Parse(clip,bin as ArrayBuffer);
                    state.beSucces=true;
                }
                if(onFinish)
                {
                    onFinish(clip,state);
                }
            },(info)=>{
                if(onprogress)
                {
                    onProgress(info);
                }
            });
            return clip;
        }
    
        
        private static Parse(clip:Aniclip,buf: ArrayBuffer): void
        {
            let read: binReader = new binReader(buf);
            let _name=read.readStrLenAndContent();
    
            let fps = read.readFloat();
            let loop = read.readBoolean();
            let boneCount = read.readInt();
            let bones:{[name:string]:number} = {};
            for (let i = 0; i < boneCount; i++)
            {
                let name=read.readStrLenAndContent();
                bones[name]=i;
            }
            // let subclipCount = read.readInt();
            // let subclips = [];
            // for (let i = 0; i < subclipCount; i++)
            // {
            //     let _subClip:{name:string,loop:boolean} ={name:null,loop:null};
            //     _subClip.name = read.readStringAnsi();
            //     _subClip.loop = read.readBoolean();
            //     subclips.push(_subClip);
            // }
    
            let frameCount = read.readInt();
            let frames:Frame[] = [];
            for (let i = 0; i < frameCount; i++)
            {
                let _fid = read.readInt();
                //let _key = read.readBoolean();
                let _frame=new Frame();
                for (let k = 0; k <boneCount; k++)
                {
                    let posx=read.readFloat();
                    let posy=read.readFloat();
                    let posz=read.readFloat();
    
                    let rotx=read.readFloat();
                    let roty=read.readFloat();
                    let rotz=read.readFloat();
                    let rotw=read.readFloat();
                    
                    // if(k==0)
                    // {
                    //     console.log("==========");
                    // }
                    _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 0] =rotx;
                    _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 1] =roty;
                    _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 2] =rotz;
                    _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 3] =rotw;
                    _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 4] =posx;
                    _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 5] =posy;
                    _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 6] =posz;
                }
                frames[_fid] =_frame;
            }
            clip.fps=fps;
            clip.beLoop=loop;
            clip.frames=frames;
            clip.bones=bones;
            //buf = null;
        }
    
    }
    const _loadaniclip=new LoadAniclip();
    AssetMgr.RegisterAssetLoader(".Aniclip.bin",()=>{return _loadaniclip;});
}

