namespace webGraph
{
/**
 * The element array class.
 */
export class ElementBuffer extends BaseBuffer {

    private static curEbo:WebGLBuffer;
    
    /**
     * Constructor.
     * @param bufferData The buffer data
     */
    public constructor(data:Uint32Array|Uint16Array|number|null=null,rendermodel:number=GLConstants.STATIC_DRAW) {
        super(rendingWebgl.ELEMENT_ARRAY_BUFFER,rendermodel);
        if(data==null) return;

        this.bufferData(data);
    }

    /**
     * Write the specified buffer data to the buffer.
     * @param bufferData The buffer data
     */
    public bufferData(bufferData: Uint32Array|Uint16Array|number) {
        this.attach();
        if(typeof bufferData=="number")
        {
            rendingWebgl.bufferData(this.target, bufferData, this.rendermodel);
        }else
        {
            rendingWebgl.bufferData(this.target, bufferData, this.rendermodel);
        }
        //this.detach();
    }
    public attachWithCache(): void 
    { 
        if(this.instance!=ElementBuffer.curEbo)
        {
            rendingWebgl.bindBuffer(this.target, this.instance);
            ElementBuffer.curEbo=this.instance;
        }
    }
    public attach():void
    {
        rendingWebgl.bindBuffer(this.target, this.instance);
        ElementBuffer.curEbo=this.instance;
    }

    /**
     * 提交数据
     * @param data 数据
     * @param offset buffer中的偏移值
     */
    public bufferSubData(data:Uint16Array,offset:number=0)
    {
        this.attach();
        rendingWebgl.bufferSubData(this.target,offset,data);
        //this.detach();
    }
    
    /**
     * 初始化buffer大小
     * 重设buffer大小
     * @param indexcount buffer大小
     */
    setSize(indexcount:number)
    {
        this.attach();
        rendingWebgl.bufferData(this.target, indexcount, this.rendermodel);
        this.detach();
    }


}

}
