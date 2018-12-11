namespace web3d
{
    @GameAsset
    export class JsonAsset extends Web3dAsset
    {
        constructor(name: string|null = null,url:string|null=null,)
        {
            super(name,url);
            this.type="TextAsset";
            
        }
        content: JSON|null=null;
        
        dispose()
        {
            if(this.beDefaultAsset) return;
            this.content = null;
        }
    
    }
}
