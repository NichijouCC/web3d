namespace web3d
{
    @GameAsset
    export class TextAsset extends Web3dAsset
    {
        constructor(name: string|null = null,url:string|null=null,)
        {
            super(name,url);
            this.type="TextAsset";
            
        }
        content: string|null=null;
        
        dispose()
        {
            if(this.beDefaultAsset) return;
            this.content = null;
        }

    }
}
