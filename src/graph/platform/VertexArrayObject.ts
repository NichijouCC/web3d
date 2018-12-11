namespace webGraph
{
    export class VAO extends abstractPlatformEntity<WebGLTexture>
    {
        constructor()
        {
            super(rendingWebgl.createVertexArray());
        }
        public attach(): void {
            rendingWebgl.bindVertexArray(this.instance);
        }
        public detach(): void {
            rendingWebgl.bindVertexArray(null);
        }
    
        public dispose()
        {
            rendingWebgl.deleteVertexArray(this.instance);
        }
    
        // static beVertexArrayOES(obj:any):boolean
        // {
        //     return GLExtension.vaoExt.isVertexArrayOES(obj);
        // }
        
    }
}

