namespace webGraph
{
    export class FboOption
    {
        width:number=10;
        height:number=10;
    
        colorTextures:Texture2D[]|null=null;
        colorRenderBuffers:WebGLRenderbuffer[]|null=null;
    
        depthTexture:Texture2D|null=null;
        depthRenderBuffer:WebGLRenderbuffer|null=null;
    
        stencilRenderBuffer:WebGLRenderbuffer|null=null;
    
        depthStencilTexture:Texture2D|null=null;
        depthStencilRenderBuffer:WebGLRenderbuffer|null=null;
    
        static getDefColorDepthComboOP(width:number,height:number):FboOption
        {
            let op=new FboOption();
            op.width=width;
            op.height=height;
            let texop=new TextureOption();
            texop.setNullImageData(width,height);
            texop.setWrap(TexWrapEnum.clampToEdge,TexWrapEnum.clampToEdge);
            let glTexture=new Texture2D(null,texop);
            op.colorTextures=[];
            op.colorTextures.push(glTexture);
            op.depthRenderBuffer=rendingWebgl.createRenderbuffer();
            return op;
        }
    
    } 
    
    
    /**
     * The framebuffer class.
     */
    export class FrameBuffer extends abstractPlatformEntity<WebGLFramebuffer> {
        colorTextures:Texture2D[]|null=null;
        colorRenderBuffers:WebGLRenderbuffer[]|null=null;
        activeColorAttachments:number[]|null=null;
    
        depthTexture:Texture2D|null=null;
        depthRenderBuffer:WebGLRenderbuffer|null=null;
    
        stencilRenderBuffer:WebGLRenderbuffer|null=null;
    
        depthStencilTexture:Texture2D|null=null;
        depthStencilRenderBuffer:WebGLRenderbuffer|null=null;
    
        /**
         * Constructor.
         * @param w The width
         * @param h The height
         */
        public constructor(option:FboOption|null=null) {
            super(rendingWebgl.createFramebuffer() as FrameBuffer);
            if(option==null) return;
            this.attach();
            if(option.colorTextures!=null)
            {
                if(this.colorTextures==null)
                {
                    this.colorTextures=[];
                }
                if(this.activeColorAttachments==null)
                {
                    this.activeColorAttachments=[];
                }
                for(let i=0,len=option.colorTextures.length;i<len;i++)
                {
                    let tex=option.colorTextures[i];
                    let attachment=rendingWebgl.COLOR_ATTACHMENT0+i;
                    this.attachTexture(tex,attachment);
                    this.activeColorAttachments[i]=attachment;
                    this.colorTextures[i]=tex;
                }
            }
    
            if(option.colorRenderBuffers!=undefined)
            {
                if(this.colorRenderBuffers==null)
                {
                    this.colorRenderBuffers=[];
                }
                for(let i=0,len=option.colorRenderBuffers.length;i<len;i++)
                {
                    let renderbuffer=option.colorRenderBuffers[i];
                    let attachment=rendingWebgl.COLOR_ATTACHMENT0+i;
                    this.attachRenderBuffer(renderbuffer,attachment);
                    this.colorRenderBuffers[i]=renderbuffer;
                }
            }
            if(option.depthTexture!=undefined)
            {
                let attachment=rendingWebgl.DEPTH_ATTACHMENT;
                this.attachTexture(option.depthTexture,attachment);
                this.depthTexture=option.depthTexture;
            }
            if(option.depthRenderBuffer!=undefined)
            {
                let attachment=rendingWebgl.DEPTH_ATTACHMENT;
                this.attachDepthBuffer(option.depthRenderBuffer,option.width,option.height,attachment);
                this.depthRenderBuffer=option.depthRenderBuffer;
            }
    
            if(option.stencilRenderBuffer!=undefined)
            {
                let attachment=rendingWebgl.STENCIL_ATTACHMENT;
                this.attachRenderBuffer(option.stencilRenderBuffer,attachment);
                this.stencilRenderBuffer=option.stencilRenderBuffer;
            }
            if(option.depthStencilTexture!=undefined)
            {
                let attachment=rendingWebgl.DEPTH_STENCIL_ATTACHMENT;
                this.attachTexture(option.depthStencilTexture,attachment);
                this.depthStencilTexture=option.depthStencilTexture;
            }
            if(option.depthStencilRenderBuffer!=undefined)
            {
                let attachment=rendingWebgl.DEPTH_STENCIL_ATTACHMENT;
                this.attachRenderBuffer(option.depthStencilRenderBuffer,attachment);
                this.depthStencilRenderBuffer=option.depthStencilRenderBuffer;
            }
            this.detach();
        }
    
        /**
         * 绑定纹理对象
         * @param textue texture对象
         * @param attachment 
         */
        public attachTexture(textue:Texture2D,attachment=rendingWebgl.COLOR_ATTACHMENT0)
        {
            textue.attach();
            rendingWebgl.framebufferTexture2D(rendingWebgl.FRAMEBUFFER,attachment,rendingWebgl.TEXTURE_2D,textue.instance,0);
        }
    
        public attachRenderBuffer(renderbuffer:WebGLRenderbuffer,attachment=rendingWebgl.COLOR_ATTACHMENT0)
        {
            rendingWebgl.framebufferRenderbuffer(rendingWebgl.FRAMEBUFFER,attachment,rendingWebgl.RENDERBUFFER,renderbuffer);
        }
        public attachDepthBuffer(depthBuffer:WebGLRenderbuffer,width:number,height:number,attachment=rendingWebgl.DEPTH_ATTACHMENT)
        {
            rendingWebgl.bindRenderbuffer(rendingWebgl.RENDERBUFFER, depthBuffer);
            rendingWebgl.renderbufferStorage(rendingWebgl.RENDERBUFFER, rendingWebgl.DEPTH_COMPONENT16, width, height);
            rendingWebgl.framebufferRenderbuffer(rendingWebgl.FRAMEBUFFER, rendingWebgl.DEPTH_ATTACHMENT, rendingWebgl.RENDERBUFFER, depthBuffer);
        }
    
        public attach(): void { rendingWebgl.bindFramebuffer(rendingWebgl.FRAMEBUFFER, this.instance); }
        public detach(): void { rendingWebgl.bindFramebuffer(rendingWebgl.FRAMEBUFFER, null); }
    
        dispose()
        {
            if(this.colorTextures)
            {
                this.colorTextures.length=0;
                this.colorTextures=null;
            }
            if(this.colorRenderBuffers)
            {
                this.colorRenderBuffers.length=0;
                this.colorRenderBuffers=null;
            }
            if(this.activeColorAttachments)
            {
                this.activeColorAttachments.length=0;
                this.activeColorAttachments=null;
            }
            rendingWebgl.deleteFramebuffer(this.instance);
        }
    }
    
    
    
}
