namespace web3d
{
    @GameAsset
    export class BinAsset extends Web3dAsset
    {
        constructor(name: string|null = null,url:string|null=null)
        {
            super(name,url);
            this.type="BinAsset";
            
        }
        content: ArrayBuffer|null=null;
        
        dispose()
        {
            this.content = null;
        }
    
    }
}
