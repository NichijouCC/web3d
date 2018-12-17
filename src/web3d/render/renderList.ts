namespace web3d
{
 /**
     * @private
     */
    export class RenderList
    {
        private layerLists:{[layer:number]:LayerList}={};
        constructor()
        {
            this.layerLists[RenderLayerEnum.Background]=new LayerList("Background");
            this.layerLists[RenderLayerEnum.Geometry]=new LayerList("Geometry");
            this.layerLists[RenderLayerEnum.AlphaTest]=new LayerList("AlphaTest");
            this.layerLists[RenderLayerEnum.Transparent]=new LayerList("Transparent");
            this.layerLists[RenderLayerEnum.Overlay]=new LayerList("Overlay");
        }
        clear()
        {
            for(let key in this.layerLists)
            {
                this.layerLists[key].clear();
            }
        }
        addRenderItem(item:IRenderItem)
        {
            let layerIndex=item.mat.layer;
            this.layerLists[layerIndex].addRender(item);
        }
        setLayerSortFunc(layer:RenderLayerEnum,queuesortfunc:(a:IRenderItem[])=>void)
        {
            this.layerLists[layer].queueSortFunc=queuesortfunc;
        }
        foreach(fuc:(item:IRenderItem)=>void)
        {
            this.layerLists[RenderLayerEnum.Background].foreach(fuc);
            this.layerLists[RenderLayerEnum.Geometry].foreach(fuc);
            this.layerLists[RenderLayerEnum.AlphaTest].foreach(fuc);
            this.layerLists[RenderLayerEnum.Transparent].foreach(fuc);
            this.layerLists[RenderLayerEnum.Overlay].foreach(fuc);
        }

        private static map:{[id:number]:RenderList}={};
        static get(cam:Camera):RenderList
        {
            if(this.map[cam.gameObject.id]!=null)
            {
                return this.map[cam.gameObject.id];
            }else
            {
                let list=new RenderList();
                this.map[cam.gameObject.id]=list;
                return list;
            }
        }
    }

    export class LayerList
    {
        private layer:string;

        private queDic:{[queue:number]:IRenderItem[]}={};
        private queArr:number[]=[];

        constructor(layerType:string,queueSortFunc:(arr:IRenderItem[])=>void=null)
        {
            this.layer=layerType;
            this.queueSortFunc=queueSortFunc;
        }
        queueSortFunc:(arr:IRenderItem[])=>void;


        addRender(item:IRenderItem)
        {
            let queue=item.mat.queue;
            let value=this.queDic[queue];
            if(value==null)
            {
                this.queDic[queue]=[];
                this.queArr.push(queue);
            }
            this.queDic[queue].push(item);
        }

        sort()
        {
            if(this.queArr.length>1)
            {
                this.queArr.sort();
            }
            for(let i=0,len1=this.queArr.length;i<len1;i++)
            {
                let arr=this.queDic[this.queArr[i]];
                if(this.queueSortFunc)
                {
                    this.queueSortFunc(arr);
                }
            }
        }
        foreach(fuc:(item:IRenderItem)=>void)
        {
            for(let i=0,len1=this.queArr.length;i<len1;i++)
            {
                let arr=this.queDic[this.queArr[i]];
                arr.forEach((item)=>{
                    fuc(item);
                });
            }
        }

        clear()
        {
            this.queDic={};
            this.queArr.length=0;
        }

    }
}