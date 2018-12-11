namespace web3d
{
    @GameAsset 
    export class Aniclip extends Web3dAsset
    {
        constructor(name: string|null = null,url:string|null=null)
        {
            super(name,url,false);
            this.type="Aniclip";
        }
    
        dispose()
        {
    
        }
        static readonly maxBone:number=55;
        static readonly perBoneDataLen:number=8;
        fps:number=30;
        beLoop:boolean=false;
        frames:Frame[]|null=null;
        bones:{[name:string]:number}={};
    }
    
    
    export class Frame
    {
        bonesMixMat:Float32Array=new Float32Array(Aniclip.maxBone*Aniclip.perBoneDataLen);
    }
}
