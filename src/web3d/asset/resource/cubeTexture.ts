namespace web3d
{
    @GameAsset 
    export class CubeTexture extends Web3dAsset implements ITextrue
    {
        width: number=0;
        height: number=0;
        constructor(assetName: string|null = null,url:string|null=null,bedef:boolean=false)
        {
            super(assetName,url,bedef);
            if(!bedef)
            {
                // this.glTexture=assetMgr.getDefaultCubeTexture("black").glTexture;
            }
            this.type="CubeTexture";
        }
        
        glTexture: webGraph.CubeTex;
        private _tex2dItems:Texture[]=[];

        private beDefRef:boolean=true;
        groupCubeTexture(urlArr:string[])
        {
            let taskArr:Promise<HTMLImageElement>[]=[];
            for(let i=0;i<urlArr.length;i++)
            {
                taskArr.push(this.loadImage(urlArr[i]));
            }
            Promise.all(taskArr).then((imagarr)=>{
                this.glTexture=new webGraph.CubeTex(imagarr);
            });

        }
        private groupTexture:webGraph.CubeTex;
        private currentLevel:number=-1;
        groupMipmapCubeTexture(urlArr:string[],mipmaplevel:number,maxLevel:number)
        {
            let taskArr:Promise<HTMLImageElement>[]=[];
            for(let i=0;i<urlArr.length;i++)
            {
                taskArr.push(this.loadImage(urlArr[i]));
            }
            Promise.all(taskArr).then((imagarr)=>{
                if(this.groupTexture==null)
                {
                    this.groupTexture=new webGraph.CubeTex(null);
                }
                this.groupTexture.uploadImage(imagarr,mipmaplevel);
                this.currentLevel++;
                if(this.currentLevel==maxLevel)
                {
                    this.glTexture=this.groupTexture;
                }
            });
        }

        private loadImage(url:string):Promise<HTMLImageElement>
        {
            return new Promise((resolve,reject)=>{
                assetMgr.load(url,(asset)=>{
                    if(asset)
                    {
                        resolve((asset as Texture).imageData as HTMLImageElement);
                    }else
                    {
                        reject("load failed");
                    }
                })
            })

        }

        dispose()
        {
            if(this.beDefaultAsset) return;
            this.glTexture.dispose();
        }
    }
}

