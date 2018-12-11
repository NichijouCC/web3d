namespace web3d
{
    @GameAsset
    export class Prefab extends Web3dAsset
    {
        constructor(name: string|null = null,url:string|null=null)
        {
            super(name,url);
            this.type="Prefab";
        }
    
        root:Transform|null=null;
        instantiate():Transform|null
        {
            if(this.root==null)
            {
                return null;
            }else
            {
                let json=Serlizer.serializeObj(this.root);
                json.prefabData={};
                json.prefabData.root=this.root.insId.getInsID();
    
                let parser=new PrefabTreeParse(this.name,this.URL);
                let prefab=new Prefab();
                let index=this.URL.lastIndexOf("/");
                parser.loadABAsset(prefab,json,this.URL.substring(0,index+1));
                return prefab.root;
            }
        }
        dispose()
        {
            if(this.root)
            {
                this.root.dispose();
            }
            delete this.root;
    
        }
    }
}
