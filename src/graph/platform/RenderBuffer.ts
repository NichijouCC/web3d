namespace webGraph
{
    export class RenderBuffer extends abstractPlatformEntity<WebGLRenderbuffer>
    {
        public constructor(option:RboOption=null)
        {
            super(rendingWebgl.createRenderbuffer());
            if(option==null) return;
            this.attach();
            this.init(option.format,option.width,option.height);
            this.detach();
        }
        public attach()
        {
            rendingWebgl.bindRenderbuffer(rendingWebgl.RENDERBUFFER,this.instance);
        }
        public detach()
        {
            rendingWebgl.bindRenderbuffer(rendingWebgl.RENDERBUFFER,null);            
        }
    
        init(format:number,width:number,height:number)
        {
            rendingWebgl.renderbufferStorage(rendingWebgl.RENDERBUFFER,format,width,height);
        }
    
        dispose()
        {
            rendingWebgl.deleteRenderbuffer(this.instance);
        }
    }
    
    export class RboOption
    {
        /**
         * 深度缓冲区gl.DEPTH_COMPONENT16
         * 
         * 模板缓冲区gl.STENCIL_INDEX8
         * 
         * 颜色缓冲区，4个分量都是4比特gl.RGBA4
         * 
         * 颜色缓冲区，RGB分量5比特，A分量1比特gl.RGB5_A1
         * 
         * 颜色缓冲区，RGB分量分别5、6、5比特gl.RGB565
         */
        format:number;
        width:number;
        height:number;
    }
    
}

