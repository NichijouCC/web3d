namespace webGraph
{
    export declare var renderstateMgr:RenderStateMgr;
    export declare var rendingWebgl:WebGLRenderingContext;

    export class Graph
    {
        static maxTexImageUnits:number;
        private static unitFreeArr:number[]=[];
        private static unitUsingArr:number[]=[];
        private static unitDic:{[index:number]:Texture2D|CubeTex}={};

        static init(_webgl:WebGLRenderingContext)
        {
            rendingWebgl=_webgl;
            renderstateMgr=new RenderStateMgr();

            GLExtension.initExtension();
            UniformSetter.initUniformDic();
            AttributeSetter.initAttDic();
    
           this.maxTexImageUnits=rendingWebgl.getParameter(rendingWebgl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)-1;
            for(let i=0;i<this.maxTexImageUnits;i++)
            {
                this.unitFreeArr.push(i);
            }
        }

        /**
         * 給图片分配unit
         * @param tex 
         */
        static getFreeUnit(tex:Texture2D|CubeTex):number
        {
            let freeSlot:number;
            if(this.unitFreeArr.length>0)
            {
                freeSlot=this.unitFreeArr.shift();
                this.unitUsingArr.push(freeSlot);
                this.unitDic[freeSlot]=tex;
            }else
            {
                freeSlot=this.unitUsingArr.shift();
                this.unitDic[freeSlot].unit=null;

                this.unitUsingArr.push(freeSlot);
                this.unitDic[freeSlot]=tex;
            }
            tex.unit=freeSlot;
            return freeSlot;
        }
    }
}

