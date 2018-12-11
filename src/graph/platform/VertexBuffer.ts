namespace webGraph
{
   /**
     * The vertex buffer class.
     */
    export class VertexBuffer extends BaseBuffer 
    {
        private static curVbo:WebGLBuffer;
        /**
         * Constructor.
         */
        public constructor(rendermodel:number=GLConstants.STATIC_DRAW,data:Float32Array|Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array|ArrayBuffer|number=null)
        {
            super(rendingWebgl.ARRAY_BUFFER,rendermodel);
            if(data==null) return;
            

            this.bufferData(data);
        }

        /**
         * Write the specified buffer data to the buffer.
         * @param bufferData The buffer data
         */
        public bufferData(bufferData:Float32Array|Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array|ArrayBuffer|number)
        {
            this.attach();
            if(typeof bufferData =="number")
            {
                rendingWebgl.bufferData(this.target,bufferData,this.rendermodel);
            }else
            {
                rendingWebgl.bufferData(this.target,bufferData,this.rendermodel);
            }
            //this.detach();
        }

        /**
         * 刷新数据可刷新单个attribute的数据待测试,offset为步进//todo  
         * 在手机上非常慢，如果是更新全部数据最好用bufferData
         * @param data 
         * @param offset 
         */
        public bufferSubData(data:Float32Array|Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array|ArrayBuffer,offset:number=0)
        {
            this.attach();
            rendingWebgl.bufferSubData(this.target,offset,data);
            //this.detach();
        }


        public attachWithCache(): void 
        { 
            if(this.instance!=VertexBuffer.curVbo)
            {
                rendingWebgl.bindBuffer(this.target, this.instance);
                VertexBuffer.curVbo=this.instance;
            }
        }

        public attach()
        {
            rendingWebgl.bindBuffer(this.target, this.instance);
            VertexBuffer.curVbo=this.instance;
        }

        public detach(): void 
        { 
            VertexBuffer.curVbo=null;
            rendingWebgl.bindBuffer(this.target, null); 
        }
    }

}
 