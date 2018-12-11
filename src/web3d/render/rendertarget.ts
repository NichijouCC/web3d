// namespace web3d
// {
//     export interface ITexture
//     {
//         texture: WebGLTexture;
//         width: number;
//         height: number;
//         isFrameBuffer(): boolean;
//         dispose(webgl: WebGLRenderingContext);
//         caclByteLength(): number;
//     }
//     /**
//      * @private
//      */
//     export class glRenderTarget implements ITexture
//     {
//         width: number;
//         height: number;
//         constructor(webgl: WebGLRenderingContext, width: number, height: number, depth: boolean = false, stencil: boolean = false)
//         {
//             this.width = width;
//             this.height = height;
//             this.fbo = webgl.createFramebuffer();
//             webgl.bindFramebuffer(webgl.FRAMEBUFFER, this.fbo);
//             if (depth || stencil)
//             {
//                 this.renderbuffer = webgl.createRenderbuffer();
//                 webgl.bindRenderbuffer(webgl.RENDERBUFFER, this.renderbuffer);
//                 if (depth && stencil)
//                 {
//                     webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_STENCIL, width, height);
//                     webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.DEPTH_STENCIL_ATTACHMENT, webgl.RENDERBUFFER, this.renderbuffer);
//                 }
//                 else if (depth)
//                 {
//                     webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_COMPONENT16, width, height);
//                     webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.DEPTH_ATTACHMENT, webgl.RENDERBUFFER, this.renderbuffer);

//                 }
//                 else
//                 {
//                     webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.STENCIL_INDEX8, width, height);
//                     webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.STENCIL_ATTACHMENT, webgl.RENDERBUFFER, this.renderbuffer);
//                 }
//             }

//             this.texture = webgl.createTexture();
//             this.fbo["width"] = width;
//             this.fbo["height"] = height;

//             webgl.bindTexture(webgl.TEXTURE_2D, this.texture);
//             webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
//             webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);

//             webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, width, height, 0, webgl.RGBA, webgl.UNSIGNED_BYTE, null);

//             webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, this.texture, 0);

//         }
//         fbo: WebGLFramebuffer;
//         renderbuffer: WebGLRenderbuffer;
//         texture: WebGLTexture;
//         use(webgl: WebGLRenderingContext)
//         {
//             webgl.bindFramebuffer(webgl.FRAMEBUFFER, this.fbo);
//             webgl.bindRenderbuffer(webgl.RENDERBUFFER, this.renderbuffer);
//             webgl.bindTexture(webgl.TEXTURE_2D, this.texture);
//             //webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, this.texture, 0);

//         }
//         static useNull(webgl: WebGLRenderingContext)
//         {
//             webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
//             webgl.bindRenderbuffer(webgl.RENDERBUFFER, null);

//         }
//         dispose(webgl: WebGLRenderingContext)
//         {
//             //if (this.texture == null && this.img != null)
//             //    this.disposeit = true;

//             if (this.texture != null)
//             {
//                 webgl.deleteFramebuffer(this.renderbuffer);
//                 this.renderbuffer = null;
//                 webgl.deleteTexture(this.texture);
//                 this.texture = null;
//             }
//         }
//         caclByteLength(): number
//         {
//             //RGBA & no mipmap
//             return this.width * this.height * 4;
//         }
//         isFrameBuffer(): boolean
//         {
//             return true;
//         }
//     }
// }