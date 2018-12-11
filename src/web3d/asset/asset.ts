namespace web3d
{
    export class ResID
    {
        private static idAll: number = 0;
        static next(): number
        {
            let next = ResID.idAll;
            ResID.idAll++;
            return next;
        }
    }
    export interface IAsset //
    {
        name:string;
        beDefaultAsset:boolean;//是否为系统默认资源
        type:string;
        URL:string|null;
        // use():void;
        // unuse(disposeNow?: boolean):void;
        dispose():void;
        loadState:LoadEnum;
        onLoadEnd:()=>void;
        // onLoadEnd:(asset:IAsset)=>void;
        //caclByteLength(): number;
    }
    export class Web3dAsset implements IAsset
    {
        @Attribute
        name:string;
        readonly guid:number;
    
        @Attribute
        URL:string="";
    
        // bundleName:string|null=null;
    
        loadState:LoadEnum=LoadEnum.None;
    
        @Attribute
        readonly beDefaultAsset: boolean=false;
    
        type:string="None";
    
        constructor(name:string|null,url:string|null=null,bedef:boolean=false)
        {
            this.guid=ResID.next();
            if (name==null)
            {
                this.name ="asset_"+this.guid;
            }else
            {
                this.name = name;
            }
            this.beDefaultAsset=bedef;
            if(bedef)
            {
                this.loadState=LoadEnum.Success;
            }
        }
        private loadEndListeners:Function[]=[];
        onLoadEnd()
        {
            if(this.loadEndListeners)
            {
                for(let key in this.loadEndListeners)
                {
                    this.loadEndListeners[key]();
                }
            }
            this.loadEndListeners=null;
        }
    
        addListenerToLoadEnd(onloadEnd:()=>void)
        {
            if(this.loadEndListeners==null)
            {
                this.loadEndListeners=[];
            }
            this.loadEndListeners.push(onloadEnd);
        }
    
        // use(): void {
        //     assetMgr.use(this);
        // }
        // unuse(disposeNow?: boolean): void {
        //     assetMgr.unuse(this,disposeNow);
        // }
        dispose() {}
    }
    
}
