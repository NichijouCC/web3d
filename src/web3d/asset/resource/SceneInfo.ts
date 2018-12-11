namespace web3d
{
    @GameAsset
    export class SceneInfo extends Web3dAsset
    {
        constructor(name: string|null = null,url:string|null=null)
        {
            super(name,url);
            this.type="SceneInfo";
        }
        root:Transform|null=null;
    
        useLightmap:boolean=false;
        lightMap:Texture[]=[];
    
        useFog:boolean=false;
        fog:FogInfo|null=null;
        
    
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
            for(let key in this.lightMap)
            {
                this.lightMap[key].dispose();
            }
            delete this.root;
            delete this.lightMap;
        }
    }
    
    export class FogInfo
    {
        color:MathD.color= MathD.color.create();
        near:number=0;
        far:number=1000;
    }
}
